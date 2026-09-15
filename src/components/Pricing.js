import { apartment } from "../data/apartment.js";
import { money, template, escape as e } from "../lib/html.js";
import { sectionHeading, cta } from "./shared.js";
export function Pricing(t) {
  const a = apartment;
  return `<section class="pricing" id="pricing"><div>${sectionHeading(t.pricing.eyebrow, t.pricing.title)}<p>${t.pricing.intro}</p><div class="included-items">${t.pricing.items.map((x) => `<span>✓ ${x}</span>`).join("")}</div></div><div class="price-panel"><p class="label">${t.pricing.rent}</p><div class="price">${money(a.pricing.monthly, t.lang) || t.pricing.unknown}</div><span>${t.pricing.perMonth}</span><dl><div><dt>${t.pricing.deposit}</dt><dd>${money(a.pricing.deposit, t.lang) || t.pricing.toConfirm}</dd></div><div><dt>${t.pricing.minimum}</dt><dd>${template(t.hero.months, { n: a.rental.minimumMonths })}</dd></div><div><dt>${t.pricing.contract}</dt><dd>${template(t.hero.months, { n: a.rental.standardContractMonths })}</dd></div></dl>${a.pricing.extras.length ? `<p>${t.pricing.extras}: ${a.pricing.extras.map((x) => e(x)).join(", ")}</p>` : ""}${cta(t, "button button-light")}<p class="small-copy">${template(t.pricing.legal, { standard: a.rental.standardContractMonths, minimum: a.rental.minimumMonths })}</p></div></section>`;
}
