import test from "node:test";
import assert from "node:assert/strict";
import {
  addMonths,
  validDate,
  dayStatus,
  validatePeriod,
} from "../src/data/availability.js";
import { apartment } from "../src/data/apartment.js";
import { publicDocumentFile } from "../src/data/documents.js";
import { validateInquiry } from "../src/lib/inquiry.js";
import de from "../src/locales/de.js";
import en from "../src/locales/en.js";
const unknown = { status: "unknown", availableFrom: null, periods: [] };
test("calendar month arithmetic handles leap years and short months", () => {
  assert.equal(addMonths("2028-01-31", 1), "2028-02-29");
  assert.equal(addMonths("2027-01-31", 1), "2027-02-28");
  assert.equal(addMonths("2027-11-30", 3), "2028-02-29");
  assert.equal(validDate("2027-02-30"), false);
  assert.equal(validDate("2028-02-29"), true);
});
test("unknown availability is never silently made available", () => {
  assert.equal(dayStatus("2030-04-01", unknown), "unknown");
  assert.equal(
    dayStatus("2030-04-01", { ...unknown, status: "occupied" }),
    "occupied",
  );
});
test("explicit availability and end-exclusive reservations are respected", () => {
  const config = {
    status: "occupied",
    availableFrom: "2030-04-01",
    periods: [{ start: "2030-06-01", end: "2030-07-01", status: "reserved" }],
  };
  assert.equal(dayStatus("2030-03-31", config), "occupied");
  assert.equal(dayStatus("2030-04-01", config), "available");
  assert.equal(dayStatus("2030-06-15", config), "reserved");
  assert.equal(dayStatus("2030-07-01", config), "available");
  assert.equal(
    validatePeriod("2030-04-01", "2030-07-01", config, "2030-01-01"),
    "blockedPeriod",
  );
  assert.equal(
    validatePeriod("2030-07-01", "2030-10-01", config, "2030-01-01"),
    null,
  );
});
test("dates require correct order, minimum stay and no past start", () => {
  assert.equal(
    validatePeriod("bad", "2030-06-01", unknown, "2030-01-01"),
    "invalidDate",
  );
  assert.equal(
    validatePeriod("2029-12-01", "2030-06-01", unknown, "2030-01-01"),
    "pastDate",
  );
  assert.equal(
    validatePeriod("2030-06-01", "2030-04-01", unknown, "2030-01-01"),
    "dateOrder",
  );
  assert.equal(
    validatePeriod("2030-04-01", "2030-06-01", unknown, "2030-01-01"),
    "minimumStay",
  );
  assert.equal(
    validatePeriod("2030-04-01", "2030-07-01", unknown, "2030-01-01"),
    null,
  );
});
test("private document access never returns a public file URL", () => {
  assert.equal(
    publicDocumentFile({ access: "tenant", file: "/private.pdf" }),
    null,
  );
  assert.equal(
    publicDocumentFile({ access: "applicant", file: "/private.pdf" }),
    null,
  );
  assert.equal(
    publicDocumentFile({ access: "public", file: "/checklist.pdf" }),
    "/checklist.pdf",
  );
});
test("honeypot and occupant count are validated", () => {
  const data = {
    start: "2030-04-01",
    end: "2030-07-01",
    occupants: "1",
    website: "",
  };
  assert.equal(
    validateInquiry({ ...data, website: "spam" }, apartment, "2030-01-01"),
    "bot",
  );
  assert.equal(
    validateInquiry({ ...data, occupants: "1.5" }, apartment, "2030-01-01"),
    "invalidOccupants",
  );
  assert.equal(
    validateInquiry({ ...data, occupants: "0" }, apartment, "2030-01-01"),
    "invalidOccupants",
  );
  assert.equal(validateInquiry(data, apartment, "2030-01-01"), null);
});
function keys(value, prefix = "") {
  return Object.entries(value)
    .flatMap(([key, v]) =>
      v && typeof v === "object"
        ? keys(v, `${prefix}${key}.`)
        : [`${prefix}${key}`],
    )
    .sort();
}
test("German and English translations have identical keys and placeholders", () => {
  assert.deepEqual(keys(de), keys(en));
  function walk(a, b) {
    for (const key of Object.keys(a)) {
      if (a[key] && typeof a[key] === "object") walk(a[key], b[key]);
      else
        assert.deepEqual(
          (String(a[key]).match(/\{\w+\}/g) || []).sort(),
          (String(b[key]).match(/\{\w+\}/g) || []).sort(),
        );
    }
  }
  walk(de, en);
});
