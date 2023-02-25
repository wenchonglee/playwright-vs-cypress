# Playwright vs Cypress

Back around 2020, I chose to use Cypress for E2E tests and had a relatively good experience.  
With Playwright rising in popularity, how does it compare to Cypress which had a head start?

## General differences

![Star History Chart](./star-history.png)

- **Popularity**
  - Playwright caught up to Cypress in 2022 and has been climbing faster than Cypress
- **Browsers**
  - Cypress uses an app to run tests, and you can easily switch browsers in the app while running tests
  - Playwright directly interfaces with browser binaries, which contributes to its strength in performance
  - Cypress's Webkit browser is still experimental
- **Writing tests**
  - Playwright has a VSCode extension to facilitate development. You can easily run/debug tests within VSCode or use the Codegen tool to record tests
  - The Cypress app can do the same, but also offer the ability to "time travel" back to specific test steps for debugging
    - In my experience however, the time travel ability is rarely useful
- **Open source**
  - While both tools have an entity behind them, Cypress currently has vested interest in their SaaS Cypress Cloud
  - This slowed QoL features that could've existed in the base library
  - It has also in my opinion, stunted the development in the performance angle (running tests in parallel, sharding tests.. etc)
  - A popular alternative is to use [Sorry Cypress](https://github.com/sorry-cypress/sorry-cypress), which can be self-hosted
- Component tests
  - Both tools have ways to write component tests, but this is out of scope for this comparison (I have no intention to deviate from Vitest+RTL)

![playwright](playwright-logo.svg) In my opinion, Playwright is the safer pick moving forward. It has more eyes watching it and has a respectable cadence.  
The Cypress app had more time in the oven, but Playwright's VSCode extension is not far behind.

## Foreword: Comparison setup

In this repository, some of Cypress's [kitchen sink test suites](https://github.com/cypress-io/cypress-example-kitchensink/tree/master/cypress/e2e) were migrated to Playwright. _Even though they were written for Playwright, the titles were kept in sync for easy comparison._  
I'll use these selected test suites for discussion points:

| Cypress                                                                    | Playwright                                                             |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [todo](cypress/e2e/1-getting-started/todo.cy.js)                           | [todo](tests/1-getting-started/todo.spec.ts)                           |
| [actions](cypress/e2e/2-advanced-examples/actions.cy.js)                   | [actions](tests/2-advanced-examples/actions.spec.ts)                   |
| [aliasing](cypress/e2e/2-advanced-examples/aliasing.cy.js)                 | [aliasing](tests/2-advanced-examples/aliasing.spec.ts)                 |
| [cookies](cypress/e2e/2-advanced-examples/cookies.cy.js)                   | [cookies](tests/2-advanced-examples/cookies.spec.ts)                   |
| [network_requests](cypress/e2e/2-advanced-examples/network_requests.cy.js) | [network_requests](tests/2-advanced-examples/network_requests.spec.ts) |

Note that it is definitely **not** an apples-to-apples comparison, there are some minor differences that might give an edge to 1 tool over the other.  
I've tried to tweak it as much as possible to not affect the overall outcome of the test suites.

## Performance

### Local runs

- All tests are recorded headlessly on my PC, with no video recording
- Recorded times are average over 5 runs, excluding the cold start
- "w/ startup" means total run time after the test command is executed
- "w/o startup" means the total test time reported by Cypress/Playwright

| Runs                                    | All 35 tests |
| --------------------------------------- | ------------ |
| Cypress run (w/ startup)                | 43.5s        |
| Cypress run (w/o startup)               | 35.0s        |
| Playwright (single worker, w/ startup)  | 25.8s        |
| Playwright (single worker, w/o startup) | 25.1s        |
| Playwright (6 workers, w/ startup)      | 6.9s         |
| Playwright (6 workers, w/o startup)     | 6.3s         |

![playwright](playwright-logo.svg) Playwright is the better option when writing tests locally

### CI Runs

- Playwright offers the ability to shard tests out of the box
- Cypress Cloud orchestrates CI tests and can take a step further by optimizing sharded tests
  - e.g. test-runner-1 takes 2 long tests, test-runner-2 takes 4 shorter tests
  - With the more naive approach in Playwright, it'll be cleanly divided where each runner take 3 tests

**All 35 tests**  
![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/wenchonglee/6d4aa86c65259c0b1e1d61d644c88c84/raw/pw-6.json)  
![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/wenchonglee/6d4aa86c65259c0b1e1d61d644c88c84/raw/pw-1.json)  
![badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/wenchonglee/6d4aa86c65259c0b1e1d61d644c88c84/raw/cy.json)

![playwright](playwright-logo.svg) Unless you're a paying customer of Cypress Cloud, Playwright is the better option here (purely on the performance angle)

## API differences

Beyond performance, are these tools comparable in their API and feature sets?  
These are a select few topics that I find important.

### Async/await vs promise chaining

Coming from Cypress, I was somewhat used to promise chaining. Having to write `await` for every command in Playwright immediately felt like needless boilerplate code.

After spending just a bit of time with Playwright however, it made a lot of sense to me.  
Consider the following example, a snippet from `network_requests`:

```js
// Cypress
cy.request("https://jsonplaceholder.cypress.io/users?_limit=1")
  .its("body")
  .its("0")
  .then((user) => {
    cy.request("POST", "https://jsonplaceholder.cypress.io/posts", {
      // redacted
    });
  })
  .then((response) => {
    // redacted
  });
```

```js
// Playwright
const response = await request.get("https://jsonplaceholder.cypress.io/users?_limit=1");
const body = await response.json();
const user = body[0];

const response2 = await request.post("https://jsonplaceholder.cypress.io/posts", {
  data: {
    // redacted
  },
});
const body2 = await response2.json();
// redacted
```

Promise chaining can get difficult to read quickly, even though you might not need to do this often in Cypress.  
You also have to learn Cypress's APIs such as `its` & `wrap` instead of what you're used to in native Javascript.

![playwright](playwright-logo.svg) If you are someone who typically writes async/await for your application code, then Playwright should appeal to you more.

### Query mechanism

In my experience, both tools have the means to locate/query anything you need.  
The point of contention is how intuitive or how difficult is it to use.

Consider the following, a snippet from `aliasing`:

<!-- prettier-ignore -->
```js
// Cypress
cy.get('.as-table')
  .find('tbody>tr')
  .first()
  .find('td')
  .first()
  .find('button').as('firstBtn')
```

We can easily convert this to follow the same flow of logic using Playwright:

<!-- prettier-ignore -->
```js
// Playwright
const firstBtn = page
  .locator(".as-table")
  .locator("tbody>tr")
  .first()
  .locator("td")
  .first()
  .locator("button");
```

In my opinion however, the better way to write this snippet with both tools is:

```js
// Cypress
cy.get("td").contains("Row 1: Cell 1").find("button").as("firstBtn");

// Playwright
const firstButton = page.getByRole("cell", { name: "Row 1: Cell 1" }).getByRole("button");
```

It might be subjective at this point, but using Playwright so far didn't feel like I had to learn a new tool, the ideas behind `getByRole`, `getByLabel`, ..etc felt intuitive to me. This is also true for reading tests, I am able to understand the intention of the test slightly easier.

That is not to say Cypress is worse on all fronts, I do appreciate small quality of life functions such as:

- Traversing the DOM - `.siblings()`, `prev()`, `.next()`
- Checking dropdown by value - `.check("value")`

My bigger issue with Cypress is the amount of APIs you have to clearly understand:

- Having to use [aliases](https://docs.cypress.io/guides/core-concepts/variables-and-aliases) to workaround network requests and other problems
- `invoke` and documentations using jquery

Right now, I cannot objectively say Playwright is better, but I do enjoy writing tests in Playwright more.

### Assertions

They both have their own quirks to learn and are fairly sound in my experience.

No clear winner on this one.

<!--
Locator vs contains/get/find


## Feature set

### Waiting

### Plugins

- collecting code coverage was easier with cypress

### feature set

- wait for network
- multiple browser, multiple tabs
- start dev server
- custom commands
- having had to put arbitrary waits vs manual retries
- cy.intercept can do both wait and modify together
 -->
