import { test, expect } from "@playwright/test";

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

test.use({
  launchOptions: {
    executablePath: chrome,
    args: ["--autoplay-policy=no-user-gesture-required"],
  },
});

test.describe("permitted preloader autoplay", () => {
  test("starts during the preloader, continues into the story and respects mute", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(".farm-entrance")).toBeVisible();
    const audio = page.locator("audio");
    await expect
      .poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime))
      .toBeGreaterThan(0);
    await expect(
      page.getByRole("button", { name: "Turn sound off" }),
    ).toBeVisible();
    await expect(page).toHaveURL(/about-us$/, { timeout: 10000 });
    const time = await audio.evaluate((a: HTMLAudioElement) => a.currentTime);
    await expect
      .poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime))
      .toBeGreaterThan(time);
    await page.getByRole("button", { name: "Turn sound off" }).click();
    await expect
      .poll(() => audio.evaluate((a: HTMLAudioElement) => a.paused))
      .toBe(true);
    await page.locator(".story-scene h1").click();
    expect(await audio.evaluate((a: HTMLAudioElement) => a.paused)).toBe(true);
  });
});

for (const afterLoader of [false, true]) {
  test(`blocked autoplay resumes on first gesture ${afterLoader ? "after" : "during"} the preloader`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const original = HTMLMediaElement.prototype.play;
      let attempts = 0;
      HTMLMediaElement.prototype.play = function () {
        if (++attempts === 1)
          return Promise.reject(
            new DOMException("Autoplay blocked", "NotAllowedError"),
          );
        return original.call(this);
      };
    });
    if (afterLoader) await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator(".farm-entrance")).toBeVisible();
    const audio = page.locator("audio");
    await expect(
      page.getByRole("button", { name: "Turn sound on" }),
    ).toBeVisible();
    if (afterLoader) {
      await expect(page).toHaveURL(/about-us$/, { timeout: 10000 });
      await page.locator(".story-scene h1").click();
    } else {
      await page.locator(".entrance-header .brand-logo").click();
    }
    await expect
      .poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime))
      .toBeGreaterThan(0);
    await expect(
      page.getByRole("button", { name: "Turn sound off" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
}
