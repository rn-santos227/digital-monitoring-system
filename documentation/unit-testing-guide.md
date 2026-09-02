# Unit testing guide

This guide describes how to run, organize, and extend the unit test suite for the Digital AFP Personnel and Equipment Monitoring System.

## Test stack and configuration

The project uses [Vitest](https://vitest.dev/) as its test runner. The configuration in `vitest.config.ts`:

- runs tests in the Node.js environment;
- discovers files matching `tests/unit/**/*.test.ts`;
- resolves both `~` and `@` to the repository root; and
- treats a run with no discovered tests as a failure.

Tests can import production modules through a relative path or a configured root alias. Prefer the root alias when it makes a deeply nested import easier to read.

## Prerequisites

Install the project dependencies before running the suite:

```bash
npm install
```

The existing unit tests are deterministic and do not require a running Nuxt development server or a local Supabase instance.

## Running tests

Run the complete unit test suite once:

```bash
npm test
```

Run only endpoint-focused tests:

```bash
npm run test:endpoints
```

Run only system utility and security tests:

```bash
npm run test:system
```

Pass a file or directory to Vitest through the main test script to narrow a run:

```bash
npm test -- tests/unit/endpoints/personnel/personnel-payload.test.ts
npm test -- tests/unit/system/value-parsing
```
