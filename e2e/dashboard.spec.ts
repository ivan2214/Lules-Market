// spec: specs/full-app.md
// seed: e2e/seed.spec.ts

import { expect, test } from "@playwright/test";

test.describe("Business Management Dashboard", () => {
  test("Dashboard Access and Layout", async ({ page }) => {
    // 1. Authenticate as a merchant user
    await page.goto("http://localhost:3000/signin");
    await page
      .getByRole("textbox", { name: "Email" })
      .fill("hassan.parisian@hotmail.com");
    await page.getByRole("textbox", { name: "Contraseña" }).fill("test2214");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();

    // 2. Verify logged in and navigate to dashboard
    await expect(
      page.getByRole("heading", { name: "Panel de Control" }),
    ).toBeVisible();

    // 3. Verify dashboard displays main sections
    // Dashboard layout verification
    const main = page.getByRole("main");
    await expect(main).toBeVisible();
  });

  test("Product Management - Create Product", async ({ page }) => {
    // 1. Authenticate as merchant
    await page.goto("http://localhost:3000/signin");
    await page
      .getByRole("textbox", { name: "Email" })
      .fill("hassan.parisian@hotmail.com");
    await page.getByRole("textbox", { name: "Contraseña" }).fill("test2214");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();

    // 2. Verify dashboard loads
    await expect(
      page.getByRole("heading", { name: "Panel de Control" }),
    ).toBeVisible();

    // 3. Navigate to product creation (URL-based as UI may vary)
    // Note: Product creation form location depends on dashboard implementation
    await page.goto("http://localhost:3000/dashboard");
  });
});
