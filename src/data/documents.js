// Static hosting is NOT access control. Never place personal applicant/tenant files in public/.
export const documents = [
  {
    id: "contract",
    access: "applicant",
    format: "PDF",
    file: null,
    version: null,
  },
  {
    id: "handover",
    access: "tenant",
    format: "PDF",
    file: null,
    version: null,
  },
  {
    id: "inventory",
    access: "tenant",
    format: "PDF",
    file: null,
    version: null,
  },
  {
    id: "registration",
    access: "tenant",
    format: "PDF",
    file: null,
    version: null,
  },
  { id: "deposit", access: "tenant", format: "PDF", file: null, version: null },
  {
    id: "checklist",
    access: "public",
    format: "PDF",
    file: "/documents/move-in-checklist.pdf",
    version: "2026-09",
  },
  { id: "house", access: "tenant", format: "PDF", file: null, version: null },
];
export function publicDocumentFile(doc) {
  return doc.access === "public" && doc.file ? doc.file : null;
}
