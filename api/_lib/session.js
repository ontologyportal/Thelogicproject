// Shared cookie + signed-session helpers for the api/ functions.
// No dependencies beyond node:crypto — the session is an HMAC-signed JSON
// blob in an httpOnly cookie, not a database-backed session store.
const crypto = require("crypto");

const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days, matches the cookie's own Max-Age

function sign(payload, secret) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verify(token, secret) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  const a = Buffer.from(sig || "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  // Signature verification alone doesn't expire a session — the cookie's
  // Max-Age is a client-side hint the browser can be made to ignore, so
  // enforce the same lifetime server-side against the embedded issue time.
  if (typeof payload.iat !== "number" || Date.now() - payload.iat > SESSION_MAX_AGE_MS) return null;
  return payload;
}

function parseCookies(req) {
  if (req.cookies) return req.cookies;
  const header = req.headers.cookie || "";
  const out = {};
  header.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    const k = pair.slice(0, idx).trim();
    const v = pair.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function setCookie(res, name, value, opts = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, "Path=/", "HttpOnly", "SameSite=Lax"];
  if (process.env.VERCEL_ENV !== "development") parts.push("Secure");
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${opts.maxAge}`);
  const cookieStr = parts.join("; ");
  const existing = res.getHeader("Set-Cookie");
  if (existing) {
    res.setHeader("Set-Cookie", Array.isArray(existing) ? [...existing, cookieStr] : [existing, cookieStr]);
  } else {
    res.setHeader("Set-Cookie", cookieStr);
  }
}

module.exports = { sign, verify, parseCookies, setCookie };
