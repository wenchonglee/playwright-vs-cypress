import { expect, test } from "@playwright/test";

test.describe("example to-do app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://example.cypress.io/todo");
  });

  test("displays two todo items by default", async ({ page }) => {
    const list = page.locator(".todo-list").getByRole("listitem");
    await expect(list).toHaveCount(2);
    await expect(list.first()).toHaveText("Pay electric bill");
    await expect(list.last()).toHaveText("Walk the dog");
  });

  test("can add new todo items", async ({ page }) => {
    const newItem = "Feed the cat";

    await page.locator("[data-test=new-todo]").type(newItem);
    await page.keyboard.press("Enter");

    const list = page.locator(".todo-list").getByRole("listitem");
    await expect(list).toHaveCount(3);
    await expect(list.last()).toHaveText(newItem);
  });

  test("can check off an item as completed", async ({ page }) => {
    await page.getByText("Pay electric bill").locator("..").getByRole("checkbox").check();
    await expect(page.getByText("Pay electric bill").locator("../..")).toHaveClass("completed");
  });

  test.describe("with a checked task", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText("Pay electric bill").locator("..").getByRole("checkbox").check();
    });

    test("can filter for uncompleted tasks", async ({ page }) => {
      await page.getByText("Active").click();

      const list = page.locator(".todo-list").getByRole("listitem");
      await expect(list).toHaveCount(1);
      await expect(list.first()).toHaveText("Walk the dog");
      await expect(page.getByText("Pay electric bill")).not.toBeVisible();
    });

    test("can filter for completed tasks", async ({ page }) => {
      await page.getByText("Completed", { exact: true }).click();

      const list = page.locator(".todo-list").getByRole("listitem");
      await expect(list).toHaveCount(1);
      await expect(list.first()).toHaveText("Pay electric bill");
      await expect(page.getByText("Walk the dog")).not.toBeVisible();
    });

    test("can delete all completed tasks", async ({ page }) => {
      await page.getByText("Clear completed").click();

      const list = page.locator(".todo-list").getByRole("listitem");
      await expect(list).toHaveCount(1);
      await expect(page.getByText("Pay electric bill")).not.toBeVisible();
      await expect(page.getByText("Clear completed")).not.toBeVisible();
    });
  });
});
