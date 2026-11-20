# Verification Gates

**Iron Law:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

## The Gate

Before claiming anything passes/works/complete:

```
1. IDENTIFY → What command proves this?
2. RUN → Execute command (fresh, complete)
3. READ → Check output, exit code
4. VERIFY → Does output confirm claim?
5. THEN → Make claim WITH evidence
```

Skip any step = lying, not verifying.

## Common Claims

| Claim | Requires | NOT Sufficient |
|-------|----------|----------------|
| Tests pass | `npm test` → 0 failures | "Should pass" |
| Build works | Build → exit 0 | "Linter clean" |
| Bug fixed | Test symptom → passes | "Code changed" |
| Task done | Checklist verified | "Tests pass" |

## Red Flags - STOP

You might be lying if using:

- "should", "probably", "seems to"
- "Great!", "Done!", "Perfect!" (before verify)
- About to commit without verification
- Expressing satisfaction before proof

## Examples

**Good:**
```
[Run: npm test]
[Output: 34/34 pass]
"All tests pass."
```

**Bad:**
```
"Should pass now."
"Looks correct."
"I'm confident it works."
```

## Bottom Line

Run command → Read output → THEN claim result.

No shortcuts. Evidence before claims.
