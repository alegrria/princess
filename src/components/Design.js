import { sectionHeading } from "./shared.js";
import { escape } from "../lib/html.js";
export function Design(t) {
  return `<section class="section design-story"><div>${sectionHeading(t.design.eyebrow, t.design.title)}</div><div><p class="lead">${escape(t.design.text)}</p></div></section>`;
}
