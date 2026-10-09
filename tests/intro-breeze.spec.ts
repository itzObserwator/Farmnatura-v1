import sharp from "sharp";
import { test, expect } from "@playwright/test";

test("welcome trees bend in the wind while people and foreground stay still", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "ENTER THE FARM" }),
  ).toBeEnabled();
  await expect(page.locator(".sound-toggle")).toHaveCount(0);
  const poster = await page.locator(".intro-poster").boundingBox();
  expect(poster!.x).toBe(0);
  expect(poster!.y).toBe(0);
  expect(poster!.width).toBe(page.viewportSize()!.width);
  expect(poster!.height).toBe(page.viewportSize()!.height);
  await expect(page.locator(".intro-bird-art")).toHaveAttribute(
    "src",
    /flying-oriole.webp/,
  );
  await expect(page.locator(".intro-wind-trails path")).toHaveCount(3);
  const bird = page.locator(".intro-flying-bird");
  await expect(page.locator(".intro-tree-art")).toHaveCount(2);
  const firstX = (await bird.boundingBox())!.x;
  const field = page.locator("feDisplacementMap").first();
  const firstScale = await field.getAttribute("scale");
  await expect
    .poll(async () => (await bird.boundingBox())!.x)
    .toBeGreaterThan(firstX + 15);
  await expect.poll(() => field.getAttribute("scale")).not.toBe(firstScale);
  await expect(page.locator(".intro-art img")).toHaveCount(2);
  await expect(
    page.locator(".intro-tree-canopy, .intro-tree-ground"),
  ).toHaveCount(0);
  for (const art of await page.locator(".intro-tree-art").all()) {
    expect(await art.evaluate((el) => getComputedStyle(el).transform)).toBe(
      "none",
    );
    const box = (await art.boundingBox())!;
    const first = await page.screenshot();
    await page.waitForTimeout(350);
    const second = await page.screenshot();
    const { width, height } = box;
    // The lower central region contains the people and planting scene.
    const crop = {
      left: Math.floor(box.x + width! * 0.25),
      top: Math.floor(box.y + height! * 0.65),
      width: Math.floor(width! * 0.5),
      height: Math.floor(height! * 0.3),
    };
    const pixelsA = await sharp(first).extract(crop).raw().toBuffer();
    const pixelsB = await sharp(second).extract(crop).raw().toBuffer();
    const meanDifference =
      pixelsA.reduce((sum, value, i) => sum + Math.abs(value - pixelsB[i]), 0) /
      pixelsA.length;
    expect(meanDifference).toBeLessThan(0.1);
    const crown = {
      left: Math.floor(box.x + width! * 0.25),
      top: Math.floor(box.y + height! * 0.08),
      width: Math.floor(width! * 0.5),
      height: Math.floor(height! * 0.3),
    };
    const crownA = await sharp(first).extract(crown).raw().toBuffer();
    const crownB = await sharp(second).extract(crown).raw().toBuffer();
    expect(crownA.equals(crownB)).toBe(false);
  }
  await page.screenshot({ path: info.outputPath("welcome-breeze.png") });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(field).toHaveAttribute("scale", "0");
  expect(await bird.evaluate((el) => getComputedStyle(el).animationName)).toBe(
    "none",
  );
  await page.getByRole("button", { name: "ENTER THE FARM" }).click();
  await expect(page.locator(".sound-toggle")).toBeVisible();
  const sound = await page.locator(".sound-toggle").boundingBox();
  expect(sound!.x).toBeLessThan(50);
  expect(sound!.y).toBeGreaterThan(page.viewportSize()!.height - 100);
});
