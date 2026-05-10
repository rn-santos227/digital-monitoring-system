# Unit testing guide

The Digital AFP Personnel and Equipment Monitoring System uses Vitest for unit tests, Vue Test Utils for component setup and lifecycle tests, and V8 for coverage measurement.

## Running the suite

Install the project dependencies with `npm install`, then run:

```bash
npm test
npm run test:coverage
npm run test:frontend
npm run test:endpoints
npm run test:system
```

Run an individual file through the main script:

```bash
npm test -- tests/unit/system/suggestions.test.ts
```

The tests use synthetic personnel data and in-memory HTTP events. They do not need a Nuxt development server, Supabase instance, credentials, or a network connection. The workbook tests create and parse real XLSX buffers in memory.

## Organization and configuration

```text
tests/
  helpers/
  unit/
    frontend/
      composables/
      handlers/
      stores/
      utils/
      validation/
    endpoints/
    system/
```

- Frontend tests verify form validation, Pinia state transitions, request utilities, page orchestration, modal feedback, and Vue lifecycle behavior.
- Endpoint tests verify parsing, persistence boundaries, authorization, created-item responses, audit outcomes, usage safety, and selected compensation flows.
- System tests verify authentication, security middleware, query construction, response mapping, caching, storage helpers, XLSX parsing, and shared domain utilities.

`vitest.config.ts` discovers `tests/unit/**/*.test.ts` and fails if no tests are found. It limits workers to four. Most tests run in Node; files with `@vitest-environment happy-dom` use a browser-like DOM.

`@/` and `~~/` resolve to the project root. Frontend aliases such as `~/stores`, `~/utils`, and `~/types` resolve to the corresponding `app` folders. Small test adapters replace Nuxt keyed state, runtime configuration, and the Supabase server connector. Vue reactivity and Pinia stores remain real.

The test transform maps `import.meta.client` to the `__TEST_NUXT_CLIENT__` global. Tests exercising client-only behavior must set that flag and restore globals afterward.

## Coverage reporting

`npm run test:coverage` produces:

```text
coverage/index.html
coverage/coverage-final.json
coverage/coverage-summary.json
```

Open `coverage/index.html` to inspect uncovered statements and branches. The generated directory is ignored so reports are not mixed with manually curated source changes.

Coverage includes all TypeScript files under:

```text
app/utils
app/stores
app/handlers
app/composables
server/api
server/shared/utils
server/shared/validation
server/utils
server/middleware
```

Only `index.ts` barrels are excluded. API `index.get.ts`, `index.post.ts`, and similar route files remain included. Vue single-file components, database migrations, Nitro runtime integration, and live Supabase policies are outside this unit coverage measurement.

### Verification snapshot: 2026-10-05

The last fully verified run passed **2,142 tests in 135 files**:

| Metric     | Coverage |
| ---------- | -------- |
| Statements | 52.92%   |
| Branches   | 48.23%   |
| Functions  | 58.98%   |
| Lines      | 53.15%   |

The workspace subsequently gained `detail-repositories.test.ts`, `suggestions.test.ts`, and a personnel-suggestion deduplication fix. These additions require a fresh complete run; the last requested run outside the sandbox was declined, and the sandbox run failed during Vite startup with `spawn EPERM`.

The production build passed after these changes. The workspace contains 137 test files. This is expanded coverage, not 100% coverage. Remaining work includes additional API success and failure paths, bulk operations, print flows, feature handler orchestration, and Vue component interaction tests. The authorization inventory verifies denial before database access; it does not establish successful behavior for every route.

## Regression fixes covered by new tests

The tests exposed and accompanied fixes for:

- training updates that previously changed local state without persisting through the endpoint;
- duplicate rank creation in the page composable;
- deployment location updates routed through the details action;
- settings initialization that failed to mark a successful load as cached;
- incident creation busy state being set by KPI loading rather than creation;
- authentication accepting an inactive local profile through provider fallback;
- custom session-token headers being retained in audit data;
- personnel suggestions duplicating a selected person matching the exact service number.

Direct Vue and Pinia imports were also added where modules relied on implicit imports. A duplicate missing-rank guard was removed.

## Extending tests

Follow `AGENTS.md`: keep tests readable, use kebab-case filenames, place domain tests in the corresponding suite, and prefer typed synthetic fixtures over `any`.

Assert observable behavior, including relevant failure paths. Examples include cancellation preserving data, rejected writes leaving a modal open, failed reads clearing stale rows, and failed reference checks preventing deletion. Mock external boundaries, not the function being tested.

The recording Supabase helper queues results when queries are awaited. It records table names, methods, and arguments without opening a database connection. CRUD and collection contracts deliberately declare expected domain tables and actions; they do not infer expectations from source text.

Restore mocked globals, environment variables, clocks, listeners, and mounted components after each test. Use fake clocks limited to `Date` when exercising XLSX operations, since faking all timers can block ExcelJS asynchronous work.

Run the complete suite and coverage report after the final changes. A passing runtime suite does not establish TypeScript correctness; a separate compiler check was unavailable in this environment because installation of the missing compiler was declined.
