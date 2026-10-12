import { test, expect } from "@playwright/test";

test("conversation chat collects a name, answers questions, resets and opens visit booking", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about-us");
  const launcher = page.getByRole("button", { name: "Open Farm Natura chat" });
  await launcher.click();
  const chat = page.getByRole("dialog", { name: "Farm Natura", exact: true });
  await expect(chat).toBeVisible();
  await expect(chat.getByRole("log")).toContainText("May we have your name");
  await expect(
    chat.getByRole("button", { name: "Send message" }),
  ).toBeDisabled();
  await chat.getByLabel("Your name", { exact: true }).fill("Sravan");
  await chat.getByRole("button", { name: "Send message" }).click();
  await expect(chat.getByRole("log")).toContainText("Hi Sravan!");
  await chat.getByRole("button", { name: "Where is Farm Natura?" }).click();
  await expect(chat.getByRole("log")).toContainText("Kandukur");
  await chat
    .getByLabel("Your message", { exact: true })
    .fill("I'd like to visit & learn about natural farming.");
  await chat.getByLabel("Your message", { exact: true }).press("Enter");
  const href = await chat
    .getByRole("link", { name: "Continue on WhatsApp" })
    .getAttribute("href");
  expect(new URL(href!).searchParams.get("text")).toContain(
    "I'm Sravan. I'd like to visit & learn about natural farming.",
  );
  expect(new URL(href!).pathname).toBe("/919579555666");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    await page.evaluate(() => innerWidth),
  );
  await page.screenshot({ path: info.outputPath("conversation-chat.png") });
  await chat.getByRole("button", { name: "Restart chat" }).click();
  await expect(chat.getByLabel("Your name", { exact: true })).toHaveValue("");
  await expect(chat.getByRole("log")).not.toContainText("Sravan");
  await page.keyboard.press("Escape");
  await expect(chat).not.toBeVisible();
  await expect(launcher).toBeFocused();
  await launcher.click();
  await chat.getByLabel("Your name", { exact: true }).fill("Sravan");
  await chat.getByLabel("Your name", { exact: true }).press("Enter");
  await chat.getByRole("button", { name: "Plan a farm visit" }).click();
  await expect(page.locator(".contact-dialog")).toBeVisible();
  await expect(page.locator(".floating-chat")).toHaveCount(0);
  await page.getByRole("button", { name: "Close enquiry" }).click();
  await expect(launcher).toBeVisible();
});
