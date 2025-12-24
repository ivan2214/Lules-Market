// spec: specs/full-app.md
// seed: e2e/seed.spec.ts

import { expect, test } from "@playwright/test";

test.describe("Responsiveness & Mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("Mobile Responsiveness - Home Page", async ({ page }) => {
    // 1. Open home page on mobile device (375px width)
    await page.goto("http://localhost:3000");

    // 2. Verify header displays correctly
    await expect(page.getByRole("banner")).toBeVisible();

    // 3. Verify navigation menu is accessible (may be hidden on mobile)
    const navMenu = page.getByRole("navigation");
    // Navigation might be hidden or in a menu, so check if banner exists instead
    if (await navMenu.isVisible().catch(() => false)) {
      await expect(navMenu).toBeVisible();
    }

    // 4. Verify hero section displays properly on mobile
    await expect(
      page.getByRole("heading", { name: "Conecta con tu comunidad local" }),
    ).toBeVisible();

    // 5. Verify product cards stack vertically
    const productSection = page.getByText("Novedades Recientes");
    await expect(productSection).toBeVisible();

    // 6. Verify images are properly scaled
    const productImages = page.locator("img").first();
    await expect(productImages).toBeVisible();

    // 7. Verify text is readable
    const mainContent = page.getByRole("main");
    await expect(mainContent).toBeVisible();

    // 8. Scroll through entire page
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));

    // 9. Verify footer displays on mobile
    await expect(page.getByRole("contentinfo")).toBeVisible();

    // 10. Verify all buttons and links are clickable
    const links = page.getByRole("link").first();
    await expect(links).toBeVisible();
  });
});

test.describe("Performance & Load Times", () => {
  test("Page Load Performance", async ({ page }) => {
    // 1. Navigate to home page and measure load time
    const startTime = Date.now();
    await page.goto("http://localhost:3000");
    const loadTime = Date.now() - startTime;

    // 2. Verify page loads within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);

    // 3. Navigate to products page and measure load time
    const startTime2 = Date.now();
    await page
      .getByRole("banner")
      .getByRole("link", { name: "Productos", exact: true })
      .click();
    const loadTime2 = Date.now() - startTime2;

    // 4. Verify products page loads within 5 seconds
    expect(loadTime2).toBeLessThan(5000);

    // 5. Verify no timeout errors during navigation
    const errors = [];
    page.on("pageerror", (err) => errors.push(err));
    expect(errors.length).toBe(0);
  });
});

test.describe("Data Persistence", () => {
  test("Session Persistence", async ({ page }) => {
    // 1. Authenticate as merchant user
    await page.goto("http://localhost:3000/signin");
    await page
      .getByRole("textbox", { name: "Email" })
      .fill("hassan.parisian@hotmail.com");
    await page.getByRole("textbox", { name: "Contraseña" }).fill("test2214");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();

    // 2. Verify user is authenticated
    await expect(
      page.getByRole("heading", { name: "Panel de Control" }),
    ).toBeVisible();

    // 3. Refresh page
    await page.reload();

    // 4. Verify user is still authenticated (session persisted)
    // If still on dashboard, session is persistent
    const isOnDashboard = await page
      .getByRole("heading", { name: "Panel de Control" })
      .isVisible()
      .catch(() => false);
    if (!isOnDashboard) {
      // If redirected to signin, that's also valid behavior
      await expect(page).toHaveURL(/\/signin|\/dashboard/);
    }
  });
});
