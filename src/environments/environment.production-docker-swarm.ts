export const environment = {
    production: true,
    caching: true,
    auth: {
        issuer: 'https://extraxxx.xxxxx', // Identity Provider URL
        clientId: 'xxxxx', // Client ID
        postLogoutRedirectUri: 'https://miyembro.net', // Redirect URL after logout
        redirectUri: 'https://miyembro.net/login/callback',
        oauthRedirectUri: 'https://miyembro.net/login/oauth2/code/google',
        silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
        scope: 'openid profile logistack_apps authorization',
        requireHttps: false,
        disableAtHashCheck: true,
        responseType: 'id_token token',
        preserveRequestedRoute: true,
        oidc: true,
        showDebugInformation: false,  // Disable debug info in production
        clearHashAfterLogin: true,
        strictDiscoveryDocumentValidation: false,
    },
    // apiUrl: `${window.location.protocol}//${window.location.hostname}:8222/api/v1`,
    // apiUrl: `${window.location.protocol}//${window.location.hostname}/api/v1`,
    apiUrl: '/api/v1',
    // apiUrl: `${window.location.protocol}//${window.location.hostname}${window.location.port ? '' : ':8222'}/api/v1`,
    // apiUrl: 'http://gateway-service:8222/api/v1',  // Default to the gateway service DNS
    // apiUrl: 'http://ec2-13-53-224-124.eu-north-1.compute.amazonaws.com:8222/api/v1',  // Default to the gateway service DNS
    countryUrl: 'https://api.countrystatecity.in/v1',
    requireHttps: false
};


