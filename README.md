# Playwright Test Automation

## Overview
This is a project that tests request form on https://test-qa.capslock.global/. It utilizes playwright build-in runner.
It includes 5 tests organized into 2 suites: form filling and validation. These tests were selected to verify key functional requirements.  
- In `formFilling.spec.ts`, there are 2 tests for filling out the form: one for a successful workflow and another for an unsuccessful attempt where the user enters an invalid ZIP code.  
- In `validation.spec.ts`, there are 3 tests verifying validation of form fields: ZIP code, email, and phone number.

Here are several improvements to make this test project more scalable and maintainable:

- Use Page Object Model - encapsulate page interactions in classes (e.g., FormPage) to avoid repeating selectors and logic, this makes tests easier to read and maintain as UI changes.
- Centralize Test Data - store test data (ZIP codes, names, emails, etc.) in separate files or constants, use fixtures or data-driven testing for broader coverage.
- Reusable Fixtures - use Playwright’s fixtures for setup/teardown logic.
- Continuous Integration - integrate with CI tools (GitLab CI, Azure Pipelines, etc.) for automated test runs.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd capslock
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Install Playwright browsers**
   ```sh
   npx playwright install
   ```

## Running Tests

To run all tests:
```sh
npm run test
```
or
```sh
npx playwright test
```

To run a specific test file:
```sh
npx playwright test tests/validation.spec.ts
```

To view the HTML report after running tests:
```sh
npx playwright show-report
```

## Project Structure
- `tests/` - Main test files
- `playwright.config.ts` - Playwright configuration
- `playwright-report/` - Test reports
- `test-results/` - Raw test results


---
Feel free to reach out if you have any questions or issues!