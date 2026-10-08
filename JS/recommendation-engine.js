(function () {
    "use strict";

    const VERSION = "2.0.0";
    const TYPES = ["bowl","stew","salad","omelet","pasta","roast","porridge"];

    function role(id) {
        return window.recipeProRecipeEngine?.role?.(id) || window.products?.[id]?.role || "other";
    }

    function hasRole(ids, wanted) {
        return ids.some(id => role(id) === wanted);
    }

    function nutrition(recipe) {
        if (window.recipeProNutritionEngine?.calculateRecipe) {
            return window.recipeProNutritionEngine.calculateRecipe(recipe);
        }

        return (recipe.ingredients || []).reduce((sum, item) => {
            const product = window.products?.[item.product];
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
        let score = 0;\n        if (ingredientIntelligence) {\n            const analysis = ingredientIntelligence.analyze(ids);\n            score += Math.min(18, analysis.averageCompatibility * 0.18);\n            const suggestions = ingredientIntelligence.suggestions(ids, 8);\n            if (recipe.ingredients?.some(row => suggestions.some(item => item.id === row.productId))) score += 6;\n        }
        const reasons = [];

        const intelligence = window.recipeProIntelligence?.compatible?.(candidate.type, ids, intent);
        if (intelligence) {
            score += intelligence.score;
            if (intelligence.compatible) reasons.push("ингредиенты сочетаются");
            else if (intelligence.missing.length) reasons.push("не хватает: " + intelligence.missing[0]);
        }

        if (candidate.ingredients?.length) score += 15;

        if (intent.type) {
            if (candidate.type === intent.type) {
                score += 100;
                reasons.push("точный тип блюда");
            } else {
                score -= 8;
            }
        }

        if (intent.maxTime) {
            if (candidate.time <= intent.maxTime) {
                score += 35;
                reasons.push("время в лимите");
            } else {
                score -= Math.min(28, (candidate.time - intent.maxTime) * 0.9);
                reasons.push("дольше лимита");
            }
        }

        if (intent.minTime) {
            if (candidate.time >= intent.minTime) {
                score += 10;
                reasons.push("время подходит");
            } else {
                score -= 6;
            }
        }

        if (intent.faster) {
            score += Math.max(0, 25 - candidate.time);
            if (candidate.time <= 20) reasons.push("быстрый вариант");
        }

        const n = candidate.nutrition;

        if (intent.maxCalories) {
            if (n.calories <= intent.maxCalories) {
                score += 35;
                reasons.push("ккал в лимите");
            } else {
                score -= Math.min(35, (n.calories - intent.maxCalories) / 15);
                reasons.push("выше лимита ккал");
            }
        }

        if (intent.minCalories) {
            if (n.calories >= intent.minCalories) {
                score += 18;
                reasons.push("достаточная калорийность");
            } else {
                score -= Math.min(18, (intent.minCalories - n.calories) / 15);
                reasons.push("ниже минимума ккал");
            }
        }

        if (intent.lessCalories) {
            score += Math.max(0, 30 - n.calories / 20);
            reasons.push("относительно лёгкий вариант");
        }

        if (intent.highProtein) {
            if (hasRole(ids, "protein")) {
                score += Math.min(30, n.protein * 0.7);
                reasons.push("высокобелковый");
            } else {
                score -= 12;
            }
        }

        if (intent.minProtein) {
            if (n.protein >= intent.minProtein) {
                score += 40;
                reasons.push("белок в цели");
            } else {
                score -= Math.min(30, (intent.minProtein - n.protein) * 0.8);
                reasons.push("белка меньше цели");
            }
        }

        if (intent.maxProtein) {
            if (n.protein <= intent.maxProtein) {
                score += 12;
                reasons.push("белок в лимите");
            } else {
                score -= Math.min(15, (n.protein - intent.maxProtein) * 0.5);
                reasons.push("белка выше лимита");
            }
        }

        if (hasRole(ids, "protein")) score += 8;
        if (hasRole(ids, "vegetable")) score += 4;
        if (hasRole(ids, "carb")) score += 4;

        if (candidate.requiredProducts?.length) score += Math.min(12, candidate.requiredProducts.filter(id => ids.includes(id)).length * 3);
        if (candidate.pantryIngredients?.length) score -= Math.min(4, candidate.pantryIngredients.length * 0.5);

        return {
            score,
            reasons: [...new Set(reasons)].slice(0, 4)
        };
    }

    function recommend(ids, intent = {}) {
        const unique = [...new Set(ids)].slice(0, 10);
        const candidates = [];

        TYPES.forEach(type => {
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

    window.recipeProRecommendationEngine = {
        version: VERSION,
        recommend
    };
})();