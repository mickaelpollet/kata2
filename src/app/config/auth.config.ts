import { environment } from '../../environments/environment';
import {
    provideKeycloak,
    createInterceptorCondition,
    IncludeBearerTokenCondition,
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    withAutoRefreshToken,
    AutoRefreshTokenService,
    UserActivityService
} from 'keycloak-angular';
import type { KeycloakOnLoad } from 'keycloak-js';


const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: /^(http:\/\/localhost:8181)(\/.*)?$/i
});

function getSelectedKeycloakProfile(): any {
    try {
        const profilesCookie = document.cookie.match(/(^| )keycloak_profiles=([^;]+)/);
        const selectedNameCookie = document.cookie.match(/(^| )selected_keycloak_profile=([^;]+)/);

        if (!profilesCookie) return null;

        const profiles = JSON.parse(decodeURIComponent(profilesCookie[2]));
        const selected = selectedNameCookie
        ? decodeURIComponent(selectedNameCookie[2])
        : Object.keys(profiles)[0];

        return profiles[selected] || null;
    } catch (e) {
        console.warn('Erreur lecture cookie profils Keycloak:', e);
        return null;
    }
}

export const provideKeycloakAngular = () => {

    const profile = getSelectedKeycloakProfile();

    const keycloakConfig = {
        url: profile?.url || environment.KeycloakConfig.url,
        realm: profile?.realm || environment.KeycloakConfig.realm,
        clientId: profile?.clientId || environment.KeycloakConfig.clientId
    };

    const initOptions = {
        onLoad: 'check-sso' as KeycloakOnLoad,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        redirectUri: window.location.origin + '/',
        scope: profile?.scope || environment.KeycloakConfig.scope
    };

    const sessionTimeout = profile?.sessionTimeout || environment.KeycloakConfig.sessionTimeout || 300;

    return provideKeycloak({
        config: keycloakConfig,
        initOptions,
        features: [
        withAutoRefreshToken({
            onInactivityTimeout: 'logout',
            sessionTimeout
        })
        ],
        providers: [
        AutoRefreshTokenService,
        UserActivityService,
        {
            provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
            useValue: [localhostCondition]
        }
        ]
    });
};
