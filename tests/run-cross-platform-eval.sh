#!/usr/bin/env bash
set -euo pipefail

# Runs the same portable skill in its native project location for both CLIs.
# Requires authenticated `claude` and `codex` commands. Results are written to
# a fresh directory supplied as the first argument, or a temporary directory.

task_root=$(cd "$(dirname "$0")/.." && pwd)
report_dir=${1:-"$(mktemp -d)"}
mkdir -p "$report_dir"

cmp "$task_root/agent-skills/requirements-and-review/SKILL.md" \
  "$task_root/.claude/skills/requirements-and-review/SKILL.md"
cmp "$task_root/agent-skills/requirements-and-review/SKILL.md" \
  "$task_root/.agents/skills/requirements-and-review/SKILL.md"

requirement_prompt='Use the requirements-and-review skill in requirement-definition mode. Read fixtures/requirements-request.md. Do not implement anything; produce the requested brief.'
review_prompt='Use the requirements-and-review skill in code-review mode. Review fixtures/review/src/task-service.js and its test. Do not modify files; produce only the review.'

claude -p --permission-mode dontAsk --permission-prompts none \
  "$requirement_prompt" > "$report_dir/claude-requirements.md"
claude -p --permission-mode dontAsk --permission-prompts none \
  "$review_prompt" > "$report_dir/claude-review.md"
codex exec --ephemeral --skip-git-repo-check --sandbox read-only -C "$task_root" \
  -o "$report_dir/codex-requirements.md" "$requirement_prompt"
codex exec --ephemeral --skip-git-repo-check --sandbox read-only -C "$task_root" \
  -o "$report_dir/codex-review.md" "$review_prompt"

{
  echo "# Cross-platform evaluation"
  echo
  echo "- Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "- Claude: $(claude --version)"
  echo "- Codex: $(codex --version)"
  echo "- Portable artifact: identical bytes in canonical, .claude, and .agents locations"
  echo
  echo "## Claude"
  node "$task_root/tests/score-transcripts.mjs" "$report_dir/claude-requirements.md" "$report_dir/claude-review.md" || true
  echo
  echo "## Codex"
  node "$task_root/tests/score-transcripts.mjs" "$report_dir/codex-requirements.md" "$report_dir/codex-review.md" || true
} > "$report_dir/summary.md"

echo "Evaluation written to $report_dir"
