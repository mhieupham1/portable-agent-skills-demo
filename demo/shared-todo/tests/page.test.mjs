import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readPage() {
  return readFile(new URL("../index.html", import.meta.url), "utf8");
}

test("the shared todo page exposes task creation, filters, and a live task count", async () => {
  const page = await readPage();

  assert.match(page, /id="new-task-form"/);
  assert.match(page, /id="task-title"/);
  assert.match(page, /data-filter="active"/);
  assert.match(page, /data-filter="done"/);
  assert.match(page, /id="task-list"/);
  assert.match(page, /id="task-count"[^>]*aria-live="polite"/);
  assert.match(page, /Local demo/i);
});
