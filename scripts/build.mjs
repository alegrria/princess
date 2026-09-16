import { cp, mkdir, writeFile } from "node:fs/promises";
import { Home } from "../src/pages/Home.js";
import { Legal } from "../src/pages/Legal.js";
import { getLocale } from "../src/lib/locale.js";
const de = getLocale("de");
import { apartment } from "../src/data/apartment.js";
import { escape } from "../src/lib/html.js";
await mkdir("dist", { recursive: true });
for (const name of [
  "components",
  "data",
  "locales",
  "pages",
  "lib",
  "app.js",
  "style.css",
])
  await cp(`src/${name}`, `dist/${name}`, { recursive: true });
await cp("public", "dist", { recursive: true });
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="3" fill="#283c32"/><path d="M9 25V7h8c9 0 9 13 0 13h-4v5zm4-9h4c4 0 4-5 0-5h-4z" fill="#e8d6c9"/></svg>`;
const schema = {
  "@context": "https://schema.org",
  "@type": "Apartment",
  name: apartment.name,
  description: de.description,
  numberOfRooms: apartment.rooms,
  floorSize: {
    "@type": "QuantitativeValue",
    value: apartment.size,
    unitCode: "MTK",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: apartment.city,
    addressCountry: "DE",
  },
};
function html(content, title = de.title, path = "/") {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escape(title)}</title><meta name="description" content="${escape(de.description)}"><meta name="robots" content="${apartment.site.published ? "index,follow" : "noindex,nofollow"}"><link rel="canonical" href="${apartment.site.origin}${path}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(de.description)}"><meta property="og:url" content="${apartment.site.origin}${path}"><meta property="og:image" content="${apartment.site.origin}${apartment.site.socialImage}"><meta property="og:image:alt" content="The Princess — Kroogblöcke 2, Möbliertes Wohnen in Hamburg-Billstedt"><meta property="og:locale" content="de_DE"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(de.description)}"><meta name="twitter:image" content="${apartment.site.origin}${apartment.site.socialImage}"><link rel="icon" href="data:image/svg+xml,${encodeURIComponent(icon)}"><link rel="stylesheet" href="/style.css">${path === "/" ? '<link rel="preload" as="image" href="/images/concept-1280.avif" imagesrcset="/images/concept-640.avif 640w, /images/concept-1280.avif 1280w, /images/concept-1800.avif 1800w" imagesizes="(max-width: 700px) 100vw, 70vw" type="image/avif">' : ""}<script type="application/ld+json">${JSON.stringify(schema)}</script></head><body><div id="app">${content}</div><script type="module" src="/app.js"></script></body></html>`;
}
await writeFile("dist/index.html", html(Home(de)));
for (const route of ["impressum", "datenschutz"]) {
  await mkdir(`dist/${route}`, { recursive: true });
  await writeFile(
    `dist/${route}/index.html`,
    html(
      Legal(de, route),
      `${de.footer[route === "impressum" ? "legal" : "privacy"]} | The Princess`,
      `/${route}/`,
    ),
  );
}
await writeFile(
  "dist/robots.txt",
  `User-agent: *\n${apartment.site.published ? "Allow: /" : "Disallow: /"}\n`,
);
console.log(
  "Built static German page, legal routes and browser modules in dist/",
);
