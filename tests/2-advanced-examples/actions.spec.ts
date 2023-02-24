import { expect, test } from "@playwright/test";

test.describe("Actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://example.cypress.io/commands/actions");
  });

  test(".type() - type into a DOM element", async ({ page }) => {
    await page.locator(".action-email").type("fake@email.com");
    await expect(page.locator(".action-email")).toHaveValue("fake@email.com");

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Delete");
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Backspace");

    await page.keyboard.press("Alt");
    await page.keyboard.press("Control");
    await page.keyboard.press("Meta");
    await page.keyboard.press("Shift");

    await page.locator(".action-email").type("slow.typing@email.com", { delay: 100 });
    await expect(page.locator(".action-email")).toHaveValue("slow.typing@email.com");

    // ! cannot force type in a disabled field
    // await page.locator(".action-disabled").type("disabled error checking");
  });

  test(".focus() - focus on a DOM element", async ({ page }) => {
    await page.locator(".action-focus").focus();
    await expect(page.locator(".action-focus")).toHaveClass(/focus/);

    // ! no .prev to select sibling
    await expect(page.locator(".action-focus").locator("..").locator("label")).toHaveAttribute(
      "style",
      "color: orange;"
    );
  });

  test(".blur() - blur off a DOM element", async ({ page }) => {
    await page.locator(".action-blur").type("About to blur");
    await page.locator(".action-blur").blur();
    await expect(page.locator(".action-blur")).toHaveClass(/error/);
    await expect(page.locator(".action-blur").locator("..").locator("label")).toHaveAttribute("style", "color: red;");
  });

  test(".clear() - clears an input or textarea element", async ({ page }) => {
    await page.locator(".action-clear").type("Clear this text");
    await expect(page.locator(".action-clear")).toHaveValue("Clear this text");

    await page.locator(".action-clear").clear();
    await expect(page.locator(".action-clear")).toHaveValue("");
  });

  test(".submit() - submit a form", async ({ page }) => {
    await page.locator(".action-form").locator("[type='text']").type("HALFOFF");

    // ! no submit(), no next()
    await page.locator(".action-form").getByRole("button", { name: "Submit" }).click();
    await expect(page.locator(".action-form + p")).toHaveText("Your form has been submitted!");
  });

  test(".click() - click on a DOM element", async ({ page }) => {
    await page.locator(".action-btn").click();

    // ! playwright doesnt have predefined positions
    // ! to emulate the test going through the same steps, the clicks are looped twice
    for (let i = 0; i < 2; i++) {
      await page.locator("#action-canvas").click();
      await page.locator("#action-canvas").click({ position: { x: 80, y: 75 + i * 10 } });
      await page.locator("#action-canvas").click({ position: { x: 170, y: 75 + i * 10 } });
      await page.locator("#action-canvas").click({ position: { x: 80, y: 165 + i * 10 } });
      await page.locator("#action-canvas").click({ position: { x: 100, y: 185 + i * 10 } });
      await page.locator("#action-canvas").click({ position: { x: 125, y: 190 + i * 10 } });
      await page.locator("#action-canvas").click({ position: { x: 150, y: 185 + i * 10 } });
      await page.locator("#action-canvas").click({ position: { x: 170, y: 165 + i * 10 } });
    }

    // ! playwright doesnt have click({multiple: true})
    for (const label of await page.locator(".action-labels>.label").all()) {
      await label.click();
    }

    // ! playwright's force click doesn't work the same as cypress
    await page.locator(".action-opacity>.btn").dispatchEvent("click");
  });

  test(".dblclick() - double click on a DOM element", async ({ page }) => {
    await page.locator(".action-div").dblclick();

    await expect(page.locator(".action-div")).not.toBeVisible();
    await expect(page.locator(".action-input-hidden")).toBeVisible();
  });

  test(".rightclick() - right click on a DOM element", async ({ page }) => {
    await page.locator(".rightclick-action-div").click({ button: "right" });

    await expect(page.locator(".rightclick-action-div")).not.toBeVisible();
    await expect(page.locator(".rightclick-action-input-hidden")).toBeVisible();
  });

  test(".check() - check a checkbox or radio element", async ({ page }) => {
    // ! playwright doesn't have a disabled filter and will not check all
    // * you can use a css filter or do it programatiically with playwright
    // for (const checkbox of await page.locator(".action-checkboxes [type='checkbox']:not([disabled])").all()) {
    //   await checkbox.check();
    // }

    for (const checkbox of await page.locator(".action-checkboxes [type='checkbox']").all()) {
      if (await checkbox.isDisabled()) continue;

      await checkbox.check();
      await expect(checkbox).toBeChecked();
    }

    for (const radio of await page.locator(".action-radios [type='radio']:not([disabled])").all()) {
      await radio.check();
      await expect(radio).toBeChecked();
    }

    // ! playwright check() doesn't accept values
    // this radio step locates by the label
    await page.getByRole("radio", { name: /Radio one has value "radio1"/ }).check();
    await expect(page.getByRole("radio", { name: /Radio one has value "radio1"/ })).toBeChecked();

    // this checkbox step locates by css selector
    await page.locator(".action-multiple-checkboxes [type='checkbox'][value='checkbox1']").check();
    await page.locator(".action-multiple-checkboxes [type='checkbox'][value='checkbox2']").check();

    await expect(page.locator(".action-multiple-checkboxes [type='checkbox'][value='checkbox1']")).toBeChecked();
    await expect(page.locator(".action-multiple-checkboxes [type='checkbox'][value='checkbox2']")).toBeChecked();

    // ! cannot force check in a disabled field
    // await page.locator(".action-checkboxes [disabled]").check({ force: true });
    // await expect(page.locator(".action-checkboxes [disabled]")).toBeChecked();

    // cy.get('.action-radios [type="radio"]').check("radio3", { force: true }).should("be.checked");
  });

  test(".uncheck() - uncheck a checkbox element", async ({ page }) => {
    for (const checkbox of await page.locator(".action-check [type='checkbox']").all()) {
      if (await checkbox.isDisabled()) continue;

      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    }

    await page
      .locator(".action-check")
      .getByRole("checkbox", { name: /Checkbox one has value "checkbox1"/ })
      .uncheck();
    await expect(
      page.locator(".action-check").getByRole("checkbox", { name: /Checkbox one has value "checkbox1"/ })
    ).not.toBeChecked();

    await page.locator(".action-check [type='checkbox'][value='checkbox1']").check();
    await page.locator(".action-check [type='checkbox'][value='checkbox3']").check();
    await page.locator(".action-check [type='checkbox'][value='checkbox1']").uncheck();
    await page.locator(".action-check [type='checkbox'][value='checkbox3']").uncheck();

    await expect(page.locator(".action-check [type='checkbox'][value='checkbox1']")).not.toBeChecked();
    await expect(page.locator(".action-check [type='checkbox'][value='checkbox3']")).not.toBeChecked();

    // ! cannot force check in a disabled field
    //     cy.get(".action-check [disabled]").uncheck({ force: true }).should("not.be.checked");
  });

  test(".select() - select an option in a <select> element", async ({ page }) => {
    await expect(page.locator(".action-select")).toHaveValue("--Select a fruit--");
    await page.locator(".action-select").selectOption("apples");
    await expect(page.locator(".action-select")).toHaveValue("fr-apples");

    await page.locator(".action-select-multiple").selectOption(["apples", "oranges", "bananas"]);
    await expect(page.locator(".action-select-multiple")).toHaveValues(["fr-apples", "fr-oranges", "fr-bananas"]);

    // ! couldn't figure out how to use evaluate to do this assertion
    //     cy.get(".action-select-multiple").invoke("val").should("include", "fr-oranges");

    // this snippet yields undefined values even though it works in browser
    // const node = page.locator(".action-select-multiple");
    // const selectedOptions = await node.evaluate((node: HTMLSelectElement) => node.selectedOptions);
  });

  test(".scrollIntoView() - scroll an element into view", async ({ page }) => {
    await expect(page.locator("#scroll-horizontal button")).not.toBeInViewport();
    await page.locator("#scroll-horizontal button").scrollIntoViewIfNeeded();
    await expect(page.locator("#scroll-horizontal button")).toBeInViewport();

    await expect(page.locator("#scroll-vertical button")).not.toBeInViewport();
    await page.locator("#scroll-vertical button").scrollIntoViewIfNeeded();
    await expect(page.locator("#scroll-vertical button")).toBeInViewport();

    await expect(page.locator("#scroll-both button")).not.toBeInViewport();
    await page.locator("#scroll-both button").scrollIntoViewIfNeeded();
    await expect(page.locator("#scroll-both button")).toBeInViewport();
  });

  test(".trigger() - trigger an event on a DOM element", async ({ page }) => {
    await page.locator(".trigger-input-range").evaluate((node: HTMLInputElement) => (node.value = "25"));
    await page.locator(".trigger-input-range").dispatchEvent("change");
    await expect(page.locator(".trigger-input-range + p")).toHaveText("25");
  });

  test("cy.scrollTo() - scroll the window or element to a position", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await page.locator("#scrollable-horizontal").evaluate((node) => node.scrollTo(node.scrollWidth, 0));
    await page.locator("#scrollable-vertical").evaluate((node) => node.scrollTo(250, 250));
    await page
      .locator("#scrollable-both")
      .evaluate((node) => node.scrollTo(0.75 * node.scrollWidth, 0.25 * node.scrollHeight));

    await page.locator("#scrollable-vertical").evaluate((node) =>
      node.scrollTo({
        behavior: "smooth",
        left: 0.5 * node.scrollWidth,
        top: 0.5 * node.scrollHeight,
      })
    );

    // ! no way to change duration
    await page.locator("#scrollable-both").evaluate((node) =>
      node.scrollTo({
        behavior: "smooth",
        left: 0.5 * node.scrollWidth,
        top: 0.5 * node.scrollHeight,
      })
    );
  });
});
