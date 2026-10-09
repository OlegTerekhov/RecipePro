const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function createRecommendationEngine({ recipes, unknownCount = 0 }) {
  const window = {
    products: {
      chicken: { role: "protein", category: "protein" }
    },
    recipeProNutritionEngine: {
      calculateRecipe(recipe) {
        const nutrition = recipe.testNutrition || {};
        return {
          calories: Number(nutrition.calories || 0),
          protein: Number(nutrition.protein || 0),
          fat: 0,
          carbs: 0,
          unknownCount: Number(nutrition.unknownCount ?? unknownCount)
        };
      }
    },
    recipeProRecipeBuilder: {
      canBuildType(ids, type) {
        return Object.prototype.hasOwnProperty.call(recipes, type);
      },
      build(ids, intent) {
        const recipe = recipes[intent.type];
        if (!recipe) return null;
        return {
          title: recipe.title || intent.type,
          type: intent.type,
          time: recipe.time,
          servings: 1,
          ingredients: [{ product: "chicken", amount: 100 }],
          testNutrition: recipe.nutrition
        };
      }
    }
  };

  const context = vm.createContext({ window });
  const source = fs.readFileSync(path.join(root, "JS/recommendation-engine.js"), "utf8");
  vm.runInContext(source, context, { filename: "JS/recommendation-engine.js" });
  return context.window.recipeProRecommendationEngine;
}

test("recommendations exclude recipes that exceed the requested time limit", () => {
  const engine = createRecommendationEngine({
    recipes: {
      bowl: { time: 15, nutrition: { calories: 400, protein: 30, unknownCount: 0 } },
      salad: { time: 40, nutrition: { calories: 350, protein: 25, unknownCount: 0 } }
    }
  });

  const result = engine.recommend(["chicken"], { maxTime: 20 });

  assert.deepEqual(Array.from(result.candidates, item => item.recipe.type), ["bowl"]);
  assert.equal(result.warnings.length, 0);
});

test("recommendations warn when no recipe satisfies all numeric constraints", () => {
  const engine = createRecommendationEngine({
    recipes: {
      bowl: { time: 15, nutrition: { calories: 800, protein: 20, unknownCount: 0 } },
      salad: { time: 40, nutrition: { calories: 350, protein: 20, unknownCount: 0 } }
    }
  });

  const result = engine.recommend(["chicken"], { maxTime: 20, maxCalories: 500 });

  assert.equal(result.candidates.length, 2);
  assert.ok(["bowl", "salad"].includes(result.best.recipe.type));
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /не удалось найти рецепт/i);
});

test("incomplete nutrition data cannot satisfy a nutrition constraint", () => {
  const engine = createRecommendationEngine({
    recipes: {
      bowl: { time: 15, nutrition: { calories: 100, protein: 50, unknownCount: 1 } }
    }
  });

  const result = engine.recommend(["chicken"], { maxCalories: 500 });

  assert.equal(result.candidates.length, 1);
  assert.equal(result.best.recipe.nutritionUnknownCount, 1);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /не хватает данных о пищевой ценности/i);
});

test("incomplete nutrition does not block a time-only recommendation", () => {
  const engine = createRecommendationEngine({
    recipes: {
      bowl: { time: 15, nutrition: { calories: 100, protein: 50, unknownCount: 1 } }
    }
  });

  const result = engine.recommend(["chicken"], { maxTime: 20 });

  assert.equal(result.best.recipe.type, "bowl");
  assert.equal(result.warnings.length, 0);
});
