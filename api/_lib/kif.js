// Assembles a contribution's .kif and .tq text server-side, mirroring the
// same shape the front-end validated in Phase 7, so what gets submitted is
// exactly what was checked.

// SUMO term identifiers: alphanumeric, no spaces/parens/slashes. term and
// parent are used both unquoted inside raw KIF forms (e.g. `(subclass
// ${term} ${parent})`) and as GitHub file-path segments
// (`contributions/${term}/...`) — an unvalidated value here is both a KIF
// injection vector (a term like `Foo) (documentation Evil ...` breaks out of
// the intended form) and a path-traversal vector (a term containing `/` or
// `..` can target files outside contributions/). Reject anything that isn't
// a clean identifier before it reaches either use.
const IDENTIFIER_RE = /^[A-Za-z][A-Za-z0-9_]{0,79}$/;

function isValidIdentifier(s) {
  return typeof s === "string" && IDENTIFIER_RE.test(s);
}

function escapeKifString(s) {
  return String(s || "").replace(/"/g, "'");
}

// formulas are written raw (unquoted, unescaped) into the assembled .kif,
// unlike docString/everydayName. The front-end only ever sends formulas that
// passed Phase 7, but /api/submit is a public endpoint and nothing stops a
// client from posting to it directly with hand-crafted formulas, so this is
// the server-side backstop: each formula must be exactly one balanced
// top-level form, or a formula like "(foo) (subclass Evil BadParent)" could
// inject a second, unrelated top-level assertion into the file.
function isSingleBalancedForm(s) {
  if (typeof s !== "string") return false;
  const t = s.trim();
  if (!t.startsWith("(") || !t.endsWith(")")) return false;
  let depth = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i] === "(") depth++;
    else if (t[i] === ")") {
      depth--;
      if (depth < 0) return false;
      if (depth === 0 && i !== t.length - 1) return false;
    }
  }
  return depth === 0;
}

function assembleKif({ term, parent, everydayName, docString, formulas = [] }) {
  const lines = [
    ";; ============================================================",
    `;; ${term} (wizard contribution)`,
    ";; ============================================================",
    `(subclass ${term} ${parent})`,
    `(termFormat EnglishLanguage ${term} "${escapeKifString(everydayName)}")`,
    `(documentation ${term} EnglishLanguage "${escapeKifString(docString)}")`,
    "",
    ...formulas,
  ];
  return lines.join("\n") + "\n";
}

function assembleTq(scenario) {
  const lines = [];
  if (scenario.note) lines.push(`(note "${escapeKifString(scenario.note)}")`);
  lines.push("(time 60)");
  for (const a of scenario.axioms || []) lines.push(a);
  for (const f of scenario.facts || []) lines.push(f);
  lines.push(`(query ${scenario.query})`);
  lines.push(`(answer ${scenario.answer || "yes"})`);
  return lines.join("\n") + "\n";
}

module.exports = { assembleKif, assembleTq, isValidIdentifier, isSingleBalancedForm };
