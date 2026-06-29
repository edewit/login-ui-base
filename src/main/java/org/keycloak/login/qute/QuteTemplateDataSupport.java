package org.keycloak.login.qute;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.keycloak.forms.login.freemarker.model.AbstractUserProfileBean;
import org.keycloak.forms.login.freemarker.model.AuthenticationContextBean;
import org.keycloak.forms.login.freemarker.model.ClientBean;
import org.keycloak.forms.login.freemarker.model.CodeBean;
import org.keycloak.forms.login.freemarker.model.LogoutConfirmBean;
import org.keycloak.forms.login.freemarker.model.OAuthGrantBean;
import org.keycloak.forms.login.freemarker.model.ProfileBean;
import org.keycloak.forms.login.freemarker.model.SAMLPostFormBean;
import org.keycloak.forms.login.freemarker.model.LoginBean;
import org.keycloak.forms.login.freemarker.model.TotpLoginBean;
import org.keycloak.forms.login.freemarker.model.X509ConfirmBean;
import org.keycloak.theme.beans.MessagesPerFieldBean;

final class QuteTemplateDataSupport {

    private QuteTemplateDataSupport() {
    }

    static void enrich(Map<String, Object> data) {
        putDefault(data, "message", null);
        putDefault(data, "auth", null);
        putDefault(data, "login", new LoginBean(null));

        if (data.get("login") instanceof LoginBean login) {
            data.put("loginUsername", nullToEmpty(login.getUsername()));
            data.put("rememberMeChecked", login.getRememberMe() != null);
        } else {
            data.put("loginUsername", "");
            data.put("rememberMeChecked", false);
        }

        MessagesPerFieldBean messagesPerField = data.get("messagesPerField") instanceof MessagesPerFieldBean bean
                ? bean
                : null;
        putFieldError(data, messagesPerField, "username");
        putFieldError(data, messagesPerField, "password");
        putFieldError(data, messagesPerField, "totp");
        putFieldError(data, messagesPerField, "password-confirm", "passwordConfirm");
        putFieldError(data, messagesPerField, "recoveryCodeInput");
        putFieldError(data, messagesPerField, "userLabel");
        if (messagesPerField != null) {
            data.put("hasUsernamePasswordError", messagesPerField.existsError("username", "password"));
            data.put("usernamePasswordError", nullToEmpty(messagesPerField.getFirstError("username", "password")));
        } else {
            data.put("hasUsernamePasswordError", false);
            data.put("usernamePasswordError", "");
        }

        Object message = data.get("message");
        data.put("hasMessage", message != null);
        if (message != null) {
            data.put("messageType", nullToEmpty(String.valueOf(readProperty(message, "type", "error"))));
            String summary = nullToEmpty(String.valueOf(readProperty(message, "summary", "")));
            data.put("messageSummary", summary);
            data.put("hasMessageSummary", !summary.isEmpty());
        } else {
            data.put("messageType", "");
            data.put("messageSummary", "");
            data.put("hasMessageSummary", false);
        }

        List<Map<String, String>> socialProviderList = buildSocialProviderList(data.get("social"));
        data.put("socialProviderList", socialProviderList);
        data.put("socialProviders", socialProviderList);
        boolean hasSocialProviders = !socialProviderList.isEmpty();
        data.put("hasSocialProviders", hasSocialProviders);

        Object realm = data.get("realm");
        data.put("realmPassword", readBoolean(realm, "password", true));
        data.put("realmLoginWithEmailAllowed", readBoolean(realm, "loginWithEmailAllowed", false));
        data.put("realmRegistrationEmailAsUsername", readBoolean(realm, "registrationEmailAsUsername", false));
        data.put("realmRememberMe", readBoolean(realm, "rememberMe", false));
        data.put("realmResetPasswordAllowed", readBoolean(realm, "resetPasswordAllowed", false));
        data.put("realmRegistrationAllowed", readBoolean(realm, "registrationAllowed", false));
        data.put("realmDisplayName", nullToEmpty(String.valueOf(readProperty(realm, "displayName",
                readProperty(realm, "name", "")))));
        data.put("showRegistrationLink", readBoolean(realm, "password", true)
                && readBoolean(realm, "registrationAllowed", false)
                && !Boolean.TRUE.equals(data.get("registrationDisabled")));
        data.put("showSocialProviders", readBoolean(realm, "password", true) && hasSocialProviders);

        Object url = data.get("url");
        data.put("urlLoginAction", nullToEmpty(String.valueOf(readProperty(url, "loginAction", ""))));
        data.put("urlLoginUrl", nullToEmpty(String.valueOf(readProperty(url, "loginUrl", ""))));
        data.put("urlRegistrationUrl", nullToEmpty(String.valueOf(readProperty(url, "registrationUrl", ""))));
        data.put("urlRegistrationAction", nullToEmpty(String.valueOf(readProperty(url, "registrationAction", ""))));
        data.put("urlLoginResetCredentialsUrl", nullToEmpty(String.valueOf(readProperty(url, "loginResetCredentialsUrl", ""))));
        data.put("urlLogoutConfirmAction", nullToEmpty(String.valueOf(readProperty(url, "logoutConfirmAction", ""))));
        data.put("urlLoginRestartFlowUrl", nullToEmpty(String.valueOf(readProperty(url, "loginRestartFlowUrl", ""))));
        data.put("urlOauthAction", nullToEmpty(String.valueOf(readProperty(url, "oauthAction", ""))));
        data.put("urlOauth2DeviceVerificationAction", nullToEmpty(String.valueOf(readProperty(url, "oauth2DeviceVerificationAction", ""))));
        data.put("urlResourcesPath", nullToEmpty(String.valueOf(readProperty(url, "resourcesPath", ""))));
        data.put("urlResourcesCommonPath", nullToEmpty(String.valueOf(readProperty(url, "resourcesCommonPath", ""))));

        data.put("isAppInitiatedAction", data.containsKey("isAppInitiatedAction"));
        data.put("verifyEmail", nullToEmpty((String) data.get("verifyEmail")));
        data.put("hasVerifyEmail", !nullToEmpty((String) data.get("verifyEmail")).isEmpty());

        if (data.get("user") instanceof ProfileBean profile) {
            data.put("userEmail", nullToEmpty(profile.getEmail()));
        } else {
            data.put("userEmail", "");
        }

        String clientBaseUrl = "";
        if (data.get("client") instanceof ClientBean client) {
            clientBaseUrl = nullToEmpty(client.getBaseUrl());
        }
        data.put("clientBaseUrl", clientBaseUrl);

        boolean skipLink = Boolean.TRUE.equals(data.get("skipLink"));
        if (!skipLink && data.get("logoutConfirm") instanceof LogoutConfirmBean logoutConfirm) {
            skipLink = logoutConfirm.isSkipLink();
            data.put("logoutConfirmCode", nullToEmpty(logoutConfirm.getCode()));
        } else if (data.get("logoutConfirm") instanceof LogoutConfirmBean logoutConfirm) {
            data.put("logoutConfirmCode", nullToEmpty(logoutConfirm.getCode()));
        } else {
            data.put("logoutConfirmCode", "");
        }
        data.put("skipLink", skipLink);
        data.put("showBackLink", !skipLink && !clientBaseUrl.isEmpty());

        data.put("pageRedirectUri", nullToEmpty((String) data.get("pageRedirectUri")));
        data.put("actionUri", nullToEmpty((String) data.get("actionUri")));
        data.put("showInfoRedirectLink", !nullToEmpty((String) data.get("pageRedirectUri")).isEmpty());
        data.put("showInfoActionLink", nullToEmpty((String) data.get("pageRedirectUri")).isEmpty()
                && !nullToEmpty((String) data.get("actionUri")).isEmpty());
        data.put("traceId", nullToEmpty((String) data.get("traceId")));
        data.put("hasTraceId", !nullToEmpty((String) data.get("traceId")).isEmpty());
        data.put("idpDisplayName", nullToEmpty((String) data.get("idpDisplayName")));

        if (data.get("code") instanceof CodeBean code) {
            data.put("codeSuccess", code.isSuccess());
            data.put("codeValue", nullToEmpty(code.getCode()));
            data.put("codeError", nullToEmpty(code.getError()));
        } else {
            data.put("codeSuccess", false);
            data.put("codeValue", "");
            data.put("codeError", "");
        }

        if (data.get("auth") instanceof AuthenticationContextBean auth) {
            List<Map<String, String>> selections = new ArrayList<>();
            auth.getAuthenticationSelections().forEach(option -> selections.add(Map.of(
                    "authExecId", nullToEmpty(option.getAuthExecId()),
                    "displayName", nullToEmpty(option.getDisplayName()),
                    "helpText", nullToEmpty(option.getHelpText()))));
            data.put("authSelections", selections);
        } else {
            data.put("authSelections", Collections.emptyList());
        }

        data.put("profileFields", buildProfileFields(data.get("profile"), messagesPerField));
        data.put("passwordRequired", Boolean.TRUE.equals(data.get("passwordRequired")));
        data.put("recaptchaRequired", data.containsKey("recaptchaRequired"));
        data.put("recaptchaVisible", Boolean.TRUE.equals(data.get("recaptchaVisible")));
        data.put("termsAcceptanceRequired", data.containsKey("termsAcceptanceRequired"));

        if (data.get("oauth") instanceof OAuthGrantBean oauth) {
            List<Map<String, String>> scopes = new ArrayList<>();
            oauth.getClientScopesRequested().forEach(scope -> scopes.add(Map.of(
                    "text", nullToEmpty(scope.getConsentScreenText()),
                    "parameter", nullToEmpty(readScopeParameter(scope)))));
            data.put("oauthScopes", scopes);
            data.put("oauthClient", nullToEmpty(oauth.getClient()));
        } else {
            data.put("oauthScopes", Collections.emptyList());
            data.put("oauthClient", "");
        }

        if (data.get("samlPost") instanceof SAMLPostFormBean samlPost) {
            data.put("samlPostUrl", nullToEmpty(samlPost.getUrl()));
            data.put("samlRequest", nullToEmpty(samlPost.getSAMLRequest()));
            data.put("samlResponse", nullToEmpty(samlPost.getSAMLResponse()));
            data.put("samlRelayState", nullToEmpty(samlPost.getRelayState()));
            data.put("hasSamlRequest", !nullToEmpty(samlPost.getSAMLRequest()).isEmpty());
            data.put("hasSamlResponse", !nullToEmpty(samlPost.getSAMLResponse()).isEmpty());
            data.put("hasSamlRelayState", !nullToEmpty(samlPost.getRelayState()).isEmpty());
        } else {
            data.put("samlPostUrl", "");
            data.put("samlRequest", "");
            data.put("samlResponse", "");
            data.put("samlRelayState", "");
            data.put("hasSamlRequest", false);
            data.put("hasSamlResponse", false);
            data.put("hasSamlRelayState", false);
        }

        if (data.get("x509") instanceof X509ConfirmBean x509) {
            Map<String, String> formData = x509.getFormData();
            data.put("x509SubjectDn", nullToEmpty(formData.get("subjectDN")));
            data.put("x509Username", nullToEmpty(formData.get("username")));
        } else {
            data.put("x509SubjectDn", "");
            data.put("x509Username", "");
        }

        if (data.get("configuredOtpCredentials") instanceof TotpLoginBean configuredOtp) {
            data.put("otpCredentialOptions", buildOtpCredentialOptions(configuredOtp));
        } else if (data.get("otpLogin") instanceof TotpLoginBean otpLogin) {
            data.put("otpCredentialOptions", buildOtpCredentialOptions(otpLogin));
        } else {
            data.put("otpCredentialOptions", Collections.emptyList());
        }

        Object user = data.get("user");
        data.put("organizationOptions", buildOrganizationOptions(user));

        Object totp = data.get("totp");
        data.put("totpSecretEncoded", nullToEmpty(String.valueOf(readProperty(totp, "totpSecretEncoded", ""))));
        data.put("totpQrUrl", nullToEmpty(String.valueOf(readProperty(totp, "qrUrl", ""))));
        data.put("hasTotpSecret", !nullToEmpty(String.valueOf(readProperty(totp, "totpSecretEncoded", ""))).isEmpty());
        data.put("hasTotpQrUrl", !nullToEmpty(String.valueOf(readProperty(totp, "qrUrl", ""))).isEmpty());

        data.put("recoveryCodes", buildRecoveryCodes(data.get("recoveryAuthnCodesConfigBean")));
        data.put("credentialLabel", nullToEmpty((String) data.get("credentialLabel")));
    }

