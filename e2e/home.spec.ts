import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Lules Market/);
});

test("check for main heading", async ({ page }) => {
  await page.goto("/");
  // Basic check to ensure the page renders content
  await expect(page.locator("body")).toBeVisible();
});
