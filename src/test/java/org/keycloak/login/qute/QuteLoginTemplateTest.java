package org.keycloak.login.qute;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import io.quarkus.qute.Engine;
import io.quarkus.qute.RawString;
import io.quarkus.qute.ReflectionValueResolver;
import io.quarkus.qute.TemplateException;

class QuteLoginTemplateTest {

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

    public static void main(String[] args) throws Exception {
        int failures = 0;
        failures += assertTemplate("login.html", baseLoginData(), html ->
                html.contains("kc-form-login")
                        && html.contains("kc-form-buttons")
                        && html.contains("kc-social-providers")
                        && html.contains("mb-4")
                        && html.contains("</html>"));
        failures += assertTemplate("register.html", registrationData(), html ->
                html.contains("kc-register-form-inner")
                        && html.contains("kc-form-buttons")
                        && html.contains("</html>"));
        failures += assertTemplate("login-update-password.html", appInitiatedActionData(), html ->
                html.contains("kc-form-buttons")
                        && html.contains("cancel-aia")
                        && html.contains("password-new")
                        && html.contains("</html>"));
        if (failures == 0) {
            System.out.println("OK");
        } else {
            System.err.println("FAILURES: " + failures);
            System.exit(1);
        }
    }

    private static int assertTemplate(String templateName, Map<String, Object> data,
            java.util.function.Predicate<String> assertion) {
        try {
            String html = render(templateName, data);
            if (!assertion.test(html)) {
                System.err.println("ASSERTION FAILED: " + templateName);
                return 1;
            }
        } catch (TemplateException e) {
            System.err.println("FAIL " + templateName + ": " + e.getMessage());
            e.printStackTrace();
            return 1;
        } catch (Exception e) {
            System.err.println("FAIL " + templateName + ": " + e.getMessage());
            e.printStackTrace();
            return 1;
        }
        return 0;
    }

    private static Map<String, Object> baseLoginData() {
        Map<String, Object> data = commonData();
        data.put("pageId", "login");
        data.put("usernameHidden", false);
        data.put("registrationDisabled", false);
        data.put("social", Map.of("providers", List.of(Map.of(
                "alias", "google",
                "loginUrl", "http://localhost/google",
                "displayName", "Google",
                "iconClasses", "fa fa-google"))));
        QuteTemplateDataSupport.enrich(data);
        return data;
    }

    private static Map<String, Object> registrationData() {
        Map<String, Object> data = commonData();
        data.put("pageId", "register");
        data.put("passwordRequired", true);
        data.put("profile", Collections.emptyMap());
        QuteTemplateDataSupport.enrich(data);
        return data;
    }

    private static Map<String, Object> appInitiatedActionData() {
        Map<String, Object> data = commonData();
        data.put("pageId", "login-update-password");
        data.put("isAppInitiatedAction", true);
        QuteTemplateDataSupport.enrich(data);
        return data;
    }

    private static Map<String, Object> commonData() {
        Map<String, Object> data = new HashMap<>();
        data.put("lang", "en");
        data.put("darkMode", true);
        data.put("scripts", List.of());
        data.put("styles", List.of("css/styles.css"));
        data.put("realm", Map.of(
                "displayName", "Keycloak",
                "password", true,
                "loginWithEmailAllowed", true,
                "registrationEmailAsUsername", false,
                "rememberMe", false,
                "resetPasswordAllowed", false,
                "registrationAllowed", false));
        data.put("url", Map.of(
                "resourcesPath", "/resources",
                "resourcesCommonPath", "/resources-common",
                "loginAction", "http://localhost/login",
                "loginResetCredentialsUrl", "http://localhost/reset",
                "registrationUrl", "http://localhost/register",
                "registrationAction", "http://localhost/register-action",
                "loginUrl", "http://localhost/login-url"));
        data.put("propertiesMap", Map.of(
                "kcHtmlClass", "",
                "kcDarkModeClass", "dark"));
        data.put("msg", new QuteMessageResolver(java.util.Locale.ENGLISH, new Properties()));
        data.put("contextJson", new RawString("{}"));
        return data;
    }

    private static String render(String templateName, Map<String, Object> data) throws Exception {
        var themeRoot = java.nio.file.Path.of("target/classes/theme/login-ui-qute/login");
        Engine engine = Engine.builder()
                .addDefaults()
                .addValueResolver(new ReflectionValueResolver())
                .strictRendering(false)
                .addLocator(id -> {
                    var file = themeRoot.resolve(id.contains(".") ? id : id + ".html");
                    if (!file.toFile().exists()) {
                        return java.util.Optional.empty();
                    }
                    return java.util.Optional.of(new io.quarkus.qute.TemplateLocator.TemplateLocation() {
                        @Override
                        public java.io.Reader read() {
                            try {
                                return java.nio.file.Files.newBufferedReader(file, StandardCharsets.UTF_8);
                            } catch (java.io.IOException e) {
                                throw new RuntimeException(e);
                            }
                        }

                        @Override
                        public java.util.Optional<io.quarkus.qute.Variant> getVariant() {
                            return java.util.Optional.of(io.quarkus.qute.Variant.forContentType(io.quarkus.qute.Variant.TEXT_HTML));
                        }
                    });
                })
                .build();

        for (String[] fragment : FRAGMENTS) {
            preload(engine, themeRoot, fragment[0], fragment[1]);
        }

        return engine.getTemplate(templateName).data(data).render();
    }

    private static void preload(Engine engine, java.nio.file.Path themeRoot, String fileName, String alias)
            throws java.io.IOException {
        String content = java.nio.file.Files.readString(themeRoot.resolve(fileName), StandardCharsets.UTF_8);
        var parsed = engine.parse(content);
        engine.putTemplate(fileName, parsed);
        if (!fileName.equals(alias)) {
            engine.putTemplate(alias, parsed);
        }
    }
}
