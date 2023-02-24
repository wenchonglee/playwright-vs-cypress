import { expect, test } from "@playwright/test";

test.describe("Aliasing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://example.cypress.io/commands/aliasing");
  });

  test(".as() - alias a DOM element for later use", async ({ page }) => {
    // There's no aliasing in Playwright, but you can save locators
    const firstButton = page.getByRole("cell", { name: "Row 1: Cell 1" }).getByRole("button");
    await firstButton.click();

    await expect(firstButton).toHaveClass(/btn-success/);
    await expect(firstButton).toHaveText(/changed/i);
  });

  test(".as() - alias a route for later use", async ({ page }) => {
    const commentPromise = page.waitForResponse("**/comments/*");

    await page.locator(".network-btn").click();

    const response = await commentPromise;
    expect(response.status()).toBe(200);
  });
});
