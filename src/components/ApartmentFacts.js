import { apartment } from "../data/apartment.js";
import { template } from "../lib/html.js";
import { sectionHeading } from "./shared.js";
export function ApartmentFacts(t) {
  return `<section class="section overview" id="apartment"><div>${sectionHeading(t.overview.eyebrow, t.overview.title)}</div><div class="overview-copy"><p class="lead">${template(t.overview.text, { size: new Intl.NumberFormat(t.lang).format(apartment.size) })}</p><p>${t.overview.detail}</p></div><div class="fact-strip">${t.overview.facts.map((s, i) => `<div><span class="fact-icon" aria-hidden="true">${["⌂", "⌑", "♧", "⌁", "✓", "↳"][i]}</span><span>${s}</span></div>`).join("")}</div></section>`;
}
