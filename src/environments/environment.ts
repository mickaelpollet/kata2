export const environment = {
    KeycloakConfig: {
        url: 'https://tools.poudlard.net:8450/auth/',
        realm: 'wizards-world',
        clientId: 'wizards-world-app',
        clientSecret: '',
        scope: 'openid profile email',
        sessionTimeout: 60000
    },
    appName: 'Keycloak Angular Testing Application',
    appNameAcronym: 'KATA 2',
    appUrl: 'https://kata.poudlard.net:4443'
};
