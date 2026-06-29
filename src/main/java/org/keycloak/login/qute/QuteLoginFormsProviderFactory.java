package org.keycloak.login.qute;

import org.keycloak.Config;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.forms.login.LoginFormsProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

public class QuteLoginFormsProviderFactory implements LoginFormsProviderFactory {

    public static final String PROVIDER_ID = "qute";

    @Override
    public LoginFormsProvider create(KeycloakSession session) {
        return new QuteLoginFormsProvider(session);
    }

    @Override
    public void init(Config.Scope config) {
    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {
    }

    @Override
    public void close() {
    }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public int order() {
        return 1;
    }
}