    private static List<Map<String, String>> buildSocialProviderList(Object social) {
        if (social == null) {
            return Collections.emptyList();
        }

        Object providers = readProperty(social, "providers", null);
        if (!(providers instanceof List<?> list)) {
            return Collections.emptyList();
        }

        List<Map<String, String>> socialProviderList = new ArrayList<>();
        for (Object provider : list) {
            if (provider == null) {
                continue;
            }
            String alias = nullToEmpty(String.valueOf(readProperty(provider, "alias", "")));
            String displayName = nullToEmpty(String.valueOf(readProperty(provider, "displayName", "")));
            if (displayName.isEmpty()) {
                displayName = alias;
            }
            socialProviderList.add(Map.of(
                    "alias", alias,
                    "loginUrl", nullToEmpty(String.valueOf(readProperty(provider, "loginUrl", ""))),
                    "displayName", displayName,
                    "iconClasses", nullToEmpty(String.valueOf(readProperty(provider, "iconClasses", "")))));
        }
        return socialProviderList;
    }

    private static String readScopeParameter(Object scope) {
        Object parameter = readProperty(scope, "parameterizedScopeParameter", null);
        if (parameter == null || "".equals(parameter)) {
            parameter = readProperty(scope, "dynamicScopeParameter", "");
        }
        return nullToEmpty(String.valueOf(parameter));
    }

