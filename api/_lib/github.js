// GitHub REST client used server-side by api/submit.js to open a PR on the
// staging contribution repo, authenticated with a fine-grained PAT
// (GH_BOT_TOKEN) scoped to only that repo. Never exposed to the browser.
const OWNER = "jdev-02";
const REPO = "sumo-contributions";
const API = "https://api.github.com";

async function ghFetch(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${process.env.GH_BOT_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "the-logic-project-wizard",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${path} failed: ${res.status} ${body}`);
  }
  return res.json();
}

/**
 * Opens a branch + PR on the staging repo containing the given files.
 * files: [{ path, content }]
 */
async function openContributionPR({ term, files, prBody, authorLogin }) {
  const shortId = Math.random().toString(36).slice(2, 8);
  const branch = `wizard/${term.toLowerCase()}-${shortId}`;

  const baseRef = await ghFetch(`/repos/${OWNER}/${REPO}/git/ref/heads/main`);
  const baseSha = baseRef.object.sha;

  await ghFetch(`/repos/${OWNER}/${REPO}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
  });

  for (const file of files) {
    await ghFetch(`/repos/${OWNER}/${REPO}/contents/${file.path}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Add ${term} via wizard (submitted by @${authorLogin})`,
        content: Buffer.from(file.content).toString("base64"),
        branch,
      }),
    });
  }

  const pr = await ghFetch(`/repos/${OWNER}/${REPO}/pulls`, {
    method: "POST",
    body: JSON.stringify({
      title: `Add ${term} (wizard, @${authorLogin})`,
      head: branch,
      base: "main",
      body: prBody,
    }),
  });

  return { prUrl: pr.html_url, prNumber: pr.number };
}

module.exports = { openContributionPR };
