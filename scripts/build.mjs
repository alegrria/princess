import { cp, mkdir } from "node:fs/promises";
await mkdir("dist", { recursive: true });
for (const file of ["index.html", "style.css", "app.js", "photo-credits.txt"]) {
  await cp(`src/${file}`, `dist/${file}`);
}
console.log("Built apartment website in dist/");
