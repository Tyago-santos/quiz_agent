import { test, expect } from "@playwright/test";

test("faz login com sucesso", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("xlzthiago@gmail.com");
  await page.getByLabel("senha", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Logar" }).click();

  await expect(page.getByRole("heading", { name: "Quiz AI" })).toBeVisible();
});
