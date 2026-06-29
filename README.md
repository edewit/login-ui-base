# Keycloak Login UI Base Theme

A base theme for client-side and server-side Keycloak login UIs. This JAR includes:

- **`login-ui-base`** — FreeMarker theme that serializes context to JSON for plain HTML/JS, Vue, Alpine.js, and other client-side approaches
- **`login-ui-qute`** — Quarkus Qute theme for fully server-rendered login pages
- **`QuteLoginFormsProvider`** — Keycloak SPI that renders Qute templates when `templateEngine=qute`

Requires **Keycloak 26.x**.

## Theme modes

### Client-side UI (`login-ui-base`)

Child themes should:

1. Set `parent=login-ui-base` in `theme.properties`
2. Provide `js/main.js` (optional when using embedded HTML templates)
3. Optionally provide `css/styles.css`

Read page context from:

```javascript
const ctx = JSON.parse(document.getElementById('kc-context').textContent);
```

Set `embeddedTemplates=true` to load page content from `pages/<page-name>.html` via FreeMarker includes.

### Server-side Qute (`login-ui-qute`)

Child themes should:

1. Set `parent=login-ui-qute` in `theme.properties`
2. Override `.html` templates with [Qute syntax](https://quarkus.io/guides/qute)
3. No FreeMarker (`.ftl`) files required

Enable Qute on any theme by setting:

```properties
templateEngine=qute
```

The provider maps `login.ftl` → `login.html`, `register.ftl` → `register.html`, etc.

**Layout pattern:**

```html
{#include template}
  <form action="{url.loginAction}" method="post">
    ...
  </form>
{/include}
```

**Internationalization:**

```html
{msg.format('loginAccountTitle')}
{msg.format('loginTitle', realm.displayName)}
```

Template data includes the same objects as FreeMarker themes: `realm`, `url`, `login`, `message`, `messagesPerField`, `propertiesMap`, `contextJson`, and more.

## Building

```bash
mvn clean package
```

Tailwind CSS for `login-ui-qute` is built during `generate-resources` via `frontend-maven-plugin` (Node/npm are downloaded automatically; no local Node install required).

Produces `target/keycloak-login-ui-base-1.0.0-SNAPSHOT.jar` (includes `qute-core` classes only; uses Keycloak's bundled Mutiny at runtime).

## Deployment

```bash
cp target/keycloak-login-ui-base-*.jar $KEYCLOAK_HOME/providers/
$KEYCLOAK_HOME/bin/kc.sh build
```

Restart Keycloak if it is already running.

## Creating a child theme

Scaffold a minimal Maven child theme project (login page only):

```bash
npx @edewit/login-ui-base create-login-theme -- --name acme-login --type qute --output ../acme-login
npx @edewit/login-ui-base create-login-theme -- --name acme-login --type embedded
```

From a git checkout you can also run `npm run create-theme` locally.

| Type | Parent | What you get |
|------|--------|--------------|
| `qute` | `login-ui-qute` | `login.html` (Qute) copied from this package |
| `vanilla-js` | `login-ui-base` | `resources/js/main.js` with a login page renderer |
| `embedded` | `login-ui-base` | `embeddedTemplates=true`, `pages/login.html` + Alpine.js bundle |

Run without flags for an interactive prompt (arrow keys to select the theme type).

Generated projects depend on `@edewit/login-ui-base` from npm and include `npm run start-keycloak` for local development.

## npm package

Published as [`@edewit/login-ui-base`](https://www.npmjs.com/package/@edewit/login-ui-base):

- **Provider JAR** — `import '@edewit/login-ui-base/jar'` or install and use via `resolve-jar`
- **CLI** — `npx @edewit/login-ui-base create-login-theme`
- **Resolver** — `import { resolveLoginUiBaseJar } from '@edewit/login-ui-base/resolve-jar'`

Install in a child theme project:

```bash
npm install @edewit/login-ui-base
```

## Local development

Start Keycloak with theme caching disabled using [`keycloak-runner`](https://www.npmjs.com/package/keycloak-runner):

```bash
mvn package && npm run prepare-npm
npm install
npm run start-keycloak
```

When developing this repo from source, `mvn package` builds the JAR and `npm run prepare-npm` copies it to `target/login-ui-base.jar` for the resolver. After publishing, consumers only need `npm install @edewit/login-ui-base`.

By default this sets `loginTheme` to `login-ui-qute` on the `master` realm. Override with `LOGIN_THEME=login-ui-base npm run start-keycloak`.

For a scaffolded child theme:

```bash
cd ../acme-login
npm install
npm run start-keycloak
```

This mounts `@edewit/login-ui-base` as a provider JAR and symlinks your theme from `src/main/resources/theme/<name>/` so edits reload on browser refresh.

Environment variables:

| Variable | Purpose |
|----------|---------|
| `LOGIN_UI_BASE_JAR` | Override path to login-ui-base JAR |
| `LOGIN_THEME` | Realm login theme name (login-ui-base root script only) |
| `KEYCLOAK_VERSION` | Keycloak release tag for keycloak-runner |
| `KEYCLOAK_URL` | Base URL (default `http://127.0.0.1:8080`) |

## Publishing to npm

From this directory after building:

```bash
npm login
mvn package
npm run prepare-npm
npm publish
```

`prepublishOnly` runs `mvn package` and prepares `target/login-ui-base.jar` automatically when publishing.

## Manual smoke test

1. Deploy the JAR to Keycloak 26 and run `kc.sh build`.
2. Create a realm and set **Login theme** to `login-ui-base` — confirm the login page loads (FreeMarker path).
3. Switch **Login theme** to `login-ui-qute` — confirm the login page renders from Qute (`login.html` with username/password form).
4. Create a child theme with `parent=login-ui-qute` and override `login.html` — confirm your template is used.

Or use `npx @edewit/login-ui-base create-login-theme` and `npm run start-keycloak` in the generated project.

Theme dev flags (also applied automatically by `npm run start-keycloak`):

```bash
$KEYCLOAK_HOME/bin/kc.sh start-dev \
  --spi-theme-static-max-age=-1 \
  --spi-theme-cache-themes=false \
  --spi-theme-cache-templates=false
```

## Provider details

The `QuteLoginFormsProvider` registers with id `qute` and `order=1`. It delegates to FreeMarker for themes without `templateEngine=qute`, so existing themes keep working without configuration changes.

SPI descriptor: `META-INF/services/org.keycloak.forms.login.LoginFormsProviderFactory`
