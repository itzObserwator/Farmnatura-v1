import { test, expect } from "@playwright/test";
test("chapter content follows the new scroll sequence and interactive sections", async ({
  page,
}, info) => {
  await page.addInitScript(() => sessionStorage.setItem("farm-entered", "yes"));
  await page.goto("/#farming");
  await expect(page.locator(".page-hero .drawn-okra-top")).toBeVisible();
  await page.locator(".page-hero .drawn-mango").evaluate(async (image) => {
    await (image as HTMLImageElement).decode();
  });
  const mangoBounds = await page
    .locator(".page-hero .drawn-mango")
    .boundingBox();
  const logoBounds = await page.locator(".brand-seal").boundingBox();
  expect(mangoBounds!.x).toBeGreaterThan(
    logoBounds!.x + logoBounds!.width + 12,
  );
  await page.waitForTimeout(1200);
  await page.screenshot({ path: info.outputPath("farming-hero.png") });
  const originalViewport = page.viewportSize()!;
  const heroViewports =
    info.project.name === "desktop"
      ? [originalViewport, { width: 2048, height: 1053 }]
      : [originalViewport];
  for (const viewport of heroViewports) {
    await page.setViewportSize(viewport);
    const branch = await page.locator(".page-hero .drawn-mango").boundingBox();
    const logo = await page.locator(".brand-seal").boundingBox();
    expect(branch!.x).toBeGreaterThan(logo!.x + logo!.width + 12);
    for (const word of await page.locator(".page-hero h1 .reveal-word").all()) {
      const text = await word.boundingBox();
      const overlaps =
        branch!.x < text!.x + text!.width &&
        branch!.x + branch!.width > text!.x &&
        branch!.y < text!.y + text!.height &&
        branch!.y + branch!.height > text!.y;
      expect(
        overlaps,
        `Mango should clear headline at ${viewport.width}px`,
      ).toBe(false);
    }
    await page.screenshot({
      path: info.outputPath(`farming-hero-${viewport.width}.png`),
    });
  }
  await page.setViewportSize(originalViewport);
  const seeds = page.getByRole("tab", { name: "01 Indigenous seeds" });
  await seeds.click();
  await seeds.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "02 Chemical-free care" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("health of the land");
  await page.locator(".next-chapter-stage").scrollIntoViewIfNeeded();
  await page
    .getByRole("button", { name: "Explore Farm Life", exact: true })
    .click();
  await expect(page).toHaveURL(/(#living|farmhouses-for-sale-in-hyderabad)$/);
  await page.waitForTimeout(1200);
  await page.locator(".life-second-split").scrollIntoViewIfNeeded();
  await expect(page.locator(".life-photo-scene > img")).toHaveCount(3);
  await page.locator(".photo-gallery").scrollIntoViewIfNeeded();
  await expect(page.locator(".photo-transition")).toHaveAttribute(
    "data-webgl",
    "ready",
  );
  await page.goBack();
  await expect(page).toHaveURL(/(#farming|natural-farming)$/);
  await expect(page.locator(".transition-curtain")).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#living");
  await expect(page.locator(".life-statistic")).toHaveCount(6);
  const galleryCtaGap = await page
    .locator(".life-story-media")
    .evaluate(
      (section) =>
        section.getBoundingClientRect().bottom -
        section
          .querySelector(".gallery-page-link button")!
          .getBoundingClientRect().bottom,
    );
  expect(galleryCtaGap).toBeGreaterThanOrEqual(64);
  expect(galleryCtaGap).toBeLessThanOrEqual(100);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
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
  ).toBeGreaterThan(0);
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
  await expect(
    page.locator(".chapter-scene.is-current .orbit-two"),
  ).toHaveAttribute("src", "/illustrations/hero/chilli-sprig.webp");
  await expect(
    page.locator(".chapter-scene.is-current .scene-illustration"),
  ).toHaveAttribute("src", "/illustrations/farming-peppers.webp");
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
  await expect(page).toHaveURL(/(#living|farmhouses-for-sale-in-hyderabad)$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "LESS HURRY.",
  );
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Read this chapter" }).click();
  await page.waitForTimeout(1200);
  await expect(page).toHaveURL(/(#living|farmhouses-for-sale-in-hyderabad)$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Explore Farm Natura" });
  await expect(menu).toBeVisible();
  await menu.getByRole("button", { name: "01 Our Story" }).click();
  await expect(page).toHaveURL(/(#story|about-us)$/);
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
    "/images/farmhouse.webp",
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
  await page.getByLabel("Full name").fill("Test visitor");
  await page.getByLabel("Email address").fill("visitor@example.com");
  await page.getByLabel("Phone number").fill("9876543210");
  await page
    .getByLabel("Interested in", { exact: true })
    .selectOption("Farm Plots");
  await page
    .getByLabel("Looking for plot size")
    .selectOption("1/2 Acre (2420 sq.yards)");
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
  const audio = page.locator("audio");
  await expect(page.locator(".sound-toggle")).toHaveCount(0);
  expect(await audio.evaluate((el: HTMLAudioElement) => el.paused)).toBe(true);
  await expect(
    page.getByRole("button", { name: "Skip intro", exact: true }),
  ).toContainText("Skip the welcome");
  await page.getByRole("button", { name: "ENTER THE FARM" }).click();
  await expect(page.locator(".farm-entrance")).toBeVisible();
  await expect(page.locator(".entrance-copy")).toHaveCount(0);
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime))
    .toBeGreaterThan(0);
  await expect(
    page.getByRole("button", { name: "Turn sound off" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Skip intro", exact: true }).click();
  await expect(page.locator(".chapter-carousel")).toBeVisible();
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.paused))
    .toBe(false);
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime))
    .toBeGreaterThan(0);
  await expect(
    page.getByRole("button", { name: "Turn sound off" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Turn sound off" }).click();
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.paused))
    .toBe(true);
  await page.bringToFront();
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(
    page.getByRole("button", { name: "Turn sound off" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Explore Our Story", exact: true })
    .click();
  await expect(page).toHaveURL(/(#story|about-us)$/);
  expect(
    await page
      .locator(".hero-title")
      .evaluate((el) => getComputedStyle(el).opacity),
  ).toBe("1");
});

test("illustrated entrance advances through the farm story and enters automatically", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "ENTER THE FARM" }).click();
  await expect(page.locator(".entrance-copy")).toHaveCount(0);
  await expect(page.locator(".entrance-plough-team img")).toBeVisible();
  await expect(page.locator(".entrance-status")).toContainText("01 / 03");
  await expect(page.locator(".entrance-status")).toContainText("02 / 03", {
    timeout: 3500,
  });
  await expect(page.locator(".entrance-status")).toContainText("03 / 03", {
    timeout: 3500,
  });
  await expect(page.locator(".chapter-carousel")).toBeVisible({
    timeout: 3500,
  });
  expect(
    await page.evaluate(() => sessionStorage.getItem("farm-entered")),
  ).toBe("yes");
  await page.reload();
  await expect(page.locator(".chapter-carousel")).toBeVisible();
  await expect(page.locator(".farm-entrance")).toHaveCount(0);
});

test("Our Story hand-drawn artwork and reference-style selector work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#story");
  await page.evaluate(() => document.fonts.ready);
  const curvedTextBounds = await page
    .locator(".story-curved-line text")
    .evaluate((element) => {
      const bounds = (element as SVGGraphicsElement).getBBox();
      return { top: bounds.y, bottom: bounds.y + bounds.height };
    });
  expect(curvedTextBounds.top).toBeGreaterThanOrEqual(0);
  expect(curvedTextBounds.bottom).toBeLessThanOrEqual(150);
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
  const sections = await page
    .locator(".story-first-split, .story-second-split")
    .evaluateAll((els) =>
      els.map((el) => {
        const bounds = el.getBoundingClientRect();
        return { left: bounds.left, right: innerWidth - bounds.right };
      }),
    );
  for (const section of sections) {
    expect(section.left).toBeGreaterThanOrEqual(22);
    expect(section.right).toBeCloseTo(section.left, 0);
  }
  const media = await page
    .locator(".story-grove-art, .story-farm-frame")
    .evaluateAll((els) =>
      els.map((el) => {
        const bounds = el.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, viewport: innerWidth };
      }),
    );
  for (const item of media) {
    expect(item.left).toBeGreaterThanOrEqual(22);
    expect(item.right).toBeLessThanOrEqual(item.viewport - 22);
  }
  await page
    .locator(".story-first-split")
    .screenshot({ path: test.info().outputPath("story-spacing.png") });
  const weekends = page.getByRole("button", { name: /05 Farmhouse weekends/ });
  await weekends.click();
  await expect(weekends).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".story-selection-photo > img")).toHaveAttribute(
    "src",
    "/images/farmhouse.webp",
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
  await page.locator(".farming-about-photo").scrollIntoViewIfNeeded();
  await expect(page.locator(".farming-about-photo")).toHaveAttribute(
    "src",
    "/images/farm-estate.webp",
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
    // A small scroll must advance the handover gradually, rather than jump cards.
    expect(before - after).toBeLessThan(160);
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
    await page.evaluate((y) => window.scrollTo(0, y + 2400), start);
    await page.waitForTimeout(900);
    const exitGap = await page.evaluate(
      () =>
        document.querySelector(".visit-invitation")!.getBoundingClientRect()
          .top -
        document.querySelector(".farming-managed-card")!.getBoundingClientRect()
          .bottom,
    );
    expect(exitGap).toBeGreaterThan(120);
    expect(exitGap).toBeLessThan(220);
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
  await surface.scrollIntoViewIfNeeded();
  await expect(surface).toHaveAttribute("data-webgl", "unavailable");
  await expect(page.locator(".farming-about-photo")).toBeAttached();
  await page.getByRole("tab", { name: "01 Indigenous seeds" }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Locally adapted native and heirloom seeds",
  );
  expect(errors).toEqual([]);
});

test("Farm Life follows About's editorial, media and statistics sequence", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#living");
  const sequence = await page
    .locator(".farm-life-layout > section")
    .evaluateAll((els) =>
      els.map((el) => el.getAttribute("data-motion-section")),
    );
  expect(sequence).toEqual([
    "life-introduction",
    "life-botanical",
    "life-weekends",
    "gallery",
    "life-impact",
    "life-statistics",
  ]);
  await expect(page.locator(".life-statistic")).toHaveCount(6);
  await expect(
    page.locator(".life-statistic").first().locator("strong"),
  ).toHaveText("110");
  if (info.project.name === "mobile") {
    await expect(page.locator(".life-flower-scene")).toBeHidden();
    const photoBottom = await page
      .locator(".life-photo-scene")
      .evaluate((el) => el.getBoundingClientRect().bottom);
    const copyTop = await page
      .locator(".life-weekend-copy")
      .evaluate((el) => el.getBoundingClientRect().top);
    expect(copyTop).toBeGreaterThan(photoBottom);
    const lefts = await page
      .locator(".life-statistic")
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().left));
    expect(new Set(lefts).size).toBe(1);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Next photograph", exact: true })
    .click();
  await expect(page.locator(".gallery-photo > img")).toHaveAttribute(
    "src",
    "/images/farmhouse.webp",
  );
});

test("dedicated gallery supports the uploaded photos, filtering and keyboard viewing", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#gallery");
  await expect(page).toHaveTitle("Gallery — Farm Natura");
  await expect(page.locator(".gallery-journal-hero h1")).toContainText(
    "LIFE, AS",
  );
  await page.getByRole("button", { name: "EXPLORE THE GALLERY" }).click();
  await expect(page.locator(".gallery-journal-card")).toHaveCount(6);
  await expect(page.getByRole("status")).toHaveText(
    "Showing 6 of 6 photographs",
  );
  await expect(page.getByRole("button", { name: "MORE MOMENTS" })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Farm life", exact: true }).click();
  await expect(page.locator(".gallery-journal-card")).toHaveCount(3);
  await expect(
    page.getByRole("button", { name: "Farm life", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator(".gallery-journal-photo").first().click();
  const viewer = page.getByRole("dialog", {
    name: "Farm Natura photograph viewer",
  });
  await expect(viewer).toBeVisible();
  await expect(viewer.locator(".gallery-viewer-frame > img")).toHaveAttribute(
    "src",
    /images\/farmhouse.webp$/,
  );
  await page.keyboard.press("ArrowRight");
  await expect(viewer.locator(".gallery-viewer-frame > img")).toHaveAttribute(
    "src",
    /farm-estate.webp$/,
  );
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(viewer.locator(".gallery-viewer-frame > img")).toHaveAttribute(
    "src",
    /garden-planter.webp$/,
  );
  await page.keyboard.press("Escape");
  await expect(viewer).not.toBeVisible();
  await expect(page.locator(".gallery-journal-photo").first()).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("gallery films load on demand and gallery connects to navigation and enquiries", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html><body>Verified embed placeholder</body></html>",
    }),
  );
  await page.goto("/#living");
  await page.getByRole("button", { name: "VIEW THE GALLERY" }).click();
  await expect(page).toHaveURL(/(#gallery|gallery)$/);
  await expect(page.locator("iframe")).toHaveCount(0);
  const photoTab = page.getByRole("tab", { name: "Photographs" });
  await photoTab.focus();
  await photoTab.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Films" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "Films" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator(".gallery-films-grid figure")).toHaveCount(6);
  await page
    .getByRole("button", {
      name: "Play film: Pragya Jaiswal on sustainable living",
    })
    .click();
  const viewer = page.getByRole("dialog", { name: "Farm Natura film viewer" });
  await expect(viewer).toBeVisible();
  await expect(viewer.locator("iframe")).toHaveAttribute(
    "src",
    "https://www.youtube-nocookie.com/embed/C_XpxL-KpOs",
  );
  await page.getByRole("button", { name: "Close gallery viewer" }).click();
  await expect(page.locator("iframe")).toHaveCount(0);
  await page
    .getByRole("button", { name: "PLAN YOUR VISIT", exact: true })
    .click();
  await expect(page.locator(".contact-dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close enquiry" }).click();
  await page.getByRole("button", { name: "EXPLORE FARM LIFE" }).click();
  await expect(page).toHaveURL(/(#living|farmhouses-for-sale-in-hyderabad)$/);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("dialog", { name: "Explore Farm Natura" })
    .getByRole("button", { name: "Gallery", exact: false })
    .click();
  await expect(page).toHaveURL(/(#gallery|gallery)$/);
  await page.goBack();
  await expect(page).toHaveURL(/(#living|farmhouses-for-sale-in-hyderabad)$/);
});

test("Explore badge follows the pointer only over active illustration artwork", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => sessionStorage.setItem("farm-entered", "yes"));
  await page.goto("/");
  const art = page.locator(".chapter-scene.is-current .scene-illustration");
  const badge = page.locator(".explore-cursor");
  const bounds = await art.boundingBox();
  if (!bounds) throw new Error("Active illustration is missing");
  const x = bounds.x + bounds.width * 0.45,
    y = bounds.y + bounds.height * 0.45;
  await page.mouse.move(x, y);
  await expect(badge).toHaveAttribute("data-visible", "true");
  const first = await badge.boundingBox();
  await page.mouse.move(x + 60, y + 30);
  const second = await badge.boundingBox();
  expect(second!.x - first!.x).toBeCloseTo(60, 0);
  expect(second!.y - first!.y).toBeCloseTo(30, 0);
  await page.mouse.move(20, 120);
  await expect(badge).toHaveAttribute("data-visible", "false");
  await expect(badge).toHaveCSS("opacity", "0");
  // Hovering the chapter title or a neighbouring scene is not an Explore target.
  await page.locator(".chapter-caption h1").hover();
  await expect(badge).toHaveAttribute("data-visible", "false");
  await art.hover();
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(badge).toHaveAttribute("data-visible", "false");
  await page.getByRole("button", { name: "Close menu" }).click();
  await art.click();
  await expect(page).toHaveURL(/(#story|about-us)$/);
  await page.locator(".next-chapter-stage").scrollIntoViewIfNeeded();
  await page
    .locator(
      ".next-chapter-stage .chapter-scene.is-current .scene-illustration",
    )
    .hover();
  await expect(badge).toHaveAttribute("data-visible", "true");
  await page.mouse.move(20, 120);
  await expect(badge).toHaveAttribute("data-visible", "false");
});

test("Explore pointer badge settles smoothly and clears when illustrations change", async ({
  page,
}) => {
  await page.addInitScript(() => sessionStorage.setItem("farm-entered", "yes"));
  await page.goto("/");
  await page.locator(".chapter-scene.is-current .scene-illustration").hover();
  const badge = page.locator(".explore-cursor");
  await expect(badge).toHaveAttribute("data-visible", "true");
  await expect(badge).toHaveCSS("opacity", "1");
  await page.mouse.move(15, 120);
  await expect(badge).toHaveCSS("opacity", "0");
  await page.getByRole("button", { name: "Next chapter", exact: true }).click();
  await expect(badge).toHaveAttribute("data-visible", "false");
  await page.waitForTimeout(1100);
  await page.locator(".chapter-scene.is-current .scene-illustration").hover();
  await expect(badge).toHaveAttribute("data-visible", "true");
  await page.mouse.move(15, 120);
  await expect(badge).toHaveAttribute("data-visible", "false");
});

test("footer carousel browses all chapters without intercepting page reading", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#living");
  const carousel = page.locator(".next-chapter-stage");
  const title = carousel.getByRole("heading", { level: 2 });
  await expect(title).toHaveCount(0);
  await page.keyboard.press("ArrowDown");
  await expect(title).toHaveCount(0);
  await carousel.scrollIntoViewIfNeeded();
  await expect(title).toHaveText("Our Story");
  await expect(carousel.locator(".chapter-scene:visible")).toHaveCount(3);
  await expect(carousel.locator(".caption-explore, .next-explore")).toHaveCount(
    0,
  );
  if (info.project.name === "desktop") {
    await carousel.locator(".chapter-caption").hover();
    await carousel.evaluate((el) =>
      window.scrollTo(0, scrollY + el.getBoundingClientRect().top),
    );
    await expect
      .poll(() => carousel.evaluate((el) => el.getBoundingClientRect().top))
      .toBeLessThanOrEqual(1);
    const before = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 300);
    await expect(title).toHaveText("Natural Farming");
    expect(await page.evaluate(() => scrollY)).toBe(before);
  } else {
    await carousel
      .getByRole("button", { name: "Next chapter", exact: true })
      .click();
    await expect(title).toHaveText("Natural Farming");
  }
  await carousel
    .getByRole("button", { name: "Next chapter", exact: true })
    .click();
  await expect(title).toHaveText("Farm Life");
  await carousel
    .getByRole("button", { name: "Farm Life", exact: true })
    .click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await carousel.scrollIntoViewIfNeeded();
  await carousel
    .getByRole("button", { name: "Previous chapter", exact: true })
    .click();
  await expect(title).toHaveText("Natural Farming");
  await carousel
    .getByRole("button", { name: "Explore Natural Farming", exact: true })
    .click();
  await expect(page).toHaveURL(/(#farming|natural-farming)$/);
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel.getByRole("heading", { level: 2 })).toHaveText(
    "Farm Life",
  );
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("button", { name: "Close menu" }).click();
  await expect(carousel.getByRole("heading", { level: 2 })).toHaveText(
    "Farm Life",
  );
  if (info.project.name === "desktop") {
    await carousel.locator(".chapter-caption").hover();
    await carousel.evaluate((el) =>
      window.scrollTo(0, scrollY + el.getBoundingClientRect().top),
    );
    await expect
      .poll(() => carousel.evaluate((el) => el.getBoundingClientRect().top))
      .toBeLessThanOrEqual(1);
    const before = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, -300);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(before);
  }
  expect(errors).toEqual([]);
});

test("footer carousel wheel navigation works alongside smooth page scrolling", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Wheel input is a desktop interaction",
  );
  await page.goto("/#story");
  const carousel = page.locator(".next-chapter-stage");
  const title = carousel.getByRole("heading", { level: 2 });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await carousel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  await carousel.evaluate((el) =>
    window.scrollTo(0, scrollY + el.getBoundingClientRect().top),
  );
  await expect
    .poll(() => carousel.evaluate((el) => el.getBoundingClientRect().top))
    .toBeLessThanOrEqual(1);
  await page.mouse.move(720, 750);
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 300);
  await expect(title).toHaveText("Farm Life");
  await page.waitForTimeout(1100);
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await page.mouse.wheel(0, -300);
  await expect(title).toHaveText("Natural Farming");
  await page.waitForTimeout(1100);
  await page.mouse.wheel(0, -300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(before);
});

test("scrolling into the footer carousel keeps the page's smooth scroll handler", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Wheel input is a desktop interaction",
  );
  await page.goto("/#story");
  await page.waitForTimeout(1300);
  const carousel = page.locator(".next-chapter-stage");
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(
      0,
      scrollY +
        document.querySelector(".next-chapter-stage")!.getBoundingClientRect()
          .top -
        450,
    );
  });
  await expect
    .poll(() => carousel.evaluate((el) => el.getBoundingClientRect().top))
    .toBeGreaterThan(400);
  await page.mouse.move(720, 750);
  await page.evaluate(() => {
    (window as any).__footerWheelPrevented = null;
    window.addEventListener(
      "wheel",
      (event) => {
        (window as any).__footerWheelPrevented = event.defaultPrevented;
      },
      { once: true },
    );
  });
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 180);
  await expect
    .poll(() => page.evaluate(() => (window as any).__footerWheelPrevented))
    .toBe(true);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel.getByRole("heading", { level: 2 })).toHaveText(
    "Natural Farming",
  );
});

test("farm tune starts on request, loops, and continues across chapter navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => sessionStorage.setItem("farm-entered", "yes"));
  const musicRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/audio/")) musicRequests.push(request.url());
  });
  await page.goto("/");
  const audio = page.locator("audio");
  await expect(audio).toHaveAttribute("preload", "none");
  expect(await audio.evaluate((el: HTMLAudioElement) => el.paused)).toBe(true);
  expect(musicRequests).toEqual([]);
  await page.bringToFront();
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(
    page.getByRole("button", { name: "Turn sound off" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime))
    .toBeGreaterThan(0);
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.volume))
    .toBeCloseTo(0.18);
  expect(await audio.evaluate((el: HTMLAudioElement) => el.loop)).toBe(true);
  expect(
    await audio.evaluate((el: HTMLAudioElement) => el.duration),
  ).toBeCloseTo(60, 0);
  const before = await audio.evaluate((el: HTMLAudioElement) => el.currentTime);
  await page.getByRole("button", { name: "Our Story", exact: true }).click();
  await expect(page).toHaveURL(/(#story|about-us)$/);
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime))
    .toBeGreaterThan(before);
  await audio.evaluate((el: HTMLAudioElement) => {
    el.currentTime = el.duration - 0.2;
  });
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime))
    .toBeLessThan(2);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.paused))
    .toBe(true);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.paused))
    .toBe(false);
  await page.getByRole("button", { name: "Turn sound off" }).click();
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.paused))
    .toBe(true);
  expect(await audio.evaluate((el: HTMLAudioElement) => el.volume)).toBe(0);
  await expect(
    page.getByRole("button", { name: "Turn sound on" }),
  ).toHaveAttribute("aria-pressed", "false");
});
