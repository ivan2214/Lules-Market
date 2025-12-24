// spec: specs/full-app.md
// seed: e2e/seed.spec.ts

import { expect, test } from "@playwright/test";

test.describe("Static Pages & Content", () => {
  test("FAQ Page", async ({ page }) => {
    // 1. Navigate to FAQ page
    await page.goto("http://localhost:3000/faq");

    // 2. Verify page loads with FAQ heading
    await expect(
      page.getByRole("heading", { name: "Preguntas Frecuentes" }),
    ).toBeVisible();

    // 3. Verify page content displays
    const heading = page.getByRole("heading", { name: "Preguntas Frecuentes" });
    await expect(heading).toBeVisible();
  });

  test("Privacy Policy Page", async ({ page }) => {
    // 1. Navigate to Privacy Policy page via footer link
    await page.goto("http://localhost:3000");
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();

    // 2. Click privacy policy link
    await footer.getByRole("link", { name: "Política de Privacidad" }).click();

    // 3. Verify page loads
    await expect(page).toHaveURL(/\/privacidad/);

    // 4. Verify content displays
    const heading = page.getByRole("heading", {
      name: "Política de Privacidad",
    });
    await expect(heading).toBeVisible();
  });

  test("Terms and Conditions Page", async ({ page }) => {
    // 1. Navigate to Terms page via footer link
    await page.goto("http://localhost:3000");
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();

    // 2. Click terms link
    await footer.getByRole("link", { name: "Términos y Condiciones" }).click();

    // 3. Verify page loads
    await expect(page).toHaveURL(/\/terminos/);

    // 4. Verify content displays
    const heading = page.getByRole("heading", {
      name: "Términos y Condiciones",
    });
    await expect(heading).toBeVisible();
  });

  test("Cookies Policy Page", async ({ page }) => {
    // 1. Navigate to Cookies Policy via footer link
    await page.goto("http://localhost:3000");
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();

    // 2. Click cookies policy link
    await footer.getByRole("link", { name: "Política de Cookies" }).click();

    // 3. Verify page loads
    await expect(page).toHaveURL(/\/politica-de-cookies/);

    // 4. Verify content displays
    const heading = page.getByRole("heading", { name: "Política de Cookies" });
    await expect(heading).toBeVisible();
  });
});
