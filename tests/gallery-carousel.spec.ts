import { test, expect } from "@playwright/test";

for (const route of [
  "/about-us",
  "/natural-farming",
  "/farmhouses-for-sale-in-hyderabad",
]) {
  test(`carousel opens Gallery from ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    const carousel = page.locator(".next-chapter-stage");
    await carousel.scrollIntoViewIfNeeded();
    const title = carousel.getByRole("heading", { level: 2 });
    await expect(title).toBeVisible();
    const next = carousel.getByRole("button", {
      name: "Next chapter",
      exact: true,
    });
    for (let i = 0; i < 4 && (await title.textContent()) !== "Gallery"; i++) {
      await next.click();
    }
    await expect(title).toHaveText("Gallery");
    await expect(carousel.locator(".chapter-pagination")).toHaveText("04/04");
    const illustration = carousel.locator(
      ".chapter-scene.is-current .scene-illustration",
    );
    await expect(illustration).toHaveAttribute(
      "src",
      "/illustrations/gallery-memories.webp",
    );
    await expect
      .poll(() =>
        illustration.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
    if (route === "/about-us") {
      await carousel.screenshot({
        path: test.info().outputPath("gallery-carousel.png"),
      });
      // Two complete cycles exercise both repeated-deck boundaries.
      for (let cycle = 0; cycle < 2; cycle++) {
        for (const label of [
          "Our Story",
          "Natural Farming",
          "Farm Life",
          "Gallery",
        ]) {
          await next.click();
          await expect(title).toHaveText(label);
          await expect(
            carousel.locator(".chapter-scene.is-current:visible"),
          ).toHaveCount(1);
        }
      }
      await carousel
        .getByRole("button", { name: "Previous chapter", exact: true })
        .click();
      await expect(title).toHaveText("Farm Life");
      await next.click();
    }
    await carousel
      .getByRole("button", { name: "Explore Gallery", exact: true })
      .click();
    await expect(page).toHaveURL(/\/gallery$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "LIFE, AS",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
