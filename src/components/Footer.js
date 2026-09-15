import { brand, cta } from "./shared.js";
export function Footer(t) {
  return `<footer><div class="footer-top"><a class="brand" href="#">${brand()}</a><p>${t.footer.line}</p>${cta(t)}</div><div class="footer-bottom"><span>${t.footer.copyright}</span><nav><button class="text-button" id="print-button">${t.footer.print}</button><a href="#impressum">${t.footer.legal}</a><a href="#datenschutz">${t.footer.privacy}</a></nav></div><p class="small-copy">${t.footer.draft}</p></footer><div class="mobile-sticky">${cta(t)}</div><p id="share-status" class="toast" role="status"></p>`;
}
