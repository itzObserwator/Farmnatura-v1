import { test, expect } from "@playwright/test";

for (const viewport of [{ width: 390, height: 844 }]) {
  test(`story cards stack, reverse and release at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/about-us");
    const stack = page.locator(".story-card-stack");
    const cards = stack.locator("article");
    await expect(cards).toHaveCount(6);
    const scrollToCard = async (index: number) => {
      await cards.nth(index).evaluate(
        (el, top) => {
          // Each marker stays in flow while its card sticks.
          const marker = el.previousElementSibling!;
          scrollTo(0, scrollY + marker.getBoundingClientRect().top - top + 2);
        },
        (viewport.width < 768 ? 80 : 90) +
          index * (viewport.width < 768 ? 4 : 6),
      );
    };
    for (const index of [0, 1, 3, 5, 2, 0]) {
      await scrollToCard(index);
      const expectedTop =
        (viewport.width < 768 ? 80 : 90) +
        index * (viewport.width < 768 ? 4 : 6);
      await expect
        .poll(() =>
          cards
            .nth(index)
            .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
        )
        .toBe(expectedTop);
      const box = await cards.nth(index).boundingBox();
      expect(box!.y + box!.height).toBeLessThan(viewport.height);
      if (index > 0) {
        await expect
          .poll(() =>
            cards
              .nth(index - 1)
              .evaluate((el) => el.getBoundingClientRect().top),
          )
          .toBeLessThan(expectedTop);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(viewport.width);
    }
    await stack.evaluate((el) =>
      scrollTo(0, scrollY + el.getBoundingClientRect().bottom),
    );
    await expect
      .poll(() =>
        cards.last().evaluate((el) => el.getBoundingClientRect().bottom),
      )
      .toBeLessThan(1);
  });
}

test("reduced motion shows all six story cards in normal document flow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about-us");
  const cards = page.locator(".story-card-stack article");
  await expect(cards).toHaveCount(6);
  for (const card of await cards.all()) {
    expect(await card.evaluate((el) => getComputedStyle(el).position)).toBe(
      "relative",
    );
  }
});

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
          buttons.nth(index).evaluate((el) => getComputedStyle(el).color),
        )
        .toBe("rgb(36, 77, 38)");
      await expect
        .poll(() =>
          buttons
            .nth((index + 1) % 6)
            .evaluate((el) => getComputedStyle(el).color),
        )
        .toBe("rgb(89, 117, 91)");
    }
    await page.screenshot({
      path: info.outputPath(`story-desktop-${viewport.width}.png`),
    });
  }
});
