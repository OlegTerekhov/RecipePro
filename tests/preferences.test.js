const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("dark theme is the default and an explicit light preference is preserved", () => {
  const html = read("index.html");
  const preferences = read("JS/preferences.js");
  const manifest = JSON.parse(read("manifest.webmanifest"));

  assert.match(html, /<body data-theme="dark">/);
  assert.match(html, /<meta name="theme-color" content="#111915">/);
  assert.match(preferences, /updateThemeButton\(localStorage\.getItem\(THEME_KEY\)==="light"\?"light":"dark"\)/);
  assert.match(preferences, /localStorage\.setItem\(THEME_KEY,next\)/);
  assert.equal(manifest.background_color, "#111915");
  assert.equal(manifest.theme_color, "#111915");
});
