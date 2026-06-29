import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");

/**
 * Resolve the login-ui-base Keycloak provider JAR.
 * Order: LOGIN_UI_BASE_JAR env -> npm package export -> local Maven build.
 */
export function resolveLoginUiBaseJar() {
  if (process.env.LOGIN_UI_BASE_JAR) {
    const jar = path.resolve(process.env.LOGIN_UI_BASE_JAR);
    if (!fs.existsSync(jar)) {
      throw new Error(`LOGIN_UI_BASE_JAR not found: ${jar}`);
    }
    return jar;
  }

  try {
    const require = createRequire(import.meta.url);
    const jar = require.resolve("@edewit/login-ui-base/jar");
    if (fs.existsSync(jar)) {
      return jar;
    }
  } catch {
    /* not installed as a dependency */
  }

  const stable = path.join(packageRoot, "target", "login-ui-base.jar");
  if (fs.existsSync(stable)) {
    return stable;
  }

  const targetDir = path.join(packageRoot, "target");
  if (fs.existsSync(targetDir)) {
    const jar = fs
      .readdirSync(targetDir)
      .filter((f) => f.startsWith("keycloak-login-ui-base-") && f.endsWith(".jar"))
      .sort()
      .at(-1);
    if (jar) {
      return path.join(targetDir, jar);
    }
  }

  throw new Error(
    "login-ui-base JAR not found. Run: npm install @edewit/login-ui-base\nOr build from source: mvn package && node scripts/prepare-npm-artifacts.mjs\nOr set LOGIN_UI_BASE_JAR.",
  );
}
