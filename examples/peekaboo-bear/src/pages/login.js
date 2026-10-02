/**
 * Login page — password focus drives the bear's peekaboo.
 */
export function loginPage() {
  return {
    passwordFocused: false,

    get ctx() {
      return this.$store.ctx;
    },

    get usernameLabel() {
      if (!this.ctx.realm.loginWithEmailAllowed) {
        return this.$msg("username");
      }
      if (!this.ctx.realm.registrationEmailAsUsername) {
        return this.$msg("usernameOrEmail");
      }
      return this.$msg("email");
    },

    get usernameError() {
      return this.ctx.messagesPerField?.username || "";
    },

    get passwordError() {
      return this.ctx.messagesPerField?.password || "";
    },

    get showRegisterLink() {
      return (
        this.ctx.realm.password &&
        this.ctx.realm.registrationAllowed &&
        !this.ctx.usernameHidden
      );
    },

    get showSocialProviders() {
      return this.ctx.realm.password && this.ctx.social?.providers?.length > 0;
    },

    init() {},
  };
}
