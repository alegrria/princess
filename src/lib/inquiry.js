import { apartment } from "../data/apartment.js";
import { validatePeriod, isoDate } from "../data/availability.js";
export function validateInquiry(data, config = apartment, today = isoDate()) {
  if (data.website) return "bot";
  if (
    !Number.isInteger(Number(data.occupants)) ||
    Number(data.occupants) < 1 ||
    (config.policies.occupants &&
      Number(data.occupants) > config.policies.occupants)
  )
    return "invalidOccupants";
  return validatePeriod(data.start, data.end, config.availability, today);
}
export function enquiryText(data, t) {
  const f = t.inquiry;
  return `${f.subject}\n${f.draftLabel}\n\n${[
    ["name", f.name],
    ["email", f.email],
    ["phone", f.phone],
    ["start", f.start],
    ["end", f.end],
    ["occupants", f.occupants],
    ["occupation", f.occupation],
  ]
    .map(([key, label]) => `${label}: ${data[key] || "—"}`)
    .join(
      "\n",
    )}\n${f.reason}: ${f.reasons[Number(data.reason)] || ""}\n\n${data.message || ""}\n`;
}
