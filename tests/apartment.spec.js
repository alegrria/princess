import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function english(page) {
  await page.goto("/?lang=en");
}
async function fillEnquiry(page) {
  await page
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Alex Test");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("alex@example.com");
  await page
    .getByLabel("Preferred move-in", { exact: true })
    .fill("2030-04-01");
  await page
    .getByLabel("Preferred move-out", { exact: true })
    .fill("2030-07-01");
  await page.getByLabel("Reason for your temporary stay").selectOption("0");
  await page.getByRole("checkbox").check();
}
async function noSpamDelay(page) {
  await page.route("**/data/apartment.js", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      /minFormSeconds:\s*2/,
      "minFormSeconds: 0",
    );
    await route.fulfill({ response, body });
  });
}

test("German first page has correct facts, real images and no automatic third-party requests", async ({
  page,
}) => {
  const external = [];
  page.on("request", (req) => {
    if (
      !req.url().startsWith("http://127.0.0.1:4174") &&
      !req.url().startsWith("data:")
    )
      external.push(req.url());
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.locator("h1")).toContainText("Ankommen.");
  await expect(page.locator(".hero")).toContainText("31,75");
  await expect(page.locator(".hero")).toContainText("3 Monate");
  await expect(page.locator(".hero")).toContainText("Wird ergänzt");
  await expect(page.locator(".hero")).not.toContainText("Berlin");
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(
    await page
      .locator(".hero-photo img")
      .evaluate((img) => img.complete && img.naturalWidth > 0),
  ).toBe(true);
  expect(external).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("gallery filters, navigation, escape and focus restoration work", async ({
  page,
}) => {
  await english(page);
  await page.getByRole("button", { name: "Kitchen", exact: true }).click();
  await expect(page.locator(".gallery-grid figure:visible")).toHaveCount(1);
  await page.locator(".gallery-grid figure:visible button").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#lightbox-caption")).toContainText("3 / 3");
  await page.getByRole("button", { name: "Next image" }).click();
  await expect(page.locator("#lightbox-caption")).toContainText("1 / 3");
  await page.getByRole("dialog").press("ArrowLeft");
  await expect(page.locator("#lightbox-caption")).toContainText("3 / 3");
  await page.getByRole("dialog").press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.locator(".gallery-grid figure:visible button"),
  ).toBeFocused();
});

test("swiping changes the lightbox image", async ({ page }) => {
  await english(page);
  await page.locator(".hero-photo button").click();
  const img = page.locator(".lightbox-image");
  await img.dispatchEvent("pointerdown", {
    clientX: 250,
    clientY: 200,
    pointerType: "touch",
  });
  await img.dispatchEvent("pointerup", {
    clientX: 100,
    clientY: 205,
    pointerType: "touch",
  });
  await expect(page.locator("#lightbox-caption")).toContainText("2 / 3");
});

test("calendar selection prefills the enquiry and survives a language switch", async ({
  page,
}) => {
  await english(page);
  await page.locator("#availability-start").fill("2030-04-01");
  await page.locator("#availability-end").fill("2030-07-01");
  await page.getByRole("button", { name: "Ask about these dates" }).click();
  await expect(
    page.getByLabel("Preferred move-in", { exact: true }),
  ).toHaveValue("2030-04-01");
  await expect(
    page.getByLabel("Preferred move-out", { exact: true }),
  ).toHaveValue("2030-07-01");
  await page
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Alex Test");
  await page.getByRole("button", { name: "DE", exact: true }).click();
  await expect(
    page.getByLabel("Gewünschter Einzug", { exact: true }),
  ).toHaveValue("2030-04-01");
  await expect(
    page.getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Alex Test");
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
});

test("short and reversed calendar requests are not staged", async ({
  page,
}) => {
  await english(page);
  await page.locator("#availability-start").fill("2030-04-01");
  await page.locator("#availability-end").fill("2030-05-01");
  await page.getByRole("button", { name: "Ask about these dates" }).click();
  await expect(page.locator("#calendar-status")).toContainText(
    "at least 3 months",
  );
  await expect(
    page.getByLabel("Preferred move-in", { exact: true }),
  ).toBeEmpty();
  await page.locator("#availability-end").fill("2030-03-01");
  await page.getByRole("button", { name: "Ask about these dates" }).click();
  await expect(page.locator("#calendar-status")).toContainText("after move-in");
});

test("enquiry validates fields and downloads an honest draft without POST requests", async ({
  page,
}) => {
  await noSpamDelay(page);
  await english(page);
  const posts = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.url());
  });
  await page.getByRole("button", { name: "Download enquiry draft" }).click();
  expect(
    await page
      .getByRole("textbox", { name: "Name", exact: true })
      .evaluate((input) => input.validity.valueMissing),
  ).toBe(true);
  await fillEnquiry(page);
  await page.getByLabel("Your message").fill("Temporary research visit.");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download enquiry draft" }).click();
  const download = await downloadEvent;
  const content = await readFile(await download.path(), "utf8");
  expect(content).toContain("Alex Test");
  expect(content).toContain("2030-04-01");
  expect(content).toContain("DRAFT — NOT SENT");
  await expect(page.locator("#form-status")).toContainText("has not been sent");
  expect(posts).toEqual([]);
  await page.getByRole("button", { name: "Download enquiry draft" }).click();
  await expect(page.locator("#form-error")).toContainText("wait briefly");
});

