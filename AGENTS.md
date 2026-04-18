# AGENTS.md

## Domain Context (Source of Truth)

- This project domain is **Digital AFP Personnel and Equipment Monitoring System**
- When adding or updating UI labels, shared constants, and models, align naming and modules with the initial schema in `supabase/migrations/20260402115217_initial-schema.sql`.
- Prefer domain terms from schema entities such as: personnel, battalions, companies, training records, deployment records, engagement records, equipment categories/items/assets/issuances, incidents, and audit logs.

## Development Rules

1. **Keep shared logic centralized**
   - Put reusable server models in `server/shared/models`.
   - Put reusable constants in `server/shared/constants`.
   - Put reusable helpers in `server/shared/utils`.

2. **Centralize API contracts and validation in shared folders**
   - Put reusable request interfaces in `server/shared/requests/domain/<domain-name>.ts`.
   - Put reusable response interfaces in `server/shared/responses/domain/<domain-name>.ts`.
   - Put reusable validation/parsing helpers in `server/shared/validation/domain/<domain-name>.ts`.
   - Keep `request`/`response`/`validation` barrel exports updated for discoverability.

3. **Preserve domain-first organization**
   - New model files should live under `server/shared/models/domain/<domain-name>.ts`.
   - Avoid mixing unrelated domain contracts in a single file.

4. **Prefer pure utilities**
   - Utility functions should avoid side effects whenever possible.
   - Parser/formatter helpers should be deterministic and unit-testable.

5. **Keep constants immutable and descriptive**
   - Export constants with explicit names (e.g., `DEFAULT_PAGE_SIZE`).
   - New constant files should live under `server/shared/constants/lib/<constant>.ts`
   - Do not mutate imported constants.

6. **Barrel exports for discoverability**
   - Update `index.ts` files in each shared folder when adding new modules.

7. **Avoid duplication in API handlers**
   - If logic appears in multiple server routes, extract it into shared models/constants/utils.

8. **File naming and style**
   - Use lowercase kebab-case or simple descriptive names for files.
   - Keep TypeScript strict-friendly and avoid `any` when practical.

9. **Use shared UI components in pages**
   - When constructing or updating pages, compose the page using existing `components/ui` building blocks.
   - Avoid writing one-off page-level markup/styles for controls that already exist as shared UI components.
   - If a needed UI building block does not exist, add it to `components/ui` first and then consume it from pages.

10. **Centralize UI/page contracts and classes**
    - Keep reusable UI interfaces/types and class-string constants in `app/constants/ui.constants.ts`.
    - Keep reusable page-level labels, placeholders, and display configuration in `app/constants/pages.constants.ts`.
    - Keep reusable class-string constants for custom components in `app/constants/shared.constants.ts`
    - Avoid defining repeated interface/class strings directly inside page/component files when they can be shared through constants.

11. **Icon standardization**
    - When adding UI icons, use `@heroicons/vue` (Heroicons) as the default icon set for consistency.

12. **Keep API route files focused**
    - API route files under `server/api` should contain only one exported handler function.
    - Move reusable helper functions into shared/server utility modules instead of defining them inside route files.

13. **Keep store actions thin via endpoint utilities**
    - Supplementary logic used by store actions (for example session header building, token storage, request payload shaping) should be extracted into `app/utils` helpers instead of being declared inline inside stores.
    - For API communication, provide one utility function per API endpoint (e.g., one function for login endpoint, one for logout endpoint, one for session endpoint) so store files stay concise and focused on state transitions.

14. **Centralize page handlers**
    - Create page-level handler modules under `app/handlers/{feature}` and place page component event handlers there.
    - Keep CRUD handler functions grouped by domain in one place (e.g., future personnel CRUD handlers should live together in a dedicated handler module under `app/handlers/{feature}`).
    - This rule applies only to files under `app/pages`; component-local handlers for reusable components do not need to move.

15. **Standardize Pinia store structure**
    - All files under `app/stores` should use the options-style Pinia pattern with explicit `state`, `getters`, and `actions` sections in that order.
    - Keep getter names descriptive and ensure at least one getter exists for consistency across stores.

16. **Always apply RBAC privilege checks in APIs**
    - Every new or updated handler under `server/api` must explicitly enforce privileges via existing RBAC helpers (for example `requirePermission` / `requireAnyPermission`) before accessing protected data or mutations.
    - Map each API action to the correct permission codes and keep this privilege mapping visible in the route implementation.

17. **Mutation API safety requirements**
    - Every `POST`, `PATCH`, and `DELETE` handler under `server/api` must record API audit logs for both successful and failed outcomes.
    - For destructive operations, enforce usage-safety checks first (e.g., do not delete account types that are still assigned to user profiles).
    - Multi-step mutation handlers must implement transaction-like rollback behavior (via DB transaction or explicit compensation logic) and must record rollback errors.

18. **Frontend privilege-gated actions are required**
    - For every action button, modal trigger, or row action under `app/pages` and related feature components, hide or disable controls when the signed-in user lacks the required privilege code.
    - Use permission codes consistent with RBAC schema entries in `public.permissions` (for example `user.view`, `user.create`, `user.update`, `user.delete`, `account_type.view`, `account_type.create`, `account_type.update`, `account_type.delete`).
    - Keep permission checks centralized through store/composable helpers (e.g., auth store permission helpers) instead of duplicating ad-hoc checks in multiple templates.

19. **Account type privilege checklist in forms**
    - Account type create/update forms must include a checklist of privileges sourced from the `permissions` table (through the privileges API), grouped for clear operator review.
    - Submitted account type payloads must include selected privilege identifiers so `account_type_permissions` stays aligned with UI selections.
    - Keep privilege checklist labels user-friendly while preserving schema-consistent privilege code mapping.

20. **Guard against possibly undefined values in strict TypeScript**
    - When reading indexed values (for example typed arrays, array access, map lookups), always provide a safe fallback to satisfy strict null/undefined checks.
    - Prefer explicit normalization such as `const value = arr[index] ?? defaultValue` before reuse in expressions.
    - Do not silence these errors with unsafe casts when a deterministic fallback can be provided.
