(function () {
    "use strict";

    const ENGINE_VERSION = "1.0.0";

    const TYPE_RULES = [
        {
            id: "bowl",
            title: "Боул",
            emoji: "🥗",
            baseTime: 15,
            roles: ["protein", "carb", "vegetable"],
            score: ids => ids.some(isProtein) && ids.some(isCarb) && ids.some(isVegetable) ? 30 : 0
        },
        {
            id: "roast",
            title: "Запечённое блюдо",
            emoji: "🍗",
            baseTime: 35,
            roles: ["protein", "carb", "vegetable"],
            score: ids => ids.some(isProtein) && ids.some(isCarb) ? 24 : 0
        },
        {
            id: "stew",
            title: "Рагу",
            emoji: "🍲",
            baseTime: 30,
            roles: ["protein", "vegetable"],
            score: ids => ids.some(isProtein) && ids.some(isVegetable) ? 22 : 0
        },
        {
            id: "pasta",
            title: "Паста",
            emoji: "🍝",
            baseTime: 25,
            roles: ["protein", "carb"],
            score: ids => ids.includes("паста") && (ids.some(isProtein) || ids.some(isVegetable)) ? 32 : 0
        },
        {
            id: "porridge",
            title: "Каша",
            emoji: "🥣",
            baseTime: 12,
            roles: ["carb", "fruit"],
            score: ids => ids.includes("овсянка") && ids.some(isFruit) ? 34 : 0
        },
        {
            id: "omelet",
            title: "Омлет",
            emoji: "🍳",
            baseTime: 15,
            roles: ["protein", "vegetable"],
            score: ids => ids.includes("яйца") && (ids.some(isVegetable) || ids.includes("сыр") || ids.includes("творог")) ? 36 : 0
        },
        {
            id: "salad",
            title: "Салат",
            emoji: "🥗",
            baseTime: 10,
            roles: ["protein", "vegetable"],
            score: ids => ids.some(isVegetable) && (ids.includes("огурец") || ids.includes("помидоры")) ? 20 : 0
        }
    ];

    function role(id) {
        const p = window.products?.[id];
        if (p?.role) return p.role;
        if (["курица","куриное-бедро","индейка","говядина","свинина","лосось","тунец","креветки","яйца","творог","сыр"].includes(id)) return "protein";
        if (["картофель","рис","гречка","паста","хлеб","овсянка","чечевица","фасоль"].includes(id)) return "carb";
        if (["лук","морковь","помидоры","огурец","перец","брокколи","капуста","кабачок","чеснок"].includes(id)) return "vegetable";
        if (["банан","яблоко","апельсин"].includes(id)) return "fruit";
        if (["масло","сливочное-масло","сметана","мед","сахар"].includes(id)) return "fat";
        return "other";
    }

    const isProtein = id => role(id) === "protein";
    const isCarb = id => role(id) === "carb";
    const isVegetable = id => role(id) === "vegetable";
    const isFruit = id => role(id) === "fruit";

    function chooseType(ids, intent = {}) {
        const ranked = TYPE_RULES.map(rule => {
            let score = rule.score(ids);
            if (intent.type && rule.id === intent.type) score += 100;
            if (intent.faster && rule.baseTime <= 20) score += 15;
            return { rule, score };
        }).sort((a,b) => b.score - a.score);
        return ranked[0]?.score > 0 ? ranked[0].rule : TYPE_RULES[1];
    }

    function name(id) {
        return window.products?.[id]?.name || id;
    }

    function amount(id) {
        const p = window.products?.[id];
        if (p?.pieceWeight && ["яйца","банан","яблоко","апельсин"].includes(id)) return { amount:p.pieceWeight, unit:"г" };
        if (["масло","сливочное-масло"].includes(id)) return { amount:10, unit:"г" };
        if (role(id) === "vegetable") return { amount:80, unit:"г" };
        if (role(id) === "carb") return { amount:70, unit:"г" };
        if (["творог","йогурт","сметана","молоко","сыр","моцарелла"].includes(id)) return { amount:120, unit:"г" };
        return { amount:180, unit:"г" };
    }

    function build(ids, intent = {}) {
        const unique = [...new Set(ids)].slice(0, 10);
        const type = chooseType(unique, intent);
        const protein = unique.find(isProtein);
        const carb = unique.find(isCarb);
        const vegetables = unique.filter(isVegetable);
        const fruits = unique.filter(isFruit);
        const fats = unique.filter(id => role(id) === "fat");
        let selected = [];

        if (type.id === "pasta") selected = ["паста", protein, ...vegetables, ...fats];
        else if (type.id === "porridge") selected = ["овсянка", ...fruits, ...fats];
        else if (type.id === "omelet") selected = ["яйца", ...vegetables, ...unique.filter(id => ["творог","сыр"].includes(id)), ...fats];
        else if (type.id === "salad") selected = [...vegetables, protein, ...fats];
        else if (type.id === "stew") selected = [protein, ...vegetables, carb, ...fats];
        else selected = [protein, carb, ...vegetables, ...fats];

        selected = selected.filter(Boolean).filter((id,i,arr) => arr.indexOf(id) === i).filter(id => unique.includes(id));

        if (!selected.length) selected = unique.slice(0, 7);

        const titleMap = {
            pasta: protein ? name(protein) + " с пастой" : "Паста RecipePro",
            porridge: fruits[0] ? "Овсянка с " + name(fruits[0]) : "Овсянка RecipePro",
            omelet: "Омлет RecipePro",
            salad: protein ? "Салат с " + name(protein) : "Свежий салат",
            stew: protein ? name(protein) + " с овощами" : "Овощное рагу",
            roast: protein ? name(protein) + " с гарниром" : "Запечённое блюдо",
            bowl: protein ? "Боул с " + name(protein) : "Боул RecipePro"
        };

        const stepsByType = {
            pasta: ["Отвари пасту до готовности.","Приготовь белковый продукт и овощи.","Соедини ингредиенты и прогрей ещё 1–2 минуты."],
            porridge: ["Свари овсянку на воде или молоке.","Добавь фрукты после приготовления.","Перемешай и подай тёплой."],
            omelet: ["Смешай яйца с выбранными добавками.","Добавь овощи или творог.","Готовь под крышкой на слабом огне до полной готовности."],
            salad: ["Нарежь овощи.","Добавь белковый продукт.","Заправь небольшим количеством масла, если оно есть."],
            stew: ["Нарежь ингредиенты примерно одинаковыми кусочками.","Сначала приготовь белковую основу.","Добавь овощи и немного воды, затем туши до готовности."],
            roast: ["Нарежь основные ингредиенты.","Разложи их в форме и добавь специи.","Запекай до полной готовности продуктов."],
            bowl: ["Приготовь белковую основу и гарнир.","Нарежь свежие овощи.","Собери всё в одной миске."]
        };

        return {
            engineVersion: ENGINE_VERSION,
            type: type.id,
            title: titleMap[type.id] || "Блюдо RecipePro",
            emoji: type.emoji,
            description: "Recipe Engine выбрал тип блюда по сочетанию продуктов и собрал основу рецепта.",
            time: type.baseTime,
            servings: 1,
            ingredients: selected.map(id => ({ product:id, ...amount(id), required:true })),
            steps: stepsByType[type.id] || ["Подготовь продукты.","Приготовь до готовности.","Подавай сразу."],
            aiChanges: ["Recipe Engine определил тип блюда: " + type.title],
            aiWarnings: []
        };
    }

    window.recipeProRecipeEngine = { version: ENGINE_VERSION, build, chooseType, role };
})();