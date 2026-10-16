const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("food diary and cloud sync use the same persistent storage keys", () => {
  const diary = read("JS/food-diary.js");
  const sync = read("JS/cloud-sync.js");

  assert.match(diary, /const STORE\s*=\s*"recipepro_food_diary_v1"/);
  assert.match(diary, /\bGOALS\s*=\s*"recipepro_nutrition_goals_v1"/);
  assert.match(sync, /diary:\s*"recipepro_food_diary_v1"/);
  assert.match(sync, /goals:\s*"recipepro_nutrition_goals_v1"/);
});

test("the essential food diary controls exist in the shipped HTML", () => {
  const html = read("index.html");
  const requiredIds = [
    "rpDiaryDate", "rpFoodForm", "rpFoodProduct", "rpFoodGrams",
    "rpFoodState", "rpFoodMeal", "rpFoodLog", "rpClearDiaryBtn",
    "rpGoalsForm", "rpGoalCalories", "rpGoalProtein", "rpGoalFat",
    "rpGoalCarbs", "rpGoalsStatus"
  ];

  for (const id of requiredIds) {
    assert.match(html, new RegExp('id="' + id + '"'), "Missing HTML control: " + id);
  }
});

test("food diary rejects unknown products and invalid weights before saving", () => {
  const diary = read("JS/food-diary.js");

  assert.match(diary, /if\(!found\)/);
  assert.match(diary, /!Number\.isFinite\(grams\)\|\|grams<=0\|\|grams>10000/);
  assert.match(diary, /list\.push\(\{id,productId:found\.id/);
});

test("clearing the diary is scoped to the currently selected date", () => {
  const diary = read("JS/food-diary.js");

  assert.match(diary, /function entries\(\)\{const d=diary\(\);return Array\.isArray\(d\[date\(\)\]\)\?d\[date\(\)\]:\[\];\}/);
  assert.match(diary, /if\(entries\(\)\.length&&confirm\([\s\S]*?\)\)save\(\[\]\)/);
  assert.match(diary, /function save\(list\)\{const d=diary\(\);d\[date\(\)\]=list;/);
});

test("daily targets reject zero calories and negative or non-finite values", () => {
  const diary = read("JS/food-diary.js");

  assert.match(diary, /Object\.values\(g\)\.some\(v=>!Number\.isFinite\(v\)\|\|v<0\)\|\|g\.calories<=0/);
});

test("cloud save reads have a timeout and abort signal", () => {
  const sync = read("JS/cloud-sync.js");

  assert.match(sync, /const readController = new AbortController\(\)/);
  assert.match(sync, /setTimeout\(\(\) => readController\.abort\(\), 30000\)/);
  assert.match(sync, /abortSignal\(readController\.signal\)/);
  assert.match(sync, /clearTimeout\(readTimer\)/);
});

test("public client configuration contains no service-role or secret key assignment", () => {
  const config = read("JS/supabase-config.js");
  assert.doesNotMatch(config, /(?:service_role|sb_secret_)\s*[:=]\s*["'][^"']+["']/i);
  assert.match(config, /publishableKey\s*:/);
});

test("the app keeps dark theme as the first-visit default and preserves explicit preferences", () => {
  const html = read("index.html");
  const preferences = read("JS/preferences.js");

  assert.match(html, /<body data-theme="dark">/);
  assert.match(preferences, /recipepro_theme_v1/);
  assert.match(preferences, /localStorage\.getItem\(THEME_KEY\)/);
});


test("cloud sync abandons stale requests when the active account changes", () => {
  const sync = read("JS/cloud-sync.js");

  assert.match(sync, /currentUser\.id !== user\.id/);
  assert.match(sync, /currentUser\.id !== targetUser\.id/);
});
