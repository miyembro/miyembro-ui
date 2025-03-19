export const environment = {
    production: false,
    caching: true,
    auth: {
        issuer: 'https://extraxxx.xxxxx', // URL of the Identity Provider
        clientId: 'xxxxx', // Client ID
        postLogoutRedirectUri: 'http://127.0.0.1:30085/', // Redirect URL after logout
        redirectUri: window.location.origin + "/login/callback",
        silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html', // URL to redirect after silent refresh
        scope: 'openid profile logistack_apps authorization', // Scopes
        requireHttps: false,
        disableAtHashCheck: true,
        responseType: 'id_token token', // responseType
        preserveRequestedRoute: true, // preserve the requested route when redirecting
        oidc: true,
        showDebugInformation: true,
        clearHashAfterLogin: true,
        strictDiscoveryDocumentValidation: false,
      },
    apiUrl: 'http://a3ffb3a27225a4c069b0db8b5cd62ad6-1872038020.eu-north-1.elb.amazonaws.com/api/v1',
    countryUrl: 'https://api.countrystatecity.in/v1',
    requireHttps : false
};
