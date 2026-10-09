import { test, expect } from "@playwright/test";

function luminance(rgb: number[]) {
  const values = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

test("muted chapter titles and FAQ numbers remain readable", async ({
  page,
}) => {
  await page.goto("/about-us");
  const colors = await page
    .locator(
      '.story-index-list button[aria-pressed="false"], .story-question-number',
    )
    .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).color));
  expect(colors.length).toBeGreaterThan(5);
  for (const color of colors) {
    const foreground = luminance(color.match(/\d+/g)!.slice(0, 3).map(Number));
    const background = luminance([251, 251, 247]);
    expect((background + 0.05) / (foreground + 0.05)).toBeGreaterThanOrEqual(
      4.5,
    );
  }
  const question = page.locator("#question-0");
  await expect(question).toHaveAccessibleName("01 Where is Farm Natura?");
  await question.click();
  await expect(page.locator("#answer-0")).toBeVisible();
});

test("production security headers allow hydration, navigation and forms", async ({
  page,
  request,
  baseURL,
}) => {
  test.skip(!baseURL?.includes("4173"), "Production preview headers.");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const path of [
    "/about-us",
    "/natural-farming",
    "/farmhouses-for-sale-in-hyderabad",
    "/gallery",
  ]) {
    const response = await request.get(path);
    expect(response.headers()["content-security-policy"]).toContain(
      "script-src 'self'",
    );
    expect(response.headers()["x-frame-options"]).toBe("DENY");
    expect(response.headers()["cross-origin-opener-policy"]).toBe(
      "same-origin",
    );
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toBeVisible();
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator(".menu-footer .paper-button").click();
    await expect(page.getByLabel("Full name")).toBeVisible();
    await page.getByRole("button", { name: "Close enquiry" }).click();
  }
  await page.goto("/#story");
  await expect(page).toHaveURL(/\/about-us$/);
  await expect(page.locator("h1")).toBeVisible();
  expect(errors).toEqual([]);
});

test("Our Story does not download alternate page layouts or gallery layout animation", async ({
  page,
  baseURL,
}) => {
  test.skip(!baseURL?.includes("4173"), "Production chunk splitting.");
  const scripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url());
  });
  await page.goto("/about-us", { waitUntil: "networkidle" });
  expect(
    scripts.filter((url) =>
      /NaturalFarmingLayout|FarmLifeLayout|\/layout-/.test(url),
    ),
  ).toEqual([]);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("button", { name: /Natural Farming/ }).click();
  await expect(page).toHaveURL(/\/natural-farming$/);
  await expect(page.locator(".natural-farming-layout")).toBeVisible();
  expect(scripts.some((url) => /NaturalFarmingLayout/.test(url))).toBe(true);
});
