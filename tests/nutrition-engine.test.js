const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: { __RECIPEPRO_TEST__: true }, document: { readyState: "loading", addEventListener() {} } });

for (const file of ["JS/products.js", "JS/nutrition-engine.js", "JS/food-diary.js", "JS/recipes.js"]) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  vm.runInContext(source, context, { filename: file });
}

const engine = context.window.recipeProNutritionEngine;

test("raw chicken nutrition uses the product database", () => {
  const result = engine.calculateIngredient({
    product: "курица",
    amount: 100,
    state: "raw"
  });

  assert.equal(result.calories, 120);
  assert.equal(result.protein, 23);
  assert.equal(result.fat, 2.6);
  assert.equal(result.carbs, 0);
  assert.equal(result.known, true);
});

test("cooked weight is converted to its raw equivalent", () => {
  const result = engine.calculateIngredient({
    product: "курица",
    amount: 150,
    state: "cooked"
  });

  assert.equal(result.rawEquivalent, 200);
  assert.equal(result.calories, 240);
  assert.equal(result.protein, 46);
});

test("frying oil is included when an ingredient is marked as raw-weight based", () => {
  const result = engine.calculateIngredient({
    product: "курица",
    amount: 100,
    amountBasis: "raw",
    state: "fried",
    oilPer100: 5
  });

  assert.ok(Math.abs(result.calories - 164.95) < 0.01);
  assert.ok(Math.abs(result.fat - 7.595) < 0.01);
  assert.equal(result.oilAmount, 5);
});

test("explicit oil is counted once and not added again as frying oil", () => {
  const recipe = {
    servings: 2,
    ingredients: [
      { product: "курица", amount: 100, state: "raw", amountBasis: "raw" },
      { product: "масло", amount: 10, state: "raw", pantry: true, required: false }
    ]
  };
  const friedRecipe = engine.setCookingState(recipe, "fried");
  const result = engine.calculateRecipe(friedRecipe);

  assert.ok(Math.abs(result.calories - 209.9) < 0.01);
  assert.equal(result.unknownCount, 0);
  assert.equal(result.perServing.calories, 105);
});

test("salt, pepper and water do not count as unknown nutrition data", () => {
  const result = engine.calculateRecipe({
    servings: 1,
    ingredients: [
      { product: "соль", amount: 2, pantry: true, required: false },
      { product: "pepper", amount: 1, pantry: true, required: false },
      { product: "water", amount: 250, pantry: true, required: false },
      { product: "курица", amount: 100, state: "raw" }
    ]
  });

  assert.equal(result.unknownCount, 0);
  assert.equal(result.calories, 120);
});

test("unknown products are surfaced instead of silently treated as known", () => {
  const result = engine.calculateRecipe({
    servings: 1,
    ingredients: [
      { product: "unknown-product", amount: 100 }
    ]
  });

  assert.equal(result.unknownCount, 1);
  assert.equal(result.details[0].known, false);
});

test("per-serving values divide totals by the requested serving count", () => {
  const result = engine.calculateRecipe({
    servings: 2,
    ingredients: [
      { product: "курица", amount: 200, state: "raw", amountBasis: "raw" }
    ]
  });

  assert.equal(result.calories, 240);
  assert.equal(result.perServing.calories, 120);
  assert.equal(result.perServing.protein, 23);
});


test("cooked rice converts cooked grams back to dry-weight nutrition", () => {
  const result = engine.calculateIngredient({
    product: "рис",
    amount: 280,
    state: "boiled"
  });

  assert.equal(result.rawEquivalent, 100);
  assert.equal(result.calories, 360);
  assert.equal(result.protein, 7);
  assert.equal(result.carbs, 79);
});

test("cooked buckwheat converts cooked grams back to dry-weight nutrition", () => {
  const result = engine.calculateIngredient({
    product: "гречка",
    amount: 250,
    state: "cooked"
  });

  assert.equal(result.rawEquivalent, 100);
  assert.equal(result.calories, 343);
  assert.equal(result.protein, 13.6);
  assert.equal(result.carbs, 71.5);
});

test("ingredient quantities that are negative or non-numeric never create negative nutrition", () => {
  for (const amount of [-100, "not-a-number", null]) {
    const result = engine.calculateIngredient({
      product: "курица",
      amount,
      state: "raw"
    });

    assert.equal(result.calories, 0);
    assert.equal(result.protein, 0);
    assert.equal(result.fat, 0);
    assert.equal(result.carbs, 0);
  }
});

