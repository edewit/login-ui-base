/**
 * Typed Keycloak login context from `#kc-context` (login-ui-base FreeMarker theme).
 * Matches the JSON serialized in theme/login-ui-base/login/template.ftl.
 */

export type KcMessageType = "success" | "warning" | "error" | "info";

export interface KcRealm {
  name: string;
  displayName: string;
  displayNameHtml: string;
  registrationAllowed: boolean;
  registrationEmailAsUsername: boolean;
  loginWithEmailAllowed: boolean;
  duplicateEmailsAllowed: boolean;
  resetPasswordAllowed: boolean;
  rememberMe: boolean;
  internationalizationEnabled: boolean;
  editUsernameAllowed: boolean;
  password: boolean;
  identityFederationEnabled: boolean;
}

export interface KcUrl {
  loginAction: string;
  loginUrl: string;
  loginRestartFlowUrl: string;
  ssoLoginInOtherTabsUrl: string;
  registrationAction: string;
  registrationUrl: string;
  loginResetCredentialsUrl: string;
  resourcesUrl: string;
  resourcesPath: string;
  resourcesCommonPath: string;
  oauthAction: string;
  logoutConfirmAction: string;
  /** False on pages where Keycloak did not set an action URI (e.g. error). */
  hasAction?: boolean;
}

export interface KcClient {
  clientId: string;
  name: string | null;
  description: string | null;
  baseUrl: string | null;
  attributes: Record<string, string>;
}

export interface KcLogin {
  username: string | null;
  rememberMe: string | null;
}

export interface KcMessage {
  type: KcMessageType | string;
  summary: string;
}

export type KcMessagesPerField = Partial<
  Record<
    | "username"
    | "password"
    | "password-new"
    | "password-confirm"
    | "email"
    | "firstName"
    | "lastName"
    | "totp"
    | "userLabel"
    | "recoveryCodeInput"
    | "termsAccepted",
    string
  >
>;

export interface KcSocialProvider {
  alias: string;
  displayName: string;
  providerId: string;
  loginUrl: string;
  guiOrder: string | null;
  iconClasses: string;
}

export interface KcAuthSelection {
  authExecId: string;
  displayName: string;
  helpText: string;
  iconCssClass: string;
}

export interface KcAuth {
  showUsername: boolean;
  showResetCredentials: boolean;
  showTryAnotherWayLink: boolean;
  attemptedUsername: string | null;
  selectedCredential: string | null;
  authenticationSelections: KcAuthSelection[];
}

export interface KcLocaleSupported {
  languageTag: string;
  label: string;
  url: string;
}

export interface KcLocaleInfo {
  current: string;
  currentLanguageTag: string;
  rtl: boolean;
  supported: KcLocaleSupported[];
}

export interface KcAuthenticationSession {
  authSessionIdHash: string;
  tabId: string;
}

export interface KcRegister {
  formData: Record<string, string>;
}

export interface KcTotp {
  enabled: boolean;
  totpSecret: string;
  totpSecretEncoded: string;
  totpSecretQrCode: string;
  manualUrl: string;
  qrUrl: string;
  policy: {
    type: string;
    algorithm: string;
    digits: number;
    period: number;
  };
  supportedApplications: string[];
  otpCredentials: Array<{ id: string; userLabel: string }>;
}

export interface KcOtpLogin {
  selectedCredentialId: string | null;
  userOtpCredentials: Array<{ id: string; userLabel: string }>;
  policy: {
    type: string;
    algorithm: string;
    digits: number;
    period: number;
  };
}

export interface KcOauth {
  code: string;
  client: string;
  clientScopesRequested: Array<{
    consentScreenText: string;
    guiOrder: string | null;
    dynamicScopeParameter: string | null;
  }>;
}

