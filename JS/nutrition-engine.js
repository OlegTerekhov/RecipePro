(function () {
    "use strict";

    const VERSION = "2.1.0";
    const DEFAULTS = {
        cookedWeightRatio: 1,
        friedOilPer100g: 0
    };

    function number(value, fallback = 0) {
        const result = Number(value);
        return Number.isFinite(result) ? result : fallback;
    }

    function normalizeState(state) {
        const value = String(state || "raw").toLowerCase();

        if (value === "boiled" || value === "cooked") return "boiled";
        if (value === "fried" || value === "pan-fried") return "fried";

        return "raw";
    }

    const NON_NUTRITIONAL_PANTRY = new Set([
        "salt", "соль", "pepper", "чёрный перец", "черный перец",
        "water", "вода"
    ]);

    function normalizeProductId(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/ё/g, "е")
            .trim();
    }

    function getProduct(productOrId) {
        if (typeof productOrId === "object" && productOrId) {
            return productOrId;
        }

        const id = normalizeProductId(productOrId);
        if (id === "cookingoil" || id === "растительное масло" || id === "раст масла") {
            return window.products?.["масло"] || null;
        }

        return window.products?.[id] || null;
    }

    function isNegligiblePantry(row) {
        if (row?.pantry !== true && row?.required !== false) return false;
        const id = normalizeProductId(row?.product || row?.productId || row?.key);
        return NON_NUTRITIONAL_PANTRY.has(id);
    }

    function getRawEquivalent(amount, product, state) {
        const grams = Math.max(0, number(amount));
        const ratio = number(product?.cookedWeightRatio, DEFAULTS.cookedWeightRatio);

        if (state === "raw" || ratio <= 0) {
            return grams;
        }

        return grams / ratio;
    }

    function getOilAmount(row, cookedAmount) {
        if (normalizeState(row?.state) !== "fried") return 0;
        if (row?.pantry === true) return 0;

        const id = normalizeProductId(row?.product || row?.productId);
        if (id === "масло" || id === "cookingoil" || id === "растительное масло") return 0;

        if (row?.oilAmount !== undefined) {
            return Math.max(0, number(row.oilAmount));
        }

        const oilPer100 = Math.max(
            0,
            number(row?.oilPer100, DEFAULTS.friedOilPer100g)
        );

        return cookedAmount * oilPer100 / 100;
    }

    function calculateIngredient(row) {
        const state = normalizeState(row?.state);

        if (isNegligiblePantry(row)) {
            return {
                calories: 0,
                protein: 0,
                fat: 0,
                carbs: 0,
                rawEquivalent: 0,
                oilAmount: 0,
                state,
                known: true,
                excluded: true
            };
        }

        const product = getProduct(row?.product || row?.productId);

        if (!product?.raw) {
            return {
                calories: 0,
                protein: 0,
                fat: 0,
                carbs: 0,
                rawEquivalent: 0,
                oilAmount: 0,
                state,
                known: false
            };
        }

        const amount = Math.max(0, number(row?.amount));
        const rawEquivalent = getRawEquivalent(amount, product, state);
        const multiplier = rawEquivalent / 100;

        const result = {
            calories: number(product.raw.kcal) * multiplier,
            protein: number(product.raw.protein) * multiplier,
            fat: number(product.raw.fat) * multiplier,
            carbs: number(product.raw.carbs) * multiplier,
            rawEquivalent,
            oilAmount: 0,
            state,
            known: true
        };

        const oilAmount = getOilAmount(row, amount);

        if (state === "fried" && oilAmount > 0) {
            const oil = window.products?.["масло"];

            if (oil?.raw) {
                const oilMultiplier = oilAmount / 100;

                result.calories += number(oil.raw.kcal) * oilMultiplier;
                result.protein += number(oil.raw.protein) * oilMultiplier;
                result.fat += number(oil.raw.fat) * oilMultiplier;
            } else {
                result.calories += oilAmount * 8.99;
                result.fat += oilAmount * 0.999;
            }

            result.oilAmount = oilAmount;
        }

        return result;
    }

    function calculateRecipe(recipe, options = {}) {
        const ingredients = Array.isArray(recipe?.ingredients)
            ? recipe.ingredients
            : [];

        const total = {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0
        };

        const details = [];
        let unknownCount = 0;

        ingredients.forEach(row => {
            const result = calculateIngredient(row);

            total.calories += result.calories;
            total.protein += result.protein;
            total.fat += result.fat;
            total.carbs += result.carbs;

            if (!result.known && !row?.pantry) unknownCount += 1;

            details.push({
                product: row.product || row.productId,
                amount: Math.max(0, number(row.amount)),
                state: result.state,
                rawEquivalent: result.rawEquivalent,
                oilAmount: result.oilAmount,
                calories: result.calories,
                protein: result.protein,
                fat: result.fat,
                carbs: result.carbs,
                known: result.known,
                excluded: Boolean(result.excluded)
            });
        });

        const servings = Math.max(
            1,
            number(options.servings ?? recipe?.servings, 1)
        );

        const perServing = {
            calories: Math.round(total.calories / servings),
            protein: Math.round(total.protein / servings * 10) / 10,
            fat: Math.round(total.fat / servings * 10) / 10,
            carbs: Math.round(total.carbs / servings * 10) / 10
        };

        return {
            ...total,
            servings,
            perServing,
            details,
            unknownCount
        };
    }

    function calculatePerServing(recipe, servings) {
        return calculateRecipe(recipe, { servings }).perServing;
    }

    function scaleRecipe(recipe, targetServings) {
        const sourceServings = Math.max(
            1,
            number(recipe?.servings, 1)
        );

        const target = Math.max(
            1,
            number(targetServings, sourceServings)
        );

        const multiplier = target / sourceServings;

        return {
            ...recipe,
            servings: target,
            ingredients: (recipe.ingredients || []).map(row => ({
                ...row,
                amount: Math.round(number(row.amount) * multiplier * 10) / 10
            }))
        };
    }

    function setCookingState(recipe, state, options = {}) {
        const normalizedState = normalizeState(state);

        return {
            ...recipe,
            ingredients: (recipe.ingredients || []).map(row => {
                const id = normalizeProductId(row?.product || row?.productId);
                const isPantry = row?.pantry === true;
                const isOil = id === "масло" || id === "cookingoil" || id === "растительное масло";

                if (isPantry || isOil) return { ...row };

                return {
                    ...row,
                    state: normalizedState,
                    oilPer100: normalizedState === "fried"
                        ? Math.max(0, number(options.oilPer100, 5))
                        : 0
                };
            })
        };
    }

    function getStateLabel(state) {
        const normalized = normalizeState(state);

        if (normalized === "boiled") return "варёное";
        if (normalized === "fried") return "жареное";

        return "сырое";
    }

    function compareStates(recipe) {
        const states = ["raw", "boiled", "fried"];

        return states.map(state => {
            const prepared = setCookingState(recipe, state, {
                oilPer100: 5
            });

            const result = calculateRecipe(prepared);

            return {
                state,
                label: getStateLabel(state),
                calories: result.perServing.calories,
                protein: result.perServing.protein,
                fat: result.perServing.fat,
                carbs: result.perServing.carbs
            };
        });
    }

    window.recipeProNutritionEngine = {
        version: VERSION,
        calculateIngredient,
        calculateRecipe,
        calculatePerServing,
        scaleRecipe,
        setCookingState,
        compareStates,
        getStateLabel
    };
})();