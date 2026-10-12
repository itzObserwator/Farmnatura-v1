import { test, expect } from "@playwright/test";

test("mobile chapters follow a finger, snap back on short drags and settle both ways", async ({
  browser,
  baseURL,
}, info) => {
  test.skip(info.project.name !== "desktop", "Dedicated mobile touch context.");
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/about-us");
  const carousel = page.locator(".next-chapter-stage");
  await carousel.evaluate((el) =>
    scrollTo(0, scrollY + el.getBoundingClientRect().top),
  );
  const heading = carousel.getByRole("heading", { level: 2 });
  await expect(heading).toHaveText("Rooted in Purpose");
  const scene = carousel.locator(".chapter-scene.is-current");
  const x = () =>
    scene.evaluate(
      (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
    );
  const session = await context.newCDPSession(page);
  const start = () =>
    session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 240, y: 360 }],
    });
  const move = (to: number) =>
    session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: to, y: 360 }],
    });
  const end = () =>
    session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  await start();
  await move(215);
  await expect.poll(x).toBeLessThan(-15);
  await expect(heading).toHaveText("Rooted in Purpose");
  await end();
  await expect.poll(x).toBeGreaterThan(-1);
  await expect(heading).toHaveText("Rooted in Purpose");
  await start();
  await move(120);
  await expect.poll(x).toBeLessThan(-80);
  await end();
  await expect(heading).toHaveText("Natural Farming");
  await expect.poll(x).toBeGreaterThan(-1);
  await start();
  await move(350);
  await end();
  await expect(heading).toHaveText("Rooted in Purpose");
  await expect(page).toHaveURL(/about-us$/);
  await context.close();
});