/** Common i18n strings embedded in FTL context for client-side UIs. */
export interface KcMsg {
  doLogIn: string;
  doRegister: string;
  doCancel: string;
  doSubmit: string;
  doBack: string;
  doYes: string;
  doNo: string;
  doContinue: string;
  doForgotPassword: string;
  doClickHere: string;
  doTryAgain: string;
  doTryAnotherWay: string;
  doLogout: string;
  registerTitle: string;
  loginAccountTitle: string;
  loginTotpTitle: string;
  loginProfileTitle: string;
  loginIdpReviewProfileTitle: string;
  oauthGrantTitle: string;
  errorTitle: string;
  emailVerifyTitle: string;
  emailForgotTitle: string;
  updatePasswordTitle: string;
  termsTitle: string;
  noAccount: string;
  username: string;
  usernameOrEmail: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  passwordNew: string;
  rememberMe: string;
  authenticatorCode: string;
  loginOtpOneTime: string;
  loginTotpOneTime: string;
  loginTotpDeviceName: string;
  loginTotpScanBarcode: string;
  loginTotpManualStep2: string;
  loginTotpManualStep3: string;
  loginTotpStep1: string;
  loginTotpStep2: string;
  loginTotpStep3: string;
  loginTotpUnableToScan: string;
  totpAppFreeOTPName: string;
  totpAppGoogleName: string;
  totpAppMicrosoftAuthenticatorName: string;
  loginChooseAuthenticator: string;
  oauthGrantRequest: string;
  oauthGrantPermissions: string;
  emailInstruction: string;
  backToLogin: string;
  emailVerifyInstruction1: string;
  emailVerifyInstruction2: string;
  emailVerifyInstruction3: string;
  pageExpiredTitle: string;
  pageExpiredMsg1: string;
  pageExpiredMsg2: string;
  logoutConfirmTitle: string;
  logoutConfirmHeader: string;
  restartLoginTooltip: string;
  confirmLinkIdpTitle: string;
  emailLinkIdpTitle: string;
  emailLinkIdp1: string;
  emailLinkIdp2: string;
  emailLinkIdp3: string;
  backToApplication: string;
  codeSuccessTitle: string;
  copyCodeInstruction: string;
  [key: string]: string;
}

/**
 * Full client-side context from login-ui-base (FreeMarker / embedded / vanilla-js).
 */
export interface KcContext {
  pageId: string;
  locale: string;
  lang: string;
  darkMode: boolean;
  realm: KcRealm;
  url: KcUrl;
  client: KcClient | null;
  login: KcLogin | null;
  message: KcMessage | null;
  messagesPerField: KcMessagesPerField;
  social: { providers: KcSocialProvider[] };
  auth: KcAuth | null;
  localeInfo: KcLocaleInfo | null;
  authenticationSession: KcAuthenticationSession | null;
  register?: KcRegister;
  totp?: KcTotp;
  otpLogin?: KcOtpLogin;
  oauth?: KcOauth;
  recoveryAuthnCodesConfigBean?: {
    generatedRecoveryAuthnCodes: string[];
    generatedRecoveryAuthnCodesAsString: string;
    generatedAt: number;
  };
  recoveryAuthnCodesInputBean?: { codeNumber: number };
  code?: { code: string | null; error: string | null };
  logoutConfirm?: { code: string; skipLink: string | null };
  idpAlias?: string;
  idpDisplayName?: string;
  brokerContext?: { username: string };
  org?: { name: string; alias: string };
  logout?: {
    clients: Array<{ name: string; frontChannelLogoutUrl: string }>;
  };
  passwordPolicies?: {
    policies: Array<{ name: string; value: string | null }>;
  };
  usernameHidden: boolean;
  isAppInitiatedAction: boolean;
  execution: string | null;
  statusCode?: number;
  properties: Record<string, string>;
  scripts: string[];
  msg: KcMsg;
}

/**
 * Slimmer JSON from QuteLoginFormsProvider / LoginContextJsonBuilder.
 * Qute pages use server-side `msg.format(...)` instead of the full `msg` map.
 */
export interface QuteContextJson {
  pageId: string;
  locale: string;
  lang: string;
  darkMode: boolean;
  realm?: {
    name: string;
    displayName: string;
    displayNameHtml: string;
    registrationAllowed: boolean;
    registrationEmailAsUsername: boolean;
    loginWithEmailAllowed: boolean;
    duplicateEmailsAllowed: boolean;
    resetPasswordAllowed: boolean;
    rememberMe: boolean;
    password: boolean;
    internationalizationEnabled: boolean;
  };
  url?: {
    loginAction: string;
    loginUrl: string;
    registrationUrl: string;
    loginResetCredentialsUrl: string;
    resourcesPath: string;
    resourcesCommonPath: string;
    hasAction?: boolean;
  };
  localeBean?: { currentLanguageTag: string };
  message?: { summary: string; type: string };
  properties?: Record<string, string>;
}

export as namespace KcContextTypes;
