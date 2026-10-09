import { test, expect } from "@playwright/test";

for (const width of [320, 440]) {
  test(`story preview stops before the statistics at ${width}px`, async ({
    browser,
    baseURL,
  }, info) => {
    test.skip(
      info.project.name !== "desktop",
      "Dedicated touch viewport test.",
    );
    const context = await browser.newContext({
      baseURL,
      viewport: { width, height: 956 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto("/about-us");
    const list = page.locator(".story-index-list");
    await list.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const positions = await list.evaluate((el) => {
      const top = scrollY + el.getBoundingClientRect().top;
      return [
        top,
        top + el.clientHeight * 0.5,
        top + el.clientHeight - 150,
        top + el.clientHeight,
        top + el.clientHeight - 150,
        top,
      ];
    });
    for (const position of positions) {
      await page.evaluate((y) => scrollTo(0, y), position);
      await expect
        .poll(() =>
          page.evaluate(() => {
            const panel = document
              .querySelector(".story-index-panel")!
              .getBoundingClientRect();
            const facts = document
              .querySelector(".story-index-mobile-facts")!
              .getBoundingClientRect();
            return panel.bottom <= facts.top + 1;
          }),
        )
        .toBe(true);
    }
    await page.screenshot({ path: test.info().outputPath("story-sticky.png") });
    await context.close();
  });
}
