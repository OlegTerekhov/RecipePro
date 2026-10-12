const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("meal planner and shopping list are included in the page and offline cache", () => {
  const html = read("index.html");
  const worker = read("sw.js");
  assert.match(html, /id="rpMealPlanner"/);
  assert.match(html, /id="rpShoppingList"/);
  assert.match(html, /JS\/meal-planner\.js/);
  assert.match(html, /CSS\/meal-planner\.css/);
  assert.match(worker, /\.\/JS\/meal-planner\.js/);
  assert.match(worker, /\.\/CSS\/meal-planner\.css/);
});

test("planner and shopping list use persistent local storage", () => {
  const module = read("JS/meal-planner.js");
  assert.match(module, /recipepro_meal_plan/);
  assert.match(module, /recipepro_shopping_list/);
  assert.match(module, /function buildShopping\(/);
  assert.match(module, /function renderPlanner\(/);
  assert.match(module, /function renderShopping\(/);
  assert.match(module, /rpCopyShoppingBtn/);
  assert.match(module, /rpClearCheckedBtn/);
});

test("cloud schema and sync include meal plans and shopping lists", () => {
  const schema = read("supabase/schema.sql");
  const sync = read("JS/cloud-sync.js");
  assert.match(schema, /meal_plan jsonb not null default '\{\}'::jsonb/);
  assert.match(schema, /shopping_list jsonb not null default '\[\]'::jsonb/);
  assert.match(sync, /meal_plan: snapshot\.plan/);
  assert.match(sync, /shopping_list: snapshot\.shopping/);
  assert.match(sync, /mergePlanThreeWay\(baseline\.plan, local\.plan, cloud\.plan\)/);
  assert.match(sync, /STORAGE_KEYS\.shopping/);
});
