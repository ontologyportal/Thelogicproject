// Starts GitHub OAuth. Identity only (scope: read:user) — the wizard never
// requests repo access on the user's behalf; contributions are opened by the
// server's own bot token (see api/_lib/github.js), with the signed-in user's
// login recorded in the PR body and commit message.
const crypto = require("crypto");
const { setCookie } = require("../_lib/session");

module.exports = (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  setCookie(res, "oauth_state", state, { maxAge: 600 });

  const clientId = process.env.GITHUB_CLIENT_ID;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const redirectUri = `${proto}://${req.headers.host}/api/auth/callback`;
  const url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&scope=read:user` +
    `&state=${state}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.writeHead(302, { Location: url });
  res.end();
};
