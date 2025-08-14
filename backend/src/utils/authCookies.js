// backend/src/utils/authCookies.js
const isProd = process.env.NODE_ENV === 'production';

export const AUTH_COOKIE_NAME = 'fed_auth';

export function buildCookieOptions(maxAgeMs = 1000 * 60 * 60 * 12) {
  // Con dev-proxy (FE y BE "same-origin" desde el POV del browser):
  // - podemos usar SameSite=Lax y secure=false sin problemas.
  // En prod: Secure + Lax.
  return {
    httpOnly: true,
    secure: isProd,                // prod: true, dev: false
    sameSite: 'lax',               // con proxy, Lax es suficiente
    path: '/',
    maxAge: maxAgeMs,
  };
}

export function setAuthCookie(res, jwt) {
  res.cookie(AUTH_COOKIE_NAME, jwt, buildCookieOptions());
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, { ...buildCookieOptions(), maxAge: 0 });
}
