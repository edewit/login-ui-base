import path from "node:path";

const THEME_NAME_RE = /^[a-z][a-z0-9-]*$/;

export function validateThemeName(name) {
  if (!name || !THEME_NAME_RE.test(name)) {
    throw new Error(
      'Theme name must start with a lowercase letter and contain only lowercase letters, digits, and hyphens.',
    );
  }
}

const VALID_TYPES = new Set(["qute", "vanilla-js", "embedded", "peekaboo"]);

export function validateType(type) {
  if (!VALID_TYPES.has(type)) {
    throw new Error(
      'Type must be "qute", "vanilla-js", "embedded", or "peekaboo".',
    );
  }
}

export function resolveOutputDir(output, name, cwd) {
  const dir = path.resolve(cwd, output ?? path.join("..", name));
  return dir;
}

export function assertSafeOutput(outputDir, loginUiBaseRoot) {
  const base = path.resolve(loginUiBaseRoot);
  const out = path.resolve(outputDir);
  if (out === base || out.startsWith(base + path.sep)) {
    throw new Error("Refusing to scaffold inside login-ui-base. Choose a different --output path.");
  }
}
