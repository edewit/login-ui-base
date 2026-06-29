package org.keycloak.login.qute;

import java.io.IOException;
import java.net.URL;
import java.util.Properties;

import org.jboss.logging.Logger;
import org.keycloak.models.KeycloakSession;
import org.keycloak.theme.Theme;

public final class QuteThemeSupport {

    private static final Logger LOG = Logger.getLogger(QuteThemeSupport.class);

    public static final String TEMPLATE_ENGINE_PROPERTY = "templateEngine";
    public static final String QUTE_ENGINE = "qute";

    private QuteThemeSupport() {
    }

    public static boolean usesQute(KeycloakSession session, Theme theme) {
        Theme current = theme;
        while (current != null) {
            try {
                Properties properties = current.getProperties();
                if (QUTE_ENGINE.equalsIgnoreCase(properties.getProperty(TEMPLATE_ENGINE_PROPERTY))) {
                    return true;
                }
            } catch (IOException e) {
                LOG.warnf(e, "Failed to read theme properties for theme %s", current.getName());
            }

            String parentName = current.getParentName();
            if (parentName == null || parentName.isBlank()) {
                break;
            }

            try {
                current = session.theme().getTheme(parentName, current.getType());
            } catch (IOException e) {
                LOG.warnf(e, "Failed to load parent theme %s", parentName);
                break;
            }
        }
        return false;
    }

    public static String toQuteTemplateName(String freeMarkerTemplateName) {
        if (freeMarkerTemplateName == null) {
            return null;
        }
        if (freeMarkerTemplateName.endsWith(".ftl")) {
            return freeMarkerTemplateName.substring(0, freeMarkerTemplateName.length() - 4) + ".html";
        }
        if (!freeMarkerTemplateName.endsWith(".html")) {
            return freeMarkerTemplateName + ".html";
        }
        return freeMarkerTemplateName;
    }

    public static URL locateTemplate(KeycloakSession session, Theme theme, String templateName) throws IOException {
        URL template = locateTemplateExact(session, theme, templateName);
        if (template != null) {
            return template;
        }

        if (!templateName.contains(".")) {
            return locateTemplateExact(session, theme, templateName + ".html");
        }

        return null;
    }

    private static URL locateTemplateExact(KeycloakSession session, Theme theme, String templateName) throws IOException {
        Theme current = theme;
        while (current != null) {
            URL template = current.getTemplate(templateName);
            if (template != null) {
                return template;
            }

            String parentName = current.getParentName();
            if (parentName == null || parentName.isBlank()) {
                break;
            }
            current = session.theme().getTheme(parentName, current.getType());
        }
        return null;
    }
}
