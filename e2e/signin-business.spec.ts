import { expect, test } from "@playwright/test";

test("signin-business", async ({ page }) => {
  await page.goto("");
  await page.getByRole("link", { name: "Para comercios" }).click();
  await page.getByRole("link", { name: "Iniciar sesión", exact: true }).click();
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("hassan.parisian@hotmail.com");
  await page.getByRole("textbox", { name: "Email" }).press("Tab");
  await page.getByRole("textbox", { name: "Contraseña" }).fill("test2214");
  await page.getByRole("button", { name: "Iniciar Sesión" }).click();
  const heading = await page.getByRole("heading", { name: "Panel de Control" });
  await expect(heading).toBeVisible();
});
