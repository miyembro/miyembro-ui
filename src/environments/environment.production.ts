export const environment = {
    production: true,
    caching: true,
    auth: {
        issuer: 'https://extraxxx.xxxxx', // Identity Provider URL
        clientId: 'xxxxx', // Client ID
        postLogoutRedirectUri: 'http://127.0.0.1:30085/', // Redirect URL after logout (Kubernetes service)
        redirectUri: window.location.origin + "/login/callback",
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
    apiUrl: (window as any).env?.API_URL, // this part (API_URL) is declared in the configmap of miyembro-angular (filename: configmap-angular-miyembro-aws.yaml)
    countryUrl: 'https://api.countrystatecity.in/v1',
    requireHttps: false
};
