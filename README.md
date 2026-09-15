# Princess

A responsive apartment rental SPA, currently branded “Linden Flat”, built with semantic HTML, CSS, and vanilla JavaScript. No frontend runtime dependencies.

## Run locally

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4174.

## Build and preview

```sh
npm run build
npm run preview
```

The build copies authored files from `src/` into `dist/`. Any static host can serve `dist/`; Sites hosting configuration is in `.openai/hosting.json`.

## Tests

```sh
npx playwright install chromium
npm run check
npm test
```

Playwright tests run the built app at desktop and mobile sizes. They cover gallery navigation, direct room selection, keyboard dismissal and focus restoration, form validation, past-date rejection, enquiry downloads, and viewport overflow. External stock photos and fonts are blocked during tests to keep the suite deterministic. GitHub Actions runs checks and tests on every push and pull request, retaining reports on failures.

## Project structure

```text
src/                   Editable page, styles, scripts and photo credits
scripts/               Static build and local HTTP server
tests/                 End-to-end application tests
playwright.config.js   Desktop and mobile browser configuration
.github/workflows/     Continuous integration
dist/                  Generated site
```

## Features

- Responsive apartment presentation, amenities, neighbourhood link and itemized rental costs
- Three-photo modal gallery with arrow-key controls
- Accessible native dialogs and HTML form validation
- Viewing enquiry exported as a text file, with no server submission
- Optional WebMCP tool to open the enquiry form

## Customize before using as a real listing

All apartment facts, Berlin location, prices and availability are sample content in `src/index.html`. Replace them with confirmed information. Replace the illustrative photo URLs in `src/app.js` with actual apartment images; stock photo credits are in `src/photo-credits.txt`. Fonts currently load from Google Fonts.

The enquiry form downloads a draft locally. It does **not** send email, reserve a viewing or persist personal information. Connect a real recipient/backend before offering live enquiries and update the explanatory copy accordingly.
