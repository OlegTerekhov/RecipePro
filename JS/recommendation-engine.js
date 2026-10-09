(function () {
    "use strict";

    const VERSION = "2.1.0";
    const TYPES = ["bowl","stew","salad","omelet","pasta","roast","porridge"];

    function role(id) {
        return window.recipeProRecipeEngine?.role?.(id) || window.products?.[id]?.role || window.products?.[id]?.category || "other";
    }

    function hasRole(ids, wanted) {
        return ids.some(id => role(id) === wanted);
    }

    function nutrition(recipe) {
        if (window.recipeProNutritionEngine?.calculateRecipe) {
            return window.recipeProNutritionEngine.calculateRecipe(recipe);
        }
        return (recipe.ingredients || []).reduce((sum, item) => {
            const id = item.product || item.productId;
            const product = window.products?.[id];
            if (!product?.raw) return sum;
            const factor = Number(item.amount || 0) / 100;
            sum.calories += Number(product.raw.kcal || 0) * factor;
            sum.protein += Number(product.raw.protein || 0) * factor;
            sum.fat += Number(product.raw.fat || 0) * factor;
            sum.carbs += Number(product.raw.carbs || 0) * factor;
            return sum;
        }, { calories: 0, protein: 0, fat: 0, carbs: 0 });
    }

    function finalize(recipe) {
        const total = nutrition(recipe);
        const servings = recipe.servings || 1;
        return {
            ...recipe,
            nutrition: {
                calories: Math.round(total.calories / servings),
                protein: Math.round(total.protein / servings * 10) / 10,
                fat: Math.round(total.fat / servings * 10) / 10,
                carbs: Math.round(total.carbs / servings * 10) / 10
            }
        };
    }

    function score(candidate, ids, intent) {
        let total = 0;
        const reasons = [];
        const intelligence = window.recipeProIntelligence?.compatible?.(candidate.type, ids, intent);

        if (intelligence) {
            total += Number(intelligence.score || 0);
            if (intelligence.compatible) reasons.push("ингредиенты сочетаются");
            else if (intelligence.missing?.length) reasons.push("не хватает: " + intelligence.missing[0]);
        }

        const ingredientIntelligence = window.recipeProIngredientIntelligence;
        if (ingredientIntelligence?.analyze) {
            const analysis = ingredientIntelligence.analyze(ids);
            total += Math.min(18, Number(analysis.averageCompatibility || 0) * 0.18);
        }

        if (candidate.ingredients?.length) total += 15;

        if (intent.type) {
            if (candidate.type === intent.type) {
                total += 100;
                reasons.push("точный тип блюда");
            } else {
                total -= 8;
            }
        }

        if (intent.maxTime) {
            if (candidate.time <= intent.maxTime) {
                total += 35;
                reasons.push("время в лимите");
            } else {
                total -= Math.min(28, (candidate.time - intent.maxTime) * 0.9);
                reasons.push("дольше лимита");
            }
        }

        if (intent.minTime) {
            if (candidate.time >= intent.minTime) {
                total += 10;
                reasons.push("время подходит");
            } else {
                total -= 6;
            }
        }

        if (intent.faster) {
            total += Math.max(0, 25 - candidate.time);
            if (candidate.time <= 20) reasons.push("быстрый вариант");
        }

        const n = candidate.nutrition || {};

        if (intent.maxCalories) {
            if (n.calories <= intent.maxCalories) {
                total += 35;
                reasons.push("ккал в лимите");
            } else {
                total -= Math.min(35, (n.calories - intent.maxCalories) / 15);
                reasons.push("выше лимита ккал");
            }
        }

        if (intent.minCalories) {
            if (n.calories >= intent.minCalories) {
                total += 18;
                reasons.push("достаточная калорийность");
            } else {
                total -= Math.min(18, (intent.minCalories - n.calories) / 15);
                reasons.push("ниже минимума ккал");
            }
        }

        if (intent.lessCalories) {
            total += Math.max(0, 30 - n.calories / 20);
            reasons.push("относительно лёгкий вариант");
        }

        if (intent.highProtein) {
            if (hasRole(ids, "protein") || hasRole(ids, "eggs")) {
                total += Math.min(30, Number(n.protein || 0) * 0.7);
                reasons.push("высокобелковый");
            } else {
                total -= 12;
            }
        }

        if (intent.minProtein) {
            if (n.protein >= intent.minProtein) {
                total += 40;
                reasons.push("белок в цели");
            } else {
                total -= Math.min(30, (intent.minProtein - n.protein) * 0.8);
                reasons.push("белка меньше цели");
            }
        }

        if (intent.maxProtein) {
            if (n.protein <= intent.maxProtein) {
                total += 12;
                reasons.push("белок в лимите");
            } else {
                total -= Math.min(15, (n.protein - intent.maxProtein) * 0.5);
                reasons.push("белка выше лимита");
            }
        }

        if (hasRole(ids, "protein")) total += 8;
        if (hasRole(ids, "vegetable")) total += 4;
        if (hasRole(ids, "carb")) total += 4;
        if (candidate.requiredProducts?.length) {
            total += Math.min(12, candidate.requiredProducts.filter(id => ids.includes(id)).length * 3);
        }
        if (candidate.pantryIngredients?.length) {
            total -= Math.min(4, candidate.pantryIngredients.length * 0.5);
        }

        return { score: total, reasons: [...new Set(reasons)].slice(0, 4) };
    }

    function recommend(ids, intent = {}) {
        const unique = [...new Set(ids)].filter(Boolean).slice(0, 10);
        const candidates = [];

        TYPES.forEach(type => {
            const builder = window.recipeProRecipeBuilder;
            if (builder?.canBuildType && !builder.canBuildType(unique, type, intent)) return;

            const recipe = window.recipeProRecipeEngine?.build(unique, { ...intent, type });
            if (!recipe) return;

            const finalized = finalize(recipe);
            const scored = score(finalized, unique, intent);
            candidates.push({
                recipe: finalized,
                score: scored.score,
                reason: scored.reasons.join(" · ")
            });
        });

        candidates.sort((a,b) => b.score - a.score);

        const uniqueCandidates = [];
        const seen = new Set();
        for (const candidate of candidates) {
            const key = candidate.recipe.type + "|" + candidate.recipe.title;
            if (seen.has(key)) continue;
            seen.add(key);
            uniqueCandidates.push(candidate);
        }

        return {
            version: VERSION,
            candidates: uniqueCandidates.slice(0, 5),
            best: uniqueCandidates[0] || null
        };
    }

    window.recipeProRecommendationEngine = { version: VERSION, recommend };
})();