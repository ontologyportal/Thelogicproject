// Returns the signed-in user's identity from the session cookie, or 401.
const { parseCookies, verify } = require("../_lib/session");

module.exports = (req, res) => {
  const cookies = parseCookies(req);
  const session = verify(cookies.session, process.env.SESSION_SECRET);
  if (!session) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "not signed in" }));
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ login: session.login, avatar: session.avatar }));
};
