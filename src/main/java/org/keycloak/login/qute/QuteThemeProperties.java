package org.keycloak.login.qute;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

public final class QuteThemeProperties {

    private final Map<String, String> properties;

    public QuteThemeProperties(Properties properties) {
        this.properties = properties.stringPropertyNames().stream()
                .collect(Collectors.toMap(key -> key, properties::getProperty));
    }

    public String get(String name) {
        return properties.getOrDefault(name, "");
    }

    public boolean has(String name) {
        String value = properties.get(name);
        return value != null && !value.isBlank();
    }

    public List<String> split(String name) {
        String value = properties.get(name);
        if (value == null || value.isBlank()) {
            return Collections.emptyList();
        }
        return new ArrayList<>(Arrays.asList(value.trim().split("\\s+")));
    }
}
