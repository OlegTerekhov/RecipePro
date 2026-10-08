document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     STATE
  ========================================================= */

  const state = {
    activeFilter: "all",
    currentSearch: "",
    currentRecipeId: null,
    userRecipes: [],
    favorites: [],
    smartSearchResults: [],
    heroRecipeId: null
  };


  /* =========================================================
     DOM HELPERS
  ========================================================= */

  const $ = (selector) =>
    document.querySelector(selector);

  const $$ = (selector) => [
    ...document.querySelectorAll(selector)
  ];


  /* =========================================================
     INITIALIZATION
  ========================================================= */

  function init() {
    loadUserData();
    bindEvents();
    renderRecipes();
    renderHero();
    renderMyRecipes();
    updatePreview();
  }


  /* =========================================================
     LOCAL STORAGE
  ========================================================= */

  function loadUserData() {
    try {
      const savedRecipes =
        localStorage.getItem(
          "recipepro_user_recipes"
        );

      const savedFavorites =
        localStorage.getItem(
          "recipepro_favorites"
        );

      state.userRecipes = savedRecipes
        ? JSON.parse(savedRecipes)
        : [];

      state.favorites = savedFavorites
        ? JSON.parse(savedFavorites)
        : [];

      const allRecipes = [
        ...(Array.isArray(window.recipes) ? window.recipes : []),
        ...state.userRecipes
      ];

      if (allRecipes.length) {
        const randomIndex =
          Math.floor(Math.random() * allRecipes.length);

        state.heroRecipeId =
          allRecipes[randomIndex].id;
      }

      if (!Array.isArray(state.userRecipes)) {
        state.userRecipes = [];
      }

      if (!Array.isArray(state.favorites)) {
        state.favorites = [];
      }
    } catch (error) {
      console.error(
        "Ошибка загрузки данных:",
        error
      );

      state.userRecipes = [];
      state.favorites = [];
    }
  }


  function saveUserData() {
    try {
      localStorage.setItem(
        "recipepro_user_recipes",
        JSON.stringify(state.userRecipes)
      );

      localStorage.setItem(
        "recipepro_favorites",
        JSON.stringify(state.favorites)
      );
    } catch (error) {
      console.error(
        "Ошибка сохранения данных:",
        error
      );
    }
  }


  /* =========================================================
     EVENTS
  ========================================================= */

  function bindEvents() {
    const findButton =
      $("#findRecipesBtn");

    const ingredientInput =
      $("#ingredientInput");


    if (findButton) {
      findButton.addEventListener(
        "click",
        searchAndRender
      );
    }


    if (ingredientInput) {
      ingredientInput.addEventListener(
        "keydown",
        (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            searchAndRender();
          }
        }
      );
    }


    /* AI RECIPE GENERATOR */
    const aiGeneratorBtn =
      $("#aiRecipeGeneratorBtn");

    if (aiGeneratorBtn) {
      aiGeneratorBtn.addEventListener(
        "click",
        openAiRecipeGenerator
      );
    }


    /* Popular products */

    $$(".popular-item").forEach(
      (item) => {
        item.addEventListener(
          "click",
          () => {
            const product =
              item.dataset.product || "";

            if (ingredientInput) {
              ingredientInput.value =
                product;

              ingredientInput.focus();
            }

            searchAndRender();
          }
        );
      }
    );


    /* Filters */

    $$(".filter-button").forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            $$(".filter-button")
              .forEach((item) => {
                item.classList.remove(
                  "active"
                );
              });

            button.classList.add(
              "active"
            );

            state.activeFilter =
              button.dataset.filter ||
              "all";

            state.currentSearch = "";

            if (ingredientInput) {
              ingredientInput.value = "";
            }

            state.smartSearchResults = [];

            renderRecipes();
            renderHero();
          }
        );
      }
    );


    /* Recipe modal */

    const modalClose =
      $("#modalClose");

    if (modalClose) {
      modalClose.addEventListener(
        "click",
        closeRecipeModal
      );
    }


    const recipeModal =
      $("#recipeModal");

    if (recipeModal) {
      recipeModal.addEventListener(
        "click",
        (event) => {
          if (
            event.target === recipeModal
          ) {
            closeRecipeModal();
          }
        }
      );
    }


    /* My recipes */

    const myRecipesBtn =
      $("#myRecipesBtn");

    if (myRecipesBtn) {
      myRecipesBtn.addEventListener(
        "click",
        () => {
          const section =
            $("#my-recipes");

          if (section) {
            section.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        }
      );
    }


    /* Add recipe */

    const addRecipeBtn =
      $("#addRecipeBtn");

    if (addRecipeBtn) {
      addRecipeBtn.addEventListener(
        "click",
        openAddRecipeModal
      );
    }


    const addRecipeModalClose =
      $("#addRecipeModalClose");

    if (addRecipeModalClose) {
      addRecipeModalClose.addEventListener(
        "click",
        closeAddRecipeModal
      );
    }


    const addRecipeModal =
      $("#addRecipeModal");

    if (addRecipeModal) {
      addRecipeModal.addEventListener(
        "click",
        (event) => {
          if (
            event.target ===
            addRecipeModal
          ) {
            closeAddRecipeModal();
          }
        }
      );
    }


    /* Add ingredients */

    const addIngredientBtn =
      $("#addIngredientBtn");

    if (addIngredientBtn) {
      addIngredientBtn.addEventListener(
        "click",
        addIngredientRow
      );
    }


    /* Add steps */

    const addStepBtn =
      $("#addStepBtn");

    if (addStepBtn) {
      addStepBtn.addEventListener(
        "click",
        addStepRow
      );
    }


    /* Form */

    const recipeForm =
      $("#recipeForm");

    if (recipeForm) {
      recipeForm.addEventListener(
        "submit",
        handleRecipeSubmit
      );
    }


    /* Live preview */

    [
      "#recipeTitle",
      "#recipeDescription",
      "#recipeTime",
      "#recipeServings",
      "#recipeEmoji"
    ].forEach((selector) => {
      const element = $(selector);

      if (element) {
        element.addEventListener(
          "input",
          updatePreview
        );

        element.addEventListener(
          "change",
          updatePreview
        );
      }
    });


    /* =====================================================
       ADAPT RECIPE
    ===================================================== */

    document.addEventListener(
      "click",
      (event) => {
        const button =
          event.target.closest(
            "button, a"
          );

        if (!button) {
          return;
        }

        const buttonText =
          normalizeText(
            button.textContent
          );

        const isAdaptButton =
          button.dataset.adaptRecipe !== undefined ||
          button.dataset.adapt !== undefined ||
          button.classList.contains(
            "adapt-recipe-button"
          ) ||
          button.classList.contains(
            "adapt-button"
          ) ||
          buttonText.includes(
            "адаптировать"
          );

        if (!isAdaptButton) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        let recipeId =
          button.dataset.adaptRecipe ||
          button.dataset.adapt ||
          button.dataset.recipeId ||
          state.currentRecipeId;

        if (!recipeId) {
          const card =
            button.closest(
              "[data-recipe-id]"
            );

          if (card) {
            recipeId =
              card.dataset.recipeId;
          }
        }

        if (recipeId) {
          openAdaptRecipeDialog(
            recipeId
          );
        }
      },
      true
    );


    /* Escape */

    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape") {
          return;
        }

        closeRecipeModal();
        closeAddRecipeModal();
        closeAdaptRecipeDialog();
      }
    );
  }


  /* =========================================================
     RECIPES
  ========================================================= */

  function getAllRecipes() {
    const baseRecipes =
      Array.isArray(window.recipes)
        ? window.recipes
        : [];

    return [
      ...baseRecipes,
      ...state.userRecipes
    ];
  }


  function getRecipeById(id) {
    return getAllRecipes().find(
      (recipe) =>
        String(recipe.id) ===
        String(id)
    );
  }


  /* =========================================================
     TEXT NORMALIZATION
  ========================================================= */

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(
        /[^a-zа-я0-9\s-]/gi,
        " "
      )
      .replace(/\s+/g, " ")
      .trim();
  }


  /* =========================================================
     PRODUCT HELPERS
  ========================================================= */

  function getProducts() {
    return window.products || {};
  }


  function getProduct(productId) {
    const products =
      getProducts();

    return products[productId] || null;
  }


  function getProductName(productId) {
    const product =
      getProduct(productId);

    if (
      product &&
      product.name
    ) {
      return product.name;
    }

    return String(
      productId || ""
    );
  }


  function getProductAliases(productId) {
    const product =
      getProduct(productId);

    if (!product) {
      return [
        normalizeText(productId)
      ];
    }

    const aliases =
      Array.isArray(product.aliases)
        ? product.aliases
        : [];

    return [
      normalizeText(productId),
      normalizeText(product.name),
      ...aliases.map(normalizeText)
    ].filter(Boolean);
  }


  /* =========================================================
     SMART PRODUCT ALIASES
  ========================================================= */

  const smartProductAliases = {
    курица: [
      "курица",
      "курицу",
      "курицей",
      "куриной",
      "куриное",
      "куриным",
      "куриный",
      "куриного",
      "куриная",
      "куриной грудки",
      "куриная грудка",
      "грудка",
      "грудку",
      "грудкой"
    ],

    "куриное-бедро": [
      "бедро",
      "бедрышко",
      "бедрышки",
      "бедра",
      "бедрами",
      "куриное бедро",
      "куриные бедра"
    ],

    индейка: [
      "индейка",
      "индейку",
      "индейкой",
      "индейки",
      "филе индейки"
    ],

    говядина: [
      "говядина",
      "говядину",
      "говядиной",
      "говядины",
      "говяжье",
      "говяжий"
    ],

    свинина: [
      "свинина",
      "свинину",
      "свининой",
      "свинины",
      "свиное",
      "свиной"
    ],

    лосось: [
      "лосось",
      "лосося",
      "лососем",
      "семга",
      "семгу",
      "семгой",
      "семги"
    ],

    тунец: [
      "тунец",
      "тунца",
      "тунцом"
    ],

    креветки: [
      "креветки",
      "креветок",
      "креветками",
      "креветку",
      "креветкой"
    ],

    картофель: [
      "картофель",
      "картошку",
      "картошка",
      "картошкой",
      "картофелем",
      "картофеля"
    ],

    лук: [
      "лук",
      "лука",
      "луком",
      "луковица",
      "луковицу",
      "луковицей"
    ],

    морковь: [
      "морковь",
      "морковку",
      "морковью",
      "моркови",
      "морковкой"
    ],

    помидоры: [
      "помидор",
      "помидоры",
      "помидора",
      "помидорами",
      "помидором",
      "томат",
      "томаты",
      "томата",
      "томатами"
    ],

    огурец: [
      "огурец",
      "огурцы",
      "огурца",
      "огурцом",
      "огурцами"
    ],

    перец: [
      "перец",
      "перца",
      "перцем",
      "перчик",
      "перчики"
    ],

    брокколи: [
      "брокколи",
      "броколли"
    ],

    капуста: [
      "капуста",
      "капусту",
      "капустой",
      "капусты"
    ],

    кабачок: [
      "кабачок",
      "кабачки",
      "кабачка",
      "кабачком",
      "кабачками"
    ],

    чеснок: [
      "чеснок",
      "чеснока",
      "чесноком",
      "чесночный"
    ],

    яйца: [
      "яйцо",
      "яйца",
      "яиц",
      "яйцами",
      "яйцом"
    ],

    сыр: [
      "сыр",
      "сыра",
      "сыром"
    ],

    моцарелла: [
      "моцарелла",
      "моцареллы",
      "моцареллой"
    ],

    молоко: [
      "молоко",
      "молока",
      "молоком"
    ],

    творог: [
      "творог",
      "творога",
      "творогом",
      "творожок",
      "творожный"
    ],

    йогурт: [
      "йогурт",
      "йогурта",
      "йогуртом",
      "йогурты"
    ],

    сметана: [
      "сметана",
      "сметану",
      "сметаной",
      "сметаны"
    ],

    рис: [
      "рис",
      "риса",
      "рисом",
      "рисовый"
    ],

    гречка: [
      "гречка",
      "гречку",
      "гречкой",
      "гречневая",
      "гречневую"
    ],

    овсянка: [
      "овсянка",
      "овсянку",
      "овсянкой",
      "овсяные хлопья",
      "хлопья"
    ],

    паста: [
      "паста",
      "пасту",
      "пастой",
      "макароны",
      "макарон",
      "макаронами"
    ],

    хлеб: [
      "хлеб",
      "хлеба",
      "хлебом",
      "хлебный"
    ],

    чечевица: [
      "чечевица",
      "чечевицу",
      "чечевицей",
      "чечевицы"
    ],

    фасоль: [
      "фасоль",
      "фасоли",
      "фасолью"
    ],

    банан: [
      "банан",
      "бананы",
      "банана",
      "бананом"
    ],

    яблоко: [
      "яблоко",
      "яблоки",
      "яблока",
      "яблоком"
    ],

    апельсин: [
      "апельсин",
      "апельсины",
      "апельсина",
      "апельсином"
    ],

    масло: [
      "масло",
      "масла",
      "маслом",
      "растительное масло"
    ],

    "сливочное-масло": [
      "сливочное масло",
      "сливочным маслом",
      "сливочное",
      "сливочного"
    ],

    мед: [
      "мед",
      "меда",
      "медом",
      "мёд"
    ],

    сахар: [
      "сахар",
      "сахара",
      "сахаром"
    ]
  };


  function productMatchesText(
    productId,
    text
  ) {
    const normalized =
      normalizeText(text);

    const aliases = [
      ...getProductAliases(
        productId
      ),
      ...(
        smartProductAliases[
          productId
        ] || []
      ).map(normalizeText)
    ]
      .filter(Boolean)
      .sort(
        (a, b) =>
          b.length - a.length
      );

    return aliases.some(
      (alias) => {
        return normalized.includes(
          alias
        );
      }
    );
  }


  function detectProducts(text) {
    const products =
      getProducts();

    const detected = [];

    Object.keys(products).forEach(
      (productId) => {
        if (
          productMatchesText(
            productId,
            text
          )
        ) {
          detected.push(
            productId
          );
        }
      }
    );

    return detected;
  }


  /* =========================================================
     RECIPE PRODUCT MATCHING
  ========================================================= */

  function recipeContainsProduct(
    recipe,
    productId
  ) {
    if (
      !recipe ||
      !Array.isArray(
        recipe.ingredients
      )
    ) {
      return false;
    }

    return recipe.ingredients.some(
      (ingredient) => {
        return (
          normalizeText(
            ingredient.product
          ) ===
          normalizeText(
            productId
          )
        );
      }
    );
  }


  /* =========================================================
     NUTRITION
  ========================================================= */

  function getIngredientStateLabel(state) {
    if (state === "boiled") {
      return "варёное";
    }

    if (state === "fried") {
      return "жареное";
    }

    return "сырое";
  }


  function getIngredientNutrition(
    ingredient
  ) {
    const result = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0
    };

    const product =
      getProduct(
        ingredient?.product
      );

    if (
      !product ||
      !product.raw
    ) {
      return result;
    }

    let amount =
      Number(
        ingredient.amount
      ) || 0;

    if (
      ingredient.unit === "шт" &&
      product.pieceWeight
    ) {
      amount *= Number(
        product.pieceWeight
      );
    }

    const state =
      ingredient.state ||
      "raw";

    let rawEquivalent =
      amount;

    const ratio =
      Number(
        product.cookedWeightRatio
      );

    if (
      state !== "raw" &&
      Number.isFinite(ratio) &&
      ratio > 0
    ) {
      rawEquivalent =
        amount / ratio;
    }

    const multiplier =
      rawEquivalent / 100;

    result.calories +=
      Number(
        product.raw.kcal || 0
      ) * multiplier;

    result.protein +=
      Number(
        product.raw.protein || 0
      ) * multiplier;

    result.fat +=
      Number(
        product.raw.fat || 0
      ) * multiplier;

    result.carbs +=
      Number(
        product.raw.carbs || 0
      ) * multiplier;

    if (state === "fried") {
      const oilPer100 =
        Math.max(
          0,
          Number(
            ingredient.oilPer100 || 0
          )
        );

      const oilAmount =
        amount *
        oilPer100 /
        100;

      result.calories +=
        oilAmount * 8.99;

      result.fat +=
        oilAmount * 0.999;
    }

    return result;
  }


  function calculateRecipeNutrition(
    recipe
  ) {
    const result = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0
    };

    if (
      !recipe ||
      !Array.isArray(
        recipe.ingredients
      )
    ) {
      return result;
    }

    recipe.ingredients.forEach(
      (ingredient) => {
        const nutrition =
          getIngredientNutrition(
            ingredient
          );

        result.calories +=
          nutrition.calories;

        result.protein +=
          nutrition.protein;

        result.fat +=
          nutrition.fat;

        result.carbs +=
          nutrition.carbs;
      }
    );

    const servings =
      Math.max(
        1,
        Number(
          recipe.servings
        ) || 1
      );

    return {
      calories:
        Math.round(
          result.calories /
          servings
        ),

      protein:
        Math.round(
          result.protein /
          servings
        ),

      fat:
        Math.round(
          result.fat /
          servings
        ),

      carbs:
        Math.round(
          result.carbs /
          servings
        )
    };
  }

  /* =========================================================
     SMART QUERY PARSER
  ========================================================= */

  function parseSmartQuery(
    query
  ) {
    const text =
      normalizeText(query);

    const parsed = {
      original: query,

      ingredients: [],

      maxCalories: null,
      minCalories: null,

      maxProtein: null,
      minProtein: null,

      maxTime: null,
      minTime: null,

      protein: false,
      vegetarian: false,
      keto: false,
      quick: false,

      recognized: false
    };


    parsed.ingredients =
      detectProducts(text);

    if (
      parsed.ingredients.length
    ) {
      parsed.recognized = true;
    }


    let match =
      text.match(
        /(?:до|меньше|максимум|макс|не более|не больше)\s*(\d+)\s*(?:ккал|калорий|калории|кал)?/
      );

    if (match) {
      parsed.maxCalories =
        Number(match[1]);

      parsed.recognized = true;
    }


    match =
      text.match(
        /(?:от|минимум|не менее|не меньше)\s*(\d+)\s*(?:ккал|калорий|калории|кал)?/
      );

    if (match) {
      parsed.minCalories =
        Number(match[1]);

      parsed.recognized = true;
    }


    match =
      text.match(
        /(?:минимум|от|не менее|не меньше)\s*(\d+)\s*(?:г|гр|грамм)?\s*(?:белка|протеина)/
      );

    if (match) {
      parsed.minProtein =
        Number(match[1]);

      parsed.recognized = true;
    }


    match =
      text.match(
        /(?:до|максимум|макс|меньше|не более|не больше)\s*(\d+)\s*(?:г|гр|грамм)?\s*(?:белка|протеина)/
      );

    if (match) {
      parsed.maxProtein =
        Number(match[1]);

      parsed.recognized = true;
    }


    match =
      text.match(
        /(?:до|меньше|максимум|макс|не более|не больше)\s*(\d+)\s*(?:мин|минут|минуты|минуту|минуте)/
      );

    if (match) {
      parsed.maxTime =
        Number(match[1]);

      parsed.recognized = true;
    }


    match =
      text.match(
        /(?:от|минимум|не менее|не меньше)\s*(\d+)\s*(?:мин|минут|минуты|минуту|минуте)/
      );

    if (match) {
      parsed.minTime =
        Number(match[1]);

      parsed.recognized = true;
    }


    if (
      /белков\w*/.test(text) ||
      /протеин\w*/.test(text) ||
      text.includes("много белка") ||
      text.includes("высокое содержание белка") ||
      text.includes("богат белком") ||
      text.includes("богатое белком")
    ) {
      parsed.protein = true;
      parsed.recognized = true;
    }


    if (
      text.includes("вегетариан") ||
      text.includes("без мяса") ||
      text.includes("постное")
    ) {
      parsed.vegetarian = true;
      parsed.recognized = true;
    }


    if (
      text.includes("кето") ||
      text.includes("кетоген")
    ) {
      parsed.keto = true;
      parsed.recognized = true;
    }


    if (
      /\bбыстр\w*/.test(text) ||
      text.includes("за полчаса") ||
      text.includes("быстро приготовить")
    ) {
      parsed.quick = true;
      parsed.recognized = true;
    }


    return parsed;
  }


  /* =========================================================
     RECIPE INFO
  ========================================================= */

  function getRecipeSearchText(
    recipe
  ) {
    if (!recipe) {
      return "";
    }

    const ingredients =
      Array.isArray(
        recipe.ingredients
      )
        ? recipe.ingredients.map(
            (ingredient) =>
              getProductName(
                ingredient.product
              )
          )
        : [];

    return normalizeText(
      [
        recipe.title,
        recipe.description,
        ...(recipe.tags || []),
        ...ingredients
      ].join(" ")
    );
  }


  function getRecipeDietInfo(
    recipe
  ) {
    if (!recipe) {
      return "";
    }

    return normalizeText(
      [
        ...(recipe.tags || []),
        ...(recipe.filters || [])
      ].join(" ")
    );
  }


  /* =========================================================
     SMART SCORE
  ========================================================= */

  function scoreRecipe(
    recipe,
    parsed
  ) {
    let score = 0;

    const reasons = [];

    const nutrition =
      calculateRecipeNutrition(
        recipe
      );

    const recipeTime =
      Number(
        recipe.time || 0
      );

    const recipeInfo =
      getRecipeDietInfo(
        recipe
      );


    /*
      Ингредиенты — жёсткое условие.

      Если пользователь написал:
      "курица и картошка",
      рецепт обязан содержать оба продукта.

      Остальные параметры ниже являются
      мягкими предпочтениями: рецепт может
      немного выйти за лимит, но всё равно
      останется в выдаче.
    */

    if (
      parsed.ingredients.length > 0
    ) {
      const matchedIngredients =
        parsed.ingredients.filter(
          (productId) =>
            recipeContainsProduct(
              recipe,
              productId
            )
        );

      if (
        matchedIngredients.length !==
        parsed.ingredients.length
      ) {
        return {
          recipe,
          score: -Infinity,
          reasons: []
        };
      }

      score +=
        matchedIngredients.length * 100;

      matchedIngredients.forEach(
        (productId) => {
          reasons.push(
            `✓ ${getProductName(
              productId
            )}`
          );
        }
      );
    }


    /*
      Калории.

      Попадание в лимит получает
      заметный бонус.

      Выход за лимит не исключает
      рецепт — штраф растёт постепенно,
      поэтому близкий вариант остаётся
      выше сильно неподходящего.
    */

    if (
      parsed.maxCalories !== null
    ) {
      const difference =
        nutrition.calories -
        parsed.maxCalories;

      if (difference <= 0) {
        score += 40;

        reasons.push(
          `✓ ${nutrition.calories} ккал`
        );
      } else {
        score -= Math.min(
          45,
          difference / 8
        );

        reasons.push(
          `~ ${nutrition.calories} ккал`
        );
      }
    }


    if (
      parsed.minCalories !== null
    ) {
      const difference =
        parsed.minCalories -
        nutrition.calories;

      if (difference <= 0) {
        score += 25;

        reasons.push(
          `✓ ${nutrition.calories} ккал`
        );
      } else {
        score -= Math.min(
          25,
          difference / 8
        );

        reasons.push(
          `~ ${nutrition.calories} ккал`
        );
      }
    }


    /*
      Белок.

      Для "минимум N г" — чем ближе
      к цели, тем выше результат.

      Для "до N г" — превышение мягко
      понижает позицию.
    */

    if (
      parsed.minProtein !== null
    ) {
      const difference =
        parsed.minProtein -
        nutrition.protein;

      if (difference <= 0) {
        score += 35;

        reasons.push(
          `✓ ${nutrition.protein} г белка`
        );
      } else {
        score -= Math.min(
          35,
          difference
        );

        reasons.push(
          `~ ${nutrition.protein} г белка`
        );
      }
    }


    if (
      parsed.maxProtein !== null
    ) {
      const difference =
        nutrition.protein -
        parsed.maxProtein;

      if (difference <= 0) {
        score += 25;

        reasons.push(
          `✓ ${nutrition.protein} г белка`
        );
      } else {
        score -= Math.min(
          30,
          difference
        );

        reasons.push(
          `~ ${nutrition.protein} г белка`
        );
      }
    }


    if (parsed.protein) {
      const isTaggedProtein =
        recipeInfo.includes(
          "высокобелков"
        ) ||
        recipeInfo.includes(
          "белков"
        ) ||
        recipeInfo.includes(
          "protein"
        );

      if (isTaggedProtein) {
        score += 45;

        reasons.push(
          "✓ высокобелковое"
        );
      } else if (
        nutrition.protein >= 25
      ) {
        score += 25;

        reasons.push(
          "✓ много белка"
        );
      } else if (
        nutrition.protein >= 18
      ) {
        score += 10;

        reasons.push(
          "~ умеренно белковое"
        );
      } else {
        score -= 15;

        reasons.push(
          "~ мало белка"
        );
      }
    }


    /*
      Время — мягкое условие.

      "Максимум 30 минут" не означает,
      что 45-минутный рецепт надо скрыть.
      Он просто должен стоять ниже
      рецепта на 25 минут.
    */

    if (
      parsed.maxTime !== null
    ) {
      const difference =
        recipeTime -
        parsed.maxTime;

      if (difference <= 0) {
        score += 40;

        reasons.push(
          `✓ ${recipeTime} мин`
        );
      } else {
        score -= Math.min(
          40,
          difference * 1.25
        );

        reasons.push(
          `~ ${recipeTime} мин`
        );
      }
    }


    if (
      parsed.minTime !== null
    ) {
      const difference =
        parsed.minTime -
        recipeTime;

      if (difference <= 0) {
        score += 20;

        reasons.push(
          `✓ ${recipeTime} мин`
        );
      } else {
        score -= Math.min(
          20,
          difference
        );

        reasons.push(
          `~ ${recipeTime} мин`
        );
      }
    }


    if (parsed.vegetarian) {
      if (
        recipeInfo.includes(
          "вегетариан"
        ) ||
        recipeInfo.includes(
          "vegetarian"
        )
      ) {
        score += 40;

        reasons.push(
          "✓ вегетарианское"
        );
      } else {
        score -= 40;

        reasons.push(
          "✕ не вегетарианское"
        );
      }
    }


    if (parsed.keto) {
      if (
        recipeInfo.includes("кето") ||
        recipeInfo.includes("keto")
      ) {
        score += 40;

        reasons.push(
          "✓ кето"
        );
      } else {
        score -= 40;

        reasons.push(
          "✕ не кето"
        );
      }
    }


    if (parsed.quick) {
      if (recipeTime <= 30) {
        score += 35;

        reasons.push(
          "✓ быстрое"
        );
      } else {
        const difference =
          recipeTime - 30;

        score -= Math.min(
          35,
          difference * 1.25
        );

        reasons.push(
          `~ ${recipeTime} мин`
        );
      }
    }


    /*
      Если ингредиенты не указаны,
      используем обычный текстовый поиск
      как дополнительный сигнал.
    */

    if (
      parsed.ingredients.length === 0
    ) {
      const searchable =
        getRecipeSearchText(
          recipe
        );

      const words =
        normalizeText(
          parsed.original
        )
          .split(/\s+/)
          .filter(
            (word) =>
              word.length >= 3
          )
          .filter(
            (word) =>
              ![
                "у",
                "меня",
                "есть",
                "хочу",
                "мне",
                "нужен",
                "нужна",
                "нужно",
                "приготовить",
                "приготовь",
                "сделать",
                "сделай",
                "блюдо",
                "что",
                "можно",
                "пожалуйста"
              ].includes(word)
          );

      words.forEach(
        (word) => {
          if (
            searchable.includes(word)
          ) {
            score += 5;
          }
        }
      );
    }


    return {
      recipe,
      score,
      reasons
    };
  }


  /* =========================================================
     SEARCH RECIPES
  ========================================================= */

  function searchRecipes(
    query
  ) {
    const text =
      normalizeText(query);

    const recipes =
      getAllRecipes();


    if (!text) {
      state.smartSearchResults = [];

      return recipes;
    }


    const parsed =
      parseSmartQuery(text);


    if (parsed.recognized) {
      const scored =
        recipes
          .map(
            (recipe) =>
              scoreRecipe(
                recipe,
                parsed
              )
          )
          .filter(
            (item) =>
              item.score !== -Infinity
          );


      scored.sort(
        (a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }

          return (
            Number(a.recipe.time || 0) -
            Number(b.recipe.time || 0)
          );
        }
      );


      state.smartSearchResults =
        scored;


      return scored.map(
        (item) =>
          item.recipe
      );
    }


    const ignoredWords = [
      "у",
      "меня",
      "есть",
      "хочу",
      "мне",
      "нужен",
      "нужна",
      "нужно",
      "приготовить",
      "приготовь",
      "сделать",
      "сделай",
      "блюдо",
      "что",
      "можно",
      "пожалуйста"
    ];


    const words =
      text
        .split(/\s+/)
        .filter(
          (word) =>
            word.length >= 3
        )
        .filter(
          (word) =>
            !ignoredWords.includes(
              word
            )
        );


    if (!words.length) {
      state.smartSearchResults = [];

      return recipes;
    }


    const results =
      recipes.filter(
        (recipe) => {
          const searchable =
            getRecipeSearchText(
              recipe
            );

          return words.some(
            (word) =>
              searchable.includes(word)
          );
        }
      );


    state.smartSearchResults =
      results.map(
        (recipe) => ({
          recipe,
          score: 1,
          reasons: []
        })
      );


    return results;
  }


  /* =========================================================
     SEARCH + RENDER
  ========================================================= */

  function searchAndRender() {
    const input =
      $("#ingredientInput");

    if (!input) {
      return;
    }

    const query =
      input.value.trim();

    state.currentSearch =
      query;

    state.activeFilter =
      "all";


    $$(".filter-button")
      .forEach(
        (button) => {
          button.classList.remove(
            "active"
          );

          if (
            button.dataset.filter ===
            "all"
          ) {
            button.classList.add(
              "active"
            );
          }
        }
      );


    renderRecipes();
    renderHero();


    const recipesSection =
      $("#recipes");

    if (recipesSection) {
      setTimeout(
        () => {
          recipesSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        },
        50
      );
    }
  }


  /* =========================================================
     ACTIVE FILTER
  ========================================================= */

  function applyActiveFilter(
    recipes
  ) {
    if (
      state.activeFilter ===
      "all"
    ) {
      return recipes;
    }

    return recipes.filter(
      (recipe) => {
        const filters =
          Array.isArray(
            recipe.filters
          )
            ? recipe.filters
            : [];

        return filters.includes(
          state.activeFilter
        );
      }
    );
  }


  /* =========================================================
     SMART SEARCH SUMMARY
  ========================================================= */

  function getSmartSearchSummary() {
    if (
      !state.currentSearch.trim()
    ) {
      return null;
    }

    const parsed =
      parseSmartQuery(
        state.currentSearch
      );

    if (!parsed.recognized) {
      return null;
    }

    return parsed;
  }


  function getSmartResultForRecipe(
    recipe
  ) {
    return (
      state.smartSearchResults.find(
        (item) =>
          String(
            item.recipe.id
          ) ===
          String(recipe.id)
      ) || null
    );
  }


  /* =========================================================
     RENDER RECIPES
  ========================================================= */

  function renderRecipes() {
    const grid =
      $("#recipesGrid");

    const title =
      $("#recipesTitle");

    const count =
      $("#recipesCount");

    if (!grid) {
      return;
    }


    let recipes;


    if (
      state.currentSearch.trim()
    ) {
      recipes =
        searchRecipes(
          state.currentSearch
        );
    } else {
      recipes =
        getAllRecipes();

      state.smartSearchResults = [];
    }


    recipes =
      applyActiveFilter(
        recipes
      );


    if (title) {
      title.textContent =
        state.currentSearch.trim()
          ? "Результаты поиска"
          : "Рецепты";
    }


    if (count) {
      count.textContent =
        `${recipes.length} ${
          getRecipeWord(
            recipes.length
          )
        }`;
    }


    if (!recipes.length) {
      grid.innerHTML = `
        <div class="empty-state">

          <div class="empty-state-icon">
            🍽️
          </div>

          <h3>
            Ничего не нашли
          </h3>

          <p>
            Попробуйте изменить ингредиенты
            или условия поиска.
          </p>

          <button
            class="primary-button"
            type="button"
            data-reset-search
          >
            Показать все рецепты
          </button>

        </div>
      `;


      const resetButton =
        grid.querySelector(
          "[data-reset-search]"
        );

      if (resetButton) {
        resetButton.addEventListener(
          "click",
          resetSearch
        );
      }

      return;
    }


    grid.innerHTML =
      recipes
        .map(
          renderRecipeCard
        )
        .join("");

    bindRecipeCards(grid);
  }


  function getRecipeWord(
    number
  ) {
    const mod10 =
      number % 10;

    const mod100 =
      number % 100;


    if (
      mod10 === 1 &&
      mod100 !== 11
    ) {
      return "рецепт";
    }


    if (
      [2, 3, 4].includes(
        mod10
      ) &&
      ![
        12,
        13,
        14
      ].includes(mod100)
    ) {
      return "рецепта";
    }


    return "рецептов";
  }


  /* =========================================================
     RECIPE CARD
  ========================================================= */

  function renderRecipeCard(
    recipe
  ) {
    const nutrition =
      calculateRecipeNutrition(
        recipe
      );

    const favorite =
      state.favorites.includes(
        recipe.id
      );

    const tags =
      Array.isArray(recipe.tags)
        ? recipe.tags
        : [];


    const smartResult =
      getSmartResultForRecipe(
        recipe
      );


    let smartReasonHtml =
      "";


    if (
      state.currentSearch.trim() &&
      smartResult &&
      smartResult.reasons.length
    ) {
      const reasons =
        smartResult.reasons
          .slice(0, 4);


      smartReasonHtml = `
        <div
          style="
            margin-top: 14px;
            padding: 10px 12px;
            border-radius: 12px;
            background: #f0f6f2;
            color: #326553;
            font-size: 13px;
            line-height: 1.5;
          "
        >

          <strong
            style="
              display: block;
              margin-bottom: 5px;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: .04em;
            "
          >
            Почему подходит
          </strong>

          ${reasons
            .map(
              (reason) =>
                `<div>${escapeHtml(
                  reason
                )}</div>`
            )
            .join("")}

        </div>
      `;
    }


    return `
      <article
        class="recipe-card"
        data-recipe-id="${escapeHtml(
          recipe.id
        )}"
      >

        <div class="recipe-card-top">

          <div class="recipe-card-emoji">
            ${escapeHtml(
              recipe.emoji ||
              "🍽️"
            )}
          </div>

          <button
            class="favorite-button ${
              favorite
                ? "active"
                : ""
            }"
            type="button"
            data-favorite-id="${escapeHtml(
              recipe.id
            )}"
            aria-label="Добавить в избранное"
          >
            ${
              favorite
                ? "♥"
                : "♡"
            }
          </button>

        </div>


        <div class="recipe-card-content">

          <div class="recipe-tags">

            ${tags
              .slice(0, 3)
              .map(
                (tag) => `
                  <span class="recipe-tag">
                    ${escapeHtml(
                      tag
                    )}
                  </span>
                `
              )
              .join("")}

          </div>


          <h3 class="recipe-card-title">
            ${escapeHtml(
              recipe.title
            )}
          </h3>


          <p class="recipe-card-description">
            ${escapeHtml(
              recipe.description ||
              ""
            )}
          </p>


          <div class="recipe-card-meta">

            <span>
              ⏱ ${escapeHtml(
                recipe.time
              )} мин
            </span>

            <span>
              🔥 ${
                nutrition.calories
              } ккал
            </span>

          </div>


          <div class="recipe-card-bottom">

            <span>
              ${
                nutrition.protein
              } г белка
            </span>

            <button
              class="recipe-open-button"
              type="button"
              data-open-recipe="${escapeHtml(
                recipe.id
              )}"
            >
              Смотреть рецепт →
            </button>

          </div>


          ${smartReasonHtml}

        </div>

      </article>
    `;
  }


  function bindRecipeCards(
    container
  ) {
    container
      .querySelectorAll(
        "[data-open-recipe]"
      )
      .forEach(
        (button) => {
          button.addEventListener(
            "click",
            () => {
              openRecipeModal(
                button.dataset
                  .openRecipe
              );
            }
          );
        }
      );


    container
      .querySelectorAll(
        "[data-favorite-id]"
      )
      .forEach(
        (button) => {
          button.addEventListener(
            "click",
            (event) => {
              event.stopPropagation();

              toggleFavorite(
                button.dataset
                  .favoriteId
              );
            }
          );
        }
      );
  }


  /* =========================================================
     RESET SEARCH
  ========================================================= */

  function resetSearch() {
    const input =
      $("#ingredientInput");

    if (input) {
      input.value = "";
    }

    state.currentSearch = "";
    state.activeFilter = "all";
    state.smartSearchResults = [];


    $$(".filter-button")
      .forEach(
        (button) => {
          button.classList.remove(
            "active"
          );

          if (
            button.dataset.filter ===
            "all"
          ) {
            button.classList.add(
              "active"
            );
          }
        }
      );


    renderRecipes();
    renderHero();
  }


  /* =========================================================
     HERO
  ========================================================= */

  function renderHero() {
    const heroCard =
      $("#heroCard");

    if (!heroCard) {
      return;
    }


    let recipes;


    if (
      state.currentSearch.trim()
    ) {
      recipes =
        searchRecipes(
          state.currentSearch
        );
    } else {
      recipes =
        getAllRecipes();

      const randomRecipe =
        recipes.find(
          (recipe) =>
            String(recipe.id) ===
            String(state.heroRecipeId)
        );

      if (randomRecipe) {
        recipes = [randomRecipe];
      }
    }


    if (!recipes.length) {
      return;
    }


    const recipe =
      recipes[0];

    const nutrition =
      calculateRecipeNutrition(
        recipe
      );


    const title =
      $("#heroRecipeTitle");

    const time =
      $("#heroRecipeTime");

    const calories =
      $("#heroRecipeCalories");

    const emoji =
      $("#heroRecipeEmoji");

    const open =
      $("#heroRecipeOpen");

    const match =
      $("#heroMatch");


    if (title) {
      title.textContent =
        recipe.title;
    }


    if (time) {
      time.textContent =
        recipe.time + " мин";
    }


    if (calories) {
      calories.textContent =
        nutrition.calories + " ккал";
    }


    if (emoji) {
      emoji.textContent =
        recipe.emoji ||
        "🍽️";
    }


    if (open) {
      open.onclick = () => {
        openRecipeModal(
          recipe.id
        );
      };
    }


    if (match) {
      if (
        state.currentSearch.trim()
      ) {
        const smart =
          getSmartResultForRecipe(
            recipe
          );

        if (
          smart &&
          smart.score >= 250
        ) {
          match.textContent =
            "Отличное совпадение";
        } else if (
          smart &&
          smart.score >= 180
        ) {
          match.textContent =
            "Хорошее совпадение";
        } else {
          match.textContent =
            "Ближайшее совпадение";
        }
      } else {
        match.textContent =
          "Случайный рецепт";
      }
    }
  }


  /* =========================================================
     RECIPE MODAL
  ========================================================= */

  function openRecipeModal(
    recipeId
  ) {
    const recipe =
      getRecipeById(
        recipeId
      );

    if (!recipe) {
      return;
    }


    state.currentRecipeId =
      recipe.id;


    const nutrition =
      calculateRecipeNutrition(
        recipe
      );


    const modal =
      $("#recipeModal");

    if (!modal) {
      return;
    }


    const emoji =
      $("#modalEmoji");

    const title =
      $("#modalTitle");

    const description =
      $("#modalDescription");

    const time =
      $("#modalTime");

    const calories =
      $("#modalCalories");

    const servings =
      $("#modalServings");

    const protein =
      $("#modalProtein");

    const fat =
      $("#modalFat");

    const carbs =
      $("#modalCarbs");

    const ingredients =
      $("#modalIngredients");

    const steps =
      $("#recipeSteps");


    if (emoji) {
      emoji.textContent =
        recipe.emoji ||
        "🍽️";
    }


    if (title) {
      title.textContent =
        recipe.title;
    }


    if (description) {
      description.textContent =
        recipe.description ||
        "";
    }


    if (time) {
      time.textContent =
        `${recipe.time} мин`;
    }


    if (calories) {
      calories.textContent =
        `${nutrition.calories} ккал`;
    }


    if (servings) {
      servings.textContent =
        `${recipe.servings} ${
          recipe.servings === 1
            ? "порция"
            : "порции"
        }`;
    }


    if (protein) {
      protein.textContent =
        `${nutrition.protein} г`;
    }


    if (fat) {
      fat.textContent =
        `${nutrition.fat} г`;
    }


    if (carbs) {
      carbs.textContent =
        `${nutrition.carbs} г`;
    }


    if (ingredients) {
      ingredients.innerHTML =
        (
          recipe.ingredients ||
          []
        )
          .map(
            (ingredient) => {
              const productName =
                getProductName(
                  ingredient.product
                );

              const amount =
                ingredient.amount;

              const unit =
                ingredient.unit ||
                "г";

              const state =
                ingredient.state ||
                "raw";

              const stateLabel =
                getIngredientStateLabel(
                  state
                );

              return `
                <li>

                  <span>
                    ${escapeHtml(
                      productName
                    )}

                    <small class="recipe-ingredient-state">
                      ${escapeHtml(
                        stateLabel
                      )}
                    </small>
                  </span>

                  <strong>
                    ${escapeHtml(
                      amount
                    )}
                    ${escapeHtml(
                      unit
                    )}
                  </strong>

                </li>
              `;
            }
          )
          .join("");
    }

    if (steps) {
      steps.innerHTML =
        (
          recipe.steps ||
          []
        )
          .map(
            (step, index) => `
              <div class="step-item">

                <div class="step-number">
                  ${index + 1}
                </div>

                <div class="step-content">
                  ${escapeHtml(
                    step
                  )}
                </div>

              </div>
            `
          )
          .join("");
    }


    modal.classList.add(
      "active"
    );

    document.body.classList.add(
      "modal-open"
    );
  }


  function closeRecipeModal() {
    const modal =
      $("#recipeModal");

    if (!modal) {
      return;
    }

    modal.classList.remove(
      "active"
    );

    document.body.classList.remove(
      "modal-open"
    );

    state.currentRecipeId =
      null;
  }


  /* =========================================================
     MULTI-CONDITION AI ADAPTATION
  ========================================================= */

  let adaptationDraft = null;

  function getNutritionSnapshot(recipe) {
    const nutrition = calculateRecipeNutrition(recipe);

    return {
      calories: Math.round(Number(nutrition.calories) || 0),
      protein: Math.round((Number(nutrition.protein) || 0) * 10) / 10,
      fat: Math.round((Number(nutrition.fat) || 0) * 10) / 10,
      carbs: Math.round((Number(nutrition.carbs) || 0) * 10) / 10,
      time: Math.max(0, Number(recipe.time) || 0),
      servings: Math.max(1, Number(recipe.servings) || 1)
    };
  }


  function ensureAdaptationModal() {
    let modal = $("#adaptationModal");

    if (modal) {
      return modal;
    }

    modal = document.createElement("div");
    modal.id = "adaptationModal";
    modal.className = "modal-overlay adaptation-modal-overlay";

    modal.innerHTML = `
      <div class="adaptation-modal" role="dialog" aria-modal="true" aria-labelledby="adaptationModalTitle">
        <div class="adaptation-modal-header">
          <div>
            <span class="adaptation-modal-eyebrow">RecipePro AI</span>
            <h2 id="adaptationModalTitle">Адаптировать рецепт</h2>
            <p id="adaptationModalRecipeName"></p>
          </div>

          <button class="adaptation-modal-close" id="adaptationModalClose" type="button" aria-label="Закрыть">×</button>
        </div>

        <div class="adaptation-modal-body">
          <div class="adaptation-original">
            <div class="adaptation-original-emoji" id="adaptationOriginalEmoji">🍽️</div>
            <div>
              <span>Исходный рецепт</span>
              <strong id="adaptationOriginalTitle">Рецепт</strong>
            </div>
          </div>

          <div class="adaptation-section">
            <div class="adaptation-section-label">Быстрые изменения</div>

            <div class="adaptation-chips">
              <button type="button" class="adaptation-chip" data-adaptation-preset="lessCalories">🔥 Менее калорийный</button>
              <button type="button" class="adaptation-chip" data-adaptation-preset="moreProtein">💪 Больше белка</button>
              <button type="button" class="adaptation-chip" data-adaptation-preset="faster">⏱️ Сделать быстрее</button>
              <button type="button" class="adaptation-chip" data-adaptation-preset="servings">👥 На 4 порции</button>
              <button type="button" class="adaptation-chip" data-adaptation-preset="noPotato">🥔 Убрать картофель</button>
              <button type="button" class="adaptation-chip" data-adaptation-preset="turkey">🦃 Курица → индейка</button>
            </div>
          </div>

          <div class="adaptation-section">
            <div class="adaptation-section-label">Или опишите своими словами</div>

            <textarea
              id="adaptationRequest"
              class="adaptation-request"
              rows="4"
              placeholder="Например: сделай на 2 порции, до 500 ккал, минимум 40 г белка и максимум 30 минут"
            ></textarea>

            <div class="adaptation-hint">
              Можно объединять несколько условий в одном запросе.
            </div>
          </div>

          <div class="adaptation-result" id="adaptationResult" hidden>
            <div class="adaptation-result-head">
              <div>
                <span class="adaptation-modal-eyebrow">Результат</span>
                <h3>Было → Стало</h3>
              </div>
              <span class="adaptation-result-status" id="adaptationResultStatus">Готово</span>
            </div>

            <div class="adaptation-metrics" id="adaptationMetrics"></div>

            <div id="adaptationGoals"></div>

            <div class="adaptation-changes" id="adaptationChanges"></div>

            <div class="adaptation-warnings" id="adaptationWarnings"></div>
          </div>
        </div>

        <div class="adaptation-modal-footer">
          <button class="adaptation-secondary-button" id="adaptationCancel" type="button">Вернуться к рецепту</button>
          <button class="adaptation-primary-button" id="adaptationGenerate" type="button">Создать адаптацию <span>→</span></button>
          <button class="adaptation-primary-button adaptation-save-button" id="adaptationSave" type="button" hidden>Сохранить как мой рецепт <span>→</span></button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    $("#adaptationModalClose").addEventListener("click", closeAdaptRecipeDialog);
    $("#adaptationCancel").addEventListener("click", closeAdaptRecipeDialog);
    $("#adaptationGenerate").addEventListener("click", generateAdaptation);
    $("#adaptationSave").addEventListener("click", saveAdaptationDraft);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeAdaptRecipeDialog();
      }
    });

    $$(".adaptation-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const input = $("#adaptationRequest");
        if (!input) return;

        const presets = {
          lessCalories: "Сделай менее калорийным",
          moreProtein: "Сделай более белковым",
          faster: "Сделай быстрее",
          servings: "Сделай на 4 порции",
          noPotato: "Убери картофель",
          turkey: "Замени курицу на индейку"
        };

        input.value = presets[chip.dataset.adaptationPreset] || "";
        input.focus();

        $$(".adaptation-chip").forEach((item) => item.classList.remove("active"));
        chip.classList.add("active");
      });
    });

    return modal;
  }


  function openAdaptRecipeDialog(recipeId) {
    const recipe = getRecipeById(recipeId);

    if (!recipe) {
      alert("Не удалось найти рецепт для адаптации.");
      return;
    }

    const modal = ensureAdaptationModal();
    const requestInput = $("#adaptationRequest");
    const result = $("#adaptationResult");
    const generateButton = $("#adaptationGenerate");
    const saveButton = $("#adaptationSave");

    adaptationDraft = {
      recipe,
      adapted: null,
      originalNutrition: getNutritionSnapshot(recipe)
    };

    $("#adaptationModalRecipeName").textContent = recipe.title;
    $("#adaptationOriginalTitle").textContent = recipe.title;
    $("#adaptationOriginalEmoji").textContent = recipe.emoji || "🍽️";

    requestInput.value = "";
    result.hidden = true;
    generateButton.hidden = false;
    saveButton.hidden = true;
    $$(".adaptation-chip").forEach((item) => item.classList.remove("active"));

    modal.classList.add("active");
    document.body.classList.add("modal-open");

    setTimeout(() => requestInput.focus(), 50);
  }


  function closeAdaptRecipeDialog() {
    const modal = $("#adaptationModal");

    if (!modal) {
      return;
    }

    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    adaptationDraft = null;
  }


  function formatAdaptationMetric(value, unit) {
    const number = Number(value) || 0;
    const formatted = Number.isInteger(number)
      ? String(number)
      : number.toFixed(1).replace(/\\.0$/, "");

    return `
      <div class="adaptation-metric">
        <span class="adaptation-metric-label">${unit}</span>
        <div class="adaptation-metric-values">
          <span>${formatted}</span>
        </div>
      </div>
    `;
  }


  function renderAdaptationMetrics(original, adapted) {
    const metrics = [
      ["Калории", original.calories, adapted.calories, "ккал"],
      ["Белки", original.protein, adapted.protein, "г"],
      ["Жиры", original.fat, adapted.fat, "г"],
      ["Углеводы", original.carbs, adapted.carbs, "г"],
      ["Время", original.time, adapted.time, "мин"]
    ];

    return metrics.map(([label, before, after, unit]) => {
      const beforeNumber = Number(before) || 0;
      const afterNumber = Number(after) || 0;
      const difference = afterNumber - beforeNumber;
      const direction = difference > 0 ? "up" : difference < 0 ? "down" : "same";
      const afterFormatted = Number.isInteger(afterNumber)
        ? String(afterNumber)
        : afterNumber.toFixed(1).replace(/\\.0$/, "");

      return `
        <div class="adaptation-metric">
          <span class="adaptation-metric-label">${label}</span>
          <div class="adaptation-metric-main">
            <span class="adaptation-metric-before">${beforeNumber}${unit}</span>
            <span class="adaptation-metric-arrow">→</span>
            <strong class="adaptation-metric-after ${direction}">${afterFormatted}${unit}</strong>
          </div>
        </div>
      `;
    }).join("");
  }


  function renderAdaptationGoals(parsed, nutrition, time) {
    if (!parsed) {
      return "";
    }

    const goals = [];

    if (parsed.maxCalories !== null) {
      const actual = Number(nutrition.calories) || 0;
      const target = Number(parsed.maxCalories);
      goals.push({
        label: "Калории",
        target: `до ${target} ккал`,
        actual: `${actual} ккал`,
        success: actual <= target
      });
    }

    if (parsed.minCalories !== null) {
      const actual = Number(nutrition.calories) || 0;
      const target = Number(parsed.minCalories);
      goals.push({
        label: "Калории",
        target: `от ${target} ккал`,
        actual: `${actual} ккал`,
        success: actual >= target
      });
    }

    if (parsed.minProtein !== null) {
      const actual = Number(nutrition.protein) || 0;
      const target = Number(parsed.minProtein);
      goals.push({
        label: "Белок",
        target: `от ${target} г`,
        actual: `${actual} г`,
        success: actual >= target
      });
    }

    if (parsed.maxProtein !== null) {
      const actual = Number(nutrition.protein) || 0;
      const target = Number(parsed.maxProtein);
      goals.push({
        label: "Белок",
        target: `до ${target} г`,
        actual: `${actual} г`,
        success: actual <= target
      });
    }

    if (parsed.maxTime !== null) {
      const actual = Number(time) || 0;
      const target = Number(parsed.maxTime);
      goals.push({
        label: "Время",
        target: `до ${target} мин`,
        actual: `${actual} мин`,
        success: actual <= target
      });
    }

    if (!goals.length) {
      return "";
    }

    return `
      <div class="adaptation-goals">
        <div class="adaptation-subheading">Цели запроса</div>
        <div class="adaptation-goals-list">
          ${goals.map((goal) => `
            <div class="adaptation-goal ${goal.success ? "is-success" : "is-failed"}">
              <div class="adaptation-goal-icon">${goal.success ? "✓" : "!"}</div>
              <div class="adaptation-goal-content">
                <strong>${goal.label}</strong>
                <span>Цель: ${goal.target}</span>
              </div>
              <div class="adaptation-goal-value">
                <small>получилось</small>
                <strong>${goal.actual}</strong>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }


  function generateAdaptation() {
    if (!adaptationDraft) {
      return;
    }

    const input = $("#adaptationRequest");
    const request = input ? input.value.trim() : "";

    if (!request) {
      input.classList.add("adaptation-input-error");
      input.focus();
      return;
    }

    input.classList.remove("adaptation-input-error");

    const adapted = adaptRecipe(
      adaptationDraft.recipe,
      request
    );

    if (!adapted) {
      alert("Не удалось создать адаптированную версию рецепта.");
      return;
    }

    adaptationDraft.adapted = adapted;

    const original = adaptationDraft.originalNutrition;
    const next = getNutritionSnapshot(adapted);

    $("#adaptationMetrics").innerHTML =
      renderAdaptationMetrics(original, next);

    const goalsContainer = $("#adaptationGoals");
    if (goalsContainer) {
      goalsContainer.innerHTML =
        renderAdaptationGoals(
          adapted.adaptationConstraints,
          next,
          adapted.time
        );
    }

    const changes = Array.isArray(adapted.adaptationChanges)
      ? adapted.adaptationChanges
      : [];

    const warnings = Array.isArray(adapted.adaptationWarnings)
      ? adapted.adaptationWarnings
      : [];

    $("#adaptationChanges").innerHTML = changes.length
      ? `
          <div class="adaptation-subheading">Что изменилось</div>
          <ul>${changes.map((change) => `<li><span>✓</span>${change}</li>`).join("")}</ul>
        `
      : `
          <div class="adaptation-subheading">Что изменилось</div>
          <p>Количество ингредиентов и основные параметры рецепта не потребовали изменений.</p>
        `;

    $("#adaptationWarnings").innerHTML = warnings.length
      ? `
          <div class="adaptation-subheading">Обрати внимание</div>
          <ul>${warnings.map((warning) => `<li><span>!</span>${warning}</li>`).join("")}</ul>
        `
      : "";

    $("#adaptationResultStatus").textContent =
      warnings.length ? "Есть ограничения" : "Готово";

    $("#adaptationResult").hidden = false;
    $("#adaptationGenerate").hidden = true;
    $("#adaptationSave").hidden = false;

    $("#adaptationResult").scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }


  function saveAdaptationDraft() {
    if (!adaptationDraft || !adaptationDraft.adapted) {
      return;
    }

    state.userRecipes.push(adaptationDraft.adapted);
    saveUserData();

    closeAdaptRecipeDialog();
    closeRecipeModal();

    renderRecipes();
    renderMyRecipes();
    renderHero();

    const myRecipesSection = $("#my-recipes");

    if (myRecipesSection) {
      setTimeout(() => {
        myRecipesSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    }
  }


  /* =========================================================
     PARSE ADAPTATION REQUEST
  ========================================================= */

  function parseAdaptationRequest(
    request
  ) {
    const text =
      normalizeText(
        request
      );


    const parsed = {
      original: request,

      targetServings: null,

      maxCalories: null,
      minCalories: null,

      minProtein: null,
      maxProtein: null,

      maxTime: null,
      minTime: null,

      lessCalories: false,
      moreProtein: false,
      faster: false,

      noPotato: false,
      replaceChickenWithTurkey: false,

      recognized: false
    };


    /* =====================================================
       SERVINGS
    ===================================================== */

    let match =
      text.match(
        /(?:на|для)\s*(\d+)\s*(?:порц|порцию|порции|порций|человек|человека|человекам)/
      );


    if (!match) {
      match =
        text.match(
          /(\d+)\s*(?:порц|порцию|порции|порций)/
        );
    }


    if (match) {
      parsed.targetServings =
        Math.max(
          1,
          Number(
            match[1]
          )
        );

      parsed.recognized = true;
    }


    /* =====================================================
       MAX CALORIES
    ===================================================== */

    match =
      text.match(
        /(?:до|максимум|макс|не более|не больше|меньше)\s*(\d+)\s*(?:ккал|калорий|калории|кал)?/
      );


    if (match) {
      parsed.maxCalories =
        Number(
          match[1]
        );

      parsed.recognized = true;
    }


    /* =====================================================
       MIN CALORIES
    ===================================================== */

    match =
      text.match(
        /(?:от|минимум|не менее|не меньше)\s*(\d+)\s*(?:ккал|калорий|калории|кал)?/
      );


    if (match) {
      parsed.minCalories =
        Number(
          match[1]
        );

      parsed.recognized = true;
    }


    /* =====================================================
       MIN PROTEIN
    ===================================================== */

    match =
      text.match(
        /(?:минимум|от|не менее|не меньше)\s*(\d+)\s*(?:г|гр|грамм)?\s*(?:белка|протеина)/
      );


    if (match) {
      parsed.minProtein =
        Number(
          match[1]
        );

      parsed.recognized = true;
    }


    /* =====================================================
       MAX PROTEIN
    ===================================================== */

    match =
      text.match(
        /(?:до|максимум|макс|не более|не больше|меньше)\s*(\d+)\s*(?:г|гр|грамм)?\s*(?:белка|протеина)/
      );


    if (match) {
      parsed.maxProtein =
        Number(
          match[1]
        );

      parsed.recognized = true;
    }


    /* =====================================================
       MAX TIME
    ===================================================== */

    match =
      text.match(
        /(?:до|максимум|макс|не более|не больше|меньше|за|не дольше|не дольше чем)\s*(\d+)\s*(?:мин|минут|минуты|минуту|минуте)/
      );


    if (match) {
      parsed.maxTime =
        Number(
          match[1]
        );

      parsed.recognized = true;
    }


    /* =====================================================
       MIN TIME
    ===================================================== */

    match =
      text.match(
        /(?:от|минимум|не менее|не меньше)\s*(\d+)\s*(?:мин|минут|минуты|минуту|минуте)/
      );


    if (match) {
      parsed.minTime =
        Number(
          match[1]
        );

      parsed.recognized = true;
    }


    /* =====================================================
       MORE PROTEIN
    ===================================================== */

    if (
      text.includes("больше белка") ||
      text.includes("больше протеина") ||
      text.includes("высокобелков") ||
      text.includes("белковее") ||
      text.includes("повысить белок") ||
      text.includes("увеличь белок") ||
      text.includes("увеличить белок") ||
      text.includes("много белка") ||
      text.includes("больше белков")
    ) {
      parsed.moreProtein = true;
      parsed.recognized = true;
    }


    /* =====================================================
       LESS CALORIES
    ===================================================== */

    if (
      text.includes("менее калор") ||
      text.includes("меньше калор") ||
      text.includes("низкокалор") ||
      text.includes("снизь калор") ||
      text.includes("облегчи") ||
      text.includes("облегчен") ||
      text.includes("полегче") ||
      text.includes("легче")
    ) {
      parsed.lessCalories = true;
      parsed.recognized = true;
    }


    /* =====================================================
       FASTER
    ===================================================== */

    if (
      text.includes("быстр") ||
      text.includes("скорее") ||
      text.includes("меньше времени") ||
      text.includes("сократи время") ||
      text.includes("ускорь") ||
      text.includes("побыстрее")
    ) {
      parsed.faster = true;
      parsed.recognized = true;
    }


    /* =====================================================
       NO POTATO
    ===================================================== */

    if (
      text.includes("без картоф") ||
      text.includes("убери картоф") ||
      text.includes("убрать картоф") ||
      text.includes("исключи картоф") ||
      text.includes("исключить картоф")
    ) {
      parsed.noPotato = true;
      parsed.recognized = true;
    }


    /* =====================================================
       CHICKEN -> TURKEY
    ===================================================== */

    if (
      (
        text.includes("замени куриц") ||
        text.includes("заменить куриц") ||
        text.includes("вместо куриц") ||
        text.includes("замена куриц")
      ) &&
      text.includes("индей")
    ) {
      parsed.replaceChickenWithTurkey = true;
      parsed.recognized = true;
    }


    return parsed;
  }


  /* =========================================================
     ADAPTATION HELPERS
  ========================================================= */

  function cloneIngredients(
    ingredients
  ) {
    return Array.isArray(
      ingredients
    )
      ? ingredients.map(
          (ingredient) => ({
            ...ingredient
          })
        )
      : [];
  }


  function scaleIngredients(
    ingredients,
    ratio
  ) {
    ingredients.forEach(
      (ingredient) => {
        const amount =
          Number(
            ingredient.amount
          ) || 0;

        const scaled =
          amount * ratio;

        ingredient.amount =
          roundIngredientAmount(
            scaled,
            ingredient.unit
          );
      }
    );
  }


  function roundIngredientAmount(
    amount,
    unit
  ) {
    const value =
      Number(
        amount
      ) || 0;


    if (
      unit === "шт"
    ) {
      return Math.max(
        1,
        Math.round(
          value
        )
      );
    }


    if (
      value < 10
    ) {
      return Math.round(
        value * 2
      ) / 2;
    }


    if (
      value < 100
    ) {
      return Math.round(
        value / 5
      ) * 5;
    }


    return Math.round(
      value / 10
    ) * 10;
  }


  function getIngredientProduct(
    ingredient
  ) {
    return getProduct(
      ingredient.product
    );
  }


  function getIngredientCalories(
    ingredient
  ) {
    const product =
      getIngredientProduct(
        ingredient
      );


    if (
      !product ||
      !product.raw
    ) {
      return 0;
    }


    let amount =
      Number(
        ingredient.amount
      ) || 0;


    if (
      ingredient.unit === "шт" &&
      product.pieceWeight
    ) {
      amount *= Number(
        product.pieceWeight
      );
    }


    return (
      Number(
        product.raw.kcal || 0
      ) *
      amount /
      100
    );
  }


  function getIngredientProtein(
    ingredient
  ) {
    const product =
      getIngredientProduct(
        ingredient
      );


    if (
      !product ||
      !product.raw
    ) {
      return 0;
    }


    let amount =
      Number(
        ingredient.amount
      ) || 0;


    if (
      ingredient.unit === "шт" &&
      product.pieceWeight
    ) {
      amount *= Number(
        product.pieceWeight
      );
    }


    return (
      Number(
        product.raw.protein || 0
      ) *
      amount /
      100
    );
  }


  function isProteinProduct(
    productId
  ) {
    return [
      "курица",
      "куриное-бедро",
      "индейка",
      "говядина",
      "свинина",
      "тунец",
      "лосось",
      "креветки",
      "яйца",
      "творог"
    ].includes(
      productId
    );
  }


  function isCalorieDenseProduct(
    productId
  ) {
    return [
      "масло",
      "сливочное-масло",
      "сыр",
      "моцарелла",
      "сметана",
      "майонез",
      "сахар",
      "мед"
    ].includes(
      productId
    );
  }


  function isCarbHeavyProduct(
    productId
  ) {
    return [
      "картофель",
      "рис",
      "паста",
      "хлеб",
      "овсянка",
      "гречка",
      "чечевица",
      "фасоль"
    ].includes(
      productId
    );
  }


  function findProteinIngredient(
    ingredients
  ) {
    return (
      ingredients.find(
        (ingredient) =>
          isProteinProduct(
            ingredient.product
          )
      ) || null
    );
  }


  function reduceIngredient(
    ingredient,
    ratio
  ) {
    const current =
      Number(
        ingredient.amount
      ) || 0;


    ingredient.amount =
      Math.max(
        ingredient.unit === "шт"
          ? 1
          : 0,
        roundIngredientAmount(
          current * ratio,
          ingredient.unit
        )
      );
  }


  function calculateIngredientsNutrition(
    ingredients,
    servings
  ) {
    return calculateRecipeNutrition({
      ingredients,
      servings
    });
  }


  function addChange(
    changes,
    text
  ) {
    if (
      text &&
      !changes.includes(text)
    ) {
      changes.push(text);
    }
  }


  function formatConstraintSummary(
    parsed
  ) {
    const constraints = [];


    if (
      parsed.targetServings !== null
    ) {
      constraints.push(
        `${parsed.targetServings} порции`
      );
    }


    if (
      parsed.maxCalories !== null
    ) {
      constraints.push(
        `до ${parsed.maxCalories} ккал`
      );
    }


    if (
      parsed.minCalories !== null
    ) {
      constraints.push(
        `от ${parsed.minCalories} ккал`
      );
    }


    if (
      parsed.minProtein !== null
    ) {
      constraints.push(
        `минимум ${parsed.minProtein} г белка`
      );
    }


    if (
      parsed.maxProtein !== null
    ) {
      constraints.push(
        `до ${parsed.maxProtein} г белка`
      );
    }


    if (
      parsed.maxTime !== null
    ) {
      constraints.push(
        `до ${parsed.maxTime} минут`
      );
    }


    if (
      parsed.lessCalories
    ) {
      constraints.push(
        "менее калорийно"
      );
    }


    if (
      parsed.moreProtein
    ) {
      constraints.push(
        "больше белка"
      );
    }


    if (
      parsed.faster &&
      parsed.maxTime === null
    ) {
      constraints.push(
        "быстрее"
      );
    }


    if (
      parsed.noPotato
    ) {
      constraints.push(
        "без картофеля"
      );
    }


    if (
      parsed.replaceChickenWithTurkey
    ) {
      constraints.push(
        "курица → индейка"
      );
    }


    return constraints;
  }


  /* =========================================================
     ADAPTATION - CALORIES
  ========================================================= */

  function adaptToMaxCalories(
    ingredients,
    servings,
    targetCalories,
    changes,
    warnings,
    preserveProtein = false
  ) {
    let nutrition =
      calculateIngredientsNutrition(
        ingredients,
        servings
      );

    if (nutrition.calories <= targetCalories) {
      return nutrition;
    }

    const candidates = ingredients.filter(
      (ingredient) =>
        Number(ingredient.amount) > (ingredient.unit === "шт" ? 1 : 1) &&
        (!preserveProtein ||
          !isProteinProduct(ingredient.product))
    );

    if (!candidates.length) {
      warnings.push(
        `Невозможно безопасно снизить калорийность до ${targetCalories} ккал без уменьшения основных белковых продуктов.`
      );
      return nutrition;
    }

    let changed = false;

    for (let pass = 0; pass < 8; pass += 1) {
      nutrition =
        calculateIngredientsNutrition(
          ingredients,
          servings
        );

      if (nutrition.calories <= targetCalories) {
        break;
      }

      const currentCalories =
        Math.max(
          1,
          Number(nutrition.calories) || 1
        );

      const desiredRatio =
        Math.max(
          0.35,
          Math.min(
            0.92,
            targetCalories / currentCalories
          )
        );

      const ranked =
        candidates
          .map((ingredient) => {
            const product =
              getProduct(ingredient.product);

            if (!product || !product.raw) {
              return {
                ingredient,
                calories: 0
              };
            }

            let amount =
              Number(ingredient.amount) || 0;

            if (
              ingredient.unit === "шт" &&
              product.pieceWeight
            ) {
              amount *= Number(product.pieceWeight);
            }

            return {
              ingredient,
              calories:
                Number(product.raw.kcal || 0) *
                (amount / 100)
            };
          })
          .sort(
            (a, b) =>
              b.calories - a.calories
          );

      let passChanged = false;

      ranked.forEach(({ ingredient }) => {
        nutrition =
          calculateIngredientsNutrition(
            ingredients,
            servings
          );

        if (
          nutrition.calories <=
          targetCalories
        ) {
          return;
        }

        const before =
          Number(ingredient.amount) || 0;

        reduceIngredient(
          ingredient,
          desiredRatio
        );

        if (
          Number(ingredient.amount) <
          before
        ) {
          passChanged = true;
          changed = true;
        }
      });

      if (!passChanged) {
        break;
      }
    }

    nutrition =
      calculateIngredientsNutrition(
        ingredients,
        servings
      );

    if (changed) {
      addChange(
        changes,
        preserveProtein
          ? "точечно снижены наиболее калорийные ингредиенты с сохранением основного источника белка"
          : "количество наиболее калорийных ингредиентов рассчитано под заданный лимит"
      );
    }

    if (
      nutrition.calories >
      targetCalories
    ) {
      warnings.push(
        `Цель ${targetCalories} ккал полностью не достигнута: получилось ${nutrition.calories} ккал.`
      );
    }

    return nutrition;
  }

  /* =========================================================
     ADAPTATION - PROTEIN TARGET
  ========================================================= */

  function adaptToProteinTarget(
    ingredients,
    servings,
    targetProtein,
    changes,
    warnings
  ) {
    let nutrition =
      calculateIngredientsNutrition(
        ingredients,
        servings
      );


    if (
      nutrition.protein >=
      targetProtein
    ) {
      return nutrition;
    }


    let proteinIngredient =
      findProteinIngredient(
        ingredients
      );


    if (proteinIngredient) {
      proteinIngredient.amount =
        roundIngredientAmount(
          (
            Number(
              proteinIngredient.amount
            ) || 0
          ) * 1.4,
          proteinIngredient.unit
        );


      addChange(
        changes,
        "увеличен основной источник белка"
      );
    } else {
      ingredients.push({
        product: "яйца",
        amount: 2,
        unit: "шт"
      });


      addChange(
        changes,
        "добавлены яйца для повышения белка"
      );
    }


    nutrition =
      calculateIngredientsNutrition(
        ingredients,
        servings
      );


    /*
      Если белка всё ещё недостаточно,
      увеличиваем источник ещё раз.
    */

    if (
      nutrition.protein <
      targetProtein
    ) {
      proteinIngredient =
        findProteinIngredient(
          ingredients
        );


      if (proteinIngredient) {
        proteinIngredient.amount =
          roundIngredientAmount(
            (
              Number(
                proteinIngredient.amount
              ) || 0
            ) * 1.25,
            proteinIngredient.unit
          );


        nutrition =
          calculateIngredientsNutrition(
            ingredients,
            servings
          );


        addChange(
          changes,
          "дополнительно увеличен источник белка"
        );
      }
    }


    if (
      nutrition.protein <
      targetProtein
    ) {
      warnings.push(
        `Цель ${targetProtein} г белка полностью не достигнута: получилось ${nutrition.protein} г.`
      );
    }


    return nutrition;
  }


  /* =========================================================
     ADAPTATION - MORE PROTEIN
  ========================================================= */

  function increaseProtein(
    ingredients,
    servings,
    changes
  ) {
    const proteinIngredient =
      findProteinIngredient(
        ingredients
      );


    if (proteinIngredient) {
      proteinIngredient.amount =
        roundIngredientAmount(
          (
            Number(
              proteinIngredient.amount
            ) || 0
          ) * 1.3,
          proteinIngredient.unit
        );


      addChange(
        changes,
        "увеличено содержание белка"
      );
    } else {
      ingredients.push({
        product: "яйца",
        amount: 2,
        unit: "шт"
      });


      addChange(
        changes,
        "добавлены яйца для повышения белка"
      );
    }


    return calculateIngredientsNutrition(
      ingredients,
      servings
    );
  }


  /* =========================================================
     ADAPTATION - LESS CALORIES
  ========================================================= */

  function makeLessCaloric(
    ingredients,
    servings,
    changes
  ) {
    let changed =
      false;


    ingredients.forEach(
      (ingredient) => {
        if (
          isCalorieDenseProduct(
            ingredient.product
          )
        ) {
          const before =
            Number(
              ingredient.amount
            ) || 0;

          reduceIngredient(
            ingredient,
            0.5
          );

          if (
            Number(
              ingredient.amount
            ) < before
          ) {
            changed = true;
          }
        }
      }
    );


    if (!changed) {
      ingredients
        .filter(
          (ingredient) =>
            isCarbHeavyProduct(
              ingredient.product
            )
        )
        .forEach(
          (ingredient) => {
            const before =
              Number(
                ingredient.amount
              ) || 0;

            reduceIngredient(
              ingredient,
              0.8
            );

            if (
              Number(
                ingredient.amount
              ) < before
            ) {
              changed = true;
            }
          }
        );
    }


    if (changed) {
      addChange(
        changes,
        "снижена калорийность"
      );
    }


    return calculateIngredientsNutrition(
      ingredients,
      servings
    );
  }


  /* =========================================================
     ADAPTATION - MAX PROTEIN
  ========================================================= */

  function reduceProteinToTarget(
    ingredients,
    servings,
    targetProtein,
    changes
  ) {
    let nutrition =
      calculateIngredientsNutrition(
        ingredients,
        servings
      );


    const proteinIngredient =
      findProteinIngredient(
        ingredients
      );


    if (!proteinIngredient) {
      return nutrition;
    }


    let attempts = 0;


    while (
      nutrition.protein >
        targetProtein &&
      attempts < 4
    ) {
      reduceIngredient(
        proteinIngredient,
        0.85
      );


      nutrition =
        calculateIngredientsNutrition(
          ingredients,
          servings
        );


      attempts += 1;
    }


    if (
      attempts > 0
    ) {
      addChange(
        changes,
        "скорректировано количество белкового продукта"
      );
    }


    return nutrition;
  }


  /* =========================================================
     ADAPTATION - FASTER
  ========================================================= */

  function makeRecipeFaster(
    originalTime,
    maxTime,
    changes,
    warnings
  ) {
    let newTime =
      Number(
        originalTime
      ) || 0;


    if (
      maxTime !== null
    ) {
      if (
        newTime >
        maxTime
      ) {
        const optimizedTime =
          Math.round(
            newTime * 0.7
          );


        /*
          Здесь не утверждаем, что физически
          каждый рецепт гарантированно можно
          приготовить за целевое время.
          Это именно оценка адаптации.
        */

        newTime =
          Math.max(
            1,
            optimizedTime
          );


        addChange(
          changes,
          `оптимизировано время приготовления примерно до ${newTime} минут`
        );


        if (
          newTime >
          maxTime
        ) {
          warnings.push(
            `Оценочное время всё ещё выше лимита ${maxTime} минут: около ${newTime} минут.`
          );
        }
      } else {
        addChange(
          changes,
          `время приготовления уже укладывается в ${maxTime} минут`
        );
      }
    } else {
      newTime =
        Math.max(
          15,
          Math.round(
            newTime * 0.7
          )
        );


      addChange(
        changes,
        `сокращено время приготовления примерно до ${newTime} минут`
      );
    }


    return newTime;
  }


  /* =========================================================
     ADAPTATION - MAIN
  ========================================================= */

  function adaptRecipe(
    originalRecipe,
    request
  ) {
    if (!originalRecipe) {
      return null;
    }


    const parsed =
      parseAdaptationRequest(
        request
      );


    const ingredients =
      cloneIngredients(
        originalRecipe.ingredients
      );


    const steps =
      Array.isArray(
        originalRecipe.steps
      )
        ? [
            ...originalRecipe.steps
          ]
        : [];


    let servings =
      Math.max(
        1,
        Number(
          originalRecipe.servings
        ) || 1
      );


    let time =
      Math.max(
        1,
        Number(
          originalRecipe.time
        ) || 0
      );


    const changes = [];
    const warnings = [];


    /* =====================================================
       1. ПОРЦИИ
    ===================================================== */

    if (
      parsed.targetServings !== null &&
      parsed.targetServings !== servings
    ) {
      const ratio =
        parsed.targetServings /
        servings;


      scaleIngredients(
        ingredients,
        ratio
      );


      servings =
        parsed.targetServings;


      addChange(
        changes,
        `изменено количество до ${servings} порций`
      );
    }


    /* =====================================================
       2. ЗАМЕНА КУРИЦЫ НА ИНДЕЙКУ
    ===================================================== */

    if (
      parsed.replaceChickenWithTurkey
    ) {
      let replaced =
        false;


      ingredients.forEach(
        (ingredient) => {
          if (
            ingredient.product ===
            "курица"
          ) {
            ingredient.product =
              "индейка";

            replaced = true;
          }


          if (
            ingredient.product ===
            "куриное-бедро"
          ) {
            ingredient.product =
              "индейка";

            replaced = true;
          }
        }
      );


      if (replaced) {
        addChange(
          changes,
          "курица заменена на индейку"
        );
      } else {
        warnings.push(
          "В рецепте не найдено куриное мясо для замены на индейку."
        );
      }
    }


    /* =====================================================
       3. БЕЗ КАРТОФЕЛЯ
    ===================================================== */

    if (
      parsed.noPotato
    ) {
      const before =
        ingredients.length;


      const filtered =
        ingredients.filter(
          (ingredient) =>
            ingredient.product !==
            "картофель"
        );


      ingredients.length =
        0;


      filtered.forEach(
        (ingredient) => {
          ingredients.push(
            ingredient
          );
        }
      );


      if (
        ingredients.length <
        before
      ) {
        addChange(
          changes,
          "картофель исключён"
        );
      } else {
        warnings.push(
          "В рецепте картофель не найден."
        );
      }
    }


    /* =====================================================
       4. МЕНЕЕ КАЛОРИЙНЫЙ
    ===================================================== */

    if (
      parsed.lessCalories
    ) {
      makeLessCaloric(
        ingredients,
        servings,
        changes
      );
    }


    /* =====================================================
       5. БОЛЬШЕ БЕЛКА
    ===================================================== */

    if (
      parsed.moreProtein
    ) {
      increaseProtein(
        ingredients,
        servings,
        changes
      );
    }


    /* =====================================================
       6. МИНИМУМ БЕЛКА
    ===================================================== */

    if (
      parsed.minProtein !== null
    ) {
      adaptToProteinTarget(
        ingredients,
        servings,
        parsed.minProtein,
        changes,
        warnings
      );
    }


    /*
      ВАЖНО:
      После увеличения белка снова проверяем калории.
      Это позволяет одновременно выполнять:
      "больше белка" + "до 500 ккал".
    */

    if (
      parsed.maxCalories !== null
    ) {
      adaptToMaxCalories(
        ingredients,
        servings,
        parsed.maxCalories,
        changes,
        warnings,
        parsed.minProtein !== null
      );
    }


    /* =====================================================
       7. МИНИМУМ КАЛОРИЙ
    ===================================================== */

    let nutrition =
      calculateIngredientsNutrition(
        ingredients,
        servings
      );


    if (
      parsed.minCalories !== null &&
      nutrition.calories <
      parsed.minCalories
    ) {
      warnings.push(
        `Минимум ${parsed.minCalories} ккал не достигнут: получилось ${nutrition.calories} ккал.`
      );
    }


    /* =====================================================
       8. МАКСИМУМ БЕЛКА
    ===================================================== */

    if (
      parsed.maxProtein !== null &&
      nutrition.protein >
      parsed.maxProtein
    ) {
      nutrition =
        reduceProteinToTarget(
          ingredients,
          servings,
          parsed.maxProtein,
          changes
        );


      if (
        nutrition.protein >
        parsed.maxProtein
      ) {
        warnings.push(
          `Максимум ${parsed.maxProtein} г белка не удалось полностью соблюсти: получилось ${nutrition.protein} г.`
        );
      }
    }


    /*
      После уменьшения белка снова проверяем
      максимальную калорийность.
    */

    if (
      parsed.maxCalories !== null
    ) {
      nutrition =
        calculateIngredientsNutrition(
          ingredients,
          servings
        );


      if (
        nutrition.calories >
        parsed.maxCalories
      ) {
        nutrition =
          adaptToMaxCalories(
        ingredients,
        servings,
        parsed.maxCalories,
        changes,
        warnings,
        parsed.minProtein !== null
      );
      }
    }


    /* =====================================================
       9. ВРЕМЯ
    ===================================================== */

    if (
      parsed.maxTime !== null
    ) {
      time =
        makeRecipeFaster(
          time,
          parsed.maxTime,
          changes,
          warnings
        );
    }


    if (
      parsed.faster &&
      parsed.maxTime === null
    ) {
      time =
        makeRecipeFaster(
          time,
          null,
          changes,
          warnings
        );
    }


    /* =====================================================
       10. МИНИМАЛЬНОЕ ВРЕМЯ
    ===================================================== */

    if (
      parsed.minTime !== null &&
      time <
      parsed.minTime
    ) {
      warnings.push(
        `Минимальное время ${parsed.minTime} минут не требуется увеличивать искусственно: текущая оценка ${time} минут.`
      );
    }


    /* =====================================================
       11. ФИНАЛЬНЫЙ РАСЧЁТ
    ===================================================== */

    nutrition =
      calculateIngredientsNutrition(
        ingredients,
        servings
      );


    /* =====================================================
       12. ФИНАЛЬНАЯ ПРОВЕРКА ЦЕЛЕЙ
    ===================================================== */

    if (
      parsed.maxCalories !== null &&
      nutrition.calories >
      parsed.maxCalories
    ) {
      const exists =
        warnings.some(
          (warning) =>
            warning.includes(
              "ккал"
            )
        );


      if (!exists) {
        warnings.push(
          `Цель ${parsed.maxCalories} ккал не выполнена: получилось ${nutrition.calories} ккал.`
        );
      }
    }


    if (
      parsed.minCalories !== null &&
      nutrition.calories <
      parsed.minCalories
    ) {
      const exists =
        warnings.some(
          (warning) =>
            warning.includes(
              "Минимум"
            ) &&
            warning.includes(
              "ккал"
            )
        );


      if (!exists) {
        warnings.push(
          `Минимум ${parsed.minCalories} ккал не достигнут: получилось ${nutrition.calories} ккал.`
        );
      }
    }


    if (
      parsed.minProtein !== null &&
      nutrition.protein <
      parsed.minProtein
    ) {
      const exists =
        warnings.some(
          (warning) =>
            warning.includes(
              "белка"
            )
        );


      if (!exists) {
        warnings.push(
          `Цель ${parsed.minProtein} г белка не выполнена: получилось ${nutrition.protein} г.`
        );
      }
    }


    if (
      parsed.maxProtein !== null &&
      nutrition.protein >
      parsed.maxProtein
    ) {
      const exists =
        warnings.some(
          (warning) =>
            warning.includes(
              "белка"
            )
        );


      if (!exists) {
        warnings.push(
          `Лимит ${parsed.maxProtein} г белка не выполнен: получилось ${nutrition.protein} г.`
        );
      }
    }


    if (
      parsed.maxTime !== null &&
      time >
      parsed.maxTime
    ) {
      const exists =
        warnings.some(
          (warning) =>
            warning.includes(
              "врем"
            )
        );


      if (!exists) {
        warnings.push(
          `Лимит ${parsed.maxTime} минут не выполнен: оценочное время ${time} минут.`
        );
      }
    }


    /* =====================================================
       13. TITLE
    ===================================================== */

    const title =
      `${originalRecipe.title} — AI-адаптация`;


    /* =====================================================
       14. DESCRIPTION
    ===================================================== */

    const constraintSummary =
      formatConstraintSummary(
        parsed
      );


    let description =
      originalRecipe.description ||
      "";


    if (
      constraintSummary.length
    ) {
      description =
        `${description} Персональная адаптация RecipePro: ${constraintSummary.join(" · ")}.`;
    } else {
      description =
        `${description} Персональная адаптация RecipePro по запросу пользователя.`;
    }


    if (
      changes.length
    ) {
      description +=
        ` Изменения: ${changes.join(
          " · "
        )}.`;
    }


    if (
      warnings.length
    ) {
      description +=
        ` Важно: ${warnings.join(
          " "
        )}`;
    }


    /* =====================================================
       15. RETURN
    ===================================================== */

    return {
      id:
        `ai-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      title,

      description,

      emoji:
        originalRecipe.emoji ||
        "🍽️",

      tags: [
        "AI-адаптация",
        "Мой рецепт"
      ],

      filters:
        Array.isArray(
          originalRecipe.filters
        )
          ? [
              ...originalRecipe.filters
            ]
          : [],

      time,

      servings,

      ingredients,

      steps,

      nutrition,

      sourceRecipeId:
        originalRecipe.id,

      sourceRecipeTitle:
        originalRecipe.title,

      sourceRecipeIsAiAdaptation:
        originalRecipe.isAiAdaptation === true,

      adaptationRequest:
        request,

      adaptationChanges:
        changes,

      adaptationConstraints:
        parsed,

      adaptationWarnings:
        warnings,

      adaptationVersion:
        1,

      adaptedAt:
        new Date().toISOString(),

      isAiAdaptation:
        true
    };
  }


  /* =========================================================
     FAVORITES
  ========================================================= */

  function toggleFavorite(
    recipeId
  ) {
    const index =
      state.favorites.findIndex(
        (id) =>
          String(id) ===
          String(recipeId)
      );


    if (index >= 0) {
      state.favorites.splice(
        index,
        1
      );
    } else {
      state.favorites.push(
        recipeId
      );
    }


    saveUserData();
    renderRecipes();
  }


  /* =========================================================
     MY RECIPES
  ========================================================= */

  function renderMyRecipes() {
    const grid =
      $("#myRecipesGrid");

    if (!grid) {
      return;
    }


    if (
      !state.userRecipes.length
    ) {
      grid.innerHTML = `
        <div class="empty-state">

          <div class="empty-state-icon">
            👨‍🍳
          </div>

          <h3>
            Здесь появятся ваши рецепты
          </h3>

          <p>
            Создайте свой первый рецепт
            и сохраните его в RecipePro.
          </p>

        </div>
      `;

      return;
    }


    grid.innerHTML =
      state.userRecipes
        .map(
          renderRecipeCard
        )
        .join("");


    bindRecipeCards(grid);
  }


  /* =========================================================
     ADD RECIPE MODAL
  ========================================================= */

  function openAddRecipeModal() {
    const modal =
      $("#addRecipeModal");

    if (!modal) {
      return;
    }

    modal.classList.add(
      "active"
    );

    document.body.classList.add(
      "modal-open"
    );


    ensureInitialIngredientRow();
    ensureInitialStepRow();
    updatePreview();
  }


  function closeAddRecipeModal() {
    const modal =
      $("#addRecipeModal");

    if (!modal) {
      return;
    }

    modal.classList.remove(
      "active"
    );

    document.body.classList.remove(
      "modal-open"
    );
  }


  /* =========================================================
     INGREDIENT BUILDER
  ========================================================= */

  function ensureInitialIngredientRow() {
    const builder =
      $("#ingredientsBuilder");

    if (!builder) {
      return;
    }

    if (
      !builder.querySelector(
        ".ingredient-row"
      )
    ) {
      addIngredientRow();
    }
  }


  function addIngredientRow() {
    const builder =
      $("#ingredientsBuilder");

    if (!builder) {
      return;
    }

    const products =
      getProducts();

    const options =
      Object.keys(products)
        .map(
          (productId) => `
            <option value="${escapeHtml(
              productId
            )}">
              ${escapeHtml(
                getProductName(
                  productId
                )
              )}
            </option>
          `
        )
        .join("");

    const row =
      document.createElement(
        "div"
      );

    row.className =
      "ingredient-row";

    row.innerHTML = `
      <select class="ingredient-product">
        ${options}
      </select>

      <input
        class="ingredient-amount"
        type="number"
        min="0"
        step="1"
        value="100"
        placeholder="Количество"
      />

      <select class="ingredient-unit">
        <option value="г">г</option>
        <option value="мл">мл</option>
        <option value="шт">шт</option>
      </select>

      <select class="ingredient-state" aria-label="Состояние продукта">
        <option value="raw">Сырое</option>
        <option value="boiled">Варёное</option>
        <option value="fried">Жареное</option>
      </select>

      <button
        type="button"
        class="builder-remove ingredient-remove"
        aria-label="Удалить ингредиент"
      >
        ×
      </button>
    `;

    builder.appendChild(
      row
    );

    const remove =
      row.querySelector(
        ".ingredient-remove"
      );

    if (remove) {
      remove.addEventListener(
        "click",
        () => {
          row.remove();
          updatePreview();
        }
      );
    }

    row
      .querySelectorAll(
        "input, select"
      )
      .forEach(
        (element) => {
          element.addEventListener(
            "input",
            updatePreview
          );

          element.addEventListener(
            "change",
            updatePreview
          );
        }
      );

    updatePreview();
  }

  /* =========================================================
     STEP BUILDER
  ========================================================= */

  function ensureInitialStepRow() {
    const builder =
      $("#stepsBuilder");

    if (!builder) {
      return;
    }

    if (
      !builder.querySelector(
        ".step-row"
      )
    ) {
      addStepRow();
    }
  }


  function addStepRow() {
    const builder =
      $("#stepsBuilder");

    if (!builder) {
      return;
    }


    const row =
      document.createElement(
        "div"
      );

    row.className =
      "step-row";


    const number =
      builder.querySelectorAll(
        ".step-row"
      ).length + 1;


    row.innerHTML = `
      <div class="step-number">
        ${number}
      </div>

      <textarea
        class="step-input"
        rows="2"
        placeholder="Напишите шаг приготовления..."
      ></textarea>

      <button
        type="button"
        class="builder-remove step-remove"
        aria-label="Удалить шаг"
      >
        ×
      </button>
    `;


    builder.appendChild(
      row
    );


    const remove =
      row.querySelector(
        ".step-remove"
      );

    if (remove) {
      remove.addEventListener(
        "click",
        () => {
          row.remove();
          renumberSteps();
        }
      );
    }
  }


  function renumberSteps() {
    const rows =
      $$(".step-row");

    rows.forEach(
      (row, index) => {
        const number =
          row.querySelector(
            ".step-number"
          );

        if (number) {
          number.textContent =
            index + 1;
        }
      }
    );
  }


  /* =========================================================
     PREVIEW
  ========================================================= */

  function updatePreview() {
    const titleInput =
      $("#recipeTitle");

    const descriptionInput =
      $("#recipeDescription");

    const timeInput =
      $("#recipeTime");

    const servingsInput =
      $("#recipeServings");


    const previewTitle =
      $("#previewTitle");

    const previewDescription =
      $("#previewDescription");

    const previewTime =
      $("#previewTime");

    const previewServings =
      $("#previewServings");


    if (previewTitle) {
      previewTitle.textContent =
        titleInput?.value ||
        "Название рецепта";
    }


    if (previewDescription) {
      previewDescription.textContent =
        descriptionInput?.value ||
        "Описание рецепта";
    }


    if (previewTime) {
      previewTime.textContent =
        `${timeInput?.value || 0} мин`;
    }


    if (previewServings) {
      previewServings.textContent =
        `${servingsInput?.value || 1} порц.`;
    }


    const nutrition =
      calculateBuilderNutrition();


    const previewCalories =
      $("#previewCalories");

    const previewProtein =
      $("#previewProtein");

    const previewFat =
      $("#previewFat");

    const previewCarbs =
      $("#previewCarbs");


    if (previewCalories) {
      previewCalories.textContent =
        `${nutrition.calories} ккал`;
    }


    if (previewProtein) {
      previewProtein.textContent =
        `${nutrition.protein} г`;
    }


    if (previewFat) {
      previewFat.textContent =
        `${nutrition.fat} г`;
    }


    if (previewCarbs) {
      previewCarbs.textContent =
        `${nutrition.carbs} г`;
    }


    const emojiInput =
      $("#recipeEmoji");

    const previewEmoji =
      $("#previewEmoji");


    if (previewEmoji) {
      previewEmoji.textContent =
        emojiInput?.value ||
        "🍽️";
    }
  }


  function calculateBuilderNutrition() {
    const ingredients = [];

    const builder =
      $("#ingredientsBuilder");

    if (!builder) {
      return {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0
      };
    }

    builder
      .querySelectorAll(
        ".ingredient-row"
      )
      .forEach(
        (row) => {
          const productSelect =
            row.querySelector(
              ".ingredient-product"
            );

          const amountInput =
            row.querySelector(
              ".ingredient-amount"
            );

          const unitSelect =
            row.querySelector(
              ".ingredient-unit"
            );

          const stateSelect =
            row.querySelector(
              ".ingredient-state"
            );

          if (!productSelect) {
            return;
          }

          const product =
            productSelect.value;

          const amount =
            Number(
              amountInput?.value ||
              0
            );

          const unit =
            unitSelect?.value ||
            "г";

          const state =
            stateSelect?.value ||
            "raw";

          if (
            product &&
            amount > 0
          ) {
            ingredients.push({
              product,
              amount,
              unit,
              state
            });
          }
        }
      );

    const servings =
      Math.max(
        1,
        Number(
          $("#recipeServings")
            ?.value || 1
        )
      );

    return calculateRecipeNutrition({
      ingredients,
      servings
    });
  }

  /* =========================================================
     CREATE USER RECIPE
  ========================================================= */

  function handleRecipeSubmit(
    event
  ) {
    event.preventDefault();


    const title =
      $("#recipeTitle")
        ?.value.trim();

    const description =
      $("#recipeDescription")
        ?.value.trim();

    const category =
      $("#recipeCategory")
        ?.value ||
      "other";

    const emoji =
      $("#recipeEmoji")
        ?.value.trim() ||
      "🍽️";

    const time =
      Number(
        $("#recipeTime")
          ?.value || 0
      );

    const servings =
      Number(
        $("#recipeServings")
          ?.value || 1
      );


    if (!title) {
      alert(
        "Введите название рецепта."
      );

      return;
    }


    const ingredients = [];

    $(".ingredient-row")
      .forEach(
        (row) => {
          const product =
            row.querySelector(
              ".ingredient-product"
            )?.value;

          const amount =
            Number(
              row.querySelector(
                ".ingredient-amount"
              )?.value || 0
            );

          const unit =
            row.querySelector(
              ".ingredient-unit"
            )?.value ||
            "г";

          const state =
            row.querySelector(
              ".ingredient-state"
            )?.value ||
            "raw";

          if (
            product &&
            amount > 0
          ) {
            ingredients.push({
              product,
              amount,
              unit,
              state
            });
          }
        }
      );

    const steps = [];


    $$(".step-row")
      .forEach(
        (row) => {
          const value =
            row.querySelector(
              ".step-input"
            )?.value.trim();

          if (value) {
            steps.push(value);
          }
        }
      );


    if (!ingredients.length) {
      alert(
        "Добавьте хотя бы один ингредиент."
      );

      return;
    }


    if (!steps.length) {
      alert(
        "Добавьте хотя бы один шаг приготовления."
      );

      return;
    }


    const nutrition =
      calculateBuilderNutrition();


    const recipe = {
      id:
        `user-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      title,

      description,

      emoji,

      tags: [
        "Рецепт пользователя"
      ],

      filters: [
        category
      ],

      time,

      servings,

      ingredients,

      steps,

      nutrition
    };


    state.userRecipes.push(
      recipe
    );

    saveUserData();


    closeAddRecipeModal();

    resetRecipeForm();


    renderRecipes();
    renderMyRecipes();
    renderHero();


    const myRecipesSection =
      $("#my-recipes");

    if (myRecipesSection) {
      setTimeout(
        () => {
          myRecipesSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        },
        100
      );
    }
  }


  /* =========================================================
     RESET RECIPE FORM
  ========================================================= */

  function resetRecipeForm() {
    const form =
      $("#recipeForm");

    if (form) {
      form.reset();
    }


    const ingredients =
      $("#ingredientsBuilder");

    if (ingredients) {
      ingredients.innerHTML =
        "";
    }


    const steps =
      $("#stepsBuilder");

    if (steps) {
      steps.innerHTML =
        "";
    }


    ensureInitialIngredientRow();
    ensureInitialStepRow();

    updatePreview();
  }


  /* =========================================================
     HTML ESCAPE
  ========================================================= */

  function escapeHtml(value) {
    return String(
      value ?? ""
    )
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }


  /* =========================================================
     AI RECIPE GENERATOR
  ========================================================= */

  let aiGeneratorDraft = null;


  function ensureAiRecipeGeneratorModal() {
    if ($("#aiRecipeGeneratorModal")) {
      return;
    }

    const modal =
      document.createElement("div");

    modal.id =
      "aiRecipeGeneratorModal";

    modal.className =
      "ai-generator-overlay";

    modal.innerHTML = `
      <div
        class="ai-generator-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aiGeneratorTitle"
      >
        <button
          class="ai-generator-close"
          id="aiGeneratorClose"
          type="button"
          aria-label="Закрыть"
        >×</button>

        <div class="ai-generator-header">
          <div class="ai-generator-eyebrow">
            RECIPEPRO AI · GENERATOR
          </div>

          <h2 id="aiGeneratorTitle">
            Соберём блюдо из того, что есть
          </h2>

          <p>
            Напиши продукты — RecipePro подберёт сочетание,
            создаст рецепт и автоматически рассчитает КБЖУ.
          </p>
        </div>

        <div class="ai-generator-body">
          <label class="ai-generator-label" for="aiGeneratorInput">
            Что есть дома?
          </label>

          <textarea
            id="aiGeneratorInput"
            class="ai-generator-input"
            rows="4"
            placeholder="Например: яйца, творог и банан"
          ></textarea>

          <div class="ai-generator-examples">
            <button type="button" data-generator-example="яйца, творог и банан">
              яйца · творог · банан
            </button>
            <button type="button" data-generator-example="курица, картофель и лук">
              курица · картофель · лук
            </button>
            <button type="button" data-generator-example="рис, курица и помидоры">
              рис · курица · помидоры
            </button>
          </div>

          <div
            class="ai-generator-result"
            id="aiGeneratorResult"
            hidden
          ></div>

          <div class="ai-generator-actions">
            <button
              class="adaptation-secondary-button"
              id="aiGeneratorCancel"
              type="button"
            >
              Закрыть
            </button>

            <button
              class="adaptation-primary-button"
              id="aiGeneratorCreate"
              type="button"
            >
              ✨ Создать рецепт
              <span>→</span>
            </button>

            <button
              class="adaptation-primary-button adaptation-save-button"
              id="aiGeneratorSave"
              type="button"
              hidden
            >
              Сохранить в мои рецепты
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    $("#aiGeneratorClose")?.addEventListener(
      "click",
      closeAiRecipeGenerator
    );

    $("#aiGeneratorCancel")?.addEventListener(
      "click",
      closeAiRecipeGenerator
    );

    modal.addEventListener(
      "click",
      (event) => {
        if (event.target === modal) {
          closeAiRecipeGenerator();
        }
      }
    );

    $("#aiGeneratorCreate")?.addEventListener(
      "click",
      generateAiRecipe
    );

    $("#aiGeneratorSave")?.addEventListener(
      "click",
      saveAiGeneratedRecipe
    );

    modal
      .querySelectorAll(
        "[data-generator-example]"
      )
      .forEach(
        (button) => {
          button.addEventListener(
            "click",
            () => {
              const input =
                $("#aiGeneratorInput");

              if (input) {
                input.value =
                  button.dataset.generatorExample || "";

                input.focus();
              }
            }
          );
        }
      );
  }


  function openAiRecipeGenerator() {
    ensureAiRecipeGeneratorModal();

    aiGeneratorDraft = null;

    const modal =
      $("#aiRecipeGeneratorModal");

    const input =
      $("#aiGeneratorInput");

    const result =
      $("#aiGeneratorResult");

    const saveButton =
      $("#aiGeneratorSave");

    if (input) {
      input.value = "";
    }

    if (result) {
      result.hidden = true;
      result.innerHTML = "";
    }

    if (saveButton) {
      saveButton.hidden = true;
    }

    modal?.classList.add("active");
    document.body.classList.add("modal-open");

    setTimeout(
      () => input?.focus(),
      50
    );
  }


  function closeAiRecipeGenerator() {
    const modal =
      $("#aiRecipeGeneratorModal");

    if (modal) {
      modal.classList.remove("active");
    }

    document.body.classList.remove("modal-open");
  }


  function getGeneratedProductOrder(products) {
    const priority = [
      "курица",
      "куриное-бедро",
      "индейка",
      "говядина",
      "свинина",
      "лосось",
      "тунец",
      "креветки",
      "яйца",
      "творог",
      "сыр",
      "моцарелла",
      "рис",
      "гречка",
      "паста",
      "картофель",
      "чечевица",
      "фасоль",
      "овсянка",
      "помидоры",
      "огурец",
      "перец",
      "брокколи",
      "кабачок",
      "капуста",
      "лук",
      "морковь",
      "банан",
      "яблоко",
      "апельсин",
      "молоко",
      "йогурт",
      "сметана",
      "хлеб"
    ];

    return [...products].sort(
      (a, b) =>
        priority.indexOf(a) -
        priority.indexOf(b)
    );
  }


  function getGeneratedAmount(productId) {
    const amounts = {
      "курица": 250,
      "куриное-бедро": 250,
      "индейка": 250,
      "говядина": 250,
      "свинина": 250,
      "лосось": 220,
      "тунец": 180,
      "креветки": 220,
      "яйца": 3,
      "творог": 200,
      "сыр": 60,
      "моцарелла": 80,
      "рис": 180,
      "гречка": 180,
      "паста": 180,
      "картофель": 350,
      "чечевица": 180,
      "фасоль": 180,
      "овсянка": 60,
      "помидоры": 2,
      "огурец": 1,
      "перец": 1,
      "брокколи": 200,
      "кабачок": 1,
      "капуста": 250,
      "лук": 1,
      "морковь": 1,
      "банан": 1,
      "яблоко": 1,
      "апельсин": 1,
      "молоко": 200,
      "йогурт": 150,
      "сметана": 40,
      "хлеб": 2
    };

    return amounts[productId] || 100;
  }


  function getGeneratedUnit(productId) {
    const pieceProducts = [
      "яйца",
      "помидоры",
      "огурец",
      "перец",
      "кабачок",
      "лук",
      "морковь",
      "банан",
      "яблоко",
      "апельсин",
      "хлеб"
    ];

    return pieceProducts.includes(
      productId
    )
      ? "шт"
      : "г";
  }


  function getGeneratedState(productId) {
    const boiledProducts = [
      "рис",
      "гречка",
      "паста",
      "картофель",
      "чечевица",
      "фасоль",
      "овсянка"
    ];

    const rawProducts = [
      "творог",
      "сыр",
      "моцарелла",
      "молоко",
      "йогурт",
      "сметана",
      "банан",
      "яблоко",
      "апельсин",
      "огурец"
    ];

    if (rawProducts.includes(productId)) {
      return "raw";
    }

    if (boiledProducts.includes(productId)) {
      return "boiled";
    }

    return "fried";
  }


  function buildGeneratedRecipe(products) {
    const ordered =
      getGeneratedProductOrder(
        products
      );

    const hasProtein =
      ordered.some(
        (id) =>
          [
            "курица",
            "куриное-бедро",
            "индейка",
            "говядина",
            "свинина",
            "лосось",
            "тунец",
            "креветки",
            "яйца",
            "творог",
            "сыр",
            "моцарелла"
          ].includes(id)
      );

    const hasCarb =
      ordered.some(
        (id) =>
          [
            "рис",
            "гречка",
            "паста",
            "картофель",
            "чечевица",
            "фасоль",
            "овсянка",
            "хлеб"
          ].includes(id)
      );

    const hasFruit =
      ordered.some(
        (id) =>
          [
            "банан",
            "яблоко",
            "апельсин"
          ].includes(id)
      );

    const hasDairy =
      ordered.some(
        (id) =>
          [
            "творог",
            "йогурт",
            "молоко"
          ].includes(id)
      );

    let title =
      "Авторское блюдо RecipePro";

    let description =
      "RecipePro собрал это блюдо из продуктов, которые уже есть дома.";

    let time = 20;
    let emoji = "🍽️";
    let steps = [];

    if (
      hasDairy &&
      hasFruit &&
      !hasCarb
    ) {
      title =
        "Творожный боул с фруктами";
      description =
        "Быстрый белковый завтрак из доступных продуктов.";
      time = 5;
      emoji = "🥣";

      steps = [
        "Выложите творог или йогурт в глубокую миску.",
        "Нарежьте фрукт небольшими кусочками.",
        "Добавьте фрукт к творогу и аккуратно перемешайте.",
        "При желании добавьте немного молока для более нежной текстуры."
      ];
    } else if (
      hasProtein &&
      hasCarb
    ) {
      const proteinName =
        ordered.find(
          (id) =>
            [
              "курица",
              "куриное-бедро",
              "индейка",
              "говядина",
              "свинина",
              "лосось",
              "тунец",
              "креветки",
              "яйца"
            ].includes(id)
        );

      const carbName =
        ordered.find(
          (id) =>
            [
              "рис",
              "гречка",
              "паста",
              "картофель",
              "чечевица",
              "фасоль"
            ].includes(id)
        );

      title =
        `${getProductName(proteinName)} с ${getProductName(carbName).toLowerCase()}`;

      description =
        "Сытное домашнее блюдо, собранное RecipePro из твоих продуктов.";
      time = 25;
      emoji =
        carbName === "рис"
          ? "🍚"
          : carbName === "паста"
            ? "🍝"
            : carbName === "картофель"
              ? "🍗"
              : "🍲";

      steps = [
        `Подготовьте ${getProductName(proteinName).toLowerCase()} и нарежьте порционными кусочками.`,
        `Подготовьте ${getProductName(carbName).toLowerCase()} согласно его способу приготовления.`,
        `Приготовьте основной белковый продукт до полной готовности.`,
        "Соедините ингредиенты, добавьте соль и специи по вкусу.",
        "Дайте блюду постоять 2–3 минуты и подавайте горячим."
      ];
    } else if (
      hasProtein
    ) {
      const proteinName =
        ordered.find(
          (id) =>
            [
              "курица",
              "куриное-бедро",
              "индейка",
              "говядина",
              "свинина",
              "лосось",
              "тунец",
              "креветки",
              "яйца",
              "творог"
            ].includes(id)
        );

      title =
        `${getProductName(proteinName)} с овощами`;
      description =
        "Белковое блюдо RecipePro из доступных ингредиентов.";
      time = 20;
      emoji = "🍳";

      steps = [
        `Подготовьте ${getProductName(proteinName).toLowerCase()}.`,
        "Нарежьте остальные ингредиенты небольшими кусочками.",
        "Приготовьте белковую основу до готовности.",
        "Добавьте овощи и готовьте ещё 7–10 минут.",
        "Приправьте по вкусу и подавайте горячим."
      ];
    } else if (
      hasCarb
    ) {
      const carbName =
        ordered.find(
          (id) =>
            [
              "рис",
              "гречка",
              "паста",
              "картофель",
              "чечевица",
              "фасоль",
              "овсянка"
            ].includes(id)
        );

      title =
        `Домашнее блюдо с ${getProductName(carbName).toLowerCase()}`;
      description =
        "Простой вариант блюда из продуктов, которые уже есть под рукой.";
      time = 20;
      emoji = "🥘";

      steps = [
        `Подготовьте ${getProductName(carbName).toLowerCase()}.`,
        "Нарежьте остальные продукты.",
        "Приготовьте основу до мягкости.",
        "Соедините ингредиенты и прогрейте вместе.",
        "Посолите, добавьте специи и подавайте."
      ];
    } else {
      title =
        "Домашний микс RecipePro";
      description =
        "Быстрый вариант, собранный из доступных продуктов.";
      time = 10;
      emoji = "🥗";

      steps = [
        "Подготовьте все продукты.",
        "Нарежьте ингредиенты удобными кусочками.",
        "Соедините продукты в одной миске или форме.",
        "Добавьте специи по вкусу.",
        "Подавайте сразу после приготовления."
      ];
    }

    const ingredients =
      ordered.map(
        (productId) => ({
          product: productId,
          amount:
            getGeneratedAmount(
              productId
            ),
          unit:
            getGeneratedUnit(
              productId
            ),
          state:
            getGeneratedState(
              productId
            )
        })
      );

    const nutrition =
      calculateRecipeNutrition({
        ingredients,
        servings: 2
      });

    return {
      id:
        `ai-generated-${Date.now()}`,
      title:
        `${title} — AI`,
      description,
      emoji,
      tags: [
        "AI-рецепт",
        hasProtein
          ? "Высокобелковая"
          : "Домашняя кухня"
      ],
      filters: [
        hasProtein
          ? "protein"
          : "all"
      ],
      time,
      servings: 2,
      ingredients,
      steps,
      nutrition,
      isAiGenerated: true,
      aiGeneratedAt:
        new Date().toISOString(),
      aiSourceProducts:
        [...products]
    };
  }


  function renderAiGeneratedRecipe(recipe, detectedProducts) {
    const result =
      $("#aiGeneratorResult");

    if (!result) {
      return;
    }

    const nutrition =
      calculateRecipeNutrition(
        recipe
      );

    const ingredientsHtml =
      recipe.ingredients
        .map(
          (ingredient) => `
            <span>
              ${escapeHtml(
                getProductName(
                  ingredient.product
                )
              )}
              ·
              ${escapeHtml(
                ingredient.amount
              )}
              ${escapeHtml(
                ingredient.unit
              )}
            </span>
          `
        )
        .join("");

    result.hidden = false;

    result.innerHTML = `
      <div class="ai-generator-result-top">
        <div class="ai-generator-result-emoji">
          ${escapeHtml(recipe.emoji)}
        </div>

        <div>
          <span class="ai-generator-result-kicker">
            Сгенерировано из твоих продуктов
          </span>
          <h3>
            ${escapeHtml(recipe.title)}
          </h3>
          <p>
            ${escapeHtml(recipe.description)}
          </p>
        </div>
      </div>

      <div class="ai-generator-products">
        <span>Использованы</span>
        <div>
          ${ingredientsHtml}
        </div>
      </div>

      <div class="ai-generator-metrics">
        <div>
          <strong>${nutrition.calories}</strong>
          <span>ккал / порция</span>
        </div>
        <div>
          <strong>${nutrition.protein}</strong>
          <span>белки, г</span>
        </div>
        <div>
          <strong>${nutrition.fat}</strong>
          <span>жиры, г</span>
        </div>
        <div>
          <strong>${nutrition.carbs}</strong>
          <span>углеводы, г</span>
        </div>
      </div>

      <div class="ai-generator-steps">
        <span>Как приготовить</span>
        <ol>
          ${recipe.steps
            .map(
              (step) =>
                `<li>${escapeHtml(step)}</li>`
            )
            .join("")}
        </ol>
      </div>

      <div class="ai-generator-note">
        КБЖУ рассчитано по базе RecipePro. Для приготовленных продуктов
        используется ориентировочный коэффициент изменения веса.
      </div>
    `;

    if (detectedProducts.length) {
      result.insertAdjacentHTML(
        "beforeend",
        `
          <div class="ai-generator-detected">
            ✓ RecipePro распознал: ${escapeHtml(
              detectedProducts
                .map(getProductName)
                .join(", ")
            )}
          </div>
        `
      );
    }
  }


  function generateAiRecipe() {
    const input =
      $("#aiGeneratorInput");

    if (!input) {
      return;
    }

    const request =
      input.value.trim();

    if (!request) {
      input.classList.add(
        "adaptation-input-error"
      );
      input.focus();

      setTimeout(
        () =>
          input.classList.remove(
            "adaptation-input-error"
          ),
        900
      );

      return;
    }

    const detected =
      detectProducts(request);

    if (!detected.length) {
      const result =
        $("#aiGeneratorResult");

      if (result) {
        result.hidden = false;
        result.innerHTML = `
          <div class="ai-generator-empty">
            <strong>Пока не нашёл продукты из базы RecipePro.</strong>
            <span>Попробуй, например: курица, рис и помидоры.</span>
          </div>
        `;
      }

      return;
    }

    aiGeneratorDraft =
      buildGeneratedRecipe(
        detected
      );

    renderAiGeneratedRecipe(
      aiGeneratorDraft,
      detected
    );

    const saveButton =
      $("#aiGeneratorSave");

    if (saveButton) {
      saveButton.hidden = false;
    }
  }


  function saveAiGeneratedRecipe() {
    if (!aiGeneratorDraft) {
      return;
    }

    state.userRecipes.push(
      aiGeneratorDraft
    );

    saveUserData();

    closeAiRecipeGenerator();

    renderRecipes();
    renderMyRecipes();
    renderHero();

    const section =
      $("#my-recipes");

    if (section) {
      setTimeout(
        () => {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        },
        100
      );
    }
  }


  /* =========================================================
     START
  ========================================================= */

  init();
});