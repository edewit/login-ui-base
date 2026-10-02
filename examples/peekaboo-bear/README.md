# Peekaboo Bear

Polished starter theme for [login-ui-base](../..): a woodland login UI with a bear that covers its eyes when the password field is focused.

## Quick start

```bash
npm install
npm run build
npm run start-keycloak
```

Open the login page (or theme-preview at `http://127.0.0.1:8080/realms/master/theme-preview/`). Focus the password field — paws slide over the bear's eyes.

## Customize

1. Override `pages/login.html` and `resources/css/styles.css` first.
2. Add more pages under `pages/` as you need OTP, WebAuthn, etc. (parent theme covers the rest).
3. Rebuild with `npm run build` after changing Alpine sources in `src/`.

## Scaffold a copy

```bash
npx @edewit/login-ui-base create-login-theme -- --name my-bear --type peekaboo --output ../my-bear
```
