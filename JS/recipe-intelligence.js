(function () {
    "use strict";

    const VERSION = "2.0.0";

    const SEMANTICS = {
        protein: new Set(["курица","куриное-бедро","индейка","говядина","свинина","лосось","тунец","креветки","яйца","творог","сыр","моцарелла"]),
        carb: new Set(["картофель","рис","гречка","паста","хлеб","овсянка","чечевица","фасоль"]),
        vegetable: new Set(["лук","морковь","помидоры","огурец","перец","брокколи","капуста","кабачок","чеснок"]),
        fruit: new Set(["банан","яблоко","апельсин"]),
        fat: new Set(["масло","сливочное-масло","сметана","мед","сахар"]),
        dairy: new Set(["творог","сыр","моцарелла","йогурт","сметана","молоко"])
    };

    const DISHES = [
        { id:"chicken-potato", type:"roast", title:"Курица с картофелем", emoji:"🍗", time:45, requires:["курица","картофель"], supports:["лук","морковь","чеснок","масло"] },
        { id:"chicken-stew", type:"stew", title:"Тушёная курица с овощами", emoji:"🍲", time:35, requires:["курица"], anyOf:["vegetable"], supports:["картофель","морковь","лук","чеснок"] },
        { id:"chicken-soup", type:"stew", title:"Куриный суп", emoji:"🍲", time:45, requires:["курица","картофель"], supports:["морковь","лук","чеснок"] },
        { id:"chicken-bowl", type:"bowl", title:"Боул с курицей", emoji:"🥗", time:20, requires:["курица"], anyOf:["carb","vegetable"], supports:["рис","гречка","картофель","огурец","помидоры","морковь"] },
        { id:"pasta-chicken", type:"pasta", title:"Паста с курицей", emoji:"🍝", time:25, requires:["паста","курица"], supports:["лук","помидоры","чеснок","сыр"] },
        { id:"buckwheat-chicken", type:"bowl", title:"Гречка с курицей", emoji:"🍗", time:30, requires:["гречка","курица"], supports:["лук","морковь"] },
        { id:"omelet-vegetables", type:"omelet", title:"Омлет с овощами", emoji:"🍳", time:15, requires:["яйца"], anyOf:["vegetable"], supports:["сыр","молоко","масло"] },
        { id:"shakshuka", type:"omelet", title:"Шакшука", emoji:"🍳", time:20, requires:["яйца","помидоры"], supports:["лук","перец","чеснок"] },
        { id:"chicken-salad", type:"salad", title:"Салат с курицей", emoji:"🥗", time:15, requires:["курица"], anyOf:["vegetable"], supports:["огурец","помидоры","перец","капуста"] },
        { id:"potato-casserole", type:"roast", title:"Картофельная запеканка", emoji:"🥔", time:40, requires:["картофель"], anyOf:["protein","dairy"], supports:["лук","сыр","сметана"] },
        { id:"cottage-cheese-pancakes", type:"omelet", title:"Сырники", emoji:"🥞", time:25, requires:["творог"], supports:["яйца","мука"] },
        { id:"oatmeal-banana", type:"porridge", title:"Овсянка с бананом", emoji:"🥣", time:12, requires:["овсянка","банан"], supports:["молоко","йогурт","мед"] },
        { id:"rice-chicken", type:"bowl", title:"Рис с курицей и овощами", emoji:"🍚", time:30, requires:["рис","курица"], anyOf:["vegetable"], supports:["морковь","лук","перец","брокколи"] },
        { id:"lentil-soup", type:"stew", title:"Чечевичный суп", emoji:"🍲", time:35, requires:["чечевица"], supports:["морковь","лук","чеснок","помидоры"] }
    ];

    const TYPE_REQUIREMENTS = {
        bowl: [["protein"],["carb","vegetable"]],
        roast: [["protein","dairy"],["carb","vegetable"]],
        stew: [["protein","carb"],["vegetable"]],
        salad: [["vegetable"],["vegetable"]],
        omelet: [["eggs"]],
        pasta: [["pasta"],["protein","vegetable"]],
        porridge: [["oats"]]
    };

    function normalizeId(id) {
        return String(id || "").toLowerCase().trim();
    }

    function classify(id) {
        id = normalizeId(id);
        const p = window.products?.[id];
        if (id === "яйца" || p?.category === "eggs") return "eggs";
        if (id === "паста") return "pasta";
        if (id === "овсянка") return "oats";
        for (const [category,set] of Object.entries(SEMANTICS)) if (set.has(id) || p?.role === category) return category;
        return "other";
    }

    function categories(ids) {
        return ids.reduce((out,id) => {
            const c = classify(id);
            (out[c] ||= []).push(id);
            return out;
        }, {});
    }

    function hasId(ids,id) { return ids.includes(id); }
    function hasCategory(ids,category) { return ids.some(id => classify(id) === category); }

    function scoreDish(dish, ids, intent = {}) {
        let score = 0;
        const matched = [];
        const missing = [];

        dish.requires.forEach(id => {
            if (hasId(ids,id)) { score += 42; matched.push(id); }
            else { score -= 48; missing.push(id); }
        });

        if (dish.anyOf) {
            if (hasCategory(ids,dish.anyOf[0])) { score += 30; matched.push(dish.anyOf[0]); }
            else { score -= 22; missing.push(dish.anyOf[0]); }
        }

        dish.supports.forEach(id => {
            if (hasId(ids,id)) { score += 8; matched.push(id); }
        });

        if (intent.type === dish.type) score += 45;
        if (intent.maxTime) score += dish.time <= intent.maxTime ? 25 : -Math.min(20,(dish.time-intent.maxTime)*0.5);
        if (intent.faster) score += dish.time <= 20 ? 20 : 0;
        if (intent.highProtein || intent.minProtein) {
            if (hasCategory(ids,"protein") || hasCategory(ids,"eggs")) score += 15;
            if (dish.type === "bowl" || dish.type === "stew") score += 5;
        }

        const compatible = missing.length === 0;
        return { dish, score, matched:[...new Set(matched)], missing:[...new Set(missing)], compatible };
    }

    function findDishCandidates(ids, intent = {}, limit = 8) {
        return DISHES
            .map(dish => scoreDish(dish,ids,intent))
            .sort((a,b) => b.score - a.score)
            .slice(0,limit);
    }

    function chooseType(ids, intent = {}, allowedTypes = Object.keys(TYPE_REQUIREMENTS)) {
        const dish = findDishCandidates(ids,intent,12).find(item => allowedTypes.includes(item.dish.type) && item.compatible);
        if (dish) return { type:dish.dish.type, score:dish.score, dish:dish.dish };

        const fallback = allowedTypes.map(type => {
            const req = TYPE_REQUIREMENTS[type] || [];
            let score = intent.type === type ? 100 : 0;
            req.forEach(group => { if (group.some(c => hasCategory(ids,c))) score += 20; else score -= 30; });
            return {type,score};
        }).sort((a,b)=>b.score-a.score)[0];

        return fallback || null;
    }

    function compatible(type, ids, intent = {}) {
        const candidates = findDishCandidates(ids,intent,12).filter(item => item.dish.type === type);
        if (candidates.length) {
            const best = candidates[0];
            return { score:best.score, missing:best.missing, matched:best.matched, compatible:best.compatible, dish:best.dish };
        }
        return { score:0, missing:[], matched:[], compatible:false };
    }

    function getPantry(type, ids) {
        const oil = hasId(ids,"масло") || hasId(ids,"сливочное-масло");
        const map = {
            stew:["water","salt","pepper"],
            roast:["cookingOil","salt","pepper"],
            bowl:["salt"],
            salad:["cookingOil","salt","pepper"],
            omelet:["cookingOil","salt","pepper"],
            pasta:["salt"],
            porridge:["salt"]
        };
        return (map[type] || []).filter(key => !(key === "cookingOil" && oil)).map(key => ({
            type:"pantry", key, source:"RecipePro", required:false
        }));
    }

    function explain(type, ids, pantry = []) {
        const best = findDishCandidates(ids,{type},12).find(item => item.dish.type === type);
        const explicitProducts = ids.map(id => window.products?.[id]?.name || id);
        return {
            dish: best?.dish || null,
            explicitProducts,
            matched: best?.matched || [],
            missing: best?.missing || [],
            pantry: pantry.map(item => item.key),
            message: pantry.length
                ? "RecipePro использовал ваши продукты и добавил базовые кухонные ингредиенты."
                : "RecipePro построил блюдо из указанных продуктов."
        };
    }

    function getBestDish(ids,intent = {}) {
        return findDishCandidates(ids,intent,8)[0] || null;
    }

    window.recipeProIntelligence = {
        version:VERSION,
        classify,
        categories,
        compatible,
        chooseType,
        getPantry,
        explain,
        findDishCandidates,
        getBestDish,
        dishes:DISHES
    };
})();