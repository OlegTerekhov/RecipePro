/* =========================================================
   RECIPEPRO — SMART SEARCH ENGINE
   js/search.js
   ========================================================= */

window.RecipeSearch = (() => {
  /* -------------------------------------------------------
     Нормализация текста
  ------------------------------------------------------- */

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[.,!?;:()[\]{}"]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* -------------------------------------------------------
     Синонимы и ключевые слова
  ------------------------------------------------------- */

  const keywordMap = {
    protein: [
      "белковое",
      "белковый",
      "белковая",
      "много белка",
      "высокобелковое",
      "высокобелковый",
      "протеиновое",
      "протеиновый"
    ],

    vegetarian: [
      "вегетарианское",
      "вегетарианский",
      "вегетарианская",
      "без мяса"
    ],

    keto: [
      "кето",
      "кетогенное",
      "кетогенная",
      "низкоуглеводное",
      "мало углеводов"
    ],

    quick: [
      "быстро",
      "быстрое",
      "быстрый",
      "быстрая",
      "на скорую руку",
      "за полчаса"
    ],

    lowCalories: [
      "низкокалорийное",
      "низкокалорийный",
      "легкое",
      "легкая",
      "для похудения",
      "диетическое",
      "диетический"
    ]
  };

  /* -------------------------------------------------------
     Поиск ключевого слова
  ------------------------------------------------------- */

  function containsAny(text, words) {
    return words.some(word => text.includes(word));
  }

  /* -------------------------------------------------------
     Извлечение числовых ограничений
     
     Поддерживаем:
       до 600 ккал
       меньше 600 ккал
       максимум 600 ккал
       не больше 600 ккал

       от 40 г белка
       минимум 40 г белка
       больше 40 белка

       до 30 минут
       максимум 30 мин
  ------------------------------------------------------- */

  function parseNumber(text, patterns) {
    for (const pattern of patterns) {
      const match = text.match(pattern);

      if (match && match[1]) {
        const value = Number(match[1]);

        if (Number.isFinite(value)) {
          return value;
        }
      }
    }

    return null;
  }

  function parseConstraints(query) {
    const text = normalizeText(query);

    const maxCalories = parseNumber(text, [
      /(?:до|меньше|максимум|не больше|не более)\s*(\d+(?:[.,]\d+)?)\s*(?:ккал|калорий|кал)/i,
      /(\d+(?:[.,]\d+)?)\s*(?:ккал|калорий|кал)\s*(?:максимум|макс)/i
    ]);

    const minCalories = parseNumber(text, [
      /(?:от|больше|минимум|не меньше|не менее)\s*(\d+(?:[.,]\d+)?)\s*(?:ккал|калорий|кал)/i
    ]);

    const maxTime = parseNumber(text, [
      /(?:до|меньше|максимум|не больше|не более)\s*(\d+(?:[.,]\d+)?)\s*(?:минут|минуты|мин|м)/i,
      /(\d+(?:[.,]\d+)?)\s*(?:минут|минуты|мин|м)\s*(?:максимум|макс)/i
    ]);

    const minTime = parseNumber(text, [
      /(?:от|больше|минимум|не меньше|не менее)\s*(\d+(?:[.,]\d+)?)\s*(?:минут|минуты|мин|м)/i
    ]);

    const minProtein = parseNumber(text, [
      /(?:от|больше|минимум|не меньше|не менее)\s*(\d+(?:[.,]\d+)?)\s*(?:г|гр|грамм)?\s*(?:белка|протеина)/i,
      /(?:белка|протеина)\s*(?:от|больше|минимум|не меньше|не менее)\s*(\d+(?:[.,]\d+)?)/i
    ]);

    const maxProtein = parseNumber(text, [
      /(?:до|меньше|максимум|не больше|не более)\s*(\d+(?:[.,]\d+)?)\s*(?:г|гр|грамм)?\s*(?:белка|протеина)/i,
      /(?:белка|протеина)\s*(?:до|меньше|максимум|не больше|не более)\s*(\d+(?:[.,]\d+)?)/i
    ]);

    return {
      maxCalories,
      minCalories,
      maxTime,
      minTime,
      minProtein,
      maxProtein,

      protein: containsAny(text, keywordMap.protein),
      vegetarian: containsAny(text, keywordMap.vegetarian),
      keto: containsAny(text, keywordMap.keto),
      quick: containsAny(text, keywordMap.quick),
      lowCalories: containsAny(text, keywordMap.lowCalories)
    };
  }

  /* -------------------------------------------------------
     Проверяем текстовые условия
  ------------------------------------------------------- */

  function matchesCategory(recipe, constraints) {
    const filters = Array.isArray(recipe.filters)
      ? recipe.filters
      : [];

    const tags = Array.isArray(recipe.tags)
      ? recipe.tags.map(normalizeText)
      : [];

    if (constraints.protein) {
      const isProtein =
        filters.includes("protein") ||
        tags.some(tag =>
          tag.includes("белков")
        );

      if (!isProtein) {
        return false;
      }
    }

    if (constraints.vegetarian) {
      const isVegetarian =
        filters.includes("vegetarian") ||
        tags.some(tag =>
          tag.includes("вегетариан")
        );

      if (!isVegetarian) {
        return false;
      }
    }

    if (constraints.keto) {
      const isKeto =
        filters.includes("keto") ||
        tags.some(tag =>
          tag.includes("кето")
        );

      if (!isKeto) {
        return false;
      }
    }

    return true;
  }

  /* -------------------------------------------------------
     Проверяем время
  ------------------------------------------------------- */

  function matchesTime(recipe, constraints) {
    const time = Number(recipe.time);

    if (!Number.isFinite(time)) {
      return true;
    }

    if (
      constraints.maxTime !== null &&
      time > constraints.maxTime
    ) {
      return false;
    }

    if (
      constraints.minTime !== null &&
      time < constraints.minTime
    ) {
      return false;
    }

    if (
      constraints.quick &&
      time > 30
    ) {
      return false;
    }

    return true;
  }

  /* -------------------------------------------------------
     Проверяем КБЖУ
     
     Nutrition берём из RecipePro.
     app.js позже передаст готовый расчёт.
  ------------------------------------------------------- */

  function matchesNutrition(recipe, constraints, nutritionGetter) {
    if (
      constraints.maxCalories === null &&
      constraints.minCalories === null &&
      constraints.minProtein === null &&
      constraints.maxProtein === null &&
      !constraints.lowCalories
    ) {
      return true;
    }

    if (typeof nutritionGetter !== "function") {
      return true;
    }

    const nutrition = nutritionGetter(recipe);

    if (!nutrition) {
      return true;
    }

    const calories = Number(nutrition.calories) || 0;
    const protein = Number(nutrition.protein) || 0;

    if (
      constraints.maxCalories !== null &&
      calories > constraints.maxCalories
    ) {
      return false;
    }

    if (
      constraints.minCalories !== null &&
      calories < constraints.minCalories
    ) {
      return false;
    }

    if (
      constraints.minProtein !== null &&
      protein < constraints.minProtein
    ) {
      return false;
    }

    if (
      constraints.maxProtein !== null &&
      protein > constraints.maxProtein
    ) {
      return false;
    }

    if (
      constraints.lowCalories &&
      calories > 600
    ) {
      return false;
    }

    return true;
  }

  /* -------------------------------------------------------
     Проверяем ингредиенты
  ------------------------------------------------------- */

  function recipeContainsIngredients(recipe, query) {
    if (!Array.isArray(recipe.ingredients)) {
      return true;
    }

    const text = normalizeText(query);

    const ingredientNames = recipe.ingredients
      .map(item => {
        const product = window.products?.[item.product];

        if (!product) {
          return item.product;
        }

        return [
          product.name,
          ...(product.aliases || []),
          item.product
        ].join(" ");
      })
      .map(normalizeText);

    const availableProducts = Object.values(
      window.products || {}
    );

    const requestedIngredients = [];

    availableProducts.forEach(product => {
      const names = [
        product.name,
        ...(product.aliases || [])
      ].map(normalizeText);

      if (
        names.some(name =>
          name &&
          text.includes(name)
        )
      ) {
        requestedIngredients.push(
          ...names
        );
      }
    });

    if (!requestedIngredients.length) {
      return true;
    }

    return requestedIngredients.every(requested =>
      ingredientNames.some(recipeIngredient =>
        recipeIngredient.includes(requested) ||
        requested.includes(recipeIngredient)
      )
    );
  }

  /* -------------------------------------------------------
     Главная функция поиска
  ------------------------------------------------------- */

  function search(recipes, query, nutritionGetter) {
    if (!Array.isArray(recipes)) {
      return [];
    }

    const text = normalizeText(query);

    if (!text) {
      return recipes;
    }

    const constraints = parseConstraints(text);

    return recipes.filter(recipe => {
      if (
        !matchesCategory(
          recipe,
          constraints
        )
      ) {
        return false;
      }

      if (
        !matchesTime(
          recipe,
          constraints
        )
      ) {
        return false;
      }

      if (
        !matchesNutrition(
          recipe,
          constraints,
          nutritionGetter
        )
      ) {
        return false;
      }

      if (
        !recipeContainsIngredients(
          recipe,
          text
        )
      ) {
        return false;
      }

      return true;
    });
  }

  /* -------------------------------------------------------
     Определяем, является ли запрос умным
  ------------------------------------------------------- */

  function isSmartQuery(query) {
    const text = normalizeText(query);

    if (!text) {
      return false;
    }

    const constraints = parseConstraints(text);

    return Boolean(
      constraints.maxCalories !== null ||
      constraints.minCalories !== null ||
      constraints.maxTime !== null ||
      constraints.minTime !== null ||
      constraints.minProtein !== null ||
      constraints.maxProtein !== null ||
      constraints.protein ||
      constraints.vegetarian ||
      constraints.keto ||
      constraints.quick ||
      constraints.lowCalories
    );
  }

  /* -------------------------------------------------------
     Человекочитаемое описание условий
  ------------------------------------------------------- */

  function describe(query) {
    const constraints = parseConstraints(query);
    const result = [];

    if (constraints.maxCalories !== null) {
      result.push(
        `до ${constraints.maxCalories} ккал`
      );
    }

    if (constraints.minCalories !== null) {
      result.push(
        `от ${constraints.minCalories} ккал`
      );
    }

    if (constraints.maxProtein !== null) {
      result.push(
        `до ${constraints.maxProtein} г белка`
      );
    }

    if (constraints.minProtein !== null) {
      result.push(
        `от ${constraints.minProtein} г белка`
      );
    }

    if (constraints.maxTime !== null) {
      result.push(
        `до ${constraints.maxTime} мин`
      );
    }

    if (constraints.minTime !== null) {
      result.push(
        `от ${constraints.minTime} мин`
      );
    }

    if (constraints.protein) {
      result.push("высокобелковое");
    }

    if (constraints.vegetarian) {
      result.push("вегетарианское");
    }

    if (constraints.keto) {
      result.push("кето");
    }

    if (constraints.quick) {
      result.push("быстрое");
    }

    if (constraints.lowCalories) {
      result.push("низкокалорийное");
    }

    return result;
  }

  /* -------------------------------------------------------
     API
  ------------------------------------------------------- */

  return {
    normalizeText,
    parseConstraints,
    search,
    isSmartQuery,
    describe
  };
})();