import { expect, test } from "@playwright/test";

test.describe("Network Requests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://example.cypress.io/commands/network-requests");
  });

  test("cy.request() - make an XHR request", async ({ request }) => {
    const response = await request.get("https://jsonplaceholder.cypress.io/comments");
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.length === 500 || body.length === 501).toBeTruthy();
    expect(response).toHaveProperty("headers");
  });

  // identical to previous test because there's no equivalent in playwright
  test("cy.request() - verify response using BDD syntax", async ({ request }) => {
    const response = await request.get("https://jsonplaceholder.cypress.io/comments");
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.length === 500 || body.length === 501).toBeTruthy();
    expect(response).toHaveProperty("headers");
  });

  test("cy.request() with query parameters", async ({ request }) => {
    const response = await request.get("https://jsonplaceholder.cypress.io/comments", {
      params: {
        postId: 1,
        id: 3,
      },
    });
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body).toHaveLength(1);
    expect(body[0]).toHaveProperty("postId", 1);
    expect(body[0]).toHaveProperty("id", 3);
  });

  test("cy.request() - pass result to the second request", async ({ request }) => {
    const response = await request.get("https://jsonplaceholder.cypress.io/users?_limit=1");
    const body = await response.json();

    const user = body[0];
    expect(typeof user.id === "number").toBeTruthy();

    const response2 = await request.post("https://jsonplaceholder.cypress.io/posts", {
      data: {
        userId: user.id,
        title: "Cypress Test Runner",
        body: "Fast, easy and reliable testing for anything that runs in a browser.",
      },
    });
    const body2 = await response2.json();
    expect(response2.status()).toBe(201);
    expect(body2).toHaveProperty("title", "Cypress Test Runner");
    expect(body2.id).toBeGreaterThan(100);
    expect(typeof body2.userId === "number").toBeTruthy();
  });

  test("cy.request() - save response in the shared test context", async ({ request }) => {
    const response = await request.get("https://jsonplaceholder.cypress.io/users?_limit=1");
    const body = await response.json();
    const user = body[0];

    const response2 = await request.post("https://jsonplaceholder.cypress.io/posts", {
      data: {
        userId: user.id,
        title: "Cypress Test Runner",
        body: "Fast, easy and reliable testing for anything that runs in a browser.",
      },
    });
    const post = await response2.json();
    expect(post).toHaveProperty("userId", user.id);
  });

  test("cy.intercept() - route responses to matching requests", async ({ page }) => {
    const commentPromise = page.waitForResponse("**/comments/*");

    await page.locator(".network-btn").click();
    const response = await commentPromise;
    expect(response.status()).toBe(200);

    const postCommentPromise = page.waitForResponse("**/comments");
    await page.locator(".network-post").click();
    const response2 = await postCommentPromise;
    const comment2 = await response2.json();
    expect(response2.headers()).toHaveProperty("content-type");
    expect(comment2).toHaveProperty("email");
    expect(comment2).toHaveProperty("name", "Using POST in cy.intercept()");

    const putCommentPromise = page.waitForResponse("**/comments/*");
    await page.route("**/comments/*", async (route) => {
      route.fulfill({
        body: JSON.stringify({
          error: "whoa, this comment does not exist",
        }),
        status: 404,
        headers: { "access-control-allow-origin": "*" },
      });
    });
    await page.locator(".network-put").click();

    const response3 = await putCommentPromise;
    const body3 = await response3.json();
    expect(body3.error).toBe("whoa, this comment does not exist");
  });
});
