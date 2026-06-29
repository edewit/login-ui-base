#!/usr/bin/env node
import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { copyQuteLoginPage } from "./lib/copy-from-theme.mjs";
import { promptConfirm, promptThemeName, promptThemeType } from "./lib/prompt.mjs";
import { render } from "./lib/render.mjs";
import {
  assertSafeOutput,
  resolveOutputDir,
  validateThemeName,
  validateType,
} from "./lib/validate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGIN_UI_BASE_ROOT = path.resolve(__dirname, "../..");
const TEMPLATES = path.join(__dirname, "templates");

function readTemplate(...parts) {
  return fs.readFileSync(path.join(...parts), "utf8");
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function copyFile(source, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);
}

function toTitle(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pomTemplateFor(type) {
  return type === "embedded" ? "embedded/pom.xml.hbs" : "shared/pom.xml.hbs";
}

function packageTemplateFor(type) {
  return type === "embedded" ? "embedded/package.json.hbs" : "shared/package.json.hbs";
}

function writeEmbeddedSources(outputDir, values) {
  const { themeName } = values;
  const themeLoginDir = path.join(
    outputDir,
    "src/main/resources/theme",
    themeName,
    "login",
  );

  writeFile(
    path.join(outputDir, "src/main.js"),
    render(readTemplate(TEMPLATES, "embedded", "src/main.js.hbs"), values),
  );
  writeFile(
    path.join(outputDir, "src/pages/login.js"),
    render(readTemplate(TEMPLATES, "embedded", "src/pages/login.js.hbs"), values),
  );
  writeFile(
    path.join(outputDir, "src/components/alert.js"),
    render(readTemplate(TEMPLATES, "embedded", "src/components/alert.js.hbs"), values),
  );
  writeFile(
    path.join(outputDir, "src/components/password-field.js"),
    render(
      readTemplate(TEMPLATES, "embedded", "src/components/password-field.js.hbs"),
      values,
    ),
  );
  copyFile(
    path.join(TEMPLATES, "embedded", "pages/login.html"),
    path.join(themeLoginDir, "pages/login.html"),
  );
  writeFile(
    path.join(themeLoginDir, "resources/css/styles.css"),
    readTemplate(TEMPLATES, "embedded", "styles.css"),
  );
}

async function createTheme(opts) {
  let name = opts.name;
  let type = opts.type;

  if (!name) {
    name = await promptThemeName();
  }
  if (!type) {
    type = await promptThemeType();
  }

  validateThemeName(name);
  validateType(type);

  const artifactId = opts.artifactId ?? `keycloak-${name}`;
  const description =
    opts.description ?? `${toTitle(name)} login theme for Keycloak (${type})`;
  const themeTitle = toTitle(name);
  const parentTheme = type === "qute" ? "qute" : "base";
  const outputDir = resolveOutputDir(opts.output, name, process.cwd());

  assertSafeOutput(outputDir, LOGIN_UI_BASE_ROOT);

  if (fs.existsSync(outputDir)) {
    const entries = fs.readdirSync(outputDir);
    if (entries.length > 0) {
      if (!opts.force) {
        const ok = await promptConfirm(
          `Output directory exists and is not empty: ${outputDir}. Overwrite?`,
        );
        if (!ok) {
          console.log("Aborted.");
          process.exit(1);
        }
      }
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  }

  const values = {
    themeName: name,
    artifactId,
    description,
    themeTitle,
    parentTheme,
    themeType: type,
    buildStep: type === "embedded" ? "npm run build\n" : "",
  };

  const themeLoginDir = path.join(
    outputDir,
    "src/main/resources/theme",
    name,
    "login",
  );

  console.log(`Creating ${type} theme at ${outputDir}`);

  writeFile(
    path.join(outputDir, "pom.xml"),
    render(readTemplate(TEMPLATES, ...pomTemplateFor(type).split("/")), values),
  );
  writeFile(
    path.join(outputDir, "package.json"),
    render(readTemplate(TEMPLATES, ...packageTemplateFor(type).split("/")), values),
  );
  writeFile(
    path.join(outputDir, "README.md"),
    render(readTemplate(TEMPLATES, "shared", "README.md.hbs"), values),
  );
  writeFile(
    path.join(outputDir, "scripts/start-keycloak.mjs"),
    render(readTemplate(TEMPLATES, "shared", "start-keycloak.mjs.hbs"), values),
  );
  writeFile(
    path.join(outputDir, "src/main/resources/META-INF/keycloak-themes.json"),
    render(readTemplate(TEMPLATES, "shared", "keycloak-themes.json.hbs"), values),
  );
  writeFile(
    path.join(themeLoginDir, "theme.properties"),
    render(readTemplate(TEMPLATES, type, "theme.properties.hbs"), values),
  );

  if (type === "qute") {
    copyQuteLoginPage(LOGIN_UI_BASE_ROOT, path.join(themeLoginDir, "login.html"));
  } else if (type === "embedded") {
    writeEmbeddedSources(outputDir, values);
  } else {
    writeFile(
      path.join(themeLoginDir, "resources/js/main.js"),
      render(readTemplate(TEMPLATES, "vanilla-js", "main.js.hbs"), values),
    );
    writeFile(
      path.join(themeLoginDir, "resources/css/styles.css"),
      readTemplate(TEMPLATES, "vanilla-js", "styles.css"),
    );
  }

  console.log("");
  console.log("Done! Next steps:");
  console.log(`  cd ${outputDir}`);
  console.log("  npm install");
  if (type === "embedded") {
    console.log("  npm run build    # bundle Alpine.js to resources/js/main.js");
  }
  console.log("  npm run start-keycloak");
}

const program = new Command();

program
  .name("create-theme")
  .description("Create a minimal Keycloak login child theme project")
  .option("-n, --name <name>", "Theme name (lowercase, hyphens allowed)")
  .option(
    "-t, --type <type>",
    "Template type: qute, vanilla-js, or embedded",
  )
  .option("-o, --output <dir>", "Output directory (default: ../<name>)")
  .option("--artifact-id <id>", "Maven artifact ID (default: keycloak-<name>)")
  .option("-d, --description <text>", "Project description")
  .option("-f, --force", "Overwrite existing output directory without prompting")
  .action(async (opts) => {
    await createTheme(opts);
  });

await program.parseAsync(process.argv);
