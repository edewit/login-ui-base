#!/usr/bin/env node
/**
 * Start Keycloak with login-ui-base JAR and theme dev cache disabled.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveLoginUiBaseJar } from "../lib/resolve-jar.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const THEME_DEV_ARGS = [
  "--spi-theme-static-max-age=-1",
  "--spi-theme-cache-themes=false",
  "--spi-theme-cache-templates=false",
];

const loginTheme = process.env.LOGIN_THEME ?? "login-ui-qute";

function resolveKeycloakRunner() {
  const local = path.join(
    projectRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "keycloak-runner.cmd" : "keycloak-runner",
  );
  return fs.existsSync(local) ? local : "keycloak-runner";
}

const baseJar = resolveLoginUiBaseJar();
const keycloakUrl = process.env.KEYCLOAK_URL ?? "http://127.0.0.1:8080";
const args = [
  "-p",
  baseJar,
  "--realm",
  "master",
  "--patch",
  JSON.stringify({ loginTheme }),
  "--keycloak-url",
  keycloakUrl,
  "--",
  ...THEME_DEV_ARGS,
];

if (process.env.KEYCLOAK_VERSION) {
  args.unshift(process.env.KEYCLOAK_VERSION, "-v");
}

console.log(`Provider: ${baseJar}`);
console.log(`Login theme: ${loginTheme}`);
console.log(`Keycloak URL: ${keycloakUrl}`);
console.log(`Admin: ${process.env.KEYCLOAK_ADMIN_USER ?? "admin"} / ${process.env.KEYCLOAK_ADMIN_PASSWORD ?? "admin"}`);
console.log("");

const child = spawn(resolveKeycloakRunner(), args, {
  cwd: projectRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 1));
