import { test, expect } from "@playwright/test";
import { pageMetadata, routePaths } from "../src/data/routes";

test("new page has source content, legal enquiries and navigation", async ({
  page,
  request,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(routePaths.impact);
  await expect(page).toHaveTitle(pageMetadata.impact.title);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Involve.Indulge.Impact",
  );
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "https://www.farmnatura.in" + routePaths.impact,
  );
  await expect(page.locator(".impact-benefit")).toHaveCount(4);
  await expect(page.locator(".impact-plot")).toHaveCount(3);
  await expect(page.locator(".impact-legal-list li")).toHaveCount(6);
  await expect(page.locator("#impact-hmda-heading")).toContainText(
    "Farm Land Within HMDA Limits",
  );
  await expect(page.locator(".impact-profile")).toHaveCount(2);
  await expect(page.locator(".impact-award")).toHaveCount(7);
  await page.locator(".impact-inspirations").scrollIntoViewIfNeeded();
  for (const portrait of await page.locator(".impact-profile img").all()) {
    await expect
      .poll(() =>
        portrait.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 1,
        ),
      )
      .toBe(true);
  }
  await page.screenshot({ path: info.outputPath("impact-inspirations.png") });
  for (const award of await page.locator(".impact-award").all()) {
    await award.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        award
          .locator("img")
          .evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 1,
          ),
      )
      .toBe(true);
  }

  await page.screenshot({ path: info.outputPath("impact-hero.png") });
  await page.locator(".impact-plot-section").scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("impact-plots.png") });
  await page.locator(".impact-legal").scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("impact-legal.png") });
  await page.getByRole("button", { name: "REQUEST LEGAL KIT" }).click();
  await expect(
    page.getByRole("heading", { name: "Request legal documentation" }),
  ).toBeVisible();
  await page.getByLabel("Full name").fill("Sravan");
  await page.getByLabel("Email address").fill("sravan@example.com");
  await page.getByLabel("Phone number").fill("9999999999");
  await page
    .getByLabel("Interested in", { exact: true })
    .selectOption("Farm Plots");
  await page.getByLabel("Looking for plot size").selectOption({ index: 1 });
  await page.evaluate(() => {
    window.open = (url) => {
      (window as any).enquiryUrl = String(url);
      return null;
    };
  });
  await page.getByRole("button", { name: "Submit enquiry" }).click();
  expect(await page.evaluate(() => (window as any).enquiryUrl)).toContain(
    "legal%20documentation%20kit",
  );
  await page.getByRole("button", { name: "Close enquiry" }).click();
  await page
    .getByRole("button", { name: "PLAN YOUR VISIT", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Book a site visit" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close enquiry" }).click();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("button", { name: "02 Rooted in Purpose" }).click();
  await expect(page).toHaveURL(new RegExp(routePaths.impact));
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    await page.evaluate(() => innerWidth),
  );
  const html = await (await request.get(routePaths.impact)).text();
  expect(html).toContain("impact-legal-list");
  expect(await (await request.get("/sitemap.xml")).text()).toContain(
    routePaths.impact,
  );
  expect(errors).toEqual([]);
});

test("new page reveals its editorial headings on scroll", async ({ page }) => {
  await page.goto(routePaths.impact);
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.mouse.move(12, 120);
  const heading = page.locator("#impact-research-heading");
  const char = heading.locator(".reveal-char").first();
  const offset = () =>
    char.evaluate((el) => {
      const t = getComputedStyle(el).transform;
      return t === "none" ? 0 : new DOMMatrixReadOnly(t).m42;
    });
  await expect.poll(offset).toBeGreaterThan(10);
  await heading.scrollIntoViewIfNeeded();
  await expect.poll(offset).toBeLessThan(1);
});
