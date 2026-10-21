/**
 * Downloads generated images and writes optimized WebP files to public/images.
 * Usage: npx tsx scripts/fetch-images.ts <list.json>
 * where list.json is [{ "file": "hero-a5", "url": "https://..." }, ...]
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

type Item = { file: string; url: string };

const OUT_DIR = path.resolve("public/images");
const MAX_WIDTH = 1800;

async function main() {
  const listPath = process.argv[2];
  if (!listPath) throw new Error("Pass the path to a JSON list of {file,url}");
  const items: Item[] = JSON.parse(await fs.readFile(listPath, "utf8"));
  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const item of items) {
    if (!/^[a-z0-9-]+$/.test(item.file)) throw new Error(`Bad file name: ${item.file}`);
    const response = await fetch(item.url);
    if (!response.ok) throw new Error(`${item.file}: HTTP ${response.status}`);
    const input = Buffer.from(await response.arrayBuffer());
    const out = path.join(OUT_DIR, `${item.file}.webp`);
    const info = await sharp(input)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(out);
    console.log(`${item.file}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
