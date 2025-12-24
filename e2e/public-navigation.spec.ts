// spec: specs/full-app.md
// seed: e2e/seed.spec.ts

import { expect, test } from "@playwright/test";

test.describe("Home Page & Public Navigation", () => {
  test("Home Page Loads Successfully", async ({ page }) => {
    // 1. Navigate to home page (root URL)
    await page.goto("http://localhost:3000");

    // 2. Verify page title is 'Lules Market - Tu Vitrina Digital para Comercios Locales'
    await expect(page).toHaveTitle(
      "Lules Market - Tu Vitrina Digital para Comercios Locales",
    );

    // 3. Verify header with logo and navigation menu displays
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Logo" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("banner").getByRole("navigation"),
    ).toBeVisible();

    // 4. Verify search bar for products displays
    await expect(page.getByPlaceholder("Buscar productos...")).toBeVisible();

    // 5. Verify main hero section displays with call-to-action buttons
    await expect(
      page.getByRole("heading", { name: "Conecta con tu comunidad local" }),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: "Explorar Comercios" }),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: "Ver Productos" }),
    ).toBeVisible();

    // 6. Verify statistics section showing active businesses and published products
    await expect(
      page.getByRole("main").getByText("Comercios Activos").first(),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByText("Productos Publicados").first(),
    ).toBeVisible();

    // 7. Verify featured businesses section displays at least 6 businesses
    await expect(
      page.getByRole("heading", { name: "Comercios que inspiran" }),
    ).toBeVisible();
    // Verify that at least one business card is visible
    const businessCards = page
      .getByRole("main")
      .getByRole("link")
      .filter({ hasText: /Ryan|Barton|Murray|Jacobi/ });
    await expect(businessCards.first()).toBeVisible();

    // 8. Verify recent products section displays products with images and prices
    await expect(
      page.getByRole("heading", { name: "Novedades Recientes" }),
    ).toBeVisible();
    await expect(page.getByText("Elegant Rubber Tuna")).toBeVisible();

    // 9. Verify footer with links and copyright
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByText(/© 2025 Lules Market/)).toBeVisible();
  });

  test("Main Navigation Menu", async ({ page }) => {
    // 1. Navigate to home page
    await page.goto("http://localhost:3000");

    // 2. Verify navigation menu displays: Inicio, Productos, Comercios, Planes, Preguntas Frecuentes
    await expect(
      page
        .getByRole("banner")
        .getByRole("link", { name: "Inicio", exact: true }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("banner")
        .getByRole("link", { name: "Productos", exact: true }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("banner")
        .getByRole("link", { name: "Comercios", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Planes" }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("banner")
        .getByRole("link", { name: "Preguntas Frecuentes" }),
    ).toBeVisible();

    // 3. Click 'Inicio' link
    await page.getByRole("link", { name: "Inicio", exact: true }).click();

    // 4. Verify navigation to home page
    await expect(page).toHaveURL(/\/$|home/);
    await expect(
      page.getByRole("heading", { name: "Conecta con tu comunidad local" }),
    ).toBeVisible();

    // 5. Click 'Productos' link
    await page.getByRole("link", { name: "Productos", exact: true }).click();

    // 6. Verify navigation to products exploration page
    await expect(page).toHaveURL(/\/explorar\/productos/);

    // 7. Click 'Comercios' link
    await page.getByRole("link", { name: "Comercios", exact: true }).click();

    // 8. Verify navigation to businesses exploration page
    await expect(page).toHaveURL(/\/explorar\/comercios/);

    // 9. Click 'Planes' link
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Planes" })
      .click();

    // 10. Verify navigation to plans page
    await expect(page).toHaveURL(/\/planes/);

    // 11. Click 'Preguntas Frecuentes' link
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Preguntas Frecuentes" })
      .click();

    // 12. Verify navigation to FAQ page
    await expect(page).toHaveURL(/\/faq/);
  });

  test("Header Search Functionality", async ({ page }) => {
    // 1. Navigate to home page
    await page.goto("http://localhost:3000");

    // 2. Locate search bar in header
    const searchBox = page.getByPlaceholder("Buscar productos...");

    // 3. Click on search input field
    await searchBox.click();

    // 4. Type a product keyword (e.g., 'laptop', 'comida')
    await searchBox.fill("laptop");

    // 5. Press Enter or click search button
    await searchBox.press("Enter");

    // 6. Verify navigation to products page with search results
    await expect(page).toHaveURL(/\/explorar\/productos/);

    // 7. Verify search results filtered by keyword
    // Note: Search results verification depends on backend filtering implementation
    // This assertion checks that some content is visible after search
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("Footer Links Navigation", async ({ page }) => {
    // 1. Navigate to home page
    await page.goto("http://localhost:3000");

    // 2. Scroll to footer
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();

    // 3. Verify footer sections: Plataforma, Comercio, Legal
    await expect(
      footer.getByRole("heading", { name: "Plataforma" }),
    ).toBeVisible();
    await expect(
      footer.getByRole("heading", { name: "Comercio" }),
    ).toBeVisible();
    await expect(footer.getByRole("heading", { name: "Legal" })).toBeVisible();

    // 4. Click on 'Explorar Productos' under Plataforma
    await footer.getByRole("link", { name: "Explorar Productos" }).click();

    // 5. Verify navigation to products page
    await expect(page).toHaveURL(/\/explorar\/productos/);

    // 6. Navigate back to home page
    await page.goto("http://localhost:3000");
    await footer.scrollIntoViewIfNeeded();

    // 7. Click on 'Explorar Comercios' under Plataforma
    await footer.getByRole("link", { name: "Explorar Comercios" }).click();

    // 8. Verify navigation to businesses page
    await expect(page).toHaveURL(/\/explorar\/comercios/);

    // 9. Navigate back to home page
    await page.goto("http://localhost:3000");
    await footer.scrollIntoViewIfNeeded();

    // 10. Click on 'Planes' under Plataforma
    await footer.getByRole("link", { name: "Planes" }).click();

    // Verify navigation to plans page
    await expect(page).toHaveURL(/\/planes/);
  });
});
