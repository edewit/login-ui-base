# Keycloak Login UI Base Theme

**HTML-first Keycloak login themes with optional Quarkus Qute SSR — no React required.**

Use this when you want branded login pages in plain HTML, Alpine, Vue, or Qute, without Freemarker wrestling and without adopting a full React theme toolchain (e.g. Keycloakify). Keep Keycloak’s OIDC architecture; change only the login UX.

| Choose                   | When                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| **login-ui-base** (this) | HTML/Alpine/Vue/Qute themes, progressive overrides, optional SSR |
| **Keycloakify**          | React/Storybook ecosystem, component-level theming               |
| **Raw Freemarker**       | Tiny CSS tweaks on the default theme                             |

Requires **Keycloak 26.x**. See [COMPATIBILITY.md](COMPATIBILITY.md).

## What’s included

- **`login-ui-base`** — FreeMarker theme that serializes context to JSON for HTML/JS, Vue, Alpine, etc.
- **`login-ui-qute`** — Quarkus Qute theme for fully server-rendered pages
- **`QuteLoginFormsProvider`** — SPI: set `templateEngine=qute` on any theme
- **CLI** — scaffold child themes (`qute`, `vanilla-js`, `embedded`, **`peekaboo`**)
- **Types** — `KcContext` / `QuteContextJson` + `parseKcContext()`
- **Offline preview** — Vite app with mocked context (no Keycloak)
- **Peekaboo Bear** — polished starter: woodland UI

## Quick start — Peekaboo Bear

```bash
cd examples/peekaboo-bear
npm install && npm run build && npm run start-keycloak
```

Or scaffold a copy:

```bash
npx @edewit/login-ui-base create-login-theme -- --name my-theme --type peekaboo --output ../my-theme
```

Offline design (no Keycloak):

```bash
npm install
npm run preview-theme
```

Keycloak-connected multi-state preview (with `start-keycloak`):  
`http://127.0.0.1:8080/realms/master/theme-preview/`

## Progressive overrides

1. Scaffold or copy **peekaboo** / **embedded**.
2. Edit only `pages/login.html` + `resources/css/styles.css` — inherit OTP, WebAuthn, errors from the parent.
3. Override more `pages/*.html` as you need them.
4. For SSR, use `--type qute` and override `login.html` with Qute includes.

## Theme modes

### Client-side (`login-ui-base`)

```properties
parent=login-ui-base
embeddedTemplates=true
```

```js
import { parseKcContext } from "@edewit/login-ui-base/kc-context";
/** @type {import('@edewit/login-ui-base/types').KcContext} */
const ctx = parseKcContext();
```

### Server-side Qute (`login-ui-qute`)

```properties
parent=login-ui-qute
# or on any theme:
templateEngine=qute
```

```html
{#include template}
<form action="{url.loginAction}" method="post">…</form>
{/include}
```

## Building & deploying the provider JAR

```bash
mvn clean package
cp target/keycloak-login-ui-base-*.jar $KEYCLOAK_HOME/providers/
$KEYCLOAK_HOME/bin/kc.sh build
```

Published as [`@edewit/login-ui-base`](https://www.npmjs.com/package/@edewit/login-ui-base) (JAR + CLI + types).

## Scripts

| Script                   | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| `npm run create-theme`   | Scaffold a child theme                         |
| `npm run preview-theme`  | Offline Vite preview (peekaboo + mocks)        |
| `npm run check:pages`    | Fail if FTL/Qute pages drift from the contract |
| `npm run test:unit`      | `parseKcContext` unit tests                    |
| `npm run test:e2e`       | Playwright: password focus → bear hides + a11y |
| `npm run start-keycloak` | Dev Keycloak with this provider                |

## Manual smoke test

1. Deploy the JAR; set realm login theme to `login-ui-qute` or a child theme.
2. Confirm login / register / reset password.
3. For peekaboo: focus password — paws cover the bear’s eyes.

Theme cache off for local work:

```bash
$KEYCLOAK_HOME/bin/kc.sh start-dev \
  --spi-theme-static-max-age=-1 \
  --spi-theme-cache-themes=false \
  --spi-theme-cache-templates=false
```
