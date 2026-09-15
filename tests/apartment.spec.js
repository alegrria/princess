import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  // Make tests independent of third-party photo and font availability.
  await page.route(
    /https:\/\/(images\.pexels\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//,
    (route) => route.abort(),
  );
  await page.goto("/");
});

test("shows rental details and fits the viewport", async ({ page }) => {
  await expect(page).toHaveTitle(/The Linden Flat/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A little more light.A lot more home.",
  );
  await expect(
    page.getByText("Sample listing · Photos are illustrative.", {
      exact: false,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("gallery cycles in both directions and closes with Escape", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Explore the gallery/ }).click();
  const gallery = page.locator("#gallery");
  await expect(gallery).toBeVisible();
  await expect(gallery).toContainText("01 / Living room");
  await page.getByRole("button", { name: "Previous photo" }).click();
  await expect(gallery).toContainText("03 / Kitchen");
  await gallery.press("ArrowRight");
  await expect(gallery).toContainText("01 / Living room");
  await page.getByRole("button", { name: "Next photo" }).click();
  await expect(gallery).toContainText("02 / Bedroom");
  await gallery.press("Escape");
  await expect(gallery).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: /Explore the gallery/ }),
  ).toBeFocused();
});

test("each room opens its matching image", async ({ page }) => {
  await page.locator('[data-photo="1"]').click();
  await expect(page.locator("#gallery")).toContainText("02 / Bedroom");
  await page.getByRole("button", { name: "Close gallery" }).click();
  await page.locator('[data-photo="2"]').click();
  await expect(page.locator("#gallery")).toContainText("03 / Kitchen");
});

test("validates the enquiry and downloads a draft without sending it", async ({
  page,
}) => {
  const outgoing = [];
  page.on("request", (request) => {
    if (request.method() === "POST") outgoing.push(request.url());
  });
  await page
    .getByRole("button", { name: "Arrange a viewing ↗", exact: true })
    .click();
  await page.getByRole("button", { name: /Download viewing enquiry/ }).click();
  await expect(page.locator("#form-status")).toBeEmpty();
  expect(
    await page
      .getByLabel("Your name", { exact: true })
      .evaluate((input) => input.validity.valueMissing),
  ).toBe(true);
  await page.getByLabel("Your name", { exact: true }).fill("Alex Test");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("alex@example.com");
  const date = new Date();
  date.setDate(date.getDate() + 7);
  await page
    .getByLabel("Preferred viewing date")
    .fill(date.toISOString().slice(0, 10));
  await page
    .getByLabel("A little about you")
    .fill("I would like an afternoon viewing.");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: /Download viewing enquiry/ }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("linden-viewing-enquiry.txt");
  const content = await readFile(await download.path(), "utf8");
  expect(content).toContain("Alex Test");
  expect(content).toContain("alex@example.com");
  expect(content).toContain("I would like an afternoon viewing.");
  expect(content).toContain("This has not been sent");
  await expect(page.getByRole("status")).toContainText(
    "Your enquiry file is ready",
  );
  expect(outgoing).toEqual([]);
});

test("does not allow a past viewing date", async ({ page }) => {
  await page
    .getByRole("button", { name: "Arrange a viewing ↗", exact: true })
    .click();
  const date = page.getByLabel("Preferred viewing date");
  await date.fill("2000-01-01");
  expect(await date.evaluate((input) => input.validity.rangeUnderflow)).toBe(
    true,
  );
});
