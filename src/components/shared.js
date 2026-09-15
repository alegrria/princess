import { apartment } from "../data/apartment.js";
import { escape as e, template, displayDate } from "../lib/html.js";
export const lines = (text) => e(text).replaceAll("\n", "<br>");
export const sectionHeading = (eyebrow, title) =>
  `<p class="eyebrow">${e(eyebrow)}</p><h2>${lines(title)}</h2>`;
export const cta = (t, cls = "button") =>
  `<a class="${cls}" href="#inquiry">${e(t.cta)} <span aria-hidden="true">↗</span></a>`;
export function availabilityText(t) {
  const a = apartment.availability;
  return a.availableFrom
    ? template(a.status === "available" ? t.status.from : t.status.next, {
        date: displayDate(a.availableFrom, t.lang),
      })
    : t.status[a.status];
}
export function badge(t) {
  return `<span class="availability-badge ${apartment.availability.status}"><span aria-hidden="true"></span>${e(availabilityText(t))}</span>`;
}
export const brand = () =>
  `<span class="brand-word">${e(apartment.nickname)}<span class="brand-star" aria-hidden="true">✳</span></span><span class="brand-caption">${e(apartment.name.toUpperCase())} · ${e(apartment.city.toUpperCase())}</span>`;
