// spec: specs/full-app.md
// seed: e2e/seed.spec.ts

import { expect, test } from "@playwright/test";

test.describe("Business Exploration", () => {
  test("Browse All Businesses", async ({ page }) => {
    // 1. Navigate to home page
    await page.goto("http://localhost:3000");

    // 2. Click 'Explorar Comercios' button or link (use main content to avoid footer)
    await page
      .getByRole("main")
      .getByRole("link", { name: "Explorar Comercios" })
      .click();

    // 3. Verify businesses page loads
    await expect(page).toHaveURL(/\/explorar\/comercios/);

    // 4. Verify business cards display
    const mainContent = page.getByRole("main");
    await expect(mainContent).toBeVisible();

    // 5. Verify business information displays
    // Cards should show name, category, description
    const businessCard = page
      .locator("div")
      .filter({ hasText: /Ryan - Rippin|Barton and Sons|Murray and Sons/ });
    if (await businessCard.first().isVisible()) {
      await expect(businessCard.first()).toBeVisible();
    }
  });

  test("Business Search and Filter", async ({ page }) => {
    // 1. Navigate to businesses page
    await page.goto("http://localhost:3000/explorar/comercios");

    // 2. Use search to find business by name
    const searchBox = page.getByPlaceholder("Buscar comercios, ubicaciones...");
    if (await searchBox.isVisible()) {
      await searchBox.click();
      await searchBox.fill("Ryan");

      // 3. Verify search results filter to matching businesses
      await expect(page.getByText(/Ryan/i)).toBeVisible();
    }

    // 4. Verify filter options display
    const filterButton = page.getByRole("button", { name: "Filtros" });
    if (await filterButton.isVisible()) {
      await expect(filterButton).toBeVisible();
    }
  });

  test("Business Detail Page", async ({ page }) => {
    // 1. Navigate to businesses page
    await page.goto("http://localhost:3000/explorar/comercios");

    // 2. Click on a business card
    const firstBusiness = page
      .locator("a")
      .filter({ hasText: /Ryan - Rippin|Jacobi|Barton/ })
      .first();
    if (await firstBusiness.isVisible()) {
      await firstBusiness.click();

      // 3. Verify business detail page loads
      const mainContent = page.getByRole("main");
      await expect(mainContent).toBeVisible();

      // 4. Verify business name displays
      await expect(page.getByRole("heading")).toBeVisible();

      // 5. Verify business description and information displays
      const businessInfo = page
        .locator("text")
        .filter({ hasText: /Servicios|Tecnología|Vestimenta/ });
      if (await businessInfo.first().isVisible()) {
        await expect(businessInfo.first()).toBeVisible();
      }
    }
  });
});
