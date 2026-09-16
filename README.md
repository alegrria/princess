# Princess — Kroogblöcke 2

A bilingual, mobile-first furnished-apartment SPA for **Kroogblöcke 2, Hamburg-Horn**, with an editorial clay/green/wood design. The private GitHub repository is [alegrria/princess](https://github.com/alegrria/princess).

## Run

Node.js 22+ and npm:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:4174**. `dev` builds the static page and starts the local server. After editing, run `npm run build` and refresh the browser. Open the HTTP URL rather than the HTML file directly: the application uses browser modules and root-relative asset paths.

```sh
npm run build       # Generate dist/ (no network required)
npm run preview     # Serve dist/
npm run check       # JavaScript syntax checks
npm run format      # Format source
npm run format:check
```

## One source of truth

| Change                                                      | Edit                                      |
| ----------------------------------------------------------- | ----------------------------------------- |
| Size, prices, rental terms, policies, contact, legal fields | `src/data/apartment.js`                   |
| Occupied/reserved periods and next availability             | `apartment.availability` in the same file |
| Gallery assets, categories, current/concept/example labels  | `src/data/gallery.js`                     |
| Confirmed and unconfirmed furnishings                       | `src/data/amenities.js`                   |
| Document metadata and access levels                         | `src/data/documents.js`                   |
| Map area, neighbourhood links and sources                   | `src/data/neighbourhood.js`               |
| FAQ order and official references                           | `src/data/faq.js`                         |
| German/English text and legal answers                       | `src/locales/de.js`, `src/locales/en.js`  |

`null` means **unconfirmed**, not zero. The site deliberately has no invented rent, deposit, availability, owner contact or policies. The proposed 3-month minimum / 6-month contract is labelled as subject to the final legally reviewed agreement. The Horn location should be verified with the exact district designation and nearest station before public release.

## Features

- German by default, English switch, local language preference, preserved in-memory enquiry drafts
- Statically rendered German HTML, crawlable legal routes, semantic apartment metadata and social sharing image
- Responsive AVIF/WebP images, category filters, modal gallery, swipe/keyboard navigation
- Monthly calendar with available/reserved/occupied/unknown states, range selection and enquiry prefilling
- Month-aware minimum-stay checks, end-exclusive reserved periods and no invented availability
- Lightweight enquiries without sensitive uploads
- Configurable enquiry delivery: local draft, email draft or a future HTTP endpoint
- Public bilingual move-in checklist; metadata for private documents without publicly exposing files
- Local fonts (system font stack), self-hosted imagery, no analytics, opt-in OpenStreetMap
- FAQ, amenities, neighbourhood resources, move-in steps and sticky mobile CTA
- Copy listing URL and a compact print stylesheet for an apartment exposé
- Feature-detected WebMCP tools: `read_apartment_availability`, `stage_inquiry_dates`

## Enquiries and spam controls

The default `contact.email` and `contact.endpoint` are `null`. The form downloads a text draft and explicitly says **nothing was sent**. Setting `contact.email` opens a mailto draft; the visitor sends it in their email application.

A configured `contact.endpoint` receives JSON and must respond with a successful HTTP status and `{ "accepted": true }`. Only then does the interface confirm receipt. Errors keep the visitor's input. The UI includes a honeypot, minimum completion time and a short retry cooldown. These are **client-side friction, not server security**. Before connecting a real endpoint, enforce validation, rate limits and bot protection on the server, define retention/access rules, and update the privacy notice. Never put an API secret in browser code.

## Availability

```js
availability: {
  status: 'occupied',
  availableFrom: '2027-04-01',
  periods: [
    { start: '2027-07-01', end: '2027-10-01', status: 'reserved' }
  ],
  updatedAt: '2027-01-15'
}
```

This is an example, not the apartment's actual availability. Period ends are exclusive. A selection is always an enquiry, never a booking or reservation. Unknown dates remain explicitly unconfirmed.

## Images and documents

`assets/originals/` contains editable original assets. `public/images/` contains the committed optimized outputs, so normal builds and CI do not need image processing. To regenerate after replacing originals:

```sh
npm run images
npm run build
```

Current hero imagery is an **AI design concept**, not a photo of this apartment or a promised future layout. Bedroom/kitchen photos are illustrative stock images. All are visibly labelled. Credits are in `public/photo-credits.txt`. Replace them with real apartment photos before advertising the finished property.

The checklist PDF is in `public/documents/`. Its source is `scripts/checklist.py` (Python + ReportLab, optional; not required to build/run the app).

**Access levels are metadata, not authentication.** Only public documents get download links. Do not put tenant/application files or personal information in `public/` or this repository. A future authenticated server must enforce private document access.

## Tests and CI

```sh
npx playwright install chromium
npm test
```

`npm test` runs Node unit tests and Playwright at desktop and mobile sizes. Coverage includes month/leap-year arithmetic, booking-range conflicts, unknown availability, translation parity, document access rules, gallery keyboard/swipe/focus, draft downloads, spam checks, calendar-to-form flow, language persistence, endpoint error/success states, opt-in maps, metadata, sharing, and responsive overflow.

GitHub Actions runs syntax checks and the same tests on pushes and pull requests. Failure reports/traces are retained as artifacts. External endpoint/map behaviour is mocked; tests never send real enquiries. Frontend checks cannot verify delivery by a future email/backend provider.

## Structure

```text
src/
  components/    Reusable rendering components
  data/          Apartment, gallery, availability, documents and neighbourhood
  lib/           Escaping, formatting and enquiry validation
  locales/       German and English dictionaries
  pages/         Home and legal views
  app.js         Browser interactions and routing
  style.css      Theme, responsive and print styles
public/          Public images and checklist
assets/originals/Source image assets
scripts/         Build, preview, checks and optional asset generation
 tests/          Unit and end-to-end tests
dist/            Generated output, not committed
```

## Public-release completion

The current site stays private with `noindex`. Before public advertising, add confirmed prices/dates, real photographs, contact details and final legal text. Confirm occupancy, pets, smoking, parking, laundry and exact furnishings. Complete operator/privacy information, review the rental terms, configure enquiry delivery, and then change `site.published` and hosting access deliberately. `site.origin` is the canonical URL used for sharing and metadata.

The current Sites project is tracked in `.openai/hosting.json`; reuse it rather than creating another one. Runtime credentials do not belong in Git.
