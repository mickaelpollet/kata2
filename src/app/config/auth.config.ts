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

const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: /^(http:\/\/localhost:8181)(\/.*)?$/i
});

export const provideKeycloakAngular = () =>

    provideKeycloak({
    config: {
        url: environment.KeycloakConfig.url,
        realm: environment.KeycloakConfig.realm,
        clientId: environment.KeycloakConfig.clientId
    },
    initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        redirectUri: window.location.origin + '/',
        // acrValues: 'eidas2',
        scope: environment.KeycloakConfig.scope
    },
    features: [
        withAutoRefreshToken({
            onInactivityTimeout: 'logout',
            sessionTimeout: environment.KeycloakConfig.sessionTimeout
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