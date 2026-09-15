import { amenities } from "../data/amenities.js";
import { sectionHeading } from "./shared.js";
export function Amenities(t) {
  return `<section class="section amenities" id="amenities"><div class="section-top">${sectionHeading(t.amenities.eyebrow, t.amenities.title)}<p class="small-copy">${t.amenities.intro}</p></div><div class="amenities-grid">${amenities.map((g, i) => `<details ${i === 0 ? "open" : ""}><summary>${t.amenities[g.id]}<span aria-hidden="true">+</span></summary><ul>${g.confirmed.map((x) => `<li><span aria-hidden="true">✓</span>${t.amenities.items[x]}</li>`).join("")}</ul><p class="label">${t.amenities.pending}</p><ul class="pending-list">${g.pending.map((x) => `<li>${t.amenities.items[x]}</li>`).join("")}</ul></details>`).join("")}</div></section>`;
}
