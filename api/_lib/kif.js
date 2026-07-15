// Assembles a contribution's .kif and .tq text server-side, mirroring the
// same shape the front-end validated in Phase 7, so what gets submitted is
// exactly what was checked.

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

module.exports = { assembleKif, assembleTq };
