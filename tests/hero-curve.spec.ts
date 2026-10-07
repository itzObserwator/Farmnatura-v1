import { test, expect } from "@playwright/test";

const chapters = ["story", "farming", "living", "gallery"];

test("every scrolling hero bows its backdrop and restores it on scroll back", async ({
  page,
}) => {
  await page.addInitScript(() => sessionStorage.setItem("farm-entered", "yes"));
  for (const chapter of chapters) {
    await page.goto(`/#${chapter}`);
    // Let the route's entrance finish before exercising user scrolling.
    await page.waitForTimeout(1400);
    const hero = page.locator(".page-hero");
    const path = hero.locator(".hero-curve-definition path");
    await expect(path).toHaveCount(1);
    const initial = await path.getAttribute("d");
    const height = await hero.evaluate(
      (node) => node.getBoundingClientRect().height,
    );
    await page.evaluate(
      (distance) => window.scrollTo(0, distance),
      height * 0.35,
    );
    await expect.poll(() => path.getAttribute("d")).not.toBe(initial);
    await page.waitForTimeout(900);
    const shape = (await path.getAttribute("d"))!.match(
      /V([\d.]+)Q0.5 (-?[\d.]+)/,
    )!;
    expect(Number(shape[1])).toBeLessThan(1);
    expect(Number(shape[2])).toBeLessThan(Number(shape[1]));
    expect(
      await hero
        .locator(".hero-title")
        .evaluate((node) => node.closest(".hero-backdrop")),
    ).toBeNull();
    expect(
      await hero.evaluate((node) => node.getBoundingClientRect().height),
    ).toBe(height);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => path.getAttribute("d")).toBe(initial);
  }
});

test("reduced motion keeps every hero backdrop flat while scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => sessionStorage.setItem("farm-entered", "yes"));
  for (const chapter of chapters) {
    await page.goto(`/#${chapter}`);
    const hero = page.locator(".page-hero");
    const path = hero.locator(".hero-curve-definition path");
    const initial = await path.getAttribute("d");
    await page.evaluate(() => window.scrollTo(0, innerHeight * 0.4));
    await page.waitForTimeout(200);
    await expect(path).toHaveAttribute("d", initial!);
  }
});
