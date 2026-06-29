#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetDir = path.join(root, "target");

if (!fs.existsSync(targetDir)) {
  throw new Error("target/ not found. Run mvn package first.");
}

const jars = fs
  .readdirSync(targetDir)
  .filter((f) => f.startsWith("keycloak-login-ui-base-") && f.endsWith(".jar"));

if (jars.length === 0) {
  throw new Error("No keycloak-login-ui-base-*.jar in target/. Run mvn package first.");
}

const source = path.join(targetDir, jars.sort().at(-1));
const dest = path.join(targetDir, "login-ui-base.jar");

fs.copyFileSync(source, dest);
console.log(`Prepared npm artifact: ${path.basename(source)} -> target/login-ui-base.jar`);