test("honeypot stops a completed enquiry", async ({ page }) => {
  await noSpamDelay(page);
  await english(page);
  await fillEnquiry(page);
  await page.locator("[name=website]").evaluate((el) => (el.value = "spam"));
  await page.getByRole("button", { name: "Download enquiry draft" }).click();
  await expect(page.locator("#form-error")).toContainText(
    "could not be processed",
  );
  await expect(page.locator("#form-status")).toBeEmpty();
});

test("configured submission failure preserves data, success requires acceptance", async ({
  page,
}) => {
  await page.route("**/data/apartment.js", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body: (await response.text())
        .replace(/endpoint:\s*null/, 'endpoint: "/api/inquiry"')
        .replace(/minFormSeconds:\s*2/, "minFormSeconds: 0"),
    });
  });
  let accepted = false;
  await page.route("**/api/inquiry", (route) =>
    route.fulfill({
      status: accepted ? 200 : 503,
      contentType: "application/json",
      body: JSON.stringify({ accepted }),
    }),
  );
  await english(page);
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.locator("#form-error")).toContainText("could not be sent");
  await expect(
    page.getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Alex Test");
  accepted = true;
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.locator("#form-status")).toContainText("Thank you");
});

test("map is opt-in and removable", async ({ page }) => {
  await page.route("https://www.openstreetmap.org/**", (route) =>
    route.fulfill({ body: "<p>Map fixture</p>", contentType: "text/html" }),
  );
  await english(page);
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Load map", exact: true }).click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "title",
    "Map of the approximate area in Hamburg-Billstedt",
  );
  await page.getByRole("button", { name: "Remove map" }).click();
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("legal sections and public checklist work without exposing tenant files", async ({
  page,
  request,
}) => {
  await english(page);
  await expect(page.locator("#documents a[download]")).toHaveCount(1);
  const pdf = await request.get("/documents/move-in-checklist.pdf");
  expect(pdf.ok()).toBe(true);
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
  await page.getByRole("link", { name: "Legal notice", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Legal notice");
  await expect(page.locator("main")).toContainText("To be added");
  await page.getByRole("link", { name: "Back to the apartment" }).click();
  await expect(page.locator("h1")).toContainText("Settle in.");
  await page.goto("/datenschutz/?lang=en");
  await expect(page.locator("h1")).toHaveText("Privacy information");
});

test("metadata includes social image and apartment facts without invented offers", async ({
  page,
  request,
}) => {
  await english(page);
  await expect(page).toHaveTitle(/Hamburg-Billstedt/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    /Hamburg-Billstedt/,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/images\/social.jpg$/,
  );
  const schema = JSON.parse(
    await page.locator('script[type="application/ld+json"]').textContent(),
  );
  expect(schema.floorSize.value).toBe(31.75);
  expect(schema.offers).toBeUndefined();
  expect((await request.get("/images/social.jpg")).ok()).toBe(true);
});

test("copy listing uses the configured canonical origin", async ({ page }) => {
  await page.context().grantPermissions(["clipboard-write", "clipboard-read"]);
  await english(page);
  await page.getByRole("button", { name: "Share apartment" }).click();
  await expect(page.locator("#share-status")).toHaveText("Link copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "the-linden-flat.bmbbnthtnh.chatgpt.site/?lang=en",
  );
});
