import { neighbourhood } from "../data/neighbourhood.js";
import { sectionHeading } from "./shared.js";
import { Map } from "./Map.js";
export function Neighbourhood(t) {
  return `<section class="section neighbourhood" id="neighbourhood"><div class="section-top">${sectionHeading(t.neighbourhood.eyebrow, t.neighbourhood.title)}<p class="small-copy">${t.neighbourhood.intro}</p></div><div class="neighbourhood-layout"><div class="places">${neighbourhood.points.map((p, i) => `<article><span class="place-number">0${i + 1}</span><div><h3>${t.neighbourhood[p.id].title}</h3><p>${t.neighbourhood[p.id].text}</p><a href="${p.url}" target="_blank" rel="noopener noreferrer">${t.neighbourhood[p.id].link} ↗</a></div></article>`).join("")}<p class="small-copy">${t.neighbourhood.note}</p></div>${Map(t)}</div></section>`;
}
