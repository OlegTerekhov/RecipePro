(function () {
    "use strict";

    const VERSION = "1.0.0";

    const SEMANTICS = {
        protein: new Set(["курица","куриное-бедро","индейка","говядина","свинина","лосось","тунец","креветки","яйца","творог","сыр","моцарелла"]),
        carb: new Set(["картофель","рис","гречка","паста","хлеб","овсянка","чечевица","фасоль"]),
        vegetable: new Set(["лук","морковь","помидоры","огурец","перец","брокколи","капуста","кабачок","чеснок"]),
        fruit: new Set(["банан","яблоко","апельсин"]),
        fat: new Set(["масло","сливочное-масло","сметана","мед","сахар"]),
        dairy: new Set(["творог","сыр","моцарелла","йогурт","сметана","молоко"]),
        aromatic: new Set(["лук","чеснок","перец","морковь"]),
        sweet: new Set(["банан","яблоко","апельсин","мед","сахар"])
    };

    const TEMPLATES = {
        stew: {
            label: "Тушёное блюдо",
            requires: [["protein"],["vegetable"]],
            optional: ["carb"],
            pantry: ["water","salt","pepper"],
            score: 20
        },
        roast: {
            label: "Запечённое блюдо",
            requires: [["protein"],["carb","vegetable"]],
            optional: ["vegetable"],
            pantry: ["cookingOil","salt","pepper"],
            score: 18
        },
        bowl: {
            label: "Боул",
            requires: [["protein"],["carb"],["vegetable"]],
            optional: [],
            pantry: ["salt"],
            score: 24
        },
        salad: {
            label: "Салат",
            requires: [["vegetable"],["vegetable"]],
            optional: ["protein"],
            pantry: ["cookingOil","salt","pepper"],
            score: 15
        },
        omelet: {
            label: "Омлет",
            requires: [["eggs"]],
            optional: ["vegetable","dairy"],
            pantry: ["cookingOil","salt","pepper"],
            score: 25
        },
        pasta: {
            label: "Паста",
            requires: [["pasta"],["protein","vegetable"]],
            optional: ["vegetable","fat"],
            pantry: ["salt"],
            score: 23
        },
        porridge: {
            label: "Каша",
            requires: [["oats"]],
            optional: ["fruit","dairy","fat"],
            pantry: ["salt"],
            score: 25
        }
    };

    function normalizeId(id) {
        return String(id || "").toLowerCase().trim();
    }

    function has(ids, id) {
        return ids.includes(id);
    }

    function classify(id) {
        id = normalizeId(id);
        const p = window.products?.[id];

        if (SEMANTICS.protein.has(id) || p?.role === "protein") return "protein";
        if (SEMANTICS.carb.has(id) || p?.role === "carb") return "carb";
        if (SEMANTICS.vegetable.has(id) || p?.role === "vegetable") return "vegetable";
        if (SEMANTICS.fruit.has(id) || p?.role === "fruit") return "fruit";
        if (SEMANTICS.fat.has(id) || p?.role === "fat") return "fat";
        if (p?.category === "eggs") return "eggs";
        if (p?.category === "grain" && id === "паста") return "pasta";
        if (p?.category === "grain" && id === "овсянка") return "oats";
        if (SEMANTICS.dairy.has(id)) return "dairy";

        return "other";
    }

    function categories(ids) {
        return ids.reduce((out,id) => {
            const c = classify(id);
            if (!out[c]) out[c] = [];
            out[c].push(id);
            return out;
        }, {});
    }

    function compatible(type, ids, intent = {}) {
        const template = TEMPLATES[type];
        if (!template) return { score: 0, missing: [], matched: [], compatible: false };

        const groups = categories(ids);
        let score = template.score;
        const matched = [];
        const missing = [];

        template.requires.forEach(group => {
            const found = group.find(category => groups[category]?.length);
            if (found) {
                score += 20;
                matched.push(found);
            } else {
                missing.push(group.join(" / "));
                score -= 35;
            }
        });

        if (template.optional) {
            template.optional.forEach(category => {
                if (groups[category]?.length) {
                    score += 7;
                    matched.push(category);
                }
            });
        }

        if (intent.type === type) score += 100;
        if (intent.highProtein || intent.minProtein) {
            if (groups.protein?.length || groups.eggs?.length) score += 12;
        }

        return {
            score,
            missing,
            matched: [...new Set(matched)],
            compatible: missing.length === 0
        };
    }

    function chooseType(ids, intent = {}, allowedTypes = Object.keys(TEMPLATES)) {
        return allowedTypes
            .map(type => ({ type, ...compatible(type, ids, intent) }))
            .sort((a,b) => b.score - a.score)[0] || null;
    }

    function getPantry(type, ids) {
        const template = TEMPLATES[type];
        if (!template) return [];

        const hasOil = has(ids,"масло") || has(ids,"сливочное-масло");

        return template.pantry
            .filter(key => !(key === "cookingOil" && hasOil))
            .map(key => ({
                type: "pantry",
                key,
                source: "RecipePro",
                required: false
            }));
    }

    function explain(type, ids, pantry = []) {
        const info = compatible(type, ids);
        const explicitNames = ids.map(id => window.products?.[id]?.name || id);

        return {
            explicitProducts: explicitNames,
            matched: info.matched,
            missing: info.missing,
            pantry: pantry.map(item => item.key),
            message: pantry.length
                ? "RecipePro использовал ваши продукты и добавил базовые кухонные ингредиенты."
                : "RecipePro построил блюдо из указанных продуктов."
        };
    }

    window.recipeProIntelligence = {
        version: VERSION,
        classify,
        categories,
        compatible,
        chooseType,
        getPantry,
        explain,
        templates: TEMPLATES
    };
})();