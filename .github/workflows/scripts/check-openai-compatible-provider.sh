#!/usr/bin/env bash
# Pings one OpenAI-compatible chat/completions provider with a trivial
# prompt and confirms the pinned model ID still resolves and the key still
# works. Shared by every provider in api/_lib/llm.js's fallback chain
# except GenAI-MIL (IP-gated, unreachable from CI — checked locally only)
# and Gemini (different request/response shape, checked separately in the
# workflow).
#
# Usage: check-openai-compatible-provider.sh <name> <url> <model> <api-key-env-var-name>
set -euo pipefail

name="$1"
url="$2"
model="$3"
key_var="$4"
api_key="${!key_var:-}"

if [ -z "$api_key" ]; then
  echo "skip: $name ($key_var not set as a repo secret)"
  [ -n "${GITHUB_OUTPUT:-}" ] && echo "result=skipped" >> "$GITHUB_OUTPUT"
  exit 0
fi

response=$(curl -s -w '\n%{http_code}' "$url" \
  -H "Authorization: Bearer $api_key" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"$model\",\"max_tokens\":20,\"messages\":[{\"role\":\"user\",\"content\":\"Reply with exactly: OK\"}]}")
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$status" != "200" ]; then
  echo "FAIL: $name ($model) returned HTTP $status"
  echo "$body"
  [ -n "${GITHUB_OUTPUT:-}" ] && echo "result=failed" >> "$GITHUB_OUTPUT"
  exit 1
fi

content=$(echo "$body" | jq -r '.choices[0].message.content // empty')
if [ -z "$content" ]; then
  echo "FAIL: $name ($model) returned 200 but no message content — response shape may have changed"
  echo "$body"
  [ -n "${GITHUB_OUTPUT:-}" ] && echo "result=failed" >> "$GITHUB_OUTPUT"
  exit 1
fi

echo "OK: $name ($model) -> ${content}"
[ -n "${GITHUB_OUTPUT:-}" ] && echo "result=ok" >> "$GITHUB_OUTPUT"
