import { sectionHeading } from "./shared.js";
export function TenantProfile(t) {
  return `<section class="profile section"><div>${sectionHeading(t.profile.eyebrow, t.profile.title)}<p>${t.profile.intro}</p><p>${t.profile.detail}</p></div><div class="profile-uses">${t.profile.uses.map((x, i) => `<div><span>${String(i + 1).padStart(2, "0")}</span>${x}</div>`).join("")}<p class="small-copy">${t.profile.note}</p></div></section>`;
}
