import { test, expect } from "@playwright/test";

test("estate overview and questions sit before the Our Story visit invitation", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about-us");
  await expect(page.locator(".story-estate-fact")).toHaveCount(6);
  await expect(page.locator(".story-question")).toHaveCount(5);
  const order = await page
    .locator(
      ".story-golden-years, .story-estate, .story-questions, .visit-invitation",
    )
    .evaluateAll((els) => els.map((el) => el.className));
  expect(order).toEqual([
    "story-golden-years",
    "story-estate",
    "story-questions",
    "visit-invitation",
  ]);
  await page.locator(".story-golden-years").scrollIntoViewIfNeeded();
  await expect(page.locator("#golden-years-title")).toHaveAccessibleName(
    "An ideal way to spend your golden years.",
  );
  await expect(page.locator(".story-golden-copy")).toContainText(
    "children and grandchildren can visit with ease",
  );
  const portrait = page.locator(".story-golden-portrait > img");
  await expect
    .poll(() =>
      portrait.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 1,
      ),
    )
    .toBe(true);
  await page.screenshot({ path: info.outputPath("golden-years.png") });
  await page.locator(".story-estate").scrollIntoViewIfNeeded();
  const art = page.locator(".story-estate-art img");
  await expect
    .poll(() =>
      art.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 1,
      ),
    )
    .toBe(true);
  await page.screenshot({ path: info.outputPath("estate-overview.png") });
  await page
    .getByRole("button", { name: "DOWNLOAD BROCHURE", exact: true })
    .click();
  await expect(page.locator(".contact-dialog")).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeVisible();
  await page.getByRole("button", { name: "Close enquiry" }).click();
  await expect(page.locator(".contact-dialog")).not.toBeVisible();

  const question = page.getByRole("button", {
    name: "01 Where is Farm Natura?",
    exact: true,
  });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#answer-0")).toContainText("Kandukur");
  await page.screenshot({ path: info.outputPath("story-questions.png") });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "false");
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#answer-0")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/farmhouses-for-sale-in-hyderabad");
  await expect(
    page.locator(
      ".story-closing-sections, .life-impact, .life-statistics, .faq-section",
    ),
  ).toHaveCount(0);
  await expect(page.locator(".photo-gallery")).toBeAttached();
});

test("closing headings reveal on scroll and statistics respond to hover", async ({
  page,
}) => {
  await page.goto("/about-us");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.mouse.move(12, 120);
  const character = page.locator("#golden-years-title .reveal-char").first();
  const offset = () =>
    character.evaluate((el) => {
      const transform = getComputedStyle(el).transform;
      return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
    });
  await expect.poll(offset).toBeGreaterThan(10);
  await page.locator("#golden-years-title").scrollIntoViewIfNeeded();
  await expect.poll(offset, { timeout: 5000 }).toBeLessThan(1);
  const fact = page.locator(".story-estate-fact").first();
  await fact.scrollIntoViewIfNeeded();
  await expect(fact.locator("[data-count]")).toHaveText("110", {
    timeout: 5000,
  });
  await fact.hover();
  await expect
    .poll(() => fact.evaluate((el) => getComputedStyle(el).translate))
    .toBe("0px -3px");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() => fact.evaluate((el) => getComputedStyle(el).translate))
    .toBe("none");
});
