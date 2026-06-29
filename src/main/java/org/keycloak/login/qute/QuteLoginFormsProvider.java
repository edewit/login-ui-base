package org.keycloak.login.qute;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import jakarta.ws.rs.core.Response;

import org.jboss.logging.Logger;
import org.keycloak.forms.login.freemarker.FreeMarkerLoginFormsProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.theme.Theme;
import org.keycloak.utils.MediaType;

import io.quarkus.qute.Engine;
import io.quarkus.qute.RawString;
import io.quarkus.qute.ReflectionValueResolver;
import io.quarkus.qute.Template;
import io.quarkus.qute.TemplateException;

public class QuteLoginFormsProvider extends FreeMarkerLoginFormsProvider {

    private static final Logger LOG = Logger.getLogger(QuteLoginFormsProvider.class);

    private static final String[][] FRAGMENTS = {
            {"template.html", "template"},
            {"alert.html", "alert"},
            {"profile-fields.html", "profile-fields"},
            {"components/form-field.html", "form-field"},
            {"components/username-field.html", "username-field"},
            {"components/checkbox-field.html", "checkbox-field"},
            {"components/form-buttons.html", "form-buttons"},
            {"components/submit-button.html", "submit-button"},
            {"components/cancel-aia-button.html", "cancel-aia-button"},
            {"components/social-providers.html", "social-providers"},
            {"components/social-provider.html", "social-provider"},
    };

    public QuteLoginFormsProvider(KeycloakSession session) {
        super(session);
    }

    @Override
    protected Response processTemplate(Theme theme, String templateName, Locale locale) {
        if (!QuteThemeSupport.usesQute(session, theme)) {
            return super.processTemplate(theme, templateName, locale);
        }

        try {
            Map<String, Object> data = prepareTemplateData(theme, templateName, locale);
            String quteTemplateName = QuteThemeSupport.toQuteTemplateName(templateName);

            Engine engine = buildEngine(theme);

            Template template = engine.getTemplate(quteTemplateName);
            if (template == null) {
                LOG.errorf("Qute template not found: %s", quteTemplateName);
                return Response.serverError().build();
            }

            String result = template.data(data).render();
            Response.ResponseBuilder builder = Response.status(status == null ? Response.Status.OK : status)
                    .type(MediaType.TEXT_HTML_UTF_8_TYPE)
                    .language(locale)
                    .entity(result);
            for (Map.Entry<String, String> entry : httpResponseHeaders.entrySet()) {
                builder.header(entry.getKey(), entry.getValue());
            }
            return builder.build();
        } catch (TemplateException e) {
            LOG.errorf(e, "Failed to process Qute template %s: %s", templateName, e.getMessage());
            return Response.serverError().build();
        } catch (java.io.IOException e) {
            LOG.errorf(e, "Failed to load Qute template %s", templateName);
            return Response.serverError().build();
        }
    }

    private Map<String, Object> prepareTemplateData(Theme theme, String templateName, Locale locale) throws java.io.IOException {
        Map<String, Object> data = new HashMap<>(attributes);

        if (!data.containsKey("templateName")) {
            data.put("templateName", templateName);
        }

        String pageId = templateName.endsWith(".ftl")
                ? templateName.substring(0, templateName.length() - 4)
                : templateName.replace(".html", "");
        data.put("pageId", pageId);

        Properties themeProperties = theme.getProperties();
        QuteThemeProperties props = new QuteThemeProperties(themeProperties);
        data.put("properties", themeProperties);
        data.put("propertiesMap", toMap(themeProperties));
        data.put("props", props);
        data.put("stylesCommon", props.split("stylesCommon"));
        data.put("styles", props.split("styles"));
        data.put("scripts", toScriptList(data.get("scripts")));

        data.put("usernameHidden", attributes.containsKey("usernameHidden"));
        data.put("registrationDisabled", attributes.containsKey("registrationDisabled"));

        Properties messagesBundle = theme.getEnhancedMessages(session.getContext().getRealm(), locale);
        data.put("msg", new QuteMessageResolver(locale, messagesBundle));
        data.put("contextJson", new RawString(LoginContextJsonBuilder.build(data)));

        QuteTemplateDataSupport.enrich(data);

        return data;
    }

    private Engine buildEngine(Theme theme) throws IOException {
        Engine engine = Engine.builder()
                .addDefaults()
                .addValueResolver(new ReflectionValueResolver())
                .strictRendering(false)
                .addLocator(new KeycloakThemeTemplateLocator(session, theme))
                .build();

        for (String[] fragment : FRAGMENTS) {
            preloadFragment(engine, theme, fragment[0], fragment[1]);
        }
        return engine;
    }

    private void preloadFragment(Engine engine, Theme theme, String fileName, String alias) throws IOException {
        URL templateUrl = QuteThemeSupport.locateTemplate(session, theme, fileName);
        if (templateUrl == null) {
            LOG.debugf("Optional Qute fragment not found: %s", fileName);
            return;
        }

        String content = readTemplate(templateUrl);
        Template parsed = engine.parse(content);
        engine.putTemplate(fileName, parsed);
        if (!fileName.equals(alias)) {
            engine.putTemplate(alias, parsed);
        }
    }

    private static String readTemplate(URL templateUrl) throws IOException {
        try (Reader reader = new InputStreamReader(templateUrl.openStream(), StandardCharsets.UTF_8)) {
            StringBuilder content = new StringBuilder();
            char[] buffer = new char[4096];
            int read;
            while ((read = reader.read(buffer)) != -1) {
                content.append(buffer, 0, read);
            }
            return content.toString();
        }
    }

    private static List<String> toScriptList(Object scripts) {
        if (scripts instanceof List<?> list) {
            List<String> result = new ArrayList<>(list.size());
            for (Object item : list) {
                if (item != null) {
                    result.add(item.toString());
                }
            }
            return result;
        }
        return Collections.emptyList();
    }

    private static Map<String, String> toMap(Properties properties) {
        Map<String, String> map = new HashMap<>();
        for (String key : properties.stringPropertyNames()) {
            map.put(key, properties.getProperty(key));
        }
        return map;
    }
}
