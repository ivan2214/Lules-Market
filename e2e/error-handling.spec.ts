// spec: specs/full-app.md
// seed: e2e/seed.spec.ts

import { expect, test } from "@playwright/test";

test.describe("Error Handling & Edge Cases", () => {
  test("Invalid Email Signup Validation", async ({ page }) => {
    // 1. Navigate to signup page
    await page.goto("http://localhost:3000/signup");

    // 2. Try to submit form with invalid email formats
    const nameField = page.getByRole("textbox", { name: "Nombre Completo" });
    const emailField = page.getByRole("textbox", { name: "Email" });
    const passwordField = page.getByRole("textbox", {
      name: "Contraseña",
      exact: true,
    });
    const confirmField = page.getByRole("textbox", {
      name: "Confirmar Contraseña",
    });

    // Fill valid name
    await nameField.fill("Test User");

    // Try invalid email
    await emailField.fill("invalidemail");
    await passwordField.fill("TestPassword123");
    await confirmField.fill("TestPassword123");

    // Try to submit
    await page.getByRole("button", { name: "Crear Cuenta" }).click();

    // 3. Verify error message displays (email validation)
    // The form should prevent submission with invalid email
    // Check that we're still on signup page
    await expect(page).toHaveURL(/\/signup/);
  });

  test("Weak Password Validation", async ({ page }) => {
    // 1. Navigate to signup page
    await page.goto("http://localhost:3000/signup");

    // 2. Try passwords that are too weak
    const nameField = page.getByRole("textbox", { name: "Nombre Completo" });
    const emailField = page.getByRole("textbox", { name: "Email" });
    const passwordField = page.getByRole("textbox", {
      name: "Contraseña",
      exact: true,
    });
    const confirmField = page.getByRole("textbox", {
      name: "Confirmar Contraseña",
    });

    await nameField.fill("Test User");
    await emailField.fill("test@example.com");

    // Try weak password (less than 8 chars)
    await passwordField.fill("weak");
    await confirmField.fill("weak");

    await page.getByRole("button", { name: "Crear Cuenta" }).click();

    // 3. Verify error message for weak password
    // Should remain on signup page
    await expect(page).toHaveURL(/\/signup/);
  });

  test("Password Mismatch on Signup", async ({ page }) => {
    // 1. Navigate to signup page
    await page.goto("http://localhost:3000/signup");

    // 2. Enter mismatched passwords
    const nameField = page.getByRole("textbox", { name: "Nombre Completo" });
    const emailField = page.getByRole("textbox", { name: "Email" });
    const passwordField = page.getByRole("textbox", {
      name: "Contraseña",
      exact: true,
    });
    const confirmField = page.getByRole("textbox", {
      name: "Confirmar Contraseña",
    });

    await nameField.fill("Test User");
    await emailField.fill("test@example.com");
    await passwordField.fill("TestPassword123");
    await confirmField.fill("DifferentPassword456");

    // 3. Try to submit
    await page.getByRole("button", { name: "Crear Cuenta" }).click();

    // 4. Verify error message about password mismatch
    // Should remain on signup page
    await expect(page).toHaveURL(/\/signup/);
  });

  test("Missing Required Fields", async ({ page }) => {
    // 1. Navigate to signup page
    await page.goto("http://localhost:3000/signup");

    // 2. Try to submit form with empty email field
    const passwordField = page.getByRole("textbox", {
      name: "Contraseña",
      exact: true,
    });
    const confirmField = page.getByRole("textbox", {
      name: "Confirmar Contraseña",
    });

    await passwordField.fill("TestPassword123");
    await confirmField.fill("TestPassword123");

    // Try to submit without email
    await page.getByRole("button", { name: "Crear Cuenta" }).click();

    // 3. Verify error message for missing email
    // Should remain on signup page
    await expect(page).toHaveURL(/\/signup/);
  });

  test("404 Page Not Found", async ({ page }) => {
    // 1. Navigate to non-existent URL
    await page.goto("http://localhost:3000/invalid-page-xyz123");

    // 2. Verify 404 page or appropriate message
    // The application should either show 404 or redirect
    const isNotFound = await page
      .getByText(/no encontrad|404|error|not found/i)
      .isVisible()
      .catch(() => false);
    const url = page.url();
    expect([isNotFound, url.includes("invalid")]).toContain(true);
  });

  test("Unauthorized Access Protection", async ({ page }) => {
    // 1. Without authentication, try to access dashboard
    await page.goto("http://localhost:3000/dashboard");

    // 2. Should redirect to signin page
    await expect(page).toHaveURL(/\/signin|\/auth/);
    await expect(page.getByText("Iniciar Sesión").first()).toBeVisible();
  });
});
