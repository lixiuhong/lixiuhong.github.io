import { readdirSync, copyFileSync, mkdirSync, existsSync } from "fs";
import { join, extname } from "path";

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf"];
const DATA_DIR = "data";
const TARGET_DIR = join("public", "data");

if (!existsSync(DATA_DIR)) process.exit(0);

if (!existsSync(TARGET_DIR)) mkdirSync(TARGET_DIR, { recursive: true });

const files = readdirSync(DATA_DIR);
let copied = 0;

for (const file of files) {
  if (IMAGE_EXTS.includes(extname(file).toLowerCase())) {
    copyFileSync(join(DATA_DIR, file), join(TARGET_DIR, file));
    copied++;
  }
}

if (copied > 0) {
  console.log(`Synced ${copied} asset(s) from data/ to public/data/`);
}