    private static List<String> buildRecoveryCodes(Object bean) {
        Object codes = readProperty(bean, "generatedRecoveryAuthnCodesList", null);
        if (!(codes instanceof List<?> list)) {
            return Collections.emptyList();
        }
        List<String> recoveryCodes = new ArrayList<>();
        for (Object code : list) {
            recoveryCodes.add(code != null ? code.toString() : "");
        }
        return recoveryCodes;
    }

    private static List<Map<String, Object>> buildOtpCredentialOptions(TotpLoginBean totpLogin) {
        List<Map<String, Object>> options = new ArrayList<>();
        String selectedId = nullToEmpty(totpLogin.getSelectedCredentialId());
        totpLogin.getUserOtpCredentials().forEach(credential -> {
            Map<String, Object> option = new HashMap<>();
            option.put("id", nullToEmpty(credential.getId()));
            option.put("userLabel", nullToEmpty(credential.getUserLabel()));
            option.put("selected", selectedId.equals(nullToEmpty(credential.getId())));
            options.add(option);
        });
        return options;
    }

    private static List<Map<String, String>> buildOrganizationOptions(Object user) {
        if (user == null) {
            return Collections.emptyList();
        }
        Object organizations = readProperty(user, "organizations", null);
        if (!(organizations instanceof List<?> list)) {
            return Collections.emptyList();
        }
        List<Map<String, String>> options = new ArrayList<>();
        for (Object organization : list) {
            options.add(Map.of(
                    "alias", nullToEmpty(String.valueOf(readProperty(organization, "alias", ""))),
                    "name", nullToEmpty(String.valueOf(readProperty(organization, "name", "")))));
        }
        return options;
    }

