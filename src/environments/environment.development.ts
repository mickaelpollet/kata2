export const environment = {
    KeycloakConfig: {
        url: 'http://localhost:8080',
        realm: 'demo',
        clientId: 'angular-app',
        scope: 'openid profile email',
        // This file contains only default values ​​for development mode.
        // The actual configuration is entered dynamically by the user at runtime,
        // and persisted in a cookie.
        sessionTimeout: 60000
    },
    appName: 'Keycloak Angular Testing Application',
    appNameAcronym: 'KATA 2',
    appUrl: 'http://localhost:4200',
    projetUrl: "https://github.com/mickaelpollet/kata2"
};
