import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist");
const files = [];
async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (/\.(html|js|css)$/.test(entry.name)) files.push(file);
  }
}
await collect(root);
for (const file of files) {
  const source = await readFile(file, "utf8");
  const result = source.replace(/(["'`])\/(?!\/)/g, "$1/princess/");
  if (result !== source) await writeFile(file, result);
}
console.log(`Prepared ${files.length} files for GitHub Pages at /princess/`);
