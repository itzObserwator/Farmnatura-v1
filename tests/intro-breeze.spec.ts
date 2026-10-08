import { test, expect } from "@playwright/test";

test("welcome bird flies and treetops sway without moving the ground", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "ENTER THE FARM" }),
  ).toBeEnabled();
  await expect(page.locator(".sound-toggle")).toHaveCount(0);
  const canopy = page.locator(".intro-tree-canopy").first();
  const bird = page.locator(".intro-flying-bird");
  await expect(page.locator(".intro-tree-canopy")).toHaveCount(2);
  const firstX = (await bird.boundingBox())!.x;
  const firstTransform = await canopy.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  await expect
    .poll(async () => (await bird.boundingBox())!.x)
    .toBeGreaterThan(firstX + 15);
  await expect
    .poll(() => canopy.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(firstTransform);
  expect(
    await page
      .locator(".intro-tree-ground")
      .first()
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
  await page.screenshot({ path: info.outputPath("welcome-breeze.png") });
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await canopy.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(await bird.evaluate((el) => getComputedStyle(el).animationName)).toBe(
    "none",
  );
  await page.getByRole("button", { name: "ENTER THE FARM" }).click();
  await expect(page.locator(".sound-toggle")).toBeVisible();
  const sound = await page.locator(".sound-toggle").boundingBox();
  expect(sound!.x).toBeLessThan(50);
  expect(sound!.y).toBeGreaterThan(page.viewportSize()!.height - 100);
});
