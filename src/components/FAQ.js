import { faq, officialLinks } from "../data/faq.js";
import { apartment } from "../data/apartment.js";
import { template, money, escape as e } from "../lib/html.js";
import { sectionHeading, availabilityText } from "./shared.js";
export function FAQ(t) {
  const a = apartment;
  const vars = {
    size: new Intl.NumberFormat(t.lang).format(a.size),
    minimum: a.rental.minimumMonths,
    standard: a.rental.standardContractMonths,
    deposit: money(a.pricing.deposit, t.lang) || t.pricing.toConfirm,
    availability: availabilityText(t),
  };
  return `<section class="section faq" id="faq"><div>${sectionHeading(t.faq.eyebrow, t.faq.title)}</div><div>${faq.map((id) => `<details><summary>${t.faq.questions[id]}<span aria-hidden="true">+</span></summary><p>${e(template(t.faq.answers[id], vars))}</p>${officialLinks[id] ? `<a href="${officialLinks[id]}" target="_blank" rel="noopener noreferrer">${t.faq.source} ↗</a>` : ""}</details>`).join("")}</div></section>`;
}
