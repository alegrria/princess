import { escape as e } from "../lib/html.js";
import { brand, cta } from "./shared.js";
export function Header(t) {
  return `<a class="skip-link" href="#main">${e(t.nav.skip)}</a><header class="site-header"><a href="#" class="brand" aria-label="${e(t.nav.home)}">${brand()}</a><nav class="desktop-nav" aria-label="${e(t.nav.menu)}"><a href="#apartment">${t.nav.apartment}</a><a href="#availability">${t.nav.availability}</a><a href="#neighbourhood">${t.nav.area}</a></nav><div class="header-actions"><div class="language" aria-label="Language / Sprache"><button data-lang="de" aria-pressed="${t.lang === "de"}" lang="de">DE</button><span aria-hidden="true">/</span><button data-lang="en" aria-pressed="${t.lang === "en"}" lang="en">EN</button></div><button id="menu-button" class="menu-button" aria-expanded="false" aria-controls="mobile-menu">${t.nav.menu} <span aria-hidden="true">☰</span></button></div></header><nav id="mobile-menu" class="mobile-menu" hidden aria-label="${t.nav.menu}">${[
    ["apartment", "apartment"],
    ["availability", "availability"],
    ["neighbourhood", "area"],
    ["documents", "documents"],
    ["faq", "faq"],
  ]
    .map(([id, key]) => `<a href="#${id}">${t.nav[key]}</a>`)
    .join("")}${cta(t)}</nav>`;
}
