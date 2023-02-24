# Playwright vs Cypress

Back around 2020, I chose to use Cypress for E2E tests and had a relatively good experience.  
With Playwright rising in popularity, how does it compare to Cypress which had an earlier start?

## General difference

[![Star History Chart](https://api.star-history.com/svg?repos=microsoft/playwright,cypress-io/cypress&type=Date)](https://star-history.com/#microsoft/playwright&cypress-io/cypress&Date)

- Cypress uses an app, while Playwright directly interacts with browser binaries
- Cypress Cloud is a Saas that orchestrates and records test runs, Playwright has no equivalent
  - This is not necessarily a good thing for Cypress, to be discussed further

## Comparison setup

In this repository, some of Cypress's kitchen sink test suites were migrated to Playwright.  
We'll use this selected few test suites for discussion points, these are the test files converted:

| Test suite                    | Cypress                                                          | Playwright                                                      |
| ----------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------- |
| `1-getting-started/todo`      | [cypress/todo](cypress/e2e/1-getting-started/todo.cy.js)         | [playwright/todo](tests/1-getting-started/todo.spec.ts)         |
| `2-advanced-examples/actions` | [cypress/actions](cypress/e2e/2-advanced-examples/actions.cy.js) | [playwright/actions](tests/2-advanced-examples/actions.spec.ts) |

Note that it is definitely **not** an apples-to-apples comparison, there are some minor differences that might give an edge to 1 tool over the other.  
I've tried to tweak it as much as possible to not affect the overall outcome of the test suites.

### Performance

- All tests are recorded headlessly on my PC
- _TODO: CI Runs_
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

<!--
### Syntax

## Miscellaneous topics

### Waiting

### Plugins -->
