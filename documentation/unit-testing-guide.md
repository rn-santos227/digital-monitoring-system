# Unit testing guide

This guide describes how to run, organize, and extend the unit test suite for the Digital AFP Personnel and Equipment Monitoring System.

## Test stack and configuration

The project uses [Vitest](https://vitest.dev/) as its test runner. The configuration in `vitest.config.ts`:

- runs tests in the Node.js environment;
- discovers files matching `tests/unit/**/*.test.ts`;
- resolves both `~` and `@` to the repository root; and
- treats a run with no discovered tests as a failure.

