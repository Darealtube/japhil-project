import { initAuth0 } from "@auth0/nextjs-auth0";

export default initAuth0({
  domain: process.env.AUTH_DOMAIN,
  clientId: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  scope: "openid profile email",
  redirectUri: "http://localhost:3000/api/Authentication/callback",
  postLogoutRedirectUri: "http://localhost:3000/",
  session: {
    // The secret used to encrypt the cookie.
    cookieSecret: process.env.COOKIE_SECRET,
    // The cookie lifetime (expiration) in seconds. Set to 8 hours by default.
    cookieLifetime: 60 * 60 * 8,
    // (Optional) The cookie domain this should run on. Leave it blank to restrict it to your domain.
    // cookieDomain: "your-domain.com",
    // (Optional) SameSite configuration for the session cookie. Defaults to 'lax', but can be changed to 'strict' or 'none'. Set it to false if you want to disable the SameSite setting.
    // cookieSameSite: "lax",
    // (Optional) Store the id_token in the session. Defaults to false.
    storeIdToken: false,
    // (Optional) Store the access_token in the session. Defaults to false.
    storeAccessToken: false,
    // (Optional) Store the refresh_token in the session. Defaults to false.
    storeRefreshToken: false,
  },
});
