const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const storage = new Map();

class StorageMock {
  setItem(key, value) { storage.set(String(key), String(value)); }
  getItem(key) { return storage.has(String(key)) ? storage.get(String(key)) : null; }
}

const windowMock = {
  __RECIPEPRO_TEST__: true,
  addEventListener() {},
  setTimeout,
  clearTimeout
};
const documentMock = {
  addEventListener() {},
  dispatchEvent() {},
  getElementById() { return null; },
  querySelector() { return null; },
  createElement() { return { setAttribute() {}, appendChild() {}, addEventListener() {}, classList: { add() {}, remove() {}, toggle() {} }, style: {} }; },
  body: { appendChild() {} },
  readyState: "loading"
};
const context = vm.createContext({
  window: windowMock,
  document: documentMock,
  localStorage: new StorageMock(),
  Storage: StorageMock,
  CustomEvent: class CustomEvent {},
  console,
  Map,
  Set,
  JSON,
  Date,
  AbortController,
  setTimeout,
  clearTimeout
});
vm.runInContext(fs.readFileSync(path.join(root, "JS/cloud-sync.js"), "utf8"), context, {
  filename: "JS/cloud-sync.js"
});
const cloud = windowMock.__RECIPEPRO_CLOUD_TEST__;

test("cloud sync merge keeps additions from both devices", () => {
  const base = [{ id: "a", grams: 100 }];
  const local = [...base, { id: "b", grams: 150 }];
  const remote = [...base, { id: "c", grams: 200 }];
  const merged = cloud.mergeThreeWay(base, local, remote);

  assert.deepEqual(JSON.parse(JSON.stringify(merged)), [
    { id: "a", grams: 100 },
    { id: "b", grams: 150 },
    { id: "c", grams: 200 }
  ]);
});

test("cloud sync merge preserves a deletion instead of restoring stale diary entries", () => {
  const base = [{ id: "potato", grams: 200 }, { id: "soup", grams: 300 }];
  const local = [{ id: "soup", grams: 300 }];
  const remote = base;
  const merged = cloud.mergeThreeWay(base, local, remote);

  assert.deepEqual(JSON.parse(JSON.stringify(merged)), [{ id: "soup", grams: 300 }]);
});

test("diary merge keeps entries from both devices and applies deletions per date", () => {
  const base = {
    "2026-10-14": [{ id: "potato", grams: 200 }, { id: "soup", grams: 300 }],
    "2026-10-15": [{ id: "apple", grams: 100 }]
  };
  const local = {
    "2026-10-14": [{ id: "soup", grams: 300 }],
    "2026-10-15": [{ id: "apple", grams: 100 }, { id: "pear", grams: 120 }]
  };
  const remote = {
    "2026-10-14": [...base["2026-10-14"], { id: "rice", grams: 180 }],
    "2026-10-15": base["2026-10-15"]
  };
  const merged = cloud.mergeDiaryThreeWay(base, local, remote);

  assert.deepEqual(JSON.parse(JSON.stringify(merged)), {
    "2026-10-14": [{ id: "soup", grams: 300 }, { id: "rice", grams: 180 }],
    "2026-10-15": [{ id: "apple", grams: 100 }, { id: "pear", grams: 120 }]
  });
});

test("daily targets merge independent field edits from two devices", () => {
  const base = { calories: 2500, protein: 140, fat: 80, carbs: 150 };
  const local = { ...base, protein: 160 };
  const remote = { ...base, calories: 2300 };
  const merged = cloud.mergeGoalsThreeWay(base, local, remote);

  assert.deepEqual(JSON.parse(JSON.stringify(merged)), {
    calories: 2300, protein: 160, fat: 80, carbs: 150
  });
});

test("meal plan merge preserves independent meals and deleted meals", () => {
  const base = {
    "2026-10-15": {
      breakfast: [{ id: "oats" }],
      lunch: [{ id: "soup" }]
    }
  };
  const local = {
    "2026-10-15": {
      breakfast: [{ id: "oats" }]
    }
  };
  const remote = {
    "2026-10-15": {
      breakfast: [{ id: "oats" }],
      lunch: [{ id: "soup" }],
      dinner: [{ id: "fish" }]
    }
  };
  const merged = cloud.mergePlanThreeWay(base, local, remote);

  assert.deepEqual(JSON.parse(JSON.stringify(merged)), {
    "2026-10-15": {
      breakfast: [{ id: "oats" }],
      dinner: [{ id: "fish" }]
    }
  });
});
