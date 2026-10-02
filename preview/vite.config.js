import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

export default defineConfig({
  root: __dirname,
  server: {
    port: 5173,
    open: false,
  },
  resolve: {
    alias: {
      "@edewit/login-ui-base/kc-context": path.join(root, "lib/kc-context.mjs"),
      "@peekaboo": path.join(
        root,
        "examples/peekaboo-bear/src/main/resources/theme/peekaboo-bear/login",
      ),
      "@peekaboo-src": path.join(root, "examples/peekaboo-bear/src"),
    },
  },
});
