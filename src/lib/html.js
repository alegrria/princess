export function escape(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
export function template(value, vars = {}) {
  return value.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}
export function money(value, lang) {
  return value == null
    ? null
    : new Intl.NumberFormat(lang, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(value);
}
export function displayDate(value, lang) {
  return value
    ? new Intl.DateTimeFormat(lang, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(`${value}T12:00:00`))
    : null;
}
export function picture(
  photo,
  { hero = false, alt = "", className = "" } = {},
) {
  return `<picture class="${className}"><source type="image/avif" srcset="${photo.image}-640.avif 640w, ${photo.image}-1280.avif 1280w, ${photo.image}-1800.avif 1800w"><source type="image/webp" srcset="${photo.image}-640.webp 640w, ${photo.image}-1280.webp 1280w, ${photo.image}-1800.webp 1800w"><img src="${photo.image}-1280.webp" width="${photo.width}" height="${photo.height}" sizes="${hero ? "(max-width: 700px) 100vw, 70vw" : "(max-width: 700px) 100vw, 50vw"}" alt="${escape(alt)}" ${hero ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async"></picture>`;
}
