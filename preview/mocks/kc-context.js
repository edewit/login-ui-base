/**
 * Typed mock factories for offline theme preview.
 * @typedef {import('../../types/kc-context.js').KcContext} KcContext
 */

/** @returns {KcContext['msg']} */
function defaultMsg() {
  return {
    doLogIn: "Sign in",
    doRegister: "Register",
    doCancel: "Cancel",
    doSubmit: "Submit",
    doBack: "Back",
    doYes: "Yes",
    doNo: "No",
    doContinue: "Continue",
    doForgotPassword: "Forgot password?",
    doClickHere: "Click here",
    doTryAgain: "Try again",
    doTryAnotherWay: "Try another way",
    doLogout: "Sign out",
    registerTitle: "Register",
    loginAccountTitle: "Sign in to your account",
    loginTotpTitle: "Mobile authenticator setup",
    loginProfileTitle: "Update account information",
    loginIdpReviewProfileTitle: "Update account information",
    oauthGrantTitle: "Grant access",
    errorTitle: "We are sorry...",
    emailVerifyTitle: "Email verification",
    emailForgotTitle: "Forgot your password?",
    updatePasswordTitle: "Update password",
    termsTitle: "Terms and conditions",
    noAccount: "New user?",
    username: "Username",
    usernameOrEmail: "Username or email",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    password: "Password",
    passwordConfirm: "Confirm password",
    passwordNew: "New password",
    rememberMe: "Remember me",
    authenticatorCode: "One-time code",
    loginOtpOneTime: "One-time code",
    loginTotpOneTime: "One-time code",
    loginTotpDeviceName: "Device name",
    loginTotpScanBarcode: "Scan barcode",
    loginTotpManualStep2: "Enter the key",
    loginTotpManualStep3: "Provide a device name",
    loginTotpStep1: "Install an authenticator app",
    loginTotpStep2: "Open the app and scan the barcode",
    loginTotpStep3: "Enter the one-time code and device name",
    loginTotpUnableToScan: "Unable to scan?",
    totpAppFreeOTPName: "FreeOTP",
    totpAppGoogleName: "Google Authenticator",
    totpAppMicrosoftAuthenticatorName: "Microsoft Authenticator",
    loginChooseAuthenticator: "Select authentication method",
    oauthGrantRequest: "Do you grant these access privileges?",
    oauthGrantPermissions: "The following permissions are requested",
    emailInstruction: "Enter your username or email and we will send instructions.",
    backToLogin: "« Back to login",
    emailVerifyInstruction1: "An email with instructions has been sent.",
    emailVerifyInstruction2: "Haven't received an email?",
    emailVerifyInstruction3: "to re-send the email.",
    pageExpiredTitle: "Page has expired",
    pageExpiredMsg1: "To restart the login process",
    pageExpiredMsg2: "To continue the login process",
    logoutConfirmTitle: "Logging out",
    logoutConfirmHeader: "Do you want to log out?",
    restartLoginTooltip: "Restart login",
    confirmLinkIdpTitle: "Account already exists",
    emailLinkIdpTitle: "Link {0}",
    emailLinkIdp1: "An email with instructions to link {0} account {1} has been sent.",
    emailLinkIdp2: "Haven't received an email?",
    emailLinkIdp3: "to re-send the email.",
    backToApplication: "« Back to application",
    codeSuccessTitle: "Success code",
    copyCodeInstruction: "Please copy this code and paste it into your application:",
  };
}

/** @returns {KcContext} */
export function createBaseContext(overrides = {}) {
  /** @type {KcContext} */
  const base = {
    pageId: "login",
    locale: "en",
    lang: "en",
    darkMode: false,
    realm: {
      name: "peekaboo",
      displayName: "Peekaboo Woods",
      displayNameHtml: "Peekaboo Woods",
      registrationAllowed: true,
      registrationEmailAsUsername: false,
      loginWithEmailAllowed: true,
      duplicateEmailsAllowed: false,
      resetPasswordAllowed: true,
      rememberMe: true,
      internationalizationEnabled: false,
      editUsernameAllowed: false,
      password: true,
      identityFederationEnabled: false,
    },
    url: {
      loginAction: "#",
      loginUrl: "#login",
      loginRestartFlowUrl: "#restart",
      ssoLoginInOtherTabsUrl: "#sso",
      registrationAction: "#register-action",
      registrationUrl: "#register",
      loginResetCredentialsUrl: "#reset",
      resourcesUrl: "/resources",
      resourcesPath: "/resources",
      resourcesCommonPath: "/resources-common",
      oauthAction: "#oauth",
      logoutConfirmAction: "#logout",
    },
    client: {
      clientId: "account-console",
      name: "Account Console",
      description: null,
      baseUrl: null,
      attributes: {},
    },
    login: { username: "", rememberMe: null },
    message: null,
    messagesPerField: {},
    social: { providers: [] },
    auth: {
      showUsername: true,
      showResetCredentials: true,
      showTryAnotherWayLink: false,
      attemptedUsername: null,
      selectedCredential: null,
      authenticationSelections: [],
    },
    localeInfo: null,
    authenticationSession: null,
    usernameHidden: false,
    isAppInitiatedAction: false,
    execution: null,
    properties: {},
    scripts: [],
    msg: defaultMsg(),
  };

  return deepMerge(base, overrides);
}

/** @returns {KcContext} */
export function loginContext(overrides = {}) {
  return createBaseContext({ pageId: "login", ...overrides });
}

/** @returns {KcContext} */
export function registerContext(overrides = {}) {
  return createBaseContext({
    pageId: "register",
    register: { formData: {} },
    ...overrides,
  });
}

/** @returns {KcContext} */
export function errorContext(overrides = {}) {
  return createBaseContext({
    pageId: "error",
    message: {
      type: "error",
      summary: "Unexpected error when authenticating",
    },
    ...overrides,
  });
}

/** @returns {KcContext} */
export function resetPasswordContext(overrides = {}) {
  return createBaseContext({
    pageId: "login-reset-password",
    ...overrides,
  });
}

/** @returns {KcContext} */
export function otpContext(overrides = {}) {
  return createBaseContext({
    pageId: "login-otp",
    otpLogin: {
      selectedCredentialId: null,
      userOtpCredentials: [{ id: "otp-1", userLabel: "Phone" }],
      policy: { type: "totp", algorithm: "HmacSHA1", digits: 6, period: 30 },
    },
    ...overrides,
  });
}

function deepMerge(target, source) {
  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof target[key] === "object" &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export const PREVIEW_PAGES = [
  { id: "login", label: "Login", factory: loginContext },
  { id: "register", label: "Register", factory: registerContext },
  { id: "error", label: "Error", factory: errorContext },
  { id: "login-reset-password", label: "Reset password", factory: resetPasswordContext },
  { id: "login-otp", label: "OTP (context only)", factory: otpContext },
];
