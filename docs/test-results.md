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

## Browser checks, live GitHub Pages (signed out)

`node scripts/shoot.mjs https://cashpointsoulja.github.io/runtime-ops-desk` in a fresh browser context with no cookies or sign-in, 6 Oct 2026:

```
OK   desktop / status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   desktop /seat/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   desktop /operate/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   desktop /automation/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   desktop /customers/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   desktop /runbooks/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   desktop /review/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   desktop /cadence/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   desktop /field-notes/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   desktop /sources/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   mobile / status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   mobile /seat/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   mobile /operate/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   mobile /automation/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   mobile /customers/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   mobile /runbooks/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   mobile /review/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   mobile /cadence/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   mobile /field-notes/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
OK   mobile /sources/ status=200 overflow=0 logo=true errors=0 external=0 footer=true
```

Desktop is 1366×900, mobile is 390×844.

## Demo video

`docs/video/runtime-ops-desk-demo.mp4`: 1080×1920, 78.8 s, 11.1 MB, H.264 and AAC, recorded on the live site. Burned-in subtitles; the same text is in `runtime-ops-desk-demo.srt`.
