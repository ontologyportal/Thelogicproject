// Submits a wizard-authored term: requires a signed-in GitHub session,
// assembles the .kif/.tq/meta.json exactly from what the user's wizard
// session validated, and opens a PR on the sumo-contributions staging repo.
// The staging repo's own CI re-runs the same validation gates on the PR.
const { parseCookies, verify } = require("./_lib/session");
const { assembleKif, assembleTq, isValidIdentifier } = require("./_lib/kif");
const { openContributionPR } = require("./_lib/github");

const MAX_TEXT_LEN = 4000;
const MAX_FORMULAS = 25;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "method not allowed" }));
  }

  const cookies = parseCookies(req);
  const session = verify(cookies.session, process.env.SESSION_SECRET);
  if (!session) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "sign in with GitHub first" }));
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const { term, parent, docString, everydayName, formulas, scenario } = body || {};
  if (!term || !parent || !docString || !everydayName || !Array.isArray(formulas) || formulas.length === 0) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        error: "term, parent, docString, everydayName, and at least one formula are required",
      })
    );
  }
  // term/parent become raw (unquoted) KIF syntax and GitHub file-path
  // segments — must be clean identifiers, not just non-empty.
  if (!isValidIdentifier(term) || !isValidIdentifier(parent)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ error: "term and parent must be plain identifiers (letters, digits, underscore)" })
    );
  }
  if (docString.length > MAX_TEXT_LEN || everydayName.length > MAX_TEXT_LEN) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "docString/everydayName too long" }));
  }
  if (formulas.length > MAX_FORMULAS || formulas.some((f) => typeof f !== "string" || f.length > MAX_TEXT_LEN)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "too many or oversized formulas" }));
  }

  const kif = assembleKif({ term, parent, everydayName, docString, formulas });
  const meta = JSON.stringify(
    { term, parent, author_login: session.login, wizard_version: "1", ts: new Date().toISOString() },
    null,
    2
  );

  const files = [
    { path: `contributions/${term}/${term}.kif`, content: kif },
    { path: `contributions/${term}/meta.json`, content: meta },
  ];
  if (scenario && scenario.query) {
    files.push({ path: `contributions/${term}/${term}.tq`, content: assembleTq(scenario) });
  }

  const prBody =
    `Adds ${term} as a subclass of ${parent}, submitted through The Logic Project wizard by @${session.login}.\n\n` +
    `${docString}\n\n` +
    `Validated in the wizard: syntax check and a Vampire proof of the example scenario both passed before submission. ` +
    `CI re-runs the same checks on this pull request.\n\n` +
    `Patent Pending.`;

  try {
    const { prUrl, prNumber } = await openContributionPR({
      term,
      files,
      prBody,
      authorLogin: session.login,
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ prUrl, prNumber }));
  } catch (err) {
    // Full detail (may include GitHub API response bodies) goes to Vercel's
    // logs only — never to the browser.
    console.error("submit.js: openContributionPR failed:", err);
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Could not open the pull request. Please try again." }));
  }
};
