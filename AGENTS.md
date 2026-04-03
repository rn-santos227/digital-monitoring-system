# AGENTS.md

## Development Rules

1. **Keep shared logic centralized**
   - Put reusable server models in `app/server/shared/models`.
   - Put reusable constants in `app/server/shared/constants`.
   - Put reusable helpers in `app/server/shared/utils`.

2. **Preserve domain-first organization**
   - New model files should live under `app/server/shared/models/domain/<domain-name>.ts`.
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
