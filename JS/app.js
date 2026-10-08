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
    smartSearchResults: []
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
        const product =
          getProduct(
            ingredient.product
          );

        if (
          !product ||
          !product.raw
        ) {
          return;
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

        const multiplier =
          amount / 100;

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
      text.includes("белков") ||
      text.includes("высокобелков") ||
      text.includes("много белка") ||
      text.includes("протеинов")
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
      text.includes("быстро") ||
      text.includes("быстрое") ||
      text.includes("быстрый") ||
      text.includes("быстрая")
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

    let matchedIngredients = 0;
    let requiredCriteria = 0;
    let matchedCriteria = 0;


    /* =====================================================
       1. INGREDIENTS — HARD REQUIREMENT
    ===================================================== */

    if (
      parsed.ingredients.length > 0
    ) {
      parsed.ingredients.forEach(
        (productId) => {
          if (
            recipeContainsProduct(
              recipe,
              productId
            )
          ) {
            matchedIngredients += 1;
            score += 100;

            reasons.push(
              `✓ ${getProductName(
                productId
              )}`
            );
          }
        }
      );


      /*
       * If the user explicitly named ingredients,
       * every one of them must be present.
       * Nutrition/time/diet preferences remain soft.
       */
      if (
        matchedIngredients !==
        parsed.ingredients.length
      ) {
        return {
          recipe,
          score: -Infinity,
          reasons: [],
          matchPercent: 0,
          matchedIngredients,
          totalIngredients:
            parsed.ingredients.length,
          matchedCriteria: 0,
          totalCriteria: 0
        };
      }
    }


    /* =====================================================
       2. CALORIES
    ===================================================== */

    if (
      parsed.maxCalories !== null
    ) {
      requiredCriteria += 1;

      if (
        nutrition.calories <=
        parsed.maxCalories
      ) {
        matchedCriteria += 1;
        score += 45;

        reasons.push(
          `✓ ${nutrition.calories} ккал — в лимите`
        );
      } else {
        const difference =
          nutrition.calories -
          parsed.maxCalories;

        score -= Math.min(
          30,
          difference / 8
        );

        reasons.push(
          `~ ${nutrition.calories} ккал — на ${Math.round(
            difference
          )} выше лимита`
        );
      }
    }


    if (
      parsed.minCalories !== null
    ) {
      requiredCriteria += 1;

      if (
        nutrition.calories >=
        parsed.minCalories
      ) {
        matchedCriteria += 1;
        score += 30;

        reasons.push(
          `✓ ${nutrition.calories} ккал — достаточно`
        );
      } else {
        const difference =
          parsed.minCalories -
          nutrition.calories;

        score -= Math.min(
          25,
          difference / 8
        );

        reasons.push(
          `~ ${nutrition.calories} ккал — ниже цели`
        );
      }
    }


    /* =====================================================
       3. PROTEIN
    ===================================================== */

    if (
      parsed.minProtein !== null
    ) {
      requiredCriteria += 1;

      if (
        nutrition.protein >=
        parsed.minProtein
      ) {
        matchedCriteria += 1;
        score += 40;

        reasons.push(
          `✓ ${nutrition.protein} г белка — цель выполнена`
        );
      } else {
        const difference =
          parsed.minProtein -
          nutrition.protein;

        score -= Math.min(
          30,
          difference
        );

        reasons.push(
          `~ ${nutrition.protein} г белка — не хватает ${Math.round(
            difference
          )} г`
        );
      }
    }


    if (
      parsed.maxProtein !== null
    ) {
      requiredCriteria += 1;

      if (
        nutrition.protein <=
        parsed.maxProtein
      ) {
        matchedCriteria += 1;
        score += 30;

        reasons.push(
          `✓ ${nutrition.protein} г белка — в лимите`
        );
      } else {
        const difference =
          nutrition.protein -
          parsed.maxProtein;

        score -= Math.min(
          25,
          difference
        );

        reasons.push(
          `~ ${nutrition.protein} г белка — на ${Math.round(
            difference
          )} выше лимита`
        );
      }
    }


    if (parsed.protein) {
      requiredCriteria += 1;

      if (
        recipeInfo.includes(
          "высокобелков"
        ) ||
        recipeInfo.includes(
          "белков"
        ) ||
        recipeInfo.includes(
          "protein"
        )
      ) {
        matchedCriteria += 1;
        score += 45;

        reasons.push(
          "✓ высокобелковое"
        );
      } else if (
        nutrition.protein >= 25
      ) {
        matchedCriteria += 1;
        score += 25;

        reasons.push(
          "✓ хороший уровень белка"
        );
      } else {
        score -= 15;

        reasons.push(
          "~ белка меньше желаемого"
        );
      }
    }


    /* =====================================================
       4. TIME — SOFT PREFERENCE
    ===================================================== */

    if (
      parsed.maxTime !== null
    ) {
      requiredCriteria += 1;

      if (
        recipeTime <=
        parsed.maxTime
      ) {
        matchedCriteria += 1;
        score += 45;

        reasons.push(
          `✓ ${recipeTime} мин — укладывается в время`
        );
      } else {
        const difference =
          recipeTime -
          parsed.maxTime;

        score -= Math.min(
          24,
          difference * 0.8
        );

        reasons.push(
          `~ ${recipeTime} мин — на ${Math.round(
            difference
          )} мин дольше желаемого`
        );
      }
    }


    if (
      parsed.minTime !== null
    ) {
      requiredCriteria += 1;

      if (
        recipeTime >=
        parsed.minTime
      ) {
        matchedCriteria += 1;
        score += 20;

        reasons.push(
          `✓ ${recipeTime} мин — подходит по времени`
        );
      } else {
        const difference =
          parsed.minTime -
          recipeTime;

        score -= Math.min(
          15,
          difference * 0.6
        );

        reasons.push(
          `~ ${recipeTime} мин — быстрее минимального времени`
        );
      }
    }


    /* =====================================================
       5. DIETS
    ===================================================== */

    if (parsed.vegetarian) {
      requiredCriteria += 1;

      if (
        recipeInfo.includes(
          "вегетариан"
        ) ||
        recipeInfo.includes(
          "vegetarian"
        )
      ) {
        matchedCriteria += 1;
        score += 45;

        reasons.push(
          "✓ вегетарианское"
        );
      } else {
        score -= 45;

        reasons.push(
          "✕ не вегетарианское"
        );
      }
    }


    if (parsed.keto) {
      requiredCriteria += 1;

      if (
        recipeInfo.includes("кето") ||
        recipeInfo.includes("keto")
      ) {
        matchedCriteria += 1;
        score += 45;

        reasons.push(
          "✓ кето"
        );
      } else {
        score -= 45;

        reasons.push(
          "✕ не кето"
        );
      }
    }


    if (parsed.quick) {
      requiredCriteria += 1;

      if (recipeTime <= 30) {
        matchedCriteria += 1;
        score += 35;

        reasons.push(
          "✓ до 30 минут"
        );
      } else {
        const difference =
          recipeTime - 30;

        score -= Math.min(
          20,
          difference * 0.7
        );

        reasons.push(
          `~ ${recipeTime} мин — дольше 30 минут`
        );
      }
    }


    /* =====================================================
       6. FREE TEXT
    ===================================================== */

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


    /* =====================================================
       7. MATCH PERCENT
       Ingredients are mandatory; the percentage describes
       how well the remaining preferences are satisfied.
    ===================================================== */

    const ingredientPercent =
      parsed.ingredients.length > 0
        ? (
            matchedIngredients /
            parsed.ingredients.length
          ) * 100
        : 100;

    const preferencePercent =
      requiredCriteria > 0
        ? (
            matchedCriteria /
            requiredCriteria
          ) * 100
        : 100;

    const matchPercent =
      Math.round(
        parsed.ingredients.length > 0
          ? (
              ingredientPercent * 0.6 +
              preferencePercent * 0.4
            )
          : preferencePercent
      );


    return {
      recipe,
      score,
      reasons,
      matchPercent,
      matchedIngredients,
      totalIngredients:
        parsed.ingredients.length,
      matchedCriteria,
      totalCriteria:
        requiredCriteria
    };
  }

  

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


    const smartSummary =
      getSmartSearchSummary();

    if (title) {
      if (
        smartSummary &&
        smartSummary.ingredients.length
      ) {
        title.textContent =
          "Лучшие совпадения";
      } else {
        title.textContent =
          state.currentSearch.trim()
            ? "Результаты поиска"
            : "Рецепты";
      }
    }


    if (count) {
      const smartSummary =
        getSmartSearchSummary();

      if (
        smartSummary &&
        smartSummary.ingredients.length
      ) {
        count.textContent =
          `${recipes.length} ${
            getRecipeWord(
              recipes.length
            )
          } · ингредиенты совпадают`;
      } else {
        count.textContent =
          `${recipes.length} ${
            getRecipeWord(
              recipes.length
            )
          }`;
      }
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
            Все указанные ингредиенты должны быть
            в рецепте. А калории, белок и время
            RecipePro подбирает как лучшие совпадения.
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

      const matchPercent =
        Number(
          smartResult.matchPercent
        ) || 0;

      smartReasonHtml = `
        <div class="smart-match-box">

          <div class="smart-match-head">

            <span class="smart-match-label">
              Почему подходит
            </span>

            <strong class="smart-match-percent">
              ${matchPercent}%
            </strong>

          </div>

          <div class="smart-match-reasons">
            ${reasons
              .map(
                (reason) =>
                  `<div class="smart-match-reason">${escapeHtml(
                    reason
                  )}</div>`
              )
              .join("")}
          </div>

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
        applyActiveFilter(
          getAllRecipes()
        );
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
        `${recipe.time} мин`;
    }


    if (calories) {
      calories.textContent =
        `${nutrition.calories} ккал`;
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
          "Рецепт дня";
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

              return `
                <li>

                  <span>
                    ${escapeHtml(
                      productName
                    )}
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

  function openAdaptRecipeDialog(
    recipeId
  ) {
    const recipe =
      getRecipeById(
        recipeId
      );

    if (!recipe) {
      alert(
        "Не удалось найти рецепт для адаптации."
      );

      return;
    }


    const request =
      window.prompt(
        `Как изменить рецепт «${recipe.title}»?\n\nМожно указать несколько условий сразу:\n\n• На 2 порции\n• До 500 ккал\n• Минимум 40 г белка\n• Максимум 30 минут\n• Больше белка\n• Менее калорийный\n• Без картофеля\n• Замени курицу на индейку\n\nНапример:\n«Сделай на 2 порции, до 500 ккал, больше белка и максимум 30 минут»`,
        "Сделай рецепт более белковым"
      );


    if (
      request === null
    ) {
      return;
    }


    if (
      !normalizeText(
        request
      )
    ) {
      alert(
        "Напишите, как нужно изменить рецепт."
      );

      return;
    }


    const adapted =
      adaptRecipe(
        recipe,
        request
      );


    if (!adapted) {
      alert(
        "Не удалось создать адаптированную версию рецепта."
      );

      return;
    }


    state.userRecipes.push(
      adapted
    );

    saveUserData();


    closeRecipeModal();

    renderRecipes();
    renderMyRecipes();
    renderHero();


    let message =
      "Готово! Адаптированная версия сохранена в «Мои рецепты».";


    if (
      Array.isArray(
        adapted.adaptationWarnings
      ) &&
      adapted.adaptationWarnings.length
    ) {
      message +=
        "\n\nОбрати внимание:\n• " +
        adapted.adaptationWarnings.join(
          "\n• "
        );
    }


    alert(
      message
    );


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
    warnings
  ) {
    let nutrition =
      calculateIngredientsNutrition(
        ingredients,
        servings
      );


    if (
      nutrition.calories <=
      targetCalories
    ) {
      return nutrition;
    }


    let changed = false;


    /*
      Этап 1.
      Сильно уменьшаем калорийные добавки.
    */

    ingredients
      .filter(
        (ingredient) =>
          isCalorieDenseProduct(
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
      );


    nutrition =
      calculateIngredientsNutrition(
        ingredients,
        servings
      );


    if (changed) {
      addChange(
        changes,
        "снижены калорийные ингредиенты"
      );
    }


    if (
      nutrition.calories <=
      targetCalories
    ) {
      return nutrition;
    }


    /*
      Этап 2.
      Уменьшаем углеводную основу.
    */

    changed = false;


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
            0.75
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


    nutrition =
      calculateIngredientsNutrition(
        ingredients,
        servings
      );


    if (changed) {
      addChange(
        changes,
        "уменьшена углеводная основа"
      );
    }


    if (
      nutrition.calories <=
      targetCalories
    ) {
      return nutrition;
    }


    /*
      Этап 3.
      Дополнительно уменьшаем некритичные продукты.
      Белок не уменьшаем.
    */

    changed = false;


    ingredients
      .filter(
        (ingredient) =>
          !isProteinProduct(
            ingredient.product
          ) &&
          !isCalorieDenseProduct(
            ingredient.product
          ) &&
          !isCarbHeavyProduct(
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


    nutrition =
      calculateIngredientsNutrition(
        ingredients,
        servings
      );


    if (changed) {
      addChange(
        changes,
        "дополнительно уменьшены второстепенные ингредиенты"
      );
    }


    /*
      Этап 4.
      Если есть очень калорийный углеводный продукт,
      пробуем уменьшить его ещё сильнее.
    */

    if (
      nutrition.calories >
      targetCalories
    ) {
      ingredients
        .filter(
          (ingredient) =>
            isCarbHeavyProduct(
              ingredient.product
            )
        )
        .forEach(
          (ingredient) => {
            if (
              nutrition.calories >
              targetCalories
            ) {
              reduceIngredient(
                ingredient,
                0.8
              );

              nutrition =
                calculateIngredientsNutrition(
                  ingredients,
                  servings
                );
            }
          }
        );


      addChange(
        changes,
        "дополнительно скорректировано количество углеводных продуктов"
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
        warnings
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
            warnings
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

        <option value="г">
          г
        </option>

        <option value="мл">