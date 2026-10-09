import { test, expect, type Page } from "@playwright/test";

const screens = [
  { name: "small phone", width: 320, height: 740 },
  { name: "phone", width: 390, height: 844 },
  { name: "large phone", width: 600, height: 900 },
  { name: "portrait tablet", width: 768, height: 1024 },
  { name: "landscape tablet", width: 1024, height: 768 },
  { name: "landscape phone", width: 844, height: 390 },
  { name: "small landscape phone", width: 568, height: 320 },
];
const pages = [
  "/",
  "/about-us",
  "/natural-farming",
  "/farmhouses-for-sale-in-hyderabad",
  "/gallery",
];
for (const screen of screens) {
  test(`responsive pages fit a ${screen.name}`, async ({
    browser,
    baseURL,
  }, info) => {
    test.skip(
      info.project.name !== "desktop",
      "This audit creates its own touch device contexts.",
    );
    const context = await browser.newContext({
      baseURL,
      viewport: screen,
      isMobile: screen.width < 768,
      hasTouch: true,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    for (const path of pages) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBe(screen.width);
      const clipped = await page
        .locator("main h1, main h2, main h3")
        .evaluateAll((elements) =>
          elements
            .filter((el) => {
              const box = el.getBoundingClientRect();
              return (
                box.width > 0 &&
                (el.scrollWidth > el.clientWidth + 2 ||
                  box.left < -2 ||
                  box.right > innerWidth + 2)
              );
            })
            .map((el) => el.textContent),
        );
      expect(clipped, `${path} headings fit at ${screen.width}px`).toEqual([]);
      if (path === "/") {
        const poster = await page.locator(".intro-poster").boundingBox();
        expect(poster).toMatchObject({
          x: 0,
          y: 0,
          width: screen.width,
          height: screen.height,
        });
        const enter = page.getByRole("button", { name: "ENTER THE FARM" });
        await expect(enter).toBeEnabled();
        const bounds = await enter.boundingBox();
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(screen.height);
        expect(bounds!.height).toBeGreaterThanOrEqual(44);
      } else {
        const menu = await page
          .getByRole("button", { name: "Open menu" })
          .boundingBox();
        expect(menu!.width).toBeGreaterThanOrEqual(44);
        expect(menu!.height).toBeGreaterThanOrEqual(44);
      }
    }
    await context.close();
  });
}

test("touch dialogs remain usable when scrolled and when screen height shrinks", async ({
  browser,
  baseURL,
}, info) => {
  test.skip(info.project.name !== "desktop", "Dedicated touch device test.");
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 320, height: 740 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/about-us");
  await page.getByRole("button", { name: "Open menu" }).tap();
  await page
    .locator(".paper-front")
    .evaluate((el) => (el.scrollTop = el.scrollHeight));
  await expect(
    page.getByRole("button", { name: "Close menu" }),
  ).toBeInViewport();
  await page.getByRole("button", { name: "Close menu" }).tap();
  await page.getByRole("button", { name: "Open menu" }).tap();
  await page.locator(".menu-footer .paper-button").tap();
  const form = page.locator(".contact-dialog-content");
  await expect(form).toBeVisible();
  expect(await form.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
  await page
    .getByPlaceholder("Full name", { exact: true })
    .fill("Mobile visitor");
  await page.setViewportSize({ width: 320, height: 420 });
  await form.evaluate((el) => (el.scrollTop = el.scrollHeight));
  await expect(
    page.getByRole("button", { name: "Close enquiry" }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Continue on WhatsApp" }),
  ).toBeInViewport();
  expect(
    await page
      .locator("#visit-interest")
      .evaluate((el) => getComputedStyle(el).fontSize),
  ).toBe("16px");
  await page.getByRole("button", { name: "Close enquiry" }).tap();
  await expect(page.locator(".contact-dialog")).not.toBeVisible();
  await context.close();
});

async function swipe(
  page: Page,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const session = await page.context().newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [from],
  });
  for (let i = 1; i <= 8; i++) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        {
          x: from.x + ((to.x - from.x) * i) / 8,
          y: from.y + ((to.y - from.y) * i) / 8,
        },
      ],
    });
    await page.waitForTimeout(25);
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await session.detach();
}

test("touch swipes browse the carousel and continue into the footer", async ({
  browser,
  baseURL,
}, info) => {
  test.skip(info.project.name !== "desktop", "Dedicated touch device test.");
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
  await carousel.scrollIntoViewIfNeeded();
  await carousel.evaluate((el) =>
    scrollTo(0, scrollY + el.getBoundingClientRect().top),
  );
  const heading = carousel.getByRole("heading", { level: 2 });
  await expect(heading).toHaveText("Natural Farming");
  await swipe(page, { x: 195, y: 550 }, { x: 195, y: 380 });
  await expect(heading).toHaveText("Farm Life");
  await swipe(page, { x: 280, y: 450 }, { x: 100, y: 450 });
  await expect(heading).toHaveText("Gallery");
  await swipe(page, { x: 280, y: 450 }, { x: 100, y: 450 });
  await expect(heading).toHaveText("Our Story");
  await swipe(page, { x: 195, y: 550 }, { x: 195, y: 380 });
  await expect(page.locator(".farm-footer")).toBeInViewport();
  await context.close();
});

test("gallery controls and portrait photos fit touch landscape", async ({
  browser,
  baseURL,
}, info) => {
  test.skip(info.project.name !== "desktop", "Dedicated touch device test.");
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 568, height: 320 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/gallery");
  await page.getByRole("button", { name: "EXPLORE THE GALLERY" }).tap();
  await page.locator(".gallery-journal-photo").first().tap();
  await expect(
    page.getByRole("dialog", { name: "Farm Natura photograph viewer" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close gallery viewer" }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Next gallery photograph", exact: true }),
  ).toBeInViewport();
  await page
    .getByRole("button", { name: "Next gallery photograph", exact: true })
    .tap();
  await page.getByRole("button", { name: "Close gallery viewer" }).tap();
  await expect(
    page.getByRole("dialog", { name: "Farm Natura photograph viewer" }),
  ).not.toBeVisible();
  await context.close();
});

test("mobile gallery keeps the selected thumbnail reachable when wrapping", async ({
  browser,
  baseURL,
}, info) => {
  test.skip(info.project.name !== "desktop", "Dedicated touch device test.");
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 320, height: 740 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/farmhouses-for-sale-in-hyderabad");
  const gallery = page.locator(".photo-gallery");
  await gallery
    .getByRole("button", { name: "Previous photograph", exact: true })
    .tap();
  const selected = gallery.locator('.gallery-dots button[aria-pressed="true"]');
  await expect(selected).toHaveAttribute("aria-label", "Show photograph 20");
  expect(
    await selected.evaluate((el) => {
      const box = el.getBoundingClientRect();
      const strip = el.parentElement!.getBoundingClientRect();
      return box.left >= strip.left && box.right <= strip.right;
    }),
  ).toBe(true);
  await gallery
    .getByRole("button", { name: "Open photograph", exact: true })
    .tap();
  await expect(
    page.getByRole("button", { name: "Close photograph", exact: true }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", {
      name: "Next full-size photograph",
      exact: true,
    }),
  ).toBeInViewport();
  await page
    .getByRole("button", { name: "Close photograph", exact: true })
    .tap();
  await context.close();
});
