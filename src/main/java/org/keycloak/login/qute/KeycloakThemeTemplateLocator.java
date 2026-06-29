package org.keycloak.login.qute;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.jboss.logging.Logger;
import org.keycloak.models.KeycloakSession;
import org.keycloak.theme.Theme;

import io.quarkus.qute.TemplateLocator;
import io.quarkus.qute.Variant;

public class KeycloakThemeTemplateLocator implements TemplateLocator {

    private static final Logger LOG = Logger.getLogger(KeycloakThemeTemplateLocator.class);

    private final KeycloakSession session;
    private final Theme theme;

    public KeycloakThemeTemplateLocator(KeycloakSession session, Theme theme) {
        this.session = session;
        this.theme = theme;
    }

    @Override
    public Optional<TemplateLocation> locate(String id) {
        try {
            URL templateUrl = QuteThemeSupport.locateTemplate(session, theme, id);
            if (templateUrl == null) {
                LOG.warnf("Qute template not found in theme %s: %s", theme.getName(), id);
                return Optional.empty();
            }
            return Optional.of(new ThemeTemplateLocation(templateUrl));
        } catch (IOException e) {
            LOG.warnf(e, "Failed to locate Qute template %s in theme %s", id, theme.getName());
            return Optional.empty();
        }
    }

    private static final class ThemeTemplateLocation implements TemplateLocation {
        private final URL url;

        private ThemeTemplateLocation(URL url) {
            this.url = url;
        }

        @Override
        public Reader read() {
            try {
                return new InputStreamReader(url.openStream(), StandardCharsets.UTF_8);
            } catch (IOException e) {
                throw new RuntimeException("Failed to read template " + url, e);
            }
        }

        @Override
        public Optional<Variant> getVariant() {
            return Optional.of(Variant.forContentType(Variant.TEXT_HTML));
        }
    }
}
