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

Use Vitest directly when an interactive watch session is useful during development:

```bash
npx vitest tests/unit/endpoints/personnel/personnel-payload.test.ts
```

## Suite organization

Unit tests live under `tests/unit` and are grouped by the production behavior they verify:

```text
tests/unit/
├── endpoints/
│   ├── application-settings/
│   ├── batch/
│   ├── calendar/
│   ├── deployments/
│   ├── engagements/
│   ├── equipment/
│   ├── files/
│   ├── personnel/
│   ├── ranks/
│   ├── trainings/
│   ├── units/
│   └── users/
└── system/
    ├── query-filters/
    └── value-parsing/
```

The endpoint suite primarily verifies:

- request payload parsing and normalization;
- required-field, format, and business-rule validation;
- create and partial-update persistence shapes;
- file upload and external attachment safety;
- query parsing and batch request behavior; and
- structural API contracts such as RBAC enforcement, audit logging, route parameters, and destructive-operation usage checks.

The system suite verifies cross-domain behavior such as security headers, allowed-origin parsing, rate limiting, nullable query filters, and primitive value parsers.

## Naming and placement

Follow these conventions when adding a test:

1. Use a `.test.ts` suffix so Vitest discovers the file.
2. Mirror the production domain under `tests/unit/endpoints/<domain>` for endpoint request and validation behavior.
3. Place reusable infrastructure and cross-domain utility tests under `tests/unit/system/<concern>`.
4. Use a descriptive kebab-case file name, such as `deployment-payload.test.ts`.
5. Group related behavior with `describe` and state the observable result in each `it` description.

For example, tests for `server/shared/validations/domain/personnel-management.ts` belong in `tests/unit/endpoints/personnel/personnel-payload.test.ts`.

## Writing a unit test

Import test helpers from Vitest and exercise the smallest public production function that represents the behavior:

```ts
import { describe, expect, it } from 'vitest'

import { parseBoolean } from '@/server/shared/utils/parsers'

describe('boolean parsing', () => {
  it.each([
    [' yes ', true],
    ['0', false],
  ])('parses %j as %j', (input, expected) => {
    expect(parseBoolean(input)).toBe(expected)
  })

  it('uses the supplied fallback for an unsupported value', () => {
    expect(parseBoolean('unknown', true)).toBe(true)
  })
})
```

A useful unit test should follow Arrange–Act–Assert, even when those stages are compact:

1. **Arrange:** create a representative input and any deterministic dependencies.
2. **Act:** call the production function or inspect the route contract.
3. **Assert:** verify the returned value, normalized persistence shape, or expected error.
4. Run the new test file by itself for fast feedback.
5. Run the related endpoint or system suite.
6. Run the complete suite before committing.

Example workflow:

```bash
npm test -- tests/unit/endpoints/personnel/personnel-payload.test.ts
npm run test:endpoints
npm test
```

## Troubleshooting

### Vitest reports that no tests were found

Confirm that the file is under `tests/unit`, ends in `.test.ts`, and matches the configured `tests/unit/**/*.test.ts` pattern. An empty run intentionally fails.

