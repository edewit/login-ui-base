import fs from "node:fs";
import path from "node:path";

const SKIP = new Set(["node_modules", "target", ".git", "package-lock.json"]);

/**
 * Recursively copy the peekaboo-bear example and rename the theme.
 */
export function scaffoldPeekaboo(loginUiBaseRoot, outputDir, values) {
  const sourceRoot = path.join(loginUiBaseRoot, "examples", "peekaboo-bear");
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Peekaboo example not found at ${sourceRoot}`);
  }

  copyTree(sourceRoot, outputDir);

  const oldName = "peekaboo-bear";
  const { themeName, artifactId, description, themeTitle } = values;

  renameThemeDir(outputDir, oldName, themeName);
  rewriteTextFiles(outputDir, {
    [oldName]: themeName,
    "keycloak-peekaboo-bear": artifactId,
    "@keycloak/peekaboo-bear": `@keycloak/${artifactId}`,
    "Peekaboo Bear": themeTitle,
    "Peekaboo bear Keycloak login theme — covers its eyes when you type your password":
      description,
    '"@edewit/login-ui-base": "file:../.."':
      '"@edewit/login-ui-base": "^1.0.0"',
  });
}

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyTree(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function renameThemeDir(outputDir, oldName, themeName) {
  if (oldName === themeName) return;
  const themesRoot = path.join(outputDir, "src/main/resources/theme");
  const from = path.join(themesRoot, oldName);
  const to = path.join(themesRoot, themeName);
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
  }
}

function rewriteTextFiles(root, replacements) {
  const TEXT_EXT = new Set([
    ".js",
    ".mjs",
    ".json",
    ".html",
    ".css",
    ".md",
    ".xml",
    ".properties",
    ".hbs",
  ]);

  walk(root, (filePath) => {
    if (!TEXT_EXT.has(path.extname(filePath))) return;
    let content = fs.readFileSync(filePath, "utf8");
    let changed = false;
    for (const [from, to] of Object.entries(replacements)) {
      if (content.includes(from)) {
        content = content.split(from).join(to);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(filePath, content, "utf8");
    }
  });
}

function walk(dir, onFile) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, onFile);
    else onFile(full);
  }
}
