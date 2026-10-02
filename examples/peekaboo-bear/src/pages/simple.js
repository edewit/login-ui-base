/**
 * Shared Alpine data for simple embedded pages (register, error, reset).
 */
export function simplePage() {
  return {
    get ctx() {
      return this.$store.ctx;
    },

    get fieldError() {
      return (name) => this.ctx.messagesPerField?.[name] || "";
    },

    init() {},
  };
}
