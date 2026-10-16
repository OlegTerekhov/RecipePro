const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const root = process.cwd();
const source = path.join(root, "icon-nutrio.svg");
const androidRes = path.join(root, "android", "app", "src", "main", "res");
const sizes = {
  "mipmap-mdpi": 48,
  "mipmap-hdpi": 72,
  "mipmap-xhdpi": 96,
  "mipmap-xxhdpi": 144,
  "mipmap-xxxhdpi": 192
};

async function main() {
  if (!fs.existsSync(source)) throw new Error("icon-nutrio.svg was not found.");
  const assetsDir = path.join(root, "assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  await sharp(source).resize(512, 512).png().toFile(path.join(assetsDir, "nutrio-icon-512.png"));

  for (const [folder, size] of Object.entries(sizes)) {
    const dir = path.join(androidRes, folder);
    if (!fs.existsSync(dir)) continue;
    for (const name of ["ic_launcher.png", "ic_launcher_round.png", "ic_launcher_foreground.png"]) {
      const output = path.join(dir, name);
      if (!fs.existsSync(output) && name === "ic_launcher_foreground.png") continue;
      await sharp(source).resize(size, size).png().toFile(output);
    }
  }

  const colorsFile = path.join(androidRes, "values", "ic_launcher_background.xml");
  if (fs.existsSync(colorsFile)) {
    const xml = fs.readFileSync(colorsFile, "utf8").replace(
      /(<color\s+name=["']ic_launcher_background["']\s*>)[\s\S]*?(<\/color>)/,
      "$1#20372f$2"
    );
    fs.writeFileSync(colorsFile, xml);
  }
  console.log("NUTRIO launcher icon and 512x512 store icon generated.");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
