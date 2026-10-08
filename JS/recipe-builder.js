(function () {
    "use strict";

    const VERSION = "1.0.0";

    const TYPES = {
        bowl: { label:"Боул", emoji:"🥗", time:20, steps:["Подготовьте основные ингредиенты.","Приготовьте основу до готовности.","Соедините ингредиенты в одной миске и подавайте."] },
        roast: { label:"Запечённое блюдо", emoji:"🍽️", time:40, steps:["Нарежьте ингредиенты одинаковыми кусочками.","Смешайте продукты и добавьте базовые специи.","Запекайте до полной готовности основных ингредиентов."] },
        stew: { label:"Тушёное блюдо", emoji:"🍲", time:35, steps:["Нарежьте основные ингредиенты.","Обжарьте ароматные ингредиенты при необходимости.","Добавьте остальные продукты и немного воды, затем тушите до готовности."] },
        salad: { label:"Салат", emoji:"🥗", time:15, steps:["Подготовьте и нарежьте продукты.","Соедините ингредиенты.","Заправьте и аккуратно перемешайте."] },
        omelet: { label:"Омлет", emoji:"🍳", time:15, steps:["Подготовьте яйца и дополнительные ингредиенты.","Обжарьте овощи или другие добавки.","Добавьте яйца и готовьте до полной готовности."] },
        pasta: { label:"Паста", emoji:"🍝", time:25, steps:["Отварите пасту до готовности.","Приготовьте белковую или овощную часть.","Соедините пасту с соусом и добавками."] },
        porridge: { label:"Каша", emoji:"🥣", time:12, steps:["Подготовьте крупу.","Сварите до мягкости.","Добавьте подходящие дополнительные ингредиенты."] }
    };

    function normalize(id) { return String(id || "").toLowerCase().trim(); }

    function unique(ids) { return [...new Set((ids || []).map(normalize).filter(Boolean))]; }

    function classify(id) {
        return window.recipeProIngredientIntelligence?.role?.(id)
            || window.recipeProIntelligence?.classify?.(id)
            || "other";
    }

    function pick(ids, role) {
        return ids.find(id => classify(id) === role);
    }

    function titleFor(type, ids) {
        const names = ids.map(id => window.products?.[id]?.name || id);
        const protein = pick(ids,"protein");
        const carb = pick(ids,"carb");
        const vegetable = pick(ids,"vegetable");
        if (type === "bowl" && protein && carb) return (window.products?.[protein]?.name || protein) + " с " + (window.products?.[carb]?.name || carb);
        if (type === "stew" && protein) return "Тушёное блюдо с " + (window.products?.[protein]?.name || protein);
        if (type === "roast" && protein && carb) return (window.products?.[protein]?.name || protein) + " с " + (window.products?.[carb]?.name || carb) + " в духовке";
        if (type === "salad" && protein) return "Салат с " + (window.products?.[protein]?.name || protein);
        if (type === "salad" && vegetable) return "Овощная закуска с " + (window.products?.[vegetable]?.name || vegetable);
        if (type === "salad" && ids.length) return "Закуска из " + names.slice(0,2).join(" и ");
        if (type === "omelet") return "Омлет с " + (vegetable ? (window.products?.[vegetable]?.name || vegetable) : "добавками");
        if (type === "pasta" && protein) return "Паста с " + (window.products?.[protein]?.name || protein);
        if (type === "porridge") return "Каша с " + (names[1] || names[0]);
        return TYPES[type]?.label || "Домашнее блюдо";
    }

    function chooseType(ids, intent) {
        const intelligence = window.recipeProIntelligence;
        if (intelligence?.chooseType) {
            const selected = intelligence.chooseType(ids, intent || {});
            if (selected?.type) return selected.type;
        }

        const roles = ids.map(classify);
        if (roles.includes("eggs")) return "omelet";
        if (roles.includes("oats")) return "porridge";
        if (roles.includes("pasta")) return "pasta";
        if (roles.includes("protein") && roles.includes("carb")) return "bowl";
        if (roles.includes("protein") && roles.includes("vegetable")) return "stew";
        return "salad";
    }

    function pantry(type, ids) {
        return window.recipeProIntelligence?.getPantry?.(type, ids) || [];
    }

    function build(ids, intent = {}) {
        ids = unique(ids);
        if (!ids.length) return null;

        const dishChoice = window.recipeProIntelligence?.getBestDish?.(ids, intent);
        const type = intent.type || dishChoice?.dish?.type || chooseType(ids, intent);
        const template = TYPES[type] || TYPES.bowl;

        const selected = [];
        ids.forEach(id => {
            const role = classify(id);
            if (["protein","carb","vegetable","fruit","dairy","fat","aromatic","eggs"].includes(role)) {
                selected.push(id);
            }
        });

        const ingredients = selected.map(id => ({
            productId:id,
            product:id,
            name:window.products?.[id]?.name || id,
            amount: roleAmount(classify(id)),
            unit:"г",
            state:"raw",
            required:true,
            source:"user"
        }));

        const pantryIngredients = pantry(type, ids).map(item => ({
            productId:item.key,
            product:item.key,
            name:item.key === "cookingOil" ? "Растительное масло" : item.key === "salt" ? "Соль" : item.key === "pepper" ? "Чёрный перец" : "Вода",
            amount:item.key === "cookingOil" ? 10 : item.key === "water" ? 250 : 2,
            unit:item.key === "water" ? "мл" : "г",
            state:"raw",
            required:false,
            pantry:true,
            source:"RecipePro"
        }));

        const allIngredients = ingredients.concat(pantryIngredients);
        const warnings = [];
        if (dishChoice?.missing?.length) warnings.push("Для классической версии блюда не хватает: " + dishChoice.missing.join(", ") + ".");
        if (dishChoice?.replacements?.length) warnings.push("Использованы допустимые замены: " + dishChoice.replacements.join(", ") + ".");

        return {
            id:"generated-" + Date.now(),
            title:titleFor(type, selected),
            emoji:dishChoice?.dish?.emoji || template.emoji,
            description:"Рецепт собран RecipePro из продуктов, которые указал пользователь.",
            time:dishChoice?.dish?.time || template.time,
            servings:intent.targetServings || 2,
            tags:["AI Recipe","Из ваших продуктов"],
            filters:["protein"],
            type,
            ingredients:allIngredients,
            pantryIngredients,
            requiredProducts:ingredients.map(item=>item.productId),
            steps:dishChoice?.dish?.steps || template.steps,
            aiGenerated:true,
            generatedBy:"RecipePro Recipe Builder",
            intelligence:{
                dishId:dishChoice?.dish?.id || null,
                dishMatch:dishChoice?.compatible ?? false,
                matchScore:dishChoice?.score ?? 0,
                missing:dishChoice?.missing || [],
                replacements:dishChoice?.replacements || [],
                compatibility:window.recipeProIngredientIntelligence?.analyze?.(ids) || null,
                suggestions:window.recipeProIngredientIntelligence?.suggestions?.(ids) || []
            },
            warnings
        };
    }

    function roleAmount(role) {
        const amounts = { protein:250, carb:300, vegetable:150, fruit:120, dairy:150, fat:10, aromatic:60, eggs:180, other:100 };
        return amounts[role] || 100;
    }

    function buildFromText(text, intent = {}) {
        const resolver = window.recipeProProductResolver;
        if (!resolver?.resolve) return null;
        return resolver.resolve(text).then(result => {
            const ids = result?.productIds || result?.ids || [];
            return build(ids, intent);
        });
    }

    window.recipeProRecipeBuilder = {
        version:VERSION,
        build,
        buildFromText,
        chooseType,
        types:TYPES
    };
})();