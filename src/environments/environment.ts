export const environment = {
    KeycloakConfig: {
        url: 'http://localhost/',
        realm: 'test-realm',
        clientId: 'kata',
        clientSecret: '',
        scope: 'openid profile email',
        sessionTimeout: 60000
    },
    appName: 'Keycloak Angular Testing Application',
    appNameAcronym: 'KATA 2',
    appUrl: 'https://kata.poudlard.net:4443'
};
