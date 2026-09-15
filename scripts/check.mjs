import { readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
async function check(dir) {
  for (const file of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${file.name}`;
    if (file.isDirectory()) await check(path);
    else if (/\.(js|mjs)$/.test(path))
      execFileSync(process.execPath, ["--check", path], { stdio: "inherit" });
  }
}
await check("src");
await check("scripts");
console.log("JavaScript syntax checked");
