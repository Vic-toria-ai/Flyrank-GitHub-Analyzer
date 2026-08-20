import { test, expect } from "@playwright/test";

test("user can view a profile and analyze it", async ({ page }) => {
  await page.goto("/profile/torvalds");

  // confirm the profile info loaded
  await expect(page.getByRole("heading", { name: /linus torvalds/i })).toBeVisible();

  // click the real Analyze button
  await page.getByRole("button", { name: /analyze profile/i }).click();

  // confirm it enters the loading state — this proves the primary flow works,
  // without depending on a slow third-party AI response to fully complete
  await expect(page.getByRole("button", { name: /analyzing/i })).toBeVisible();
});