window.products = {

    "курица": {
        name: "Куриная грудка",
        category: "meat",
        aliases: ["курица", "куриную грудку", "куриная грудка", "грудка"],
        raw: {
            kcal: 120,
            protein: 23,
            fat: 2.6,
            carbs: 0
        },
        cookedWeightRatio: 0.75,
        pieceWeight: 250
    },

    "куриное-бедро": {
        name: "Куриное бедро",
        category: "meat",
        aliases: ["бедро", "куриное бедро"],
        raw: {
            kcal: 177,
            protein: 18.6,
            fat: 11,
            carbs: 0
        },
        cookedWeightRatio: 0.72,
        pieceWeight: 150
    },

    "индейка": {
        name: "Филе индейки",
        category: "meat",
        aliases: ["индейка", "индейку", "филе индейки"],
        raw: {
            kcal: 114,
            protein: 23.7,
            fat: 2,
            carbs: 0
        },
        cookedWeightRatio: 0.75,
        pieceWeight: 250
    },

    "говядина": {
        name: "Говядина",
        category: "meat",
        aliases: ["говядина", "говядину"],
        raw: {
            kcal: 187,
            protein: 18.9,
            fat: 12.4,
            carbs: 0
        },
        cookedWeightRatio: 0.7,
        pieceWeight: 200
    },

    "свинина": {
        name: "Свинина",
        category: "meat",
        aliases: ["свинина", "свинину"],
        raw: {
            kcal: 242,
            protein: 16.9,
            fat: 18.4,
            carbs: 0
        },
        cookedWeightRatio: 0.7,
        pieceWeight: 200
    },


    "лосось": {
        name: "Лосось",
        category: "fish",
        aliases: ["лосось", "лосося"],
        raw: {
            kcal: 208,
            protein: 20,
            fat: 13.4,
            carbs: 0
        },
        cookedWeightRatio: 0.8,
        pieceWeight: 200
    },

    "тунец": {
        name: "Тунец (сырой, желтопёрый)",
        category: "fish",
        aliases: ["тунец", "тунца", "желтопёрый тунец"],
        raw: {
            kcal: 109,
            protein: 24.4,
            fat: 0.5,
            carbs: 0
        },
        nutritionSource: {
            database: "USDA FoodData Central SR Legacy",
            fdcId: "175159",
            state: "raw",
            url: "https://fdc.nal.usda.gov/food-details/175159/nutrients"
        },
        cookedWeightRatio: 0.82,
        pieceWeight: 150
    },

    "креветки": {
        name: "Креветки (сырые)",
        category: "fish",
        aliases: ["креветки", "креветок", "креветку"],
        raw: {
            kcal: 85,
            protein: 20.1,
            fat: 0.5,
            carbs: 0
        },
        nutritionSource: {
            database: "USDA FoodData Central SR Legacy",
            fdcId: "175179",
            state: "raw",
            url: "https://fdc.nal.usda.gov/food-details/175179/nutrients"
        },
        cookedWeightRatio: 0.86,
        pieceWeight: 15
    },


    "картофель": {
        name: "Картофель",
        category: "vegetable",
        aliases: ["картофель", "картошка", "картошку", "картофеля"],
        raw: {
            kcal: 77,
            protein: 2,
            fat: 0.1,
            carbs: 17
        },
        cookedWeightRatio: 0.85,
        pieceWeight: 150
    },

    "лук": {
        name: "Лук",
        category: "vegetable",
        aliases: ["лук", "лука", "луковица"],
        raw: {
            kcal: 40,
            protein: 1.1,
            fat: 0.1,
            carbs: 9.3
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 100
    },

    "морковь": {
        name: "Морковь",
        category: "vegetable",
        aliases: ["морковь", "морковку", "моркови"],
        raw: {
            kcal: 41,
            protein: 0.9,
            fat: 0.2,
            carbs: 9.6
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 80
    },

    "помидоры": {
        name: "Помидоры",
        category: "vegetable",
        aliases: ["помидоры", "помидор", "томат", "томаты"],
        raw: {
            kcal: 18,
            protein: 0.9,
            fat: 0.2,
            carbs: 3.9
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 120
    },

    "огурец": {
        name: "Огурец",
        category: "vegetable",
        aliases: ["огурец", "огурцы", "огурца"],
        raw: {
            kcal: 15,
            protein: 0.7,
            fat: 0.1,
            carbs: 3.6
        },
        cookedWeightRatio: 0.95,
        pieceWeight: 120
    },

    "перец": {
        name: "Болгарский перец",
        category: "vegetable",
        aliases: ["перец", "болгарский перец"],
        raw: {
            kcal: 27,
            protein: 1,
            fat: 0.2,
            carbs: 6
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 150
    },

    "брокколи": {
        name: "Брокколи",
        category: "vegetable",
        aliases: ["брокколи"],
        raw: {
            kcal: 34,
            protein: 2.8,
            fat: 0.4,
            carbs: 6.6
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 300
    },

    "капуста": {
        name: "Капуста",
        category: "vegetable",
        aliases: ["капуста", "капусту"],
        raw: {
            kcal: 25,
            protein: 1.3,
            fat: 0.1,
            carbs: 5.8
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 1500
    },

    "кабачок": {
        name: "Кабачок",
        category: "vegetable",
        aliases: ["кабачок", "кабачки", "кабачка"],
        raw: {
            kcal: 24,
            protein: 0.6,
            fat: 0.3,
            carbs: 4.6
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 250
    },

    "чеснок": {
        name: "Чеснок",
        category: "vegetable",
        aliases: ["чеснок", "чеснока"],
        raw: {
            kcal: 149,
            protein: 6.4,
            fat: 0.5,
            carbs: 33
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 5
    },


    "яйца": {
        name: "Яйца",
        category: "eggs",
        aliases: ["яйца", "яйцо", "яиц", "яйца"],
        raw: {
            kcal: 143,
            protein: 12.6,
            fat: 9.5,
            carbs: 0.7
        },
        cookedWeightRatio: 0.95,
        pieceWeight: 50
    },


    "сыр": {
        name: "Сыр",
        category: "dairy",
        aliases: ["сыр", "сыра", "сыром"],
        raw: {
            kcal: 350,
            protein: 25,
            fat: 28,
            carbs: 2
        },
        cookedWeightRatio: 1,
        pieceWeight: 20
    },

    "моцарелла": {
        name: "Моцарелла",
        category: "dairy",
        aliases: ["моцарелла", "моцареллы"],
        raw: {
            kcal: 280,
            protein: 28,
            fat: 17,
            carbs: 3
        },
        cookedWeightRatio: 1,
        pieceWeight: 20
    },

    "молоко": {
        name: "Молоко",
        category: "dairy",
        aliases: ["молоко", "молока"],
        raw: {
            kcal: 52,
            protein: 2.8,
            fat: 2.5,
            carbs: 4.7
        },
        cookedWeightRatio: 1
    },

    "творог": {
        name: "Творог",
        category: "dairy",
        aliases: ["творог", "творога"],
        raw: {
            kcal: 121,
            protein: 17,
            fat: 5,
            carbs: 1.8
        },
        cookedWeightRatio: 1,
        pieceWeight: 200
    },

    "йогурт": {
        name: "Йогурт",
        category: "dairy",
        aliases: ["йогурт", "йогурта"],
        raw: {
            kcal: 60,
            protein: 4.5,
            fat: 3.2,
            carbs: 4
        },
        cookedWeightRatio: 1
    },

    "сметана": {
        name: "Сметана",
        category: "dairy",
        aliases: ["сметана", "сметаны"],
        raw: {
            kcal: 158,
            protein: 2.6,
            fat: 15,
            carbs: 3.6
        },
        cookedWeightRatio: 1
    },


    "рис": {
        name: "Рис",
        category: "grain",
        aliases: ["рис", "риса"],
        raw: {
            kcal: 360,
            protein: 7,
            fat: 0.7,
            carbs: 79
        },
        cookedWeightRatio: 2.8
    },

    "гречка": {
        name: "Гречка",
        category: "grain",
        aliases: ["гречка", "гречневую", "гречневой"],
        raw: {
            kcal: 343,
            protein: 13.6,
            fat: 3.3,
            carbs: 71.5
        },
        cookedWeightRatio: 2.5
    },

    "овсянка": {
        name: "Овсянка",
        category: "grain",
        aliases: ["овсянка", "овсянку", "овсяные хлопья"],
        raw: {
            kcal: 370,
            protein: 13,
            fat: 6.5,
            carbs: 62
        },
        cookedWeightRatio: 2.5
    },

    "паста": {
        name: "Паста",
        category: "grain",
        aliases: ["паста", "макароны", "макарон", "спагетти"],
        raw: {
            kcal: 350,
            protein: 12,
            fat: 1.5,
            carbs: 70
        },
        cookedWeightRatio: 2.4
    },

    "хлеб": {
        name: "Хлеб",
        category: "grain",
        aliases: ["хлеб", "хлеба"],
        raw: {
            kcal: 265,
            protein: 9,
            fat: 3.2,
            carbs: 49
        },
        cookedWeightRatio: 1,
        pieceWeight: 30
    },


    "чечевица": {
        name: "Чечевица",
        category: "legumes",
        aliases: ["чечевица", "чечевицу"],
        raw: {
            kcal: 352,
            protein: 24.6,
            fat: 1.1,
            carbs: 63
        },
        cookedWeightRatio: 2.5
    },

    "фасоль": {
        name: "Фасоль",
        category: "legumes",
        aliases: ["фасоль", "фасоли"],
        raw: {
            kcal: 333,
            protein: 23.6,
            fat: 0.8,
            carbs: 60
        },
        cookedWeightRatio: 2.4
    },


    "банан": {
        name: "Банан",
        category: "fruit",
        aliases: ["банан", "бананы", "банана"],
        raw: {
            kcal: 89,
            protein: 1.1,
            fat: 0.3,
            carbs: 22.8
        },
        cookedWeightRatio: 1,
        pieceWeight: 120
    },

    "яблоко": {
        name: "Яблоко",
        category: "fruit",
        aliases: ["яблоко", "яблоки", "яблока"],
        raw: {
            kcal: 52,
            protein: 0.3,
            fat: 0.2,
            carbs: 13.8
        },
        cookedWeightRatio: 1,
        pieceWeight: 180
    },

    "апельсин": {
        name: "Апельсин",
        category: "fruit",
        aliases: ["апельсин", "апельсины"],
        raw: {
            kcal: 47,
            protein: 0.9,
            fat: 0.1,
            carbs: 11.8
        },
        cookedWeightRatio: 1,
        pieceWeight: 180
    },


    "масло": {
        name: "Растительное масло",
        category: "oil",
        aliases: ["масло", "растительное масло", "оливковое масло"],
        raw: {
            kcal: 899,
            protein: 0,
            fat: 99.9,
            carbs: 0
        },
        cookedWeightRatio: 1
    },

    "сливочное-масло": {
        name: "Сливочное масло",
        category: "oil",
        aliases: ["сливочное масло", "сливочное", "масло сливочное"],
        raw: {
            kcal: 748,
            protein: 0.5,
            fat: 82.5,
            carbs: 0.8
        },
        cookedWeightRatio: 1
    },

    "мед": {
        name: "Мёд",
        category: "sweet",
        aliases: ["мед", "мёд", "меда"],
        raw: {
            kcal: 304,
            protein: 0.3,
            fat: 0,
            carbs: 82.4
        },
        cookedWeightRatio: 1
    },

    "сахар": {
        name: "Сахар",
        category: "sweet",
        aliases: ["сахар", "сахара"],
        raw: {
            kcal: 387,
            protein: 0,
            fat: 0,
            carbs: 99.8
        },
        cookedWeightRatio: 1
    }
,

    "куриное-филе": {
        name: "Куриное филе",
        category: "meat",
        aliases: ["Куриное филе", "куриная грудка", "филе курицы"],
        raw: { kcal: 120, protein: 23, fat: 2.6, carbs: 0 },
        cookedWeightRatio: 0.75,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "куриный-фарш": {
        name: "Куриный фарш",
        category: "meat",
        aliases: ["Куриный фарш", "фарш куриный"],
        raw: { kcal: 143, protein: 17, fat: 8, carbs: 0 },
        cookedWeightRatio: 0.75,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "утка": {
        name: "Утка",
        category: "meat",
        aliases: ["Утка"],
        raw: { kcal: 337, protein: 19, fat: 28, carbs: 0 },
        cookedWeightRatio: 0.7,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кролик": {
        name: "Крольчатина",
        category: "meat",
        aliases: ["Крольчатина"],
        raw: { kcal: 173, protein: 21, fat: 10, carbs: 0 },
        cookedWeightRatio: 0.7,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "баранина": {
        name: "Баранина",
        category: "meat",
        aliases: ["Баранина"],
        raw: { kcal: 294, protein: 17, fat: 25, carbs: 0 },
        cookedWeightRatio: 0.7,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "печень-куриная": {
        name: "Куриная печень",
        category: "meat",
        aliases: ["Куриная печень"],
        raw: { kcal: 119, protein: 17, fat: 4.8, carbs: 0.7 },
        cookedWeightRatio: 0.75,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "печень-говяжья": {
        name: "Говяжья печень",
        category: "meat",
        aliases: ["Говяжья печень"],
        raw: { kcal: 135, protein: 20.4, fat: 3.6, carbs: 3.9 },
        cookedWeightRatio: 0.75,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сердце-куриное": {
        name: "Куриные сердечки",
        category: "meat",
        aliases: ["Куриные сердечки"],
        raw: { kcal: 153, protein: 15.6, fat: 9.3, carbs: 0.7 },
        cookedWeightRatio: 0.75,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "фарш-говяжий": {
        name: "Говяжий фарш",
        category: "meat",
        aliases: ["Говяжий фарш"],
        raw: { kcal: 254, protein: 17.2, fat: 20, carbs: 0 },
        cookedWeightRatio: 0.7,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "ветчина": {
        name: "Ветчина",
        category: "meat",
        aliases: ["Ветчина"],
        raw: { kcal: 145, protein: 20, fat: 6, carbs: 1.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "бекон": {
        name: "Бекон",
        category: "meat",
        aliases: ["Бекон"],
        raw: { kcal: 541, protein: 37, fat: 42, carbs: 1.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "колбаса-вареная": {
        name: "Колбаса варёная",
        category: "meat",
        aliases: ["Колбаса варёная", "докторская колбаса"],
        raw: { kcal: 250, protein: 12, fat: 22, carbs: 1.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сосиски": {
        name: "Сосиски",
        category: "meat",
        aliases: ["Сосиски"],
        raw: { kcal: 270, protein: 11, fat: 24, carbs: 2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "треска": {
        name: "Треска",
        category: "fish",
        aliases: ["Треска"],
        raw: { kcal: 82, protein: 18, fat: 0.7, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "минтай": {
        name: "Минтай",
        category: "fish",
        aliases: ["Минтай"],
        raw: { kcal: 72, protein: 15.9, fat: 0.9, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "хек": {
        name: "Хек",
        category: "fish",
        aliases: ["Хек"],
        raw: { kcal: 86, protein: 16.6, fat: 2.2, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "горбуша": {
        name: "Горбуша",
        category: "fish",
        aliases: ["Горбуша"],
        raw: { kcal: 140, protein: 20.5, fat: 6.5, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "скумбрия": {
        name: "Скумбрия",
        category: "fish",
        aliases: ["Скумбрия"],
        raw: { kcal: 205, protein: 18.6, fat: 13.9, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сельдь": {
        name: "Сельдь",
        category: "fish",
        aliases: ["Сельдь"],
        raw: { kcal: 158, protein: 17.9, fat: 9, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сардины": {
        name: "Сардины",
        category: "fish",
        aliases: ["Сардины"],
        raw: { kcal: 208, protein: 24.6, fat: 11.5, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "форель": {
        name: "Форель",
        category: "fish",
        aliases: ["Форель"],
        raw: { kcal: 148, protein: 20.8, fat: 6.6, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кальмар": {
        name: "Кальмар",
        category: "fish",
        aliases: ["Кальмар"],
        raw: { kcal: 92, protein: 15.6, fat: 1.4, carbs: 3.1 },
        cookedWeightRatio: 0.85,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "мидии": {
        name: "Мидии",
        category: "fish",
        aliases: ["Мидии"],
        raw: { kcal: 86, protein: 11.9, fat: 2.2, carbs: 3.7 },
        cookedWeightRatio: 0.85,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "осьминог": {
        name: "Осьминог",
        category: "fish",
        aliases: ["Осьминог"],
        raw: { kcal: 82, protein: 14.9, fat: 1, carbs: 2.2 },
        cookedWeightRatio: 0.85,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "батат": {
        name: "Батат",
        category: "vegetable",
        aliases: ["Батат", "сладкий картофель"],
        raw: { kcal: 86, protein: 1.6, fat: 0.1, carbs: 20.1 },
        cookedWeightRatio: 0.85,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "свекла": {
        name: "Свёкла",
        category: "vegetable",
        aliases: ["Свёкла"],
        raw: { kcal: 43, protein: 1.6, fat: 0.2, carbs: 9.6 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "тыква": {
        name: "Тыква",
        category: "vegetable",
        aliases: ["Тыква"],
        raw: { kcal: 26, protein: 1, fat: 0.1, carbs: 6.5 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "баклажан": {
        name: "Баклажан",
        category: "vegetable",
        aliases: ["Баклажан"],
        raw: { kcal: 25, protein: 1, fat: 0.2, carbs: 5.9 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "цветная-капуста": {
        name: "Цветная капуста",
        category: "vegetable",
        aliases: ["Цветная капуста"],
        raw: { kcal: 25, protein: 1.9, fat: 0.3, carbs: 5 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "брюссельская-капуста": {
        name: "Брюссельская капуста",
        category: "vegetable",
        aliases: ["Брюссельская капуста"],
        raw: { kcal: 43, protein: 3.4, fat: 0.3, carbs: 9 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кукуруза": {
        name: "Кукуруза",
        category: "vegetable",
        aliases: ["Кукуруза", "кукуруза сладкая"],
        raw: { kcal: 86, protein: 3.3, fat: 1.4, carbs: 18.7 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "зелёный-горошек": {
        name: "Зелёный горошек",
        category: "vegetable",
        aliases: ["Зелёный горошек", "зеленый горошек"],
        raw: { kcal: 81, protein: 5.4, fat: 0.4, carbs: 14.5 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "стручковая-фасоль": {
        name: "Стручковая фасоль",
        category: "vegetable",
        aliases: ["Стручковая фасоль"],
        raw: { kcal: 31, protein: 1.8, fat: 0.2, carbs: 7 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "шпинат": {
        name: "Шпинат",
        category: "vegetable",
        aliases: ["Шпинат"],
        raw: { kcal: 23, protein: 2.9, fat: 0.4, carbs: 3.6 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "салат-латук": {
        name: "Листовой салат",
        category: "vegetable",
        aliases: ["Листовой салат", "салат"],
        raw: { kcal: 15, protein: 1.4, fat: 0.2, carbs: 2.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "пекинская-капуста": {
        name: "Пекинская капуста",
        category: "vegetable",
        aliases: ["Пекинская капуста"],
        raw: { kcal: 16, protein: 1.2, fat: 0.2, carbs: 3.2 },
        cookedWeightRatio: 0.95,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "редис": {
        name: "Редис",
        category: "vegetable",
        aliases: ["Редис"],
        raw: { kcal: 16, protein: 0.7, fat: 0.1, carbs: 3.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "редька": {
        name: "Редька",
        category: "vegetable",
        aliases: ["Редька"],
        raw: { kcal: 36, protein: 1.2, fat: 0.2, carbs: 7.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сельдерей": {
        name: "Сельдерей",
        category: "vegetable",
        aliases: ["Сельдерей"],
        raw: { kcal: 16, protein: 0.7, fat: 0.2, carbs: 3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "спаржа": {
        name: "Спаржа",
        category: "vegetable",
        aliases: ["Спаржа"],
        raw: { kcal: 20, protein: 2.2, fat: 0.1, carbs: 3.9 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "шампиньоны": {
        name: "Шампиньоны",
        category: "vegetable",
        aliases: ["Шампиньоны", "грибы"],
        raw: { kcal: 22, protein: 3.1, fat: 0.3, carbs: 3.3 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "вешенки": {
        name: "Вешенки",
        category: "vegetable",
        aliases: ["Вешенки"],
        raw: { kcal: 33, protein: 3.3, fat: 0.4, carbs: 6.1 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "авокадо": {
        name: "Авокадо",
        category: "fruit",
        aliases: ["Авокадо"],
        raw: { kcal: 160, protein: 2, fat: 14.7, carbs: 8.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "груша": {
        name: "Груша",
        category: "fruit",
        aliases: ["Груша"],
        raw: { kcal: 57, protein: 0.4, fat: 0.1, carbs: 15.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "персик": {
        name: "Персик",
        category: "fruit",
        aliases: ["Персик"],
        raw: { kcal: 39, protein: 0.9, fat: 0.3, carbs: 9.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "нектарин": {
        name: "Нектарин",
        category: "fruit",
        aliases: ["Нектарин"],
        raw: { kcal: 44, protein: 1.1, fat: 0.3, carbs: 10.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "киви": {
        name: "Киви",
        category: "fruit",
        aliases: ["Киви"],
        raw: { kcal: 61, protein: 1.1, fat: 0.5, carbs: 14.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "ананас": {
        name: "Ананас",
        category: "fruit",
        aliases: ["Ананас"],
        raw: { kcal: 50, protein: 0.5, fat: 0.1, carbs: 13.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "манго": {
        name: "Манго",
        category: "fruit",
        aliases: ["Манго"],
        raw: { kcal: 60, protein: 0.8, fat: 0.4, carbs: 15 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "виноград": {
        name: "Виноград",
        category: "fruit",
        aliases: ["Виноград"],
        raw: { kcal: 69, protein: 0.7, fat: 0.2, carbs: 18.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "клубника": {
        name: "Клубника",
        category: "fruit",
        aliases: ["Клубника"],
        raw: { kcal: 32, protein: 0.7, fat: 0.3, carbs: 7.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "малина": {
        name: "Малина",
        category: "fruit",
        aliases: ["Малина"],
        raw: { kcal: 52, protein: 1.2, fat: 0.7, carbs: 11.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "черника": {
        name: "Черника",
        category: "fruit",
        aliases: ["Черника"],
        raw: { kcal: 57, protein: 0.7, fat: 0.3, carbs: 14.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "вишня": {
        name: "Вишня",
        category: "fruit",
        aliases: ["Вишня"],
        raw: { kcal: 50, protein: 1, fat: 0.3, carbs: 12.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "арбуз": {
        name: "Арбуз",
        category: "fruit",
        aliases: ["Арбуз"],
        raw: { kcal: 30, protein: 0.6, fat: 0.2, carbs: 7.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "дыня": {
        name: "Дыня",
        category: "fruit",
        aliases: ["Дыня"],
        raw: { kcal: 34, protein: 0.8, fat: 0.2, carbs: 8.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "лимон": {
        name: "Лимон",
        category: "fruit",
        aliases: ["Лимон"],
        raw: { kcal: 29, protein: 1.1, fat: 0.3, carbs: 9.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "грейпфрут": {
        name: "Грейпфрут",
        category: "fruit",
        aliases: ["Грейпфрут"],
        raw: { kcal: 42, protein: 0.8, fat: 0.1, carbs: 10.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "изюм": {
        name: "Изюм",
        category: "fruit",
        aliases: ["Изюм"],
        raw: { kcal: 299, protein: 3.1, fat: 0.5, carbs: 79.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "финики": {
        name: "Финики",
        category: "fruit",
        aliases: ["Финики"],
        raw: { kcal: 282, protein: 2.5, fat: 0.4, carbs: 75 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "киноа": {
        name: "Киноа (сухая)",
        category: "grain",
        aliases: ["Киноа (сухая)"],
        raw: { kcal: 368, protein: 14.1, fat: 6.1, carbs: 64.2 },
        cookedWeightRatio: 2.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "пшено": {
        name: "Пшено (сухое)",
        category: "grain",
        aliases: ["Пшено (сухое)"],
        raw: { kcal: 378, protein: 11, fat: 4.2, carbs: 72.9 },
        cookedWeightRatio: 2.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "перловка": {
        name: "Перловая крупа (сухая)",
        category: "grain",
        aliases: ["Перловая крупа (сухая)"],
        raw: { kcal: 352, protein: 9.9, fat: 1.2, carbs: 77.7 },
        cookedWeightRatio: 2.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "булгур": {
        name: "Булгур (сухой)",
        category: "grain",
        aliases: ["Булгур (сухой)"],
        raw: { kcal: 342, protein: 12.3, fat: 1.3, carbs: 75.9 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кускус": {
        name: "Кускус (сухой)",
        category: "grain",
        aliases: ["Кускус (сухой)"],
        raw: { kcal: 376, protein: 12.8, fat: 0.6, carbs: 77.4 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "манка": {
        name: "Манная крупа",
        category: "grain",
        aliases: ["Манная крупа", "манная крупа"],
        raw: { kcal: 360, protein: 10.3, fat: 1, carbs: 73.3 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кукурузная-крупа": {
        name: "Кукурузная крупа",
        category: "grain",
        aliases: ["Кукурузная крупа"],
        raw: { kcal: 370, protein: 8.3, fat: 1.2, carbs: 79.6 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "мука-пшеничная": {
        name: "Пшеничная мука",
        category: "grain",
        aliases: ["Пшеничная мука", "мука"],
        raw: { kcal: 364, protein: 10.3, fat: 1, carbs: 76.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "мука-цельнозерновая": {
        name: "Цельнозерновая мука",
        category: "grain",
        aliases: ["Цельнозерновая мука"],
        raw: { kcal: 340, protein: 13.2, fat: 2.5, carbs: 72 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "лаваш": {
        name: "Лаваш",
        category: "grain",
        aliases: ["Лаваш"],
        raw: { kcal: 275, protein: 9.1, fat: 1.2, carbs: 55.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "хлеб-ржаной": {
        name: "Ржаной хлеб",
        category: "grain",
        aliases: ["Ржаной хлеб"],
        raw: { kcal: 259, protein: 8.5, fat: 3.3, carbs: 48.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "хлеб-цельнозерновой": {
        name: "Цельнозерновой хлеб",
        category: "grain",
        aliases: ["Цельнозерновой хлеб"],
        raw: { kcal: 247, protein: 13, fat: 4.2, carbs: 41.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "рис-коричневый": {
        name: "Коричневый рис (сухой)",
        category: "grain",
        aliases: ["Коричневый рис (сухой)"],
        raw: { kcal: 370, protein: 7.5, fat: 2.7, carbs: 77.2 },
        cookedWeightRatio: 2.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "рисовая-лапша": {
        name: "Рисовая лапша (сухая)",
        category: "grain",
        aliases: ["Рисовая лапша (сухая)"],
        raw: { kcal: 364, protein: 5.9, fat: 0.6, carbs: 80.2 },
        cookedWeightRatio: 2.4,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "лапша-яичная": {
        name: "Яичная лапша (сухая)",
        category: "grain",
        aliases: ["Яичная лапша (сухая)"],
        raw: { kcal: 384, protein: 14.2, fat: 4.4, carbs: 71.3 },
        cookedWeightRatio: 2.4,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "нут": {
        name: "Нут (сухой)",
        category: "legumes",
        aliases: ["Нут (сухой)"],
        raw: { kcal: 364, protein: 19, fat: 6, carbs: 61 },
        cookedWeightRatio: 2.4,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "горох-сухой": {
        name: "Горох сухой",
        category: "legumes",
        aliases: ["Горох сухой"],
        raw: { kcal: 341, protein: 24.6, fat: 1.2, carbs: 60.1 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "маш": {
        name: "Маш (сухой)",
        category: "legumes",
        aliases: ["Маш (сухой)"],
        raw: { kcal: 347, protein: 23.9, fat: 1.2, carbs: 62.6 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "соевые-бобы": {
        name: "Соевые бобы (сухие)",
        category: "legumes",
        aliases: ["Соевые бобы (сухие)"],
        raw: { kcal: 446, protein: 36.5, fat: 19.9, carbs: 30.2 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "тофу": {
        name: "Тофу",
        category: "legumes",
        aliases: ["Тофу"],
        raw: { kcal: 76, protein: 8, fat: 4.8, carbs: 1.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "арахис": {
        name: "Арахис",
        category: "nuts",
        aliases: ["Арахис"],
        raw: { kcal: 567, protein: 25.8, fat: 49.2, carbs: 16.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "миндаль": {
        name: "Миндаль",
        category: "nuts",
        aliases: ["Миндаль"],
        raw: { kcal: 579, protein: 21.2, fat: 49.9, carbs: 21.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "грецкий-орех": {
        name: "Грецкий орех",
        category: "nuts",
        aliases: ["Грецкий орех"],
        raw: { kcal: 654, protein: 15.2, fat: 65.2, carbs: 13.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кешью": {
        name: "Кешью",
        category: "nuts",
        aliases: ["Кешью"],
        raw: { kcal: 553, protein: 18.2, fat: 43.9, carbs: 30.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "фисташки": {
        name: "Фисташки",
        category: "nuts",
        aliases: ["Фисташки"],
        raw: { kcal: 560, protein: 20.2, fat: 45.3, carbs: 27.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "фундук": {
        name: "Фундук",
        category: "nuts",
        aliases: ["Фундук"],
        raw: { kcal: 628, protein: 15, fat: 60.8, carbs: 16.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "семечки-подсолнечника": {
        name: "Семечки подсолнечника",
        category: "nuts",
        aliases: ["Семечки подсолнечника", "семечки"],
        raw: { kcal: 584, protein: 20.8, fat: 51.5, carbs: 20 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "семена-чия": {
        name: "Семена чиа",
        category: "nuts",
        aliases: ["Семена чиа"],
        raw: { kcal: 486, protein: 16.5, fat: 30.7, carbs: 42.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "семена-льна": {
        name: "Семена льна",
        category: "nuts",
        aliases: ["Семена льна"],
        raw: { kcal: 534, protein: 18.3, fat: 42.2, carbs: 28.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кефир": {
        name: "Кефир 2,5%",
        category: "dairy",
        aliases: ["Кефир 2,5%"],
        raw: { kcal: 53, protein: 3, fat: 2.5, carbs: 4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "ряженка": {
        name: "Ряженка 2,5%",
        category: "dairy",
        aliases: ["Ряженка 2,5%"],
        raw: { kcal: 54, protein: 2.9, fat: 2.5, carbs: 4.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "греческий-йогурт": {
        name: "Греческий йогурт натуральный",
        category: "dairy",
        aliases: ["Греческий йогурт натуральный"],
        raw: { kcal: 97, protein: 9, fat: 5, carbs: 3.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "йогурт-обезжиренный": {
        name: "Йогурт натуральный 1,5%",
        category: "dairy",
        aliases: ["Йогурт натуральный 1,5%"],
        raw: { kcal: 48, protein: 5, fat: 1.5, carbs: 3.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "молоко-обезжиренное": {
        name: "Молоко 1,5%",
        category: "dairy",
        aliases: ["Молоко 1,5%"],
        raw: { kcal: 44, protein: 3, fat: 1.5, carbs: 4.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "молоко-цельное": {
        name: "Молоко 3,2%",
        category: "dairy",
        aliases: ["Молоко 3,2%"],
        raw: { kcal: 60, protein: 3, fat: 3.2, carbs: 4.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сыр-чеддер": {
        name: "Сыр чеддер",
        category: "dairy",
        aliases: ["Сыр чеддер"],
        raw: { kcal: 403, protein: 25, fat: 33, carbs: 1.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сыр-пармезан": {
        name: "Пармезан",
        category: "dairy",
        aliases: ["Пармезан"],
        raw: { kcal: 431, protein: 38, fat: 29, carbs: 4.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сыр-фета": {
        name: "Сыр фета",
        category: "dairy",
        aliases: ["Сыр фета"],
        raw: { kcal: 264, protein: 14.2, fat: 21.3, carbs: 4.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сыр-адыгейский": {
        name: "Адыгейский сыр",
        category: "dairy",
        aliases: ["Адыгейский сыр"],
        raw: { kcal: 240, protein: 18.5, fat: 18, carbs: 1.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "брынза": {
        name: "Брынза",
        category: "dairy",
        aliases: ["Брынза"],
        raw: { kcal: 260, protein: 17.9, fat: 20.1, carbs: 0.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сливки-10": {
        name: "Сливки 10%",
        category: "dairy",
        aliases: ["Сливки 10%"],
        raw: { kcal: 119, protein: 3, fat: 10, carbs: 4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сливки-20": {
        name: "Сливки 20%",
        category: "dairy",
        aliases: ["Сливки 20%"],
        raw: { kcal: 206, protein: 2.8, fat: 20, carbs: 4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "мороженое": {
        name: "Мороженое сливочное",
        category: "dairy",
        aliases: ["Мороженое сливочное"],
        raw: { kcal: 207, protein: 3.5, fat: 11, carbs: 24 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "яичный-белок": {
        name: "Яичный белок",
        category: "eggs",
        aliases: ["Яичный белок"],
        raw: { kcal: 52, protein: 10.9, fat: 0.2, carbs: 0.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "яичный-желток": {
        name: "Яичный желток",
        category: "eggs",
        aliases: ["Яичный желток"],
        raw: { kcal: 322, protein: 15.9, fat: 26.5, carbs: 3.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "оливковое-масло": {
        name: "Оливковое масло",
        category: "oil",
        aliases: ["Оливковое масло"],
        raw: { kcal: 884, protein: 0, fat: 100, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "масло-кокосовое": {
        name: "Кокосовое масло",
        category: "oil",
        aliases: ["Кокосовое масло"],
        raw: { kcal: 892, protein: 0, fat: 99.1, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "майонез": {
        name: "Майонез",
        category: "sauce",
        aliases: ["Майонез"],
        raw: { kcal: 680, protein: 1, fat: 75, carbs: 1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кетчуп": {
        name: "Кетчуп",
        category: "sauce",
        aliases: ["Кетчуп"],
        raw: { kcal: 112, protein: 1.3, fat: 0.2, carbs: 25.8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "соевый-соус": {
        name: "Соевый соус",
        category: "sauce",
        aliases: ["Соевый соус"],
        raw: { kcal: 53, protein: 8.1, fat: 0.6, carbs: 4.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "горчица": {
        name: "Горчица столовая",
        category: "sauce",
        aliases: ["Горчица столовая"],
        raw: { kcal: 66, protein: 4.4, fat: 4, carbs: 5.8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "томатная-паста": {
        name: "Томатная паста",
        category: "sauce",
        aliases: ["Томатная паста"],
        raw: { kcal: 82, protein: 4.3, fat: 0.5, carbs: 18.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "соль": {
        name: "Соль",
        category: "seasoning",
        aliases: ["Соль"],
        raw: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "черный-перец": {
        name: "Чёрный перец молотый",
        category: "seasoning",
        aliases: ["Чёрный перец молотый"],
        raw: { kcal: 251, protein: 10.4, fat: 3.3, carbs: 64 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "паприка": {
        name: "Паприка",
        category: "seasoning",
        aliases: ["Паприка"],
        raw: { kcal: 282, protein: 14.1, fat: 12.9, carbs: 53.99 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "корица": {
        name: "Корица",
        category: "seasoning",
        aliases: ["Корица"],
        raw: { kcal: 247, protein: 4, fat: 1.2, carbs: 80.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "какао": {
        name: "Какао-порошок",
        category: "sweet",
        aliases: ["Какао-порошок"],
        raw: { kcal: 228, protein: 19.6, fat: 13.7, carbs: 57.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "шоколад-тёмный": {
        name: "Тёмный шоколад 70–85%",
        category: "sweet",
        aliases: ["Тёмный шоколад 70–85%", "горький шоколад"],
        raw: { kcal: 598, protein: 7.8, fat: 42.6, carbs: 45.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "шоколад-молочный": {
        name: "Молочный шоколад",
        category: "sweet",
        aliases: ["Молочный шоколад"],
        raw: { kcal: 535, protein: 7.7, fat: 29.7, carbs: 59.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "варенье": {
        name: "Варенье",
        category: "sweet",
        aliases: ["Варенье"],
        raw: { kcal: 278, protein: 0.4, fat: 0.1, carbs: 70 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "джем": {
        name: "Джем",
        category: "sweet",
        aliases: ["Джем"],
        raw: { kcal: 250, protein: 0.4, fat: 0.1, carbs: 65 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "дрожжи": {
        name: "Дрожжи прессованные",
        category: "other",
        aliases: ["Дрожжи прессованные"],
        raw: { kcal: 105, protein: 8.4, fat: 1.9, carbs: 18.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "желатин": {
        name: "Желатин сухой",
        category: "other",
        aliases: ["Желатин сухой"],
        raw: { kcal: 335, protein: 85.6, fat: 0.1, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "рисовые-хлебцы": {
        name: "Рисовые хлебцы",
        category: "grain",
        aliases: ["Рисовые хлебцы"],
        raw: { kcal: 387, protein: 8.2, fat: 2.8, carbs: 81.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "овсяные-отруби": {
        name: "Овсяные отруби",
        category: "grain",
        aliases: ["Овсяные отруби"],
        raw: { kcal: 246, protein: 17.3, fat: 7, carbs: 66.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "пшеничные-отруби": {
        name: "Пшеничные отруби",
        category: "grain",
        aliases: ["Пшеничные отруби"],
        raw: { kcal: 216, protein: 15.6, fat: 4.3, carbs: 64.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "зелёный-лук": {
        name: "Зелёный лук",
        category: "vegetable",
        aliases: ["Зелёный лук", "зеленый лук"],
        raw: { kcal: 32, protein: 1.8, fat: 0.2, carbs: 7.3 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "укроп": {
        name: "Укроп",
        category: "vegetable",
        aliases: ["Укроп"],
        raw: { kcal: 43, protein: 3.5, fat: 1.1, carbs: 7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "петрушка": {
        name: "Петрушка",
        category: "vegetable",
        aliases: ["Петрушка"],
        raw: { kcal: 36, protein: 3, fat: 0.8, carbs: 6.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кинза": {
        name: "Кинза",
        category: "vegetable",
        aliases: ["Кинза"],
        raw: { kcal: 23, protein: 2.1, fat: 0.5, carbs: 3.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "имбирь": {
        name: "Имбирь свежий",
        category: "vegetable",
        aliases: ["Имбирь свежий"],
        raw: { kcal: 80, protein: 1.8, fat: 0.8, carbs: 17.8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "оливки": {
        name: "Оливки",
        category: "vegetable",
        aliases: ["Оливки"],
        raw: { kcal: 145, protein: 1, fat: 15.3, carbs: 3.8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "маслины": {
        name: "Маслины",
        category: "vegetable",
        aliases: ["Маслины"],
        raw: { kcal: 115, protein: 0.8, fat: 10.7, carbs: 6.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "солёные-огурцы": {
        name: "Огурцы солёные",
        category: "vegetable",
        aliases: ["Огурцы солёные"],
        raw: { kcal: 11, protein: 0.3, fat: 0.2, carbs: 2.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "квашеная-капуста": {
        name: "Квашеная капуста",
        category: "vegetable",
        aliases: ["Квашеная капуста"],
        raw: { kcal: 19, protein: 0.9, fat: 0.1, carbs: 4.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "морская-капуста": {
        name: "Морская капуста",
        category: "vegetable",
        aliases: ["Морская капуста"],
        raw: { kcal: 49, protein: 0.8, fat: 5, carbs: 9.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сухое-молоко": {
        name: "Сухое молоко",
        category: "dairy",
        aliases: ["Сухое молоко"],
        raw: { kcal: 496, protein: 26.3, fat: 26.7, carbs: 38.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "протеин-сывороточный": {
        name: "Сывороточный протеин (порошок)",
        category: "other",
        aliases: ["Сывороточный протеин (порошок)", "сывороточный протеин"],
        raw: { kcal: 400, protein: 80, fat: 6, carbs: 8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сок-апельсиновый": {
        name: "Апельсиновый сок",
        category: "drink",
        aliases: ["Апельсиновый сок"],
        raw: { kcal: 45, protein: 0.7, fat: 0.2, carbs: 10.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сок-яблочный": {
        name: "Яблочный сок",
        category: "drink",
        aliases: ["Яблочный сок"],
        raw: { kcal: 46, protein: 0.1, fat: 0.1, carbs: 11.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кофе-чёрный": {
        name: "Кофе чёрный без сахара",
        category: "drink",
        aliases: ["Кофе чёрный без сахара", "кофе"],
        raw: { kcal: 2, protein: 0.1, fat: 0, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "чай-чёрный": {
        name: "Чёрный чай без сахара",
        category: "drink",
        aliases: ["Чёрный чай без сахара", "чай"],
        raw: { kcal: 1, protein: 0, fat: 0, carbs: 0.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "пельмени": {
        name: "Пельмени мясные (средние)",
        category: "other",
        aliases: ["Пельмени мясные (средние)"],
        raw: { kcal: 275, protein: 11, fat: 14, carbs: 27 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "вареники-с-картофелем": {
        name: "Вареники с картофелем",
        category: "other",
        aliases: ["Вареники с картофелем"],
        raw: { kcal: 178, protein: 4.4, fat: 4.5, carbs: 30 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "блины": {
        name: "Блины домашние",
        category: "other",
        aliases: ["Блины домашние"],
        raw: { kcal: 227, protein: 6.1, fat: 12.3, carbs: 24.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сухари-панировочные": {
        name: "Панировочные сухари",
        category: "grain",
        aliases: ["Панировочные сухари"],
        raw: { kcal: 395, protein: 13, fat: 5, carbs: 72 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "рисовая-мука": {
        name: "Рисовая мука",
        category: "grain",
        aliases: ["Рисовая мука"],
        raw: { kcal: 366, protein: 6, fat: 1.4, carbs: 80 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "картофельный-крахмал": {
        name: "Картофельный крахмал",
        category: "other",
        aliases: ["Картофельный крахмал"],
        raw: { kcal: 333, protein: 0.1, fat: 0, carbs: 83.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кукурузный-крахмал": {
        name: "Кукурузный крахмал",
        category: "other",
        aliases: ["Кукурузный крахмал"],
        raw: { kcal: 381, protein: 0.3, fat: 0.1, carbs: 91.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сгущённое-молоко": {
        name: "Сгущённое молоко с сахаром",
        category: "dairy",
        aliases: ["Сгущённое молоко с сахаром", "сгущенка"],
        raw: { kcal: 321, protein: 7.9, fat: 8.7, carbs: 54.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сырники": {
        name: "Сырники (средние)",
        category: "other",
        aliases: ["Сырники (средние)"],
        raw: { kcal: 183, protein: 14, fat: 8, carbs: 16 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "котлета-говяжья": {
        name: "Говяжья котлета домашняя",
        category: "other",
        aliases: ["Говяжья котлета домашняя"],
        raw: { kcal: 250, protein: 17, fat: 18, carbs: 5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "куриная-котлета": {
        name: "Куриная котлета домашняя",
        category: "other",
        aliases: ["Куриная котлета домашняя"],
        raw: { kcal: 190, protein: 19, fat: 9, carbs: 7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "рис-варёный": {
        name: "Рис белый варёный",
        category: "grain",
        aliases: ["Рис белый варёный"],
        raw: { kcal: 130, protein: 2.7, fat: 0.3, carbs: 28.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "гречка-варёная": {
        name: "Гречка варёная",
        category: "grain",
        aliases: ["Гречка варёная"],
        raw: { kcal: 110, protein: 3.6, fat: 1.1, carbs: 21.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "овсяная-каша": {
        name: "Овсяная каша на воде",
        category: "grain",
        aliases: ["Овсяная каша на воде"],
        raw: { kcal: 71, protein: 2.5, fat: 1.5, carbs: 12 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "макароны-варёные": {
        name: "Макароны варёные",
        category: "grain",
        aliases: ["Макароны варёные"],
        raw: { kcal: 157, protein: 5.8, fat: 0.9, carbs: 30.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "картофель-варёный": {
        name: "Картофель варёный",
        category: "vegetable",
        aliases: ["Картофель варёный"],
        raw: { kcal: 87, protein: 1.9, fat: 0.1, carbs: 20.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "картофель-печёный": {
        name: "Картофель печёный без масла",
        category: "vegetable",
        aliases: ["Картофель печёный без масла"],
        raw: { kcal: 93, protein: 2.5, fat: 0.1, carbs: 21.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "курица-варёная": {
        name: "Куриная грудка варёная",
        category: "meat",
        aliases: ["Куриная грудка варёная"],
        raw: { kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "яйцо-варёное": {
        name: "Яйцо варёное",
        category: "eggs",
        aliases: ["Яйцо варёное"],
        raw: { kcal: 155, protein: 12.6, fat: 10.6, carbs: 1.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "чечевица-варёная": {
        name: "Чечевица варёная",
        category: "legumes",
        aliases: ["Чечевица варёная"],
        raw: { kcal: 116, protein: 9, fat: 0.4, carbs: 20.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "нут-варёный": {
        name: "Нут варёный",
        category: "legumes",
        aliases: ["Нут варёный"],
        raw: { kcal: 164, protein: 8.9, fat: 2.6, carbs: 27.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "фасоль-варёная": {
        name: "Фасоль варёная",
        category: "legumes",
        aliases: ["Фасоль варёная"],
        raw: { kcal: 127, protein: 8.7, fat: 0.5, carbs: 22.8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кукуруза-консервированная": {
        name: "Кукуруза консервированная",
        category: "vegetable",
        aliases: ["Кукуруза консервированная"],
        raw: { kcal: 86, protein: 3.2, fat: 1.2, carbs: 18.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "горошек-консервированный": {
        name: "Горошек зелёный консервированный",
        category: "vegetable",
        aliases: ["Горошек зелёный консервированный"],
        raw: { kcal: 69, protein: 4.4, fat: 0.4, carbs: 11.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "тунец-консервированный": {
        name: "Тунец консервированный в собственном соку",
        category: "fish",
        aliases: ["Тунец консервированный в собственном соку"],
        raw: { kcal: 116, protein: 25.5, fat: 0.8, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "фасоль-консервированная": {
        name: "Фасоль консервированная",
        category: "legumes",
        aliases: ["Фасоль консервированная"],
        raw: { kcal: 95, protein: 6.7, fat: 0.5, carbs: 16.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "хумус": {
        name: "Хумус",
        category: "legumes",
        aliases: ["Хумус"],
        raw: { kcal: 166, protein: 7.9, fat: 9.6, carbs: 14.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "темпе": {
        name: "Темпе",
        category: "legumes",
        aliases: ["Темпе"],
        raw: { kcal: 192, protein: 20.3, fat: 10.8, carbs: 7.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сейтан": {
        name: "Сейтан",
        category: "other",
        aliases: ["Сейтан"],
        raw: { kcal: 141, protein: 24.7, fat: 2.1, carbs: 7.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кокосовое-молоко": {
        name: "Кокосовое молоко консервированное",
        category: "dairy",
        aliases: ["Кокосовое молоко консервированное"],
        raw: { kcal: 230, protein: 2.3, fat: 23.8, carbs: 5.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "миндальное-молоко": {
        name: "Миндальный напиток без сахара",
        category: "drink",
        aliases: ["Миндальный напиток без сахара"],
        raw: { kcal: 15, protein: 0.6, fat: 1.2, carbs: 0.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "овсяное-молоко": {
        name: "Овсяный напиток без сахара",
        category: "drink",
        aliases: ["Овсяный напиток без сахара"],
        raw: { kcal: 45, protein: 1, fat: 1.5, carbs: 6.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "соевое-молоко": {
        name: "Соевый напиток без сахара",
        category: "drink",
        aliases: ["Соевый напиток без сахара"],
        raw: { kcal: 33, protein: 3.3, fat: 1.8, carbs: 0.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "гранола": {
        name: "Гранола",
        category: "grain",
        aliases: ["Гранола"],
        raw: { kcal: 471, protein: 10, fat: 20, carbs: 64 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "мюсли": {
        name: "Мюсли",
        category: "grain",
        aliases: ["Мюсли"],
        raw: { kcal: 370, protein: 10, fat: 7, carbs: 66 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кукурузные-хлопья": {
        name: "Кукурузные хлопья",
        category: "grain",
        aliases: ["Кукурузные хлопья"],
        raw: { kcal: 357, protein: 7.5, fat: 0.4, carbs: 84 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "баранки": {
        name: "Баранки",
        category: "grain",
        aliases: ["Баранки"],
        raw: { kcal: 310, protein: 10, fat: 2, carbs: 68 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сушки": {
        name: "Сушки",
        category: "grain",
        aliases: ["Сушки"],
        raw: { kcal: 330, protein: 11, fat: 1, carbs: 70 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "крекеры": {
        name: "Крекеры",
        category: "grain",
        aliases: ["Крекеры"],
        raw: { kcal: 430, protein: 9, fat: 14, carbs: 68 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    }

};