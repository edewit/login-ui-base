package org.keycloak.login.qute;

import java.text.MessageFormat;
import java.util.Locale;
import java.util.Properties;

import org.keycloak.theme.TemplatingUtil;

public class QuteMessageResolver {

    private final Locale locale;
    private final Properties messages;

    public QuteMessageResolver(Locale locale, Properties messages) {
        this.locale = locale;
        this.messages = messages;
    }

    public String format(String key, Object... params) {
        if (key == null) {
            return "";
        }
        Object value = messages.getOrDefault(key, key);
        String template = TemplatingUtil.resolveVariables(String.valueOf(value), messages);
        if (params == null || params.length == 0) {
            return template;
        }
        Object[] resolved = new Object[params.length];
        for (int i = 0; i < params.length; i++) {
            Object param = params[i];
            if (param instanceof String stringParam) {
                resolved[i] = TemplatingUtil.resolveVariables(stringParam, messages);
            } else {
                resolved[i] = param;
            }
        }
        return new MessageFormat(template, locale).format(resolved);
    }
}
