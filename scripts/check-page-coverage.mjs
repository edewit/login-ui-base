#!/usr/bin/env node
/**
 * Fail if login-ui-base / login-ui-qute are missing pages from the Keycloak 26
 * login page contract listed in scripts/keycloak-login-pages.json.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contractPath = path.join(__dirname, "keycloak-login-pages.json");

const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const expected = new Set(contract.pages);

function listStem(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .map((f) => f.slice(0, -ext.length));
}

const ftlDir = path.join(
  root,
  "src/main/resources/theme/login-ui-base/login",
);
const quteDir = path.join(
  root,
  "src/main/resources/theme/login-ui-qute/login",
);

const skip = new Set(["template", "theme", "alert", "profile-fields"]);
const ftlPages = new Set(
  listStem(ftlDir, ".ftl").filter((p) => !skip.has(p)),
);
const qutePages = new Set(
  listStem(quteDir, ".html").filter((p) => !skip.has(p) && !p.includes("/")),
);

const missingFtl = [...expected].filter((p) => !ftlPages.has(p)).sort();
const missingQute = [...expected].filter((p) => !qutePages.has(p)).sort();
const extraNote = {
  ftlOnly: [...ftlPages].filter((p) => !expected.has(p)).sort(),
  quteOnly: [...qutePages].filter((p) => !expected.has(p)).sort(),
};

console.log(`Contract: Keycloak ${contract.keycloakVersion} (${expected.size} pages)`);
console.log(`login-ui-base FTL pages: ${ftlPages.size}`);
console.log(`login-ui-qute HTML pages: ${qutePages.size}`);

if (extraNote.ftlOnly.length) {
  console.log(`FTL extras (ok): ${extraNote.ftlOnly.join(", ")}`);
}
if (extraNote.quteOnly.length) {
  console.log(`Qute extras (ok): ${extraNote.quteOnly.join(", ")}`);
}

let failed = false;
if (missingFtl.length) {
  failed = true;
  console.error(`Missing FTL pages: ${missingFtl.join(", ")}`);
}
if (missingQute.length) {
  failed = true;
  console.error(`Missing Qute pages: ${missingQute.join(", ")}`);
}

if (failed) {
  console.error(
    "Update themes or scripts/keycloak-login-pages.json when Keycloak adds pages.",
  );
  process.exit(1);
}

console.log("Page coverage OK");
