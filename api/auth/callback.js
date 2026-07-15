// GitHub OAuth callback: verifies state, exchanges the code for a token
// server-side, reads the user's identity, and issues our own signed session
// cookie. The GitHub access token itself is never sent to the browser.
const { parseCookies, setCookie, sign } = require("../_lib/session");

module.exports = async (req, res) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookies = parseCookies(req);

  if (!state || state !== cookies.oauth_state) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Invalid OAuth state. Please try signing in again.");
  }
  if (!code) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Missing authorization code.");
  }

  let tokenJson;
  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    tokenJson = await tokenRes.json();
  } catch (err) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    return res.end("Could not reach GitHub to complete sign-in.");
  }
  if (!tokenJson.access_token) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("GitHub sign-in failed. Please try again.");
  }

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
      "User-Agent": "the-logic-project-wizard",
    },
  });
  const user = await userRes.json();
  if (!user.login) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Could not read your GitHub identity.");
  }

  const session = sign(
    { login: user.login, avatar: user.avatar_url, iat: Date.now() },
    process.env.SESSION_SECRET
  );
  setCookie(res, "session", session, { maxAge: 60 * 60 * 24 * 30 });
  setCookie(res, "oauth_state", "", { maxAge: 0 });

  res.writeHead(302, { Location: "/" });
  res.end();
};
