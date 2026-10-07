import { test, expect } from "@playwright/test";
test("chapter content follows the new scroll sequence and interactive sections", async ({
  page,
}, info) => {
  await page.addInitScript(() => sessionStorage.setItem("farm-entered", "yes"));
  await page.goto("/#farming");
  const seeds = page.getByRole("tab", { name: "01 Indigenous seeds" });
  await seeds.click();
  await seeds.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "02 Chemical-free care" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("health of the land");
  await page
    .getByRole("button", { name: "Explore next chapter: Farm Life" })
    .click();
  await expect(page).toHaveURL(/#living$/);
  await page.waitForTimeout(1200);
  const stack = page.locator(".moments-stack");
  await stack.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  if (info.project.name === "desktop") {
    const top = await stack.evaluate(
      (el) => el.getBoundingClientRect().top + scrollY,
    );
    await page.evaluate((y) => window.scrollTo(0, y + 750), top);
    await page.waitForTimeout(1400);
    expect(
      await page
        .locator(".moment-card")
        .nth(1)
        .evaluate((el) => el.getBoundingClientRect().top),
    ).toBeLessThan(1000);
  }
  await page.locator(".photo-gallery").scrollIntoViewIfNeeded();
  await expect(page.locator(".photo-transition")).toHaveAttribute(
    "data-webgl",
    "ready",
  );
  await page.goBack();
  await expect(page).toHaveURL(/#farming$/);
  await expect(page.locator(".transition-curtain")).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#living");
  const cards = await page.locator(".moment-card").evaluateAll((els) =>
    els.map((el) => ({
      top: el.getBoundingClientRect().top,
      bottom: el.getBoundingClientRect().bottom,
    })),
  );
  expect(cards[1].top).toBeGreaterThanOrEqual(cards[0].bottom);
  await page.goto("/#story");
  await page.locator(".story-index").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-count]").first()).toHaveText("110+");
});
test("uploaded branding and WebGL animation work with a no-WebGL fallback", async ({
  page,
}) => {
  await page.addInitScript(() => sessionStorage.setItem("farm-entered", "yes"));
  await page.goto("/");
  const logo = page
    .getByRole("button", { name: "Farm Natura home" })
    .getByRole("img", { name: "Farm Natura", exact: true });
  await expect(logo).toBeVisible();
  expect(
    await logo.evaluate((el) => (el as HTMLImageElement).naturalWidth),
  ).toBe(609);
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--brand-green")
        .trim(),
    ),
  ).toBe("#3c7a3a");
  await expect(page.locator(".sunlight-canvas")).toHaveAttribute(
    "data-webgl",
    "ready",
  );
  const canvas = page.locator(".sunlight-canvas canvas");
  const first = await canvas.screenshot();
  await page.waitForTimeout(250);
  const second = await canvas.screenshot();
  expect(first.equals(second)).toBe(false);
  // Exercise the actual unavailable-context path rather than hiding the canvas with CSS.
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (type === "webgl2") return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.reload();
  await expect(page.locator(".sunlight-canvas")).toHaveAttribute(
    "data-webgl",
    "unavailable",
  );
  await page.waitForTimeout(1300);
  await page.getByRole("button", { name: "Next chapter", exact: true }).click();
  await expect(page.locator(".chapter-caption h1")).toHaveText(
    "Natural Farming",
  );
});
const enter = async (page: import("@playwright/test").Page) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Explore Our Story", exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(1300);
};
test("chapter carousel supports arrows, wheel, menu, and page transitions", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await enter(page);
  await page.getByRole("button", { name: "Next chapter", exact: true }).click();
  await expect(page.locator(".chapter-caption h1")).toHaveText(
    "Natural Farming",
  );
  await page.waitForTimeout(1250);
  if (info.project.name === "desktop") {
    await page.mouse.move(720, 500);
    await page.mouse.wheel(0, 600);
  } else {
    await page
      .getByRole("button", { name: "Next chapter", exact: true })
      .click();
  }
  await expect(page.locator(".chapter-caption h1")).toHaveText("Farm Life");
  await page.waitForTimeout(1250);
  await page
    .getByRole("button", { name: "Explore Farm Life", exact: true })
    .click();
  await expect(page).toHaveURL(/#living$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "LESS HURRY.",
  );
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Read this chapter" }).click();
  await page.waitForTimeout(1200);
  await expect(page).toHaveURL(/#living$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Explore Farm Natura" });
  await expect(menu).toBeVisible();
  await menu.getByRole("button", { name: "01 Our Story" }).click();
  await expect(page).toHaveURL(/#story$/);
  await expect(menu).not.toBeVisible();
  expect(errors).toEqual([]);
});
test("gallery, FAQ, enquiry and original artwork work", async ({ page }) => {
  await page.goto("/#living");
  await page.waitForTimeout(1300);
  const images = await page.locator("img").evaluateAll(async (imgs) =>
    Promise.all(
      imgs.map(
        (el) =>
          new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img.naturalWidth > 0);
            img.onerror = () => resolve(false);
            img.src = (el as HTMLImageElement).src;
          }),
      ),
    ),
  );
  expect(images.every(Boolean)).toBe(true);
  await page
    .getByRole("button", { name: "Next photograph", exact: true })
    .click();
  await expect(page.locator(".gallery-photo img")).toHaveAttribute(
    "src",
    "/images/farmhouse.jpg",
  );
  await page.getByRole("button", { name: "Open photograph" }).click();
  await expect(page.locator(".photo-dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close photograph" }).click();
  await page.getByRole("button", { name: "Where is Farm Natura?" }).click();
  await expect(page.locator("#answer-0")).toBeVisible();
  await page
    .getByRole("button", { name: "PLAN YOUR VISIT", exact: true })
    .click();
  await expect(page.locator(".contact-dialog")).toBeVisible();
  await page.getByLabel("Your name").fill("Test visitor");
  await page.getByLabel("Phone number").fill("9876543210");
  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("button", { name: "Continue on WhatsApp" }).click(),
  ]);
  expect(popup.url()).toMatch(/wa\.me|api\.whatsapp\.com/);
  await popup.close();
  await page.getByRole("button", { name: "Close enquiry" }).click();
  await expect(page.locator(".contact-dialog")).not.toBeVisible();
});
test("intro, sound preference and reduced motion remain accessible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "ENTER THE FARM" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "ENTER THE FARM" }).click();
  await expect(page.locator(".intro-film")).toBeVisible();
  await page.getByRole("button", { name: "Skip intro", exact: true }).click();
  await expect(page.locator(".chapter-carousel")).toBeVisible();
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(
    page.getByRole("button", { name: "Turn sound off" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Turn sound off" }).click();
  await page
    .getByRole("button", { name: "Explore Our Story", exact: true })
    .click();
  await expect(page).toHaveURL(/#story$/);
  expect(
    await page
      .locator(".hero-title")
      .evaluate((el) => getComputedStyle(el).opacity),
  ).toBe("1");
});

test("Our Story hand-drawn artwork and reference-style selector work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#story");
  const artwork = page.locator(".handdrawn-decor img");
  await expect(artwork).toHaveCount(5);
  await expect
    .poll(() =>
      artwork.evaluateAll((els) =>
        els.every(
          (el) =>
            (el as HTMLImageElement).complete &&
            (el as HTMLImageElement).naturalWidth > 0,
        ),
      ),
    )
    .toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const weekends = page.getByRole("button", { name: /05 Farmhouse weekends/ });
  await weekends.click();
  await expect(weekends).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".story-selection-photo > img")).toHaveAttribute(
    "src",
    "/images/farmhouse.jpg",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("Natural Farming keeps Centre Court sections and readable card handover", async ({
  page,
}, info) => {
  await page.goto("/#farming");
  await expect(page.locator(".farming-about-photo")).toHaveAttribute(
    "src",
    "/images/goshala.jpg",
  );
  await expect(page.locator(".farming-detail-photo")).toHaveCount(2);
  await expect(page.locator(".farming-feature-card")).toHaveCount(2);
  await page.waitForTimeout(1500);
  const cards = page.locator(".farming-cards");
  if (info.project.name === "desktop") {
    const start = await cards.evaluate(
      (el) => el.getBoundingClientRect().top + scrollY - 95,
    );
    await page.evaluate((y) => window.scrollTo(0, y + 40), start);
    await page.waitForTimeout(700);
    const before = await page
      .locator(".farming-managed-card")
      .evaluate((el) => el.getBoundingClientRect().top);
    const firstTop = await page
      .locator(".practice-window")
      .evaluate((el) => el.getBoundingClientRect().top);
    await page.evaluate((y) => window.scrollTo(0, y + 250), start);
    await page.waitForTimeout(700);
    const after = await page
      .locator(".farming-managed-card")
      .evaluate((el) => el.getBoundingClientRect().top);
    expect(after).toBeLessThan(before - 100);
    expect(
      Math.abs(
        (await page
          .locator(".practice-window")
          .evaluate((el) => el.getBoundingClientRect().top)) - firstTop,
      ),
    ).toBeLessThan(3);
    expect(
      await page
        .locator(".practice-window")
        .evaluate((el) => getComputedStyle(el).opacity),
    ).toBe("1");
    await page.evaluate((y) => window.scrollTo(0, y + 40), start);
    await page.waitForTimeout(700);
    expect(
      await page
        .locator(".farming-managed-card")
        .evaluate((el) => el.getBoundingClientRect().top),
    ).toBeGreaterThan(after + 100);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const rects = await page.locator(".farming-feature-card").evaluateAll((els) =>
    els.map((el) => ({
      top: el.getBoundingClientRect().top,
      bottom: el.getBoundingClientRect().bottom,
    })),
  );
  expect(rects[1].top).toBeGreaterThan(rects[0].bottom);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("Natural Farming fluid surfaces animate and survive WebGL failure", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#farming");
  const surface = page.locator(".farming-organic-surface");
  await surface.scrollIntoViewIfNeeded();
  await expect(surface).toHaveAttribute("data-webgl", "ready");
  const canvas = surface.locator("canvas");
  const before = await canvas.screenshot();
  const rect = await surface.boundingBox();
  await page.mouse.move(
    rect!.x + rect!.width * 0.82,
    rect!.y + rect!.height * 0.5,
  );
  await page.waitForTimeout(700);
  expect(before.equals(await canvas.screenshot())).toBe(false);
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      return type === "webgl2"
        ? null
        : Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.reload();
  await expect(surface).toHaveAttribute("data-webgl", "unavailable");
  await expect(page.locator(".farming-about-photo")).toBeAttached();
  await page.getByRole("tab", { name: "01 Indigenous seeds" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Locally adapted");
  expect(errors).toEqual([]);
});
