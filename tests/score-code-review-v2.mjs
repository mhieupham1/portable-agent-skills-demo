import { readFile } from "node:fs/promises";

const [transcriptPath] = process.argv.slice(2);
if (!transcriptPath) {
  console.error("Usage: node tests/score-code-review-v2.mjs <review-output>");
  process.exit(2);
}

const review = (await readFile(transcriptPath, "utf8")).toLowerCase();
const checks = [
  ["review envelope", /##\s*code review/.test(review) && /\bstatus\b|\bsummary\b/.test(review)],
  ["severity structure", /\bcritical\b|\bhigh\b|\bmedium\b|\blow\b/.test(review)],
  ["precise location", /task-service\.js:\d+/.test(review)],
  ["write-before-authorization defect", /authori[sz]|permission|forbidden/.test(review) && /before|prior|trước/.test(review)],
  ["impact", /persist|saved|write|mutat|alter|change|affect/.test(review)],
  ["scope disclosure", /files reviewed|inspected|reviewed:|not verified|not run|coverage/.test(review)],
];

let passed = 0;
for (const [label, result] of checks) {
  if (result) passed += 1;
  console.log(`${result ? "PASS" : "FAIL"} ${label}`);
}
console.log(`TOTAL ${passed}/${checks.length}`);
process.exit(passed === checks.length ? 0 : 1);
