import { expect, test } from "@playwright/test";

test.describe("Cookies", () => {
  test.beforeEach(async ({ page, context }) => {
    await page.goto("https://example.cypress.io/commands/cookies");
    await context.clearCookies();
  });

  test("cy.getCookie() - get a browser cookie", async ({ page, context }) => {
    await page.locator("#getCookie .set-a-cookie").click();
    const cookies = await context.cookies();
    const tokenCookie = cookies.find((cookie) => cookie.name === "token");

    expect(tokenCookie).toHaveProperty("value", "123ABC");
  });

  test("cy.getCookies() - get browser cookies for the current domain", async ({ page, context }) => {
    expect(await context.cookies()).toHaveLength(0);

    await page.locator("#getCookie .set-a-cookie").click();
    const cookies = await context.cookies();
    const tokenCookie = cookies.find((cookie) => cookie.name === "token");

    expect(tokenCookie).toHaveProperty("value", "123ABC");
    expect(tokenCookie).toHaveProperty("httpOnly", false);
    expect(tokenCookie).toHaveProperty("secure", false);
    expect(tokenCookie).toHaveProperty("domain");
    expect(tokenCookie).toHaveProperty("path");
  });

  test("cy.getAllCookies() - get all browser cookies", async ({ page, context }) => {
    expect(await context.cookies()).toHaveLength(0);

    await context.addCookies([
      {
        name: "key",
        value: "value",
        url: "https://example.cypress.io",
      },
      {
        name: "key2",
        value: "value",
        url: "https://example.cypress.io",
      },
    ]);

    const cookies = await context.cookies();

    expect(cookies[0]).toHaveProperty("name", "key");
    expect(cookies[0]).toHaveProperty("value", "value");
    expect(cookies[0]).toHaveProperty("httpOnly", false);
    expect(cookies[0]).toHaveProperty("secure", true);
    expect(cookies[0]).toHaveProperty("domain");
    expect(cookies[0]).toHaveProperty("path");

    expect(cookies[1]).toHaveProperty("name", "key2");
    expect(cookies[1]).toHaveProperty("value", "value");
    expect(cookies[1]).toHaveProperty("httpOnly", false);
    expect(cookies[1]).toHaveProperty("secure", true);
    expect(cookies[1]).toHaveProperty("domain", "example.cypress.io");
    expect(cookies[1]).toHaveProperty("path");
  });

  test("cy.setCookie() - set a browser cookie", async ({ page, context }) => {
    expect(await context.cookies()).toHaveLength(0);

    await context.addCookies([
      {
        name: "foo",
        value: "bar",
        url: "https://example.cypress.io",
      },
    ]);
    const cookies = await context.cookies();
    expect(cookies[0]).toHaveProperty("value", "bar");
  });

  test("cy.clearCookie() - clear a browser cookie", async ({ page, context }) => {
    const cookies = await context.cookies();
    const tokenCookie = cookies.find((cookie) => cookie.name === "token");
    expect(tokenCookie).toBeUndefined();

    await page.locator("#getCookie .set-a-cookie").click();
    const cookies2 = await context.cookies();
    const tokenCookie2 = cookies2.find((cookie) => cookie.name === "token");
    expect(tokenCookie2).not.toBeUndefined();
    await context.clearCookies();

    const cookies3 = await context.cookies();
    const tokenCookie3 = cookies3.find((cookie) => cookie.name === "token");
    expect(tokenCookie3).toBeUndefined();
  });

  test("cy.clearCookies() - clear browser cookies for the current domain", async ({ page, context }) => {
    expect(await context.cookies()).toHaveLength(0);

    await page.locator("#getCookie .set-a-cookie").click();
    const cookies = await context.cookies();
    expect(cookies).toHaveLength(1);

    await context.clearCookies();
    const cookies2 = await context.cookies();
    expect(cookies2).toHaveLength(0);
  });

  test("cy.clearAllCookies() - clear all browser cookies", async ({ page, context }) => {
    expect(await context.cookies()).toHaveLength(0);

    await context.addCookies([
      {
        name: "key",
        value: "value",
        url: "https://example.cypress.io",
      },
      {
        name: "key2",
        value: "value",
        url: "https://example.cypress.io",
      },
    ]);

    const cookies = await context.cookies();
    expect(cookies).toHaveLength(2);

    await context.clearCookies();

    const cookies2 = await context.cookies();
    expect(cookies2).toHaveLength(0);
  });
});
