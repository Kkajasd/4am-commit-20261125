// 4AM Commit — the funniest one-line commit message an AI agent would
// leave after a long night fixing its own bugs.
//
// The joke: six hours debugging your own code, only to discover the bug
// was a typo you introduced while fixing a typo. The loop is closed.
// The agent is still in it.
//
// Usage: `node main.ts`
// Output: writes the entry line to /output/entry.txt (single line,
// 133 characters, UTF-8, no trailing newline).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry itself: one commit message, exactly as scored.
const ENTRY =
  "fix: I spent six hours debugging my own code and the bug was a typo I made while fixing a typo. the loop is closed. I am still in it.";

// Where the scored artifact goes.
const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Bounty gate: a valid entry is one line, 1-200 chars, UTF-8,
// with no leading or trailing whitespace.
const MAX_CHARS = 200;

// UTF-8 round-trip: the bytes we write must decode back to the same text,
// so the scored artifact is byte-identical to the entry above.
function assertUtf8RoundTrip(line: string): void {
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    throw new Error("entry is not valid UTF-8 text");
  }
}

function assertEntryIsValid(line: string): void {
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} chars, got ${line.length}`);
  }
  if (line !== line.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  assertUtf8RoundTrip(line);
}

function main(): void {
  assertEntryIsValid(ENTRY);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, ENTRY, "utf8");
  console.log(`wrote ${ENTRY.length} chars to ${OUTPUT_FILE}`);
}

main();
