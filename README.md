# Portable Agent Skills Demo

A cross-platform Agent Skills demonstration for Claude Code and Codex.

The repository contains one portable `requirements-and-review` Skill, a richer
`code-review-v2` Skill, evaluation fixtures, transcripts, a small Shared Todo
List browser demo, and the Vietnamese article that documents the experiment.

## Start here

- [Vietnamese article](ARTICLE.vi.md)
- [Portable requirements-and-review Skill](agent-skills/requirements-and-review/SKILL.md)
- [Shared Todo List demo](demo/shared-todo/)
- [Cross-platform evaluation results](reports/eval-2026-11-21-shared-todo/RESULTS.md)
- [code-review-v2 evaluation results](reports/code-review-v2-eval-2026-11-21-shared-todo/RESULTS.md)

## What was tested

The same Skill content is installed in the source directory, `.claude/skills/`,
and `.agents/skills/`. Claude Code and Codex received the same fixtures and
prompts for requirement definition and code review.

The recorded Shared Todo List evaluation scored 8/8 on each platform. The
separate `code-review-v2` evaluation scored 6/6 on each platform. These are
small, explicit Skill-invocation smoke evaluations, not a general model
benchmark.

## Run the local demo

```bash
python3 -m http.server 4173 --directory demo/shared-todo
```

Then open <http://127.0.0.1:4173/>.

## Repeat the core evaluation

Authenticated `claude` and `codex` CLIs are required:

```bash
bash tests/run-cross-platform-eval.sh reports/eval-rerun
```
