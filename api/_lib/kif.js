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

module.exports = { assembleKif, assembleTq, isValidIdentifier };
