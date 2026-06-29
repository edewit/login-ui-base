package org.keycloak.login.qute;

import java.util.Map;
import java.util.Properties;

import org.keycloak.forms.login.freemarker.model.RealmBean;
import org.keycloak.forms.login.freemarker.model.UrlBean;
import org.keycloak.theme.beans.LocaleBean;
import org.keycloak.theme.beans.MessageBean;

public final class LoginContextJsonBuilder {

    private LoginContextJsonBuilder() {
    }

    public static String build(Map<String, Object> attributes) {
        StringBuilder json = new StringBuilder(1024);
        json.append('{');

        appendString(json, "pageId", stringAttr(attributes, "pageId"));
        appendString(json, "locale", stringAttr(attributes, "lang"), true);
        appendString(json, "lang", stringAttr(attributes, "lang"), true);
        appendBoolean(json, "darkMode", booleanAttr(attributes, "darkMode"), true);

        Object realm = attributes.get("realm");
        if (realm instanceof RealmBean realmBean) {
            json.append(',');
            appendObjectStart(json, "realm");
            appendString(json, "name", realmBean.getName());
            appendString(json, "displayName", realmBean.getDisplayName(), true);
            appendString(json, "displayNameHtml", realmBean.getDisplayNameHtml(), true);
            appendBoolean(json, "registrationAllowed", realmBean.isRegistrationAllowed(), true);
            appendBoolean(json, "registrationEmailAsUsername", realmBean.isRegistrationEmailAsUsername(), true);
            appendBoolean(json, "loginWithEmailAllowed", realmBean.isLoginWithEmailAllowed(), true);
            appendBoolean(json, "duplicateEmailsAllowed", realmBean.isDuplicateEmailsAllowed(), true);
            appendBoolean(json, "resetPasswordAllowed", realmBean.isResetPasswordAllowed(), true);
            appendBoolean(json, "rememberMe", realmBean.isRememberMe(), true);
            appendBoolean(json, "password", realmBean.isPassword(), true);
            appendBoolean(json, "internationalizationEnabled", realmBean.isInternationalizationEnabled(), true);
            appendObjectEnd(json);
        }

        Object url = attributes.get("url");
        if (url instanceof UrlBean urlBean) {
            json.append(',');
            appendObjectStart(json, "url");
            appendString(json, "loginAction", urlBean.getLoginAction());
            appendString(json, "loginUrl", urlBean.getLoginUrl(), true);
            appendString(json, "registrationUrl", urlBean.getRegistrationUrl(), true);
            appendString(json, "loginResetCredentialsUrl", urlBean.getLoginResetCredentialsUrl(), true);
            appendString(json, "resourcesPath", urlBean.getResourcesPath(), true);
            appendString(json, "resourcesCommonPath", urlBean.getResourcesCommonPath(), true);
            appendObjectEnd(json);
        }

        Object locale = attributes.get("locale");
        if (locale instanceof LocaleBean localeBean) {
            json.append(',');
            appendObjectStart(json, "localeBean");
            appendString(json, "currentLanguageTag", localeBean.getCurrentLanguageTag());
            appendObjectEnd(json);
        }

        Object message = attributes.get("message");
        if (message instanceof MessageBean messageBean && messageBean.getSummary() != null) {
            json.append(',');
            appendObjectStart(json, "message");
            appendString(json, "summary", messageBean.getSummary());
            appendString(json, "type", messageBean.getType(), true);
            appendObjectEnd(json);
        }

        Object properties = attributes.get("properties");
        if (properties instanceof Properties themeProperties) {
            json.append(',');
            appendObjectStart(json, "properties");
            boolean first = true;
            for (String key : themeProperties.stringPropertyNames()) {
                if (!first) {
                    json.append(',');
                }
                first = false;
                appendString(json, key, themeProperties.getProperty(key));
            }
            appendObjectEnd(json);
        }

        json.append('}');
        return json.toString();
    }

    private static String stringAttr(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        return value != null ? value.toString() : "";
    }

    private static boolean booleanAttr(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        if (value instanceof Boolean bool) {
            return bool;
        }
        return value != null && Boolean.parseBoolean(value.toString());
    }

    private static void appendObjectStart(StringBuilder json, String name) {
        json.append('"').append(escape(name)).append("\":{");
    }

    private static void appendObjectEnd(StringBuilder json) {
        json.append('}');
    }

    private static void appendString(StringBuilder json, String name, String value) {
        appendString(json, name, value, false);
    }

    private static void appendString(StringBuilder json, String name, String value, boolean prependComma) {
        if (prependComma) {
            json.append(',');
        }
        json.append('"').append(escape(name)).append("\":\"").append(escape(value != null ? value : "")).append('"');
    }

    private static void appendBoolean(StringBuilder json, String name, boolean value, boolean prependComma) {
        if (prependComma) {
            json.append(',');
        }
        json.append('"').append(escape(name)).append("\":").append(value);
    }

    private static String escape(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
