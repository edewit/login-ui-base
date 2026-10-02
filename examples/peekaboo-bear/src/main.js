/**
 * Peekaboo Bear — Alpine.js entry for embedded HTML templates.
 */
import Alpine from "alpinejs";
import { parseKcContext, formatMsg } from "@edewit/login-ui-base/kc-context";
import { loginPage } from "./pages/login.js";
import { simplePage } from "./pages/simple.js";

function initApp() {
  const ctx = parseKcContext();

  Alpine.store("ctx", ctx);

  Alpine.magic("msg", () => (key, ...params) => formatMsg(ctx, key, ...params));

  Alpine.data("loginPage", loginPage);
  Alpine.data("simplePage", simplePage);

  Alpine.start();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