    private static List<Map<String, Object>> buildProfileFields(Object profile, MessagesPerFieldBean messagesPerField) {
        if (!(profile instanceof AbstractUserProfileBean userProfile)) {
            return Collections.emptyList();
        }

        List<Map<String, Object>> fields = new ArrayList<>();
        for (AbstractUserProfileBean.Attribute attribute : userProfile.getAttributes()) {
            if (attribute.isReadOnly()) {
                continue;
            }
            Map<String, Object> field = new HashMap<>();
            field.put("name", attribute.getName());
            field.put("displayName", attribute.getDisplayName());
            field.put("value", nullToEmpty(attribute.getValue()));
            field.put("required", attribute.isRequired());
            field.put("autocomplete", nullToEmpty(attribute.getAutocomplete()));
            if (messagesPerField != null) {
                field.put("hasError", messagesPerField.existsError(attribute.getName()));
                field.put("error", nullToEmpty(messagesPerField.getFirstError(attribute.getName())));
            } else {
                field.put("hasError", false);
                field.put("error", "");
            }
            fields.add(field);
        }
        return fields;
    }

    private static void putFieldError(Map<String, Object> data, MessagesPerFieldBean messagesPerField,
            String fieldName) {
        putFieldError(data, messagesPerField, fieldName, fieldName);
    }

    private static void putFieldError(Map<String, Object> data, MessagesPerFieldBean messagesPerField,
            String fieldName, String keyPrefix) {
        String hasKey = "has" + capitalize(keyPrefix) + "Error";
        String errorKey = keyPrefix + "FieldError";
        if (messagesPerField != null) {
            data.put(hasKey, messagesPerField.existsError(fieldName));
            data.put(errorKey, nullToEmpty(messagesPerField.getFirstError(fieldName)));
        } else {
            data.put(hasKey, false);
            data.put(errorKey, "");
        }
    }

    private static boolean readBoolean(Object bean, String property, boolean defaultValue) {
        Object value = readProperty(bean, property, defaultValue);
        if (value instanceof Boolean bool) {
            return bool;
        }
        return defaultValue;
    }

    private static Object readProperty(Object bean, String property, Object defaultValue) {
        if (bean == null) {
            return defaultValue;
        }
        if (bean instanceof Map<?, ?> map) {
            Object value = map.get(property);
            return value != null ? value : defaultValue;
        }
        try {
            var method = bean.getClass().getMethod("is" + capitalize(property));
            return method.invoke(bean);
        } catch (ReflectiveOperationException ignored) {
            // fall through
        }
        try {
            var method = bean.getClass().getMethod("get" + capitalize(property));
            return method.invoke(bean);
        } catch (ReflectiveOperationException ignored) {
            return defaultValue;
        }
    }

    private static String capitalize(String value) {
        if (value == null || value.isEmpty()) {
            return value;
        }
        return Character.toUpperCase(value.charAt(0)) + value.substring(1);
    }

    private static void putDefault(Map<String, Object> data, String key, Object defaultValue) {
        if (!data.containsKey(key)) {
            data.put(key, defaultValue);
        }
    }

    private static String nullToEmpty(String value) {
        return value != null ? value : "";
    }
}
