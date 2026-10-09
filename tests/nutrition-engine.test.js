const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });

for (const file of ["JS/products.js", "JS/nutrition-engine.js"]) {
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
  const result = engine.calculateRecipe({
    servings: 2,
    ingredients: [
      { product: "курица", amount: 100, state: "raw", amountBasis: "raw" },
      { product: "масло", amount: 10, state: "raw", pantry: true, required: false }
    ]
  });

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
