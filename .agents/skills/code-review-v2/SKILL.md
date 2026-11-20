---
name: code-review-v2
description: Review code for quality, security, and best practices. Lightweight review without complex subagents.
---

# Code Review V2

Simple, focused code review for recently changed files or an explicitly supplied
review scope.

## Core Principles

- **YAGNI, KISS, DRY** — Always honor.
- **Verify before claiming** — Evidence before assertions.
- **No performative agreement** — Technical rigor over social comfort.

## References (read when needed)

| File | When to read |
|------|--------------|
| `references/verification-gates.md` | Before claiming work is done |
| `references/receiving-feedback.md` | When receiving feedback from reviewers |

## When to Use

After completing a task or before merging:

- Check code quality.
- Find security issues.
- Verify best practices.
- Ensure consistency.

## Before Review

### 1. Read available project rules

Read relevant local instructions when they exist:

```text
AGENTS.md
CLAUDE.md
docs/code-standards.md
```

Extract rules to check against:

- File naming conventions.
- File size limits.
- Code-quality guidelines.
- Pre-commit rules.

If none exist, say so in review coverage; do not invent project rules.

### 2. Read plan-specific guidance when available

If the review scope includes an implementation plan, read it and activate any
relevant listed skills. Otherwise, review the supplied code and state that no
plan-specific guidance was available.

## Review Checklist

### 1. Quick Scan

- [ ] Code compiles without errors.
- [ ] No console.log/print statements in production code.
- [ ] No hardcoded secrets or credentials.
- [ ] No TODO comments left unaddressed.

### 2. Code Quality

- [ ] Functions are small and focused (< 50 lines ideal).
- [ ] Variable names are descriptive.
- [ ] No code duplication.
- [ ] Proper error handling with try/catch.

### 3. Type Safety (TypeScript/typed languages)

- [ ] No `any` types unless justified.
- [ ] Proper null/undefined handling.
- [ ] Interface/type definitions for data structures.

### 4. Security

- [ ] Input validation present.
- [ ] Output properly escaped (XSS prevention).
- [ ] No SQL injection vulnerabilities.
- [ ] Authentication/authorization checked.

### 5. Performance

- [ ] No unnecessary re-renders (React).
- [ ] Database queries optimized.
- [ ] No N+1 query problems.
- [ ] Large lists are paginated/virtualized.

## Review Process

### Step 1: Identify review scope

1. Review explicitly supplied files or diff first.
2. If no scope was supplied and Git history is available, inspect recent
   changed files with `git diff --name-only HEAD~1` or `git status --short`.
3. If neither an explicit scope nor a usable Git diff is available, ask the
   user which files or change set to review.

### Step 2: Review each file

For each file:

1. Read the full file.
2. Check it against the checklist.
3. Note issues with severity and evidence.

### Step 3: Categorize findings

| Severity | Description | Action |
|----------|-------------|--------|
| 🔴 Critical | Security issue, data-loss risk | Must fix before merge |
| 🟠 High | Bug, type error, performance issue | Should fix |
| 🟡 Medium | Code smell, maintainability | Recommend fix |
| 🟢 Low | Style, minor optimization | Optional |

## Output Format

```markdown
## Code Review: {task-name}

**Files reviewed:** 3
**Status:** ✅ Approved / ⚠️ Needs Changes / ❌ Blocked

### Findings

#### 🔴 Critical
- None

#### 🟠 High
- `src/auth.ts:45` — Missing input validation
  ```ts
  // Current
  const user = await findUser(req.body.email);

  // Suggested
  const email = validateEmail(req.body.email);
  if (!email) throw new BadRequest('Invalid email');
  const user = await findUser(email);
  ```

#### 🟡 Medium
- `src/utils.ts:12` — Function too long (80 lines), consider splitting.

#### 🟢 Low
- `src/types.ts:5` — Could use more descriptive type name.

### Summary
{Brief overall assessment}

### Review coverage
- Inspected: ...
- Not verified: ...
```

## Tips

- Focus on logic and security, not style; use linters for style preferences.
- Provide code examples for fixes when they clarify the issue.
- Be constructive, not personal.
- Acknowledge good patterns when relevant.
