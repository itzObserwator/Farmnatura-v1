import { test, expect } from "@playwright/test";

test("chapter carousel precedes the footer and allows scrolling onward", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about-us");
  const carousel = page.locator(".next-chapter-stage");
  expect(
    await carousel.evaluate((el) =>
      el.nextElementSibling?.matches(".farm-footer"),
    ),
  ).toBe(true);
  await carousel.scrollIntoViewIfNeeded();
  await carousel.evaluate((el) =>
    scrollTo(0, scrollY + el.getBoundingClientRect().top),
  );
  await expect(carousel.getByRole("heading", { level: 2 })).toHaveText(
    "Natural Farming",
  );
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.keyboard.press("ArrowDown");
  await expect(carousel.getByRole("heading", { level: 2 })).toHaveText(
    "Farm Life",
  );
  await page.keyboard.press("ArrowDown");
  await expect(carousel.getByRole("heading", { level: 2 })).toHaveText(
    "Our Story",
  );
  const before = await page.evaluate(() => scrollY);
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  await expect(page.locator(".farm-footer")).toBeInViewport();
});

test("pointer circle follows the cursor and sound control stays in the bottom-left", async ({
  page,
}, info) => {
  await page.goto("/about-us");
  const sound = await page.locator(".sound-toggle").boundingBox();
  expect(sound!.x).toBeLessThan(50);
  expect(sound!.y).toBeGreaterThan(page.viewportSize()!.height - 100);
  if (info.project.name === "desktop") {
    await page.mouse.move(350, 350);
    const ring = page.locator(".cursor-ring");
    await expect(ring).toHaveAttribute("data-visible", "true");
    await page.mouse.move(480, 420);
    await expect
      .poll(async () => Math.round((await ring.boundingBox())!.x))
      .toBe(461);
    await expect
      .poll(async () => Math.round((await ring.boundingBox())!.y))
      .toBe(401);
  }
});
