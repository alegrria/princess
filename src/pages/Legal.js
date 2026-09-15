import { apartment } from "../data/apartment.js";
import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { escape as e } from "../lib/html.js";
export function Legal(t, page) {
  const l = t.legal;
  return `${Header(t)}<main id="main" class="legal-page"><a class="text-link" href="#">← ${t.footer.back}</a><h1>${page === "impressum" ? t.footer.legal : l.privacyTitle}</h1><p class="legal-draft">${l.draft}</p>${
    page === "impressum"
      ? `<p>${l.imprintIntro}</p><dl>${[
          ["owner", "ownerName"],
          ["address", "serviceAddress"],
          ["email", "email"],
        ]
          .map(
            ([label, key]) =>
              `<div><dt>${l[label]}</dt><dd>${e(apartment.legal[key] || l.missing)}</dd></div>`,
          )
          .join("")}</dl>`
      : `<p>${l.privacyIntro}</p>${["hosting", "inquiry", "map", "storage", "rights"].map((key) => `<h2>${l[key + "Title"]}</h2><p>${l[key]}</p>`).join("")}`
  }</main>${Footer(t)}`;
}
