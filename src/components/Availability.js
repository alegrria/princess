import { apartment } from "../data/apartment.js";
import { isoDate, dayStatus } from "../data/availability.js";
import { displayDate, escape as e } from "../lib/html.js";
import { sectionHeading, badge } from "./shared.js";
export function calendarMarkup(
  t,
  month = new Date(),
  selection = { start: "", end: "" },
) {
  const year = month.getFullYear(),
    m = month.getMonth(),
    first = (new Date(year, m, 1).getDay() + 6) % 7,
    last = new Date(year, m + 1, 0).getDate(),
    today = isoDate();
  let cells = '<span class="calendar-empty"></span>'.repeat(first);
  for (let d = 1; d <= last; d++) {
    const date = isoDate(new Date(year, m, d)),
      status = dayStatus(date),
      blocked = date < today || ["reserved", "occupied"].includes(status);
    cells += `<button type="button" data-date="${date}" data-status="${status}" class="calendar-day ${status} ${date === selection.start || date === selection.end ? "selected" : ""} ${selection.start && selection.end && date > selection.start && date < selection.end ? "in-range" : ""}" ${blocked ? "disabled" : ""} aria-label="${e(displayDate(date, t.lang))}, ${e(t.status[status])}" aria-pressed="${date === selection.start || date === selection.end}">${d}</button>`;
  }
  return `<div class="calendar-header"><button type="button" data-month="-1" aria-label="${t.availability.prev}" ${year === new Date().getFullYear() && m <= new Date().getMonth() ? "disabled" : ""}>←</button><h3 aria-live="polite">${new Intl.DateTimeFormat(t.lang, { month: "long", year: "numeric" }).format(month)}</h3><button type="button" data-month="1" aria-label="${t.availability.next}">→</button></div><div class="calendar-weekdays">${t.availability.weekdays.map((d) => `<span>${d}</span>`).join("")}</div><div class="calendar-days">${cells}</div>`;
}
export function Availability(t) {
  return `<section class="section availability-section" id="availability"><div>${sectionHeading(t.availability.eyebrow, t.availability.title)}${badge(t)}<p>${t.availability.intro}</p><p class="small-copy">${t.status.noDate && !apartment.availability.availableFrom ? t.status.noDate : ""}</p><div class="calendar-legend">${["available", "reserved", "occupied", "unknown"].map((s) => `<span><i class="${s}"></i>${t.status[s]}</span>`).join("")}</div><p class="small-copy">${t.availability.hint}</p></div><div class="calendar-panel"><div id="calendar" role="group" aria-label="${t.availability.calendar}">${calendarMarkup(t)}</div><p class="small-copy">${t.availability.select}</p><div class="date-inputs"><label>${t.availability.start}<input type="date" id="availability-start" min="${isoDate()}"></label><label>${t.availability.end}<input type="date" id="availability-end" min="${isoDate()}"></label></div><p id="calendar-status" role="status">${t.availability.empty}</p><button id="ask-dates" class="button">${t.availability.ask} <span aria-hidden="true">↗</span></button><button id="clear-dates" class="text-button">${t.availability.reset}</button></div></section>`;
}
