import { test, expect } from "@playwright/test";

test("desktop story panel fits the viewport and follows the scrolling chapter", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Desktop sticky layout.");
  for (const viewport of [
    { width: 1440, height: 800 },
    { width: 1024, height: 768 },
    { width: 768, height: 600 },
    { width: 1964, height: 1248 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/about-us");
    const list = page.locator(".story-index-list");
    await list.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    const buttons = list.locator("button");
    for (const index of [0, 1, 3, 5, 2]) {
      await buttons.nth(index).evaluate((el, chapter) => {
        const row = el.closest("li")!;
        scrollTo(
          0,
          scrollY +
            row.getBoundingClientRect().top -
            (chapter === 0
              ? 72
              : Math.min(240, Math.max(150, innerHeight * 0.3))) +
            2,
        );
      }, index);
      await expect(buttons.nth(index)).toHaveAttribute("aria-pressed", "true");
      await expect
        .poll(() =>
          page.locator(".story-index-panel").evaluate((el) => {
            const rect = el.getBoundingClientRect();
            const photo = el
              .querySelector(".story-selection-photo")!
              .getBoundingClientRect();
            return (
              Math.abs(rect.top - 72) < 2 &&
              rect.bottom <= innerHeight - 30 &&
              photo.height >= 80 &&
              photo.bottom <= rect.bottom + 1
            );
          }),
        )
        .toBe(true);
      await expect
        .poll(() =>
          buttons.nth(index).evaluate((el) => getComputedStyle(el).opacity),
        )
        .toBe("1");
      await expect
        .poll(() =>
          buttons
            .nth((index + 1) % 6)
            .evaluate((el) => getComputedStyle(el).opacity),
        )
        .toBe("0.3");
    }
    await page.screenshot({
      path: info.outputPath(`story-desktop-${viewport.width}.png`),
    });
  }
});

for (const width of [320, 440]) {
  test(`story preview stays within its section at ${width}px`, async ({
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
            const section = document
              .querySelector(".story-index")!
              .getBoundingClientRect();
            return panel.bottom <= section.bottom + 1;
          }),
        )
        .toBe(true);
    }
    await page.screenshot({ path: test.info().outputPath("story-sticky.png") });
    await context.close();
  });
}
