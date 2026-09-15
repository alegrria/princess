import { documents, publicDocumentFile } from "../data/documents.js";
import { officialLinks } from "../data/faq.js";
import { sectionHeading } from "./shared.js";
export function Documents(t) {
  return `<section class="section documents" id="documents"><div class="section-top">${sectionHeading(t.documents.eyebrow, t.documents.title)}<p class="small-copy">${t.documents.intro}</p></div><div class="document-grid">${documents.map((doc) => `<article><div class="doc-top"><span class="doc-icon">${doc.format}</span><span class="label">${t.documents[doc.access]}</span></div><h3>${t.documents.titles[doc.id]}</h3><p>${t.documents.descriptions[doc.id]}</p>${publicDocumentFile(doc) ? `<a class="text-link" href="${publicDocumentFile(doc)}" download>${t.documents.download} ↓</a><small>${t.documents.version} ${doc.version}</small>` : `<span class="doc-unavailable">${doc.access === "public" ? t.documents.pending : t.documents.protected}</span>`}</article>`).join("")}</div><div class="document-help"><a href="${officialLinks.broadcast}" target="_blank" rel="noopener noreferrer">${t.documents.broadcast} ↗</a><p>${t.documents.insurance}</p></div></section>`;
}
