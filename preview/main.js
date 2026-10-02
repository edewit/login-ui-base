import Alpine from "alpinejs";
import { parseKcContext, formatMsg } from "@edewit/login-ui-base/kc-context";
import { loginPage } from "@peekaboo-src/pages/login.js";
import { simplePage } from "@peekaboo-src/pages/simple.js";
import { PREVIEW_PAGES, loginContext } from "./mocks/kc-context.js";
import "@peekaboo/resources/css/styles.css";

const PAGE_TEMPLATES = {
  login: () => import("@peekaboo/pages/login.html?raw"),
  register: () => import("@peekaboo/pages/register.html?raw"),
  error: () => import("@peekaboo/pages/error.html?raw"),
  "login-reset-password": () =>
    import("@peekaboo/pages/login-reset-password.html?raw"),
};

const contextEl = document.getElementById("kc-context");
const container = document.getElementById("kc-container");
const buttonsEl = document.getElementById("page-buttons");

let alpineStarted = false;

function setContext(ctx) {
  contextEl.textContent = JSON.stringify(ctx);
}

async function renderPage(pageId) {
  const entry = PREVIEW_PAGES.find((p) => p.id === pageId) ?? PREVIEW_PAGES[0];
  const ctx = entry.factory();
  setContext(ctx);

  const loader = PAGE_TEMPLATES[entry.id];
  if (!loader) {
    container.innerHTML = `<div class="pb-card" style="margin:2rem auto;max-width:24rem">
      <h1 class="pb-title">${entry.label}</h1>
      <p>No peekaboo page template for <code>${entry.id}</code> yet.
      Context is still available on <code>#kc-context</code>.</p>
      <pre style="font-size:0.75rem;overflow:auto">${JSON.stringify(ctx, null, 2)}</pre>
    </div>`;
    return;
  }

  if (alpineStarted) {
    Alpine.destroyTree(container);
  }

  const mod = await loader();
  container.innerHTML = mod.default;

  Alpine.store("ctx", parseKcContext());

  if (!alpineStarted) {
    Alpine.magic(
      "msg",
      () => (key, ...params) => formatMsg(Alpine.store("ctx"), key, ...params),
    );
    Alpine.data("loginPage", loginPage);
    Alpine.data("simplePage", simplePage);
    Alpine.start();
    alpineStarted = true;
  } else {
    Alpine.initTree(container);
  }

  for (const btn of buttonsEl.querySelectorAll("button")) {
    btn.classList.toggle("is-active", btn.dataset.page === entry.id);
  }
}

function initNav() {
  for (const page of PREVIEW_PAGES) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = page.label;
    btn.dataset.page = page.id;
    btn.addEventListener("click", () => {
      const url = new URL(window.location.href);
      url.searchParams.set("page", page.id);
      history.replaceState(null, "", url);
      renderPage(page.id);
    });
    buttonsEl.appendChild(btn);
  }
}

const initial =
  new URLSearchParams(window.location.search).get("page") || "login";
initNav();
setContext(loginContext());
renderPage(initial);
