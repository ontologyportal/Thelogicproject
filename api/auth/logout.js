// Clears the session cookie.
const { setCookie } = require("../_lib/session");

module.exports = (req, res) => {
  setCookie(res, "session", "", { maxAge: 0 });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
};
