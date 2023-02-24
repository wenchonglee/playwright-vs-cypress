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

| Test suite                     | Cypress                                                           | Playwright                                                       |
| ------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| `1-getting-started/todo`       | [cypress/todo](cypress/e2e/1-getting-started/todo.cy.js)          | [playwright/todo](tests/1-getting-started/todo.spec.ts)          |
| `2-advanced-examples/actions`  | [cypress/actions](cypress/e2e/2-advanced-examples/actions.cy.js)  | [playwright/actions](tests/2-advanced-examples/actions.spec.ts)  |
| `2-advanced-examples/aliasing` | [cypress/actions](cypress/e2e/2-advanced-examples/aliasing.cy.js) | [playwright/actions](tests/2-advanced-examples/aliasing.spec.ts) |
| `2-advanced-examples/cookies`  | [cypress/actions](cypress/e2e/2-advanced-examples/cookies.cy.js)  | [playwright/actions](tests/2-advanced-examples/cookies.spec.ts)  |

Note that it is definitely **not** an apples-to-apples comparison, there are some minor differences that might give an edge to 1 tool over the other.  
I've tried to tweak it as much as possible to not affect the overall outcome of the test suites.

## Performance

### Local runs

- All tests are recorded headlessly on my PC, with no video recording
- Recorded times are average over 5 runs, excluding the cold start
- "w/ startup" means total run time after the test command is executed
- "w/o startup" means the total test time reported by Cypress/Playwright

| Runs                                    | All 29 tests |
| --------------------------------------- | ------------ |
| Cypress run (w/ startup)                | 33.8s        |
| Cypress run (w/o startup)               | 22.0s        |
| Playwright (single worker, w/ startup)  | 16.8s        |
| Playwright (single worker, w/o startup) | 16.1s        |
| Playwright (6 workers, w/ startup)      | 5.8s         |
| Playwright (6 workers, w/o startup)     | 5.1s         |

![playwright](playwright-logo.svg) Playwright is the better option when writing tests locally

### CI Runs

- Playwright offers the ability to shard tests out of the box
- Cypress Cloud orchestrates CI tests and can take a step further by optimizing sharded tests
  - e.g. test-runner-1 takes 2 long tests, test-runner-2 takes 4 shorter tests
  - With the more naive approach in Playwright, it'll be cleanly divided where each runner take 3 tests

<!-- | Runs                                               | All tests |
| -------------------------------------------------- | --------- |
| Cypress run                                        | TODO      |
| Cypress run (w/o startup)                          | TODO      |
| Playwright (unsharded, single worker, w/ startup)  | TODO      |
| Playwright (unsharded, single worker, w/o startup) | TODO      |
| Playwright (sharded, single worker, w/ startup)    | TODO      |
| Playwright (sharded, single worker, w/o startup)   | TODO      |
| Playwright (unsharded, 6 workers, w/ startup)      | TODO      |
| Playwright (unsharded, 6 workers, w/o startup)     | TODO      |
| Playwright (sharded, 6 workers, w/ startup)        | TODO      |
| Playwright (sharded, 6 workers, w/o startup)       | TODO      | -->

![playwright](playwright-logo.svg) Unless you're a paying customer of Cypress Cloud, Playwright is the better option here (purely on the performance angle)

<!-- ## API differences

### Query mechanism

Locator vs contains/get/find


### `await` vs callbkacs


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
 -->
