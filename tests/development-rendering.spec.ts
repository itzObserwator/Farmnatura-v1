import { test, expect } from "@playwright/test";

test("development story is visible before JavaScript", async ({
  browser,
  request,
  baseURL,
}) => {
  test.skip(baseURL?.includes("4173") ?? false, "Development renderer check");
  const response = await request.get("/about-us");
  const html = await response.text();
  expect(html).toContain('id="story-scene-heading"');
  expect(html).toContain('id="development-first-paint-styles"');
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto("/about-us");
  await expect(page).toHaveTitle("Our Story — Farm Natura");
  await expect(page.locator(".story-scene h1")).toBeVisible();
  await expect(page.locator(".story-scene h1")).toContainText(
    "A LITTLE CLOSER",
  );
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "https://www.farmnatura.in/about-us",
  );
  await context.close();
});

test("development hydration retains navigation and replaces initial CSS with live styles", async ({
  page,
  baseURL,
}) => {
  test.skip(baseURL?.includes("4173") ?? false, "Development renderer check");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const route of [
    "/about-us",
    "/natural-farming",
    "/farmhouses-for-sale-in-hyderabad",
    "/gallery",
  ]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("#development-first-paint-styles")).toHaveCount(
      0,
    );
    await expect(
      page.locator('style[data-vite-dev-id$="/src/styles.css"]'),
    ).toHaveCount(1);
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator(".menu-dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close menu" }).click();
  }
  expect(errors).toEqual([]);
});
