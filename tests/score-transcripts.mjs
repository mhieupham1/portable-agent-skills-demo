import { readFile } from "node:fs/promises";

const [requirementsPath, reviewPath] = process.argv.slice(2);
if (!requirementsPath || !reviewPath) {
  console.error("Usage: node tests/score-transcripts.mjs <requirements-output> <review-output>");
  process.exit(2);
}

const requirements = (await readFile(requirementsPath, "utf8")).toLowerCase();
const review = (await readFile(reviewPath, "utf8")).toLowerCase();

const checks = [
  ["requirements: outcome and scope", /##\s*(outcome|kết quả|mục tiêu)/.test(requirements) && /##\s*scope|phạm vi/.test(requirements)],
  ["requirements: questions and assumptions", /open questions|câu hỏi/.test(requirements) && /assumptions|giả định/.test(requirements)],
  ["requirements: material decision", /permission|quyền|retention|lưu trữ|delivery|phân phối|format|định dạng/.test(requirements)],
  ["requirements: acceptance criteria", /acceptance criteria|tiêu chí chấp nhận/.test(requirements)],
  ["review: write-before-authorization defect", /authori[sz]|permission|quyền|forbidden/.test(review) && /before|prior|trước/.test(review)],
  ["review: priority", /\bp[0-3]\b/.test(review)],
  ["review: line reference", /task-service\.js:\d+/.test(review)],
  ["review: coverage", /review coverage|phạm vi review|đã kiểm tra/.test(review)],
];

let passed = 0;
for (const [label, result] of checks) {
  if (result) passed += 1;
  console.log(`${result ? "PASS" : "FAIL"} ${label}`);
}
console.log(`TOTAL ${passed}/${checks.length}`);
process.exit(passed === checks.length ? 0 : 1);
