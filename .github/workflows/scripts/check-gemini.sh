#!/usr/bin/env bash
# Pings the public Gemini API directly (different request/response shape
# than the OpenAI-compatible providers, so it isn't covered by
# check-openai-compatible-provider.sh). GenAI-MIL is not checked here at
# all — it's IP-gated to a DoD network policy that no CI runner can reach,
# same reason it doesn't work from the deployed Vercel app either. Verify
# GenAI-MIL locally, from a machine on that network.
set -euo pipefail

api_key="${GEMINI_API_KEY:-}"
if [ -z "$api_key" ]; then
  echo "skip: gemini (GEMINI_API_KEY not set as a repo secret)"
  [ -n "${GITHUB_OUTPUT:-}" ] && echo "result=skipped" >> "$GITHUB_OUTPUT"
  exit 0
fi

url="https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${api_key}"
response=$(curl -s -w '\n%{http_code}' "$url" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Reply with exactly: OK"}]}],"generationConfig":{"maxOutputTokens":2000}}')
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$status" != "200" ]; then
  echo "FAIL: gemini returned HTTP $status"
  echo "$body"
  [ -n "${GITHUB_OUTPUT:-}" ] && echo "result=failed" >> "$GITHUB_OUTPUT"
  exit 1
fi

text=$(echo "$body" | jq -r '.candidates[0].content.parts[0].text // empty')
if [ -z "$text" ]; then
  echo "FAIL: gemini returned 200 but no text — response shape may have changed"
  echo "$body"
  [ -n "${GITHUB_OUTPUT:-}" ] && echo "result=failed" >> "$GITHUB_OUTPUT"
  exit 1
fi

echo "OK: gemini -> ${text}"
[ -n "${GITHUB_OUTPUT:-}" ] && echo "result=ok" >> "$GITHUB_OUTPUT"
