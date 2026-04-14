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

2. **Preserve domain-first organization**
   - New model files should live under `server/shared/models/domain/<domain-name>.ts`.
   - Avoid mixing unrelated domain contracts in a single file.

3. **Prefer pure utilities**
   - Utility functions should avoid side effects whenever possible.
   - Parser/formatter helpers should be deterministic and unit-testable.

4. **Keep constants immutable and descriptive**
   - Export constants with explicit names (e.g., `DEFAULT_PAGE_SIZE`).
   - Do not mutate imported constants.

5. **Barrel exports for discoverability**
   - Update `index.ts` files in each shared folder when adding new modules.

6. **Avoid duplication in API handlers**
   - If logic appears in multiple server routes, extract it into shared models/constants/utils.

7. **File naming and style**
   - Use lowercase kebab-case or simple descriptive names for files.
   - Keep TypeScript strict-friendly and avoid `any` when practical.

8. **Use shared UI components in pages**
   - When constructing or updating pages, compose the page using existing `components/ui` building blocks.
   - Avoid writing one-off page-level markup/styles for controls that already exist as shared UI components.
   - If a needed UI building block does not exist, add it to `components/ui` first and then consume it from pages.

9. **Centralize UI/page contracts and classes**
   - Keep reusable UI interfaces/types and class-string constants in `app/constants/ui.constants.ts`.
   - Keep reusable page-level labels, placeholders, and display configuration in `app/constants/pages.constants.ts`.
   - Keep reusable class-string constants for custom components in `app/constants/shared.constants.ts`
   - Avoid defining repeated interface/class strings directly inside page/component files when they can be shared through constants.

10. **Icon standardization**
    - When adding UI icons, use `@heroicons/vue` (Heroicons) as the default icon set for consistency.

11. **Keep API route files focused**
    - API route files under `server/api` should contain only one exported handler function.
    - Move reusable helper functions into shared/server utility modules instead of defining them inside route files.

12. **Keep store actions thin via endpoint utilities**
    - Supplementary logic used by store actions (for example session header building, token storage, request payload shaping) should be extracted into `app/utils` helpers instead of being declared inline inside stores.
    - For API communication, provide one utility function per API endpoint (e.g., one function for login endpoint, one for logout endpoint, one for session endpoint) so store files stay concise and focused on state transitions.

13. **Centralize page handlers**
    - Create page-level handler modules under `app/handlers/{feature}` and place page component event handlers there.
    - Keep CRUD handler functions grouped by domain in one place (e.g., future personnel CRUD handlers should live together in a dedicated handler module under `app/handlers/{feature}`).
    - This rule applies only to files under `app/pages`; component-local handlers for reusable components do not need to move.

14. **Standardize Pinia store structure**
    - All files under `app/stores` should use the options-style Pinia pattern with explicit `state`, `getters`, and `actions` sections in that order.
    - Keep getter names descriptive and ensure at least one getter exists for consistency across stores.