test("unknown product remains explicitly unknown", () => {
  const result = engine.calculateIngredient({
    product: "неизвестный продукт",
    amount: 100,
    state: "raw"
  });

  assert.equal(result.known, false);
  assert.equal(result.calories, 0);
});


test("every local product has complete non-negative nutrition values and a positive cooking ratio", () => {
  for (const [id, product] of Object.entries(context.window.products)) {
    assert.ok(product.name && product.name.trim(), id + " must have a display name");
    for (const field of ["kcal", "protein", "fat", "carbs"]) {
      assert.ok(Number.isFinite(product.raw?.[field]), id + " must have numeric " + field);
      assert.ok(product.raw[field] >= 0, id + " must not have negative " + field);
    }
    assert.ok(Number.isFinite(product.cookedWeightRatio) && product.cookedWeightRatio > 0,
      id + " must have a positive cooking ratio");
  }
});

test("generic fish is not silently mapped to salmon", () => {
  const salmon = context.window.products["лосось"];
  assert.ok(!salmon.aliases.some(alias => alias.toLowerCase().replace(/ё/g, "е") === "рыба"));
  assert.equal(engine.calculateIngredient({
    product: "рыба",
    amount: 100,
    state: "raw"
  }).known, false);
});

test("diary product matching rejects generic and ambiguous phrases", () => {
  const resolver = context.window.recipeProFoodDiary.findProduct;
  assert.equal(resolver("рыба"), null);
  assert.equal(resolver("курица с рисом"), null);
  assert.equal(resolver("курица").id, "курица");
  assert.equal(resolver("курица 100 г").id, "курица");
});


test("raw tuna and shrimp reference USDA raw-food records", () => {
  const tuna = context.window.products["тунец"];
  const shrimp = context.window.products["креветки"];
  assert.deepEqual(
    [tuna.raw.kcal, tuna.raw.protein, tuna.raw.fat, tuna.raw.carbs],
    [109, 24.4, 0.5, 0]
  );
  assert.equal(tuna.nutritionSource.fdcId, "175159");
  assert.deepEqual(
    [shrimp.raw.kcal, shrimp.raw.protein, shrimp.raw.fat, shrimp.raw.carbs],
    [85, 20.1, 0.5, 0]
  );
  assert.equal(shrimp.nutritionSource.fdcId, "175179");
  assert.equal(tuna.cookedWeightRatio, 0.82);
  assert.equal(shrimp.cookedWeightRatio, 0.86);
});

test("all published recipes reference known products and supported units", () => {
  const products = context.window.products;
  const recipes = context.window.recipes;
  assert.equal(recipes.length, 8);
  const allowedUnits = new Set(["г", "гр", "грамм", "грамма", "граммов", "мл", "шт"]);
  for (const recipe of recipes) {
    assert.ok(recipe.title && recipe.title.trim(), recipe.id + " needs a title");
    assert.ok(Number.isFinite(recipe.servings) && recipe.servings > 0, recipe.id + " needs servings");
    assert.ok(Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0, recipe.id + " needs ingredients");
    assert.ok(Array.isArray(recipe.steps) && recipe.steps.length > 0, recipe.id + " needs steps");
    for (const ingredient of recipe.ingredients) {
      assert.ok(products[ingredient.product], recipe.id + " references unknown product " + ingredient.product);
      assert.ok(Number.isFinite(ingredient.amount) && ingredient.amount > 0, recipe.id + " has invalid amount");
      assert.ok(allowedUnits.has(ingredient.unit), recipe.id + " has unsupported unit " + ingredient.unit);
    }
  }
});

test("recipes that explicitly fry ingredients include cooking oil in their nutrition", () => {
  const recipes = context.window.recipes;
  for (const id of ["chicken-potato", "omelet-cheese-tomato", "rice-chicken", "pasta-chicken"]) {
    const recipe = recipes.find(item => item.id === id);
    assert.ok(recipe.ingredients.some(item => item.product === "масло"), id + " must count the oil described in its cooking steps");
  }
});

test("oatmeal with banana and milk is not mislabeled as a low-calorie recipe", () => {
  const recipe = context.window.recipes.find(item => item.id === "oatmeal-banana");
  assert.ok(!recipe.filters.includes("calories"));
});
