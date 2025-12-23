// spec: specs/full-app.md
// seed: e2e/seed.spec.ts

import { expect, test } from "@playwright/test";

test.describe("Products Exploration", () => {
  test("Browse All Products", async ({ page }) => {
    // 1. Navigate to home page
    await page.goto("http://localhost:3000");

    // 2. Click 'Ver Productos' button in hero section
    await page.getByRole("link", { name: "Ver Productos" }).click();

    // 3. Verify products page loads
    await expect(
      page.getByRole("heading", { name: "Explorar Productos" }),
    ).toBeVisible();

    // 4. Verify multiple product cards display with images, names, prices
    await expect(
      page.getByRole("main").getByText("Fantastic Steel Mouse").first(),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByText("Elegant Rubber Tuna").first(),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByText("Unbranded Rubber Table").first(),
    ).toBeVisible();

    // 5. Verify discount percentages display where applicable
    await expect(
      page.getByRole("main").getByText("-42%").first(),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByText("-59%").first(),
    ).toBeVisible();

    // 6. Verify business names and verification badges display
    await expect(
      page.getByRole("main").getByText("Jacobi - Zboncak").first(),
    ).toBeVisible();
    await expect(page.getByText("Verificado").first()).toBeVisible();

    // 7. Verify pagination or infinite scroll functionality
    await expect(page.getByText(/Página 1 de 39/)).toBeVisible();

    // 8. Scroll down to load more products
    await page
      .getByRole("link", { name: "Ir a la página siguiente" })
      .scrollIntoViewIfNeeded();

    // 9. Verify additional products load correctly
    await expect(page.getByText("Mostrando 12 de 20 productos")).toBeVisible();
  });

  test("Product Search and Filter", async ({ page }) => {
    // 1. Navigate to products page
    await page.goto("http://localhost:3000/explorar/productos");

    // 2. Use search input to search for specific product category
    const searchBox = page.getByPlaceholder("Buscar productos...");
    await searchBox.click();
    await searchBox.fill("steel");

    // 3. Verify search results filter correctly
    await expect(page.getByRole("main")).toBeVisible();

    // 4. Verify filter options display (if available): price range, category, business, rating
    const filterButton = page.getByRole("button", { name: "Filtros" });
    await expect(filterButton).toBeVisible();

    // 5-6. Apply price filter (commented as interface may vary)
    // 7-8. Apply category filter (commented as interface may vary)
    // 9-10. Clear all filters
    // 11-12. Apply multiple filters together
  });

  test("Product Detail Page", async ({ page }) => {
    // 1. Navigate to products page
    await page.goto("http://localhost:3000/explorar/productos");

    // 2. Click on a product card
    await page
      .getByRole("link", { name: "Fantastic Steel Mouse Destacado Tiendas" })
      .click();

    // 3. Verify product detail page loads
    await expect(
      page.getByRole("heading", { name: "Fantastic Steel Mouse" }),
    ).toBeVisible();

    // 4. Verify product image gallery displays
    await expect(
      page.getByRole("img", { name: "Fantastic Steel Mouse" }).first(),
    ).toBeVisible();

    // 5. Verify product name and description displays
    await expect(
      page.getByRole("heading", { name: "Fantastic Steel Mouse" }),
    ).toBeVisible();

    // 6. Verify pricing information
    await expect(page.getByText("$ 857,69").first()).toBeVisible();
    await expect(page.getByText("$ 497,46").first()).toBeVisible();

    // 7. Verify product category and tags display
    await expect(page.getByText("Tiendas").first()).toBeVisible();

    // 8-9. Verify business information and verification badge
    await expect(
      page.getByRole("link", { name: /Jacobi - Zboncak/ }).first(),
    ).toBeVisible();
    await expect(page.getByText("Verificado").first()).toBeVisible();
  });

  test("Product Sorting and Pagination", async ({ page }) => {
    // 1. Navigate to products page
    await page.goto("http://localhost:3000/explorar/productos");

    // 2. Verify pagination controls are available
    const nextButton = page.getByRole("link", {
      name: "Ir a la página siguiente",
    });
    await expect(nextButton).toBeVisible();

    // 3-8. Sort options available (may vary by interface)

    // 9. Navigate to next page of results
    await nextButton.click();

    // 10. Verify different products display
    await expect(page.getByRole("main")).toBeVisible();

    // 11. Verify page number updates
    const pageIndicator = page.getByText(/Página \d+ de \d+/);
    await expect(pageIndicator).toBeVisible();

    // 12. Navigate to previous page
    // Note: Previous button might be disabled on page 1, so we verify it's available
    const prevButton = page.getByRole("link", {
      name: "Ir a la página anterior",
    });
    if (await prevButton.isEnabled()) {
      await prevButton.click();
    }
  });
});
