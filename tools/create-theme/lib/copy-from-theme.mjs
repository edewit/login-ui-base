import fs from "node:fs";
import path from "node:path";

export function copyQuteLoginPage(loginUiBaseRoot, outputLoginHtml) {
  const source = path.join(
    loginUiBaseRoot,
    "src/main/resources/theme/login-ui-qute/login/login.html",
  );
  if (!fs.existsSync(source)) {
    throw new Error(`Source login.html not found: ${source}`);
  }
  fs.mkdirSync(path.dirname(outputLoginHtml), { recursive: true });
  fs.copyFileSync(source, outputLoginHtml);
}
