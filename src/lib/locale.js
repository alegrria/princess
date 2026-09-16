import de from "../locales/de.js";
import en from "../locales/en.js";
import { apartment } from "../data/apartment.js";
import { template } from "./html.js";
// Resolve shared factual values once. Component-specific placeholders remain intact.
export function getLocale(lang = "de", config = apartment) {
  const values = {
    name: config.name,
    nickname: config.nickname,
    city: config.city,
    district: config.district,
    size: new Intl.NumberFormat(lang).format(config.size),
  };
  const resolve = (value) =>
    typeof value === "string"
      ? template(value, values)
      : Array.isArray(value)
        ? value.map(resolve)
        : Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, resolve(item)]),
          );
  return resolve(lang === "en" ? en : de);
}
