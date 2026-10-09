const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "..", "JS", "product-resolver.js"),
  "utf8"
);

function createResolver(remoteProduct) {
  const products = {};
  const storage = new Map();
  const context = vm.createContext({
    window: { products },
    localStorage: {
      getItem(key) { return storage.get(key) ?? null; },
      setItem(key, value) { storage.set(key, String(value)); },
      removeItem(key) { storage.delete(key); }
    },
    fetch: async () => ({
      ok: true,
      json: async () => ({ products: remoteProduct ? [remoteProduct] : [] })
    }),
    console,
    URL,
    encodeURIComponent
  });

  vm.runInContext(source, context, { filename: "JS/product-resolver.js" });
  return { resolver: context.window.recipeProProductResolver, products };
}

test("external products with missing macros are rejected instead of treating them as zero", async () => {
  const { resolver, products } = createResolver({
    code: "incomplete-1",
    product_name: "Mango",
    categories: "fruits",
    nutriments: {
      "energy-kcal_100g": 60,
      proteins_100g: 0.8,
      carbohydrates_100g: 15
    }
  });

  const result = await resolver.resolve("манго");

  assert.deepEqual(Array.from(result), []);
  assert.equal(Object.keys(products).length, 0);
});

test("external products with complete numeric macros are imported", async () => {
  const { resolver, products } = createResolver({
    code: "complete-1",
    product_name: "Mango",
    categories: "fruits",
    nutriments: {
      "energy-kcal_100g": 60,
      proteins_100g: 0.8,
      fat_100g: 0.4,
      carbohydrates_100g: 15
    }
  });

  const result = await resolver.resolve("манго");
  assert.equal(result.length, 1);

  const imported = products[result[0]];
  assert.equal(imported.raw.kcal, 60);
  assert.equal(imported.raw.protein, 0.8);
  assert.equal(imported.raw.fat, 0.4);
  assert.equal(imported.raw.carbs, 15);
  assert.equal(imported.source, "Open Food Facts");
});
