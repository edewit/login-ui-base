/**
 * Parse the Keycloak login context from `#kc-context`.
 * @param {ParentNode | Document} [root=document]
 * @returns {import('../types/kc-context.js').KcContext}
 */
export function parseKcContext(root = document) {
  const script = root.getElementById?.("kc-context") ?? root.querySelector?.("#kc-context");
  if (!script) {
    throw new Error("Keycloak context not found: missing #kc-context element");
  }
  const text = script.textContent?.trim() || "{}";
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("Failed to parse #kc-context JSON", { cause: error });
  }
}

/**
 * @param {import('../types/kc-context.js').KcContext} ctx
 * @param {string} key
 * @param {...unknown} params
 */
export function formatMsg(ctx, key, ...params) {
  let message = ctx.msg?.[key] ?? key;
  params.forEach((param, index) => {
    message = message.replace(new RegExp(`\\{${index}\\}`, "g"), String(param));
  });
  return message;
}
