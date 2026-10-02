import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseKcContext, formatMsg } from "../../lib/kc-context.mjs";

describe("parseKcContext", () => {
  it("parses #kc-context JSON", () => {
    const root = {
      getElementById(id) {
        if (id !== "kc-context") return null;
        return { textContent: '{"pageId":"login","msg":{"doLogIn":"Go"}}' };
      },
    };
    const ctx = parseKcContext(root);
    assert.equal(ctx.pageId, "login");
    assert.equal(formatMsg(ctx, "doLogIn"), "Go");
  });

  it("throws when missing", () => {
    assert.throws(() => parseKcContext({ getElementById: () => null }));
  });
});
