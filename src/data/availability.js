import { apartment } from "./apartment.js";
export const availability = apartment.availability;
export function isoDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.valueOf()) && isoDate(date) === value;
}
export function addMonths(value, months) {
  const date = new Date(`${value}T12:00:00`),
    day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  date.setDate(
    Math.min(
      day,
      new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
    ),
  );
  return isoDate(date);
}
export function dayStatus(date, config = availability) {
  const period = config.periods.find((p) => date >= p.start && date < p.end);
  if (period) return period.status;
  if (config.availableFrom && date >= config.availableFrom) return "available";
  if (config.availableFrom && date < config.availableFrom)
    return ["occupied", "reserved"].includes(config.status)
      ? config.status
      : "unknown";
  return config.status;
}
export function validatePeriod(
  start,
  end,
  config = availability,
  today = isoDate(),
) {
  if (!validDate(start) || !validDate(end)) return "invalidDate";
  if (start < today) return "pastDate";
  if (end <= start) return "dateOrder";
  if (end < addMonths(start, apartment.rental.minimumMonths))
    return "minimumStay";
  if (
    config.periods.some(
      (p) =>
        ["occupied", "reserved"].includes(p.status) &&
        start < p.end &&
        end > p.start,
    )
  )
    return "blockedPeriod";
  if (config.availableFrom && start < config.availableFrom)
    return "beforeAvailability";
  // Unknown future dates are enquiries, never confirmed bookings.
  return null;
}
