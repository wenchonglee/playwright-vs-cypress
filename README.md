# Playwright vs Cypress

Back around 2020, I chose to use Cypress for E2E tests and had a relatively good experience.  
With Playwright rising in popularity, how does it compare to Cypress which had a head start?

## General differences

- Popularity

  - Playwright caught up to Cypress in 2022 and has been climbing faster than Cypress  
    [![Star History Chart](https://api.star-history.com/svg?repos=microsoft/playwright,cypress-io/cypress&type=Date)](https://star-history.com/#microsoft/playwright&cypress-io/cypress&Date)

- Browsers
  - Cypress uses an app to run tests, and you can easily switch browser from the app while running tests,
  - Playwright directly interacts with browser binaries
  - Cypress's Webkit browser is still experimental
- Writing tests
  - Playwright has a VSCode extension to facilitate development. You can easily run/debug tests within VSCode or use the Codegen tool to record tests
  - The Cypress app can do the same, but also offer the ability to "time travel" back to specific test steps for debugging
    - In my experience however, the time travel ability has rarely been used
- Open source
  - While both tools have an entity behind them, Cypress currently has vested interest in their SaaS Cypress Cloud
  - This slowed QoL features that could've existed in the base library
  - It has also in my opinion, stunted the development in the performance angle (running tests in parallel, sharding tests.. etc)
  - A popular alternative is to use [Sorry Cypress](https://github.com/sorry-cypress/sorry-cypress), which can be self-hosted
- Both tools have ways to write component tests, but this is out of scope for this comparison (I have no intention to deviate from Vitest+RTL)

![playwright](playwright-logo.svg) Playwright is without a doubt the better option here

## Foreword: Comparison setup

In this repository, some of Cypress's kitchen sink test suites were migrated to Playwright.  
I'll use these selected test suites for discussion points:

| Test suite                    | Cypress                                                          | Playwright                                                      |
| ----------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------- |
| `1-getting-started/todo`      | [cypress/todo](cypress/e2e/1-getting-started/todo.cy.js)         | [playwright/todo](tests/1-getting-started/todo.spec.ts)         |
| `2-advanced-examples/actions` | [cypress/actions](cypress/e2e/2-advanced-examples/actions.cy.js) | [playwright/actions](tests/2-advanced-examples/actions.spec.ts) |

Note that it is definitely **not** an apples-to-apples comparison, there are some minor differences that might give an edge to 1 tool over the other.  
I've tried to tweak it as much as possible to not affect the overall outcome of the test suites.

## Performance

### Local runs

- All tests are recorded headlessly on my PC, with no video recording
- Recorded times are average over 5 runs, excluding the cold start
- "w/ startup" means total run time after the test command is executed
- "w/o startup" means the total test time reported by Cypress/Playwright

| Runs                                    | All tests |
| --------------------------------------- | --------- |
| Cypress run (w/ startup)                | 24.1s     |
| Cypress run (w/o startup)               | 17.0s     |
| Playwright (single worker, w/ startup)  | 11.8s     |
| Playwright (single worker, w/o startup) | 11.2s     |
| Playwright (6 workers, w/ startup)      | 5.3s      |
| Playwright (6 workers, w/o startup)     | 4.7s      |

![playwright](playwright-logo.svg) Playwright is the better option when writing tests locally

### CI Runs

- Playwright offers the ability to shard tests out of the box
- Cypress Cloud orchestrates CI tests and can take a step further by optimizing sharded tests
  - e.g. test-runner-1 takes 2 long tests, test-runner-2 takes 4 shorter tests
  - With the more naive approach in Playwright, it'll be cleanly divided where each runner take 3 tests

_TODO: performance comparison in github CI Runs_

![playwright](playwright-logo.svg) Unless you're a paying customer of Cypress Cloud, Playwright is the better option here (purely on the performance angle)

<!-- ## API differences

### Query mechanism

Locator vs contains/get/find


### `await` vs callbkacs


## Feature set

### Waiting

### Plugins

### feature set

- wait for network
- multiple browser, multiple tabs
- start dev server -->
