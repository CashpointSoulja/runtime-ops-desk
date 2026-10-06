# Test results

Actual command output from the build machine, 6 Oct 2026 (Node 22, Next.js 15.5).

## Unit tests (`npm test`)

```
 ✓ src/lib/automation.test.ts (7 tests)
 ✓ src/lib/health.test.ts (5 tests)
 ✓ src/lib/runbooks.test.ts (3 tests)
 ✓ src/lib/review.test.ts (7 tests)
      Tests  22 passed (22)
```

## Static checks

- `npm run lint`: 0 errors, 0 warnings.
- `npm run typecheck`: 0 errors.
- `npm run build` with `BASE_PATH=/runtime-ops-desk`: 11 static routes exported.

## Browser checks, local export under /runtime-ops-desk (`node scripts/shoot.mjs`)

20 of 20 OK: 10 routes at 1366×900 and 390×844, each HTTP 200, no horizontal overflow, logo rendered, 0 console errors, 0 failed requests, 0 third-party requests, footer text exact.

## Browser checks, live GitHub Pages

Pending until the Pages deploy resolves.
