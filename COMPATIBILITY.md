# Keycloak compatibility

| login-ui-base | Keycloak | Notes |
|---------------|----------|-------|
| 1.0.x | 26.x | Current target. Qute SPI + FTL JSON context. |

## Page contract

Supported login page IDs are listed in [`scripts/keycloak-login-pages.json`](scripts/keycloak-login-pages.json).

Run coverage check before release:

```bash
npm run check:pages
```

When upgrading Keycloak:

1. Diff upstream `themes/.../base/login/*.ftl` against the JSON list.
2. Add missing pages to `login-ui-base` (FTL + `pages/*.html` stub) and `login-ui-qute`.
3. Bump `keycloakVersion` in the JSON and this table.
4. Smoke-test with `npm run start-keycloak` and `examples/peekaboo-bear`.

## Context shapes

| Theme mode | Context source | Type |
|------------|----------------|------|
| `login-ui-base` (FTL / embedded / vanilla-js) | Full `#kc-context` JSON | `KcContext` |
| `login-ui-qute` | Slimmer `contextJson` | `QuteContextJson` |

Qute pages use server-side `msg.format(...)`; they do not rely on the full client `msg` map.
