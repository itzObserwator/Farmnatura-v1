import { test, expect } from "@playwright/test";

test("chapter paint excludes animation engines and reserves the footer carousel space", async ({
  page,
}) => {
  const scripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url());
  });
  await page.goto("/about-us", { waitUntil: "networkidle" });
  expect(
    scripts.filter((url) =>
      /gsap|ScrollTrigger|setupChapterAnimations|three\.module/.test(url),
    ),
  ).toEqual([]);
  const carousel = page.locator(".next-chapter-stage");
  const initialHeight = await carousel.evaluate(
    (node) => node.getBoundingClientRect().height,
  );
  expect(initialHeight).toBeGreaterThanOrEqual(
    await page.evaluate(() => innerHeight),
  );
  await page.evaluate(() => scrollTo(0, 400));
  await expect
    .poll(() => scripts.some((url) => /setupChapterAnimations/.test(url)))
    .toBe(true);
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel.getByRole("heading", { level: 2 })).toHaveText(
    "Natural Farming",
  );
  expect(
    await carousel.evaluate((node) => node.getBoundingClientRect().height),
  ).toBe(initialHeight);
});

test("development dependencies use gzip and separately accessible debugging maps", async ({
  page,
  request,
  baseURL,
}) => {
  test.skip(
    baseURL?.includes("4173") ?? false,
    "Development server transport check",
  );
  let dependency = "";
  page.on("request", (req) => {
    if (req.url().includes("/framer-motion.js")) dependency = req.url();
  });
  await page.goto("/about-us", { waitUntil: "networkidle" });
  expect(dependency).not.toBe("");
  const response = await request.get(dependency);
  expect(response.headers()["content-encoding"]).toBe("gzip");
  const code = await response.text();
  expect(code).not.toContain("sourceMappingURL=data:");
  const mapUrl = code.match(
    /sourceMappingURL=(\/__dependency-maps__\/[^\s]+)/,
  )?.[1];
  expect(mapUrl).toBeTruthy();
  const map = await request.get(mapUrl!);
  expect(map.ok()).toBe(true);
  expect((await map.json()).sources.length).toBeGreaterThan(0);
});
