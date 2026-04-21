import { readdirSync, copyFileSync, mkdirSync, existsSync, statSync } from "fs";
import { join, extname } from "path";

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf"];
const DATA_DIR = "data";
const TARGET_DIR = join("public", "data");

if (!existsSync(DATA_DIR)) process.exit(0);

if (!existsSync(TARGET_DIR)) mkdirSync(TARGET_DIR, { recursive: true });

let copied = 0;

function syncDir(srcDir, destDir) {
  if (!existsSync(srcDir)) return;
  const entries = readdirSync(srcDir);
  for (const entry of entries) {
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, entry);
    if (statSync(srcPath).isDirectory()) {
      syncDir(srcPath, destPath);
    } else if (IMAGE_EXTS.includes(extname(entry).toLowerCase())) {
      if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
      copyFileSync(srcPath, destPath);
      copied++;
    }
  }
}

syncDir(DATA_DIR, TARGET_DIR);

if (copied > 0) {
  console.log(`Synced ${copied} asset(s) from data/ to public/data/`);
}
