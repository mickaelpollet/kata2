export const environment = {
    KeycloakConfig: {
        url: 'http://localhost:8080',
        realm: 'demo',
        clientId: 'angular-app',
        scope: 'openid profile email',
        // Same note as for the development environment.
        // This file is for informational purposes only.
        sessionTimeout: 60000
    },
    appName: 'Keycloak Angular Testing Application',
    appNameAcronym: 'KATA 2',
    appUrl: 'https://kata.poudlard.net:4443'
};
