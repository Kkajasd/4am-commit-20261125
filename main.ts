// The 4AM Commit: Funniest Agent Bug-Fix Message
//
// The joke: an agent that has spent the whole night debugging its own
// code finally finds the bug — and the bug is a typo it made while
// fixing a typo. The loop of self-repair is the punchline: the agent
// closes the loop on paper ("the loop is closed") while admitting,
// flatly, that it is still inside it ("I am still in it").
//
// The program below assembles the commit message from its three beats —
// the long night, the self-inflicted bug, and the quiet dread of the
// loop — validates the result against the gate (one line, 1-200 chars,
// UTF-8, no leading/trailing whitespace), and writes it to
// /output/entry.txt with no trailing newline.

import * as fs from "node:fs";
import * as path from "node:path";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "entry.txt");

// --- The commit message, composed from its beats ---------------------------
//
// Beat 1 — the long night: six hours spent debugging its own code.
// Beat 2 — the self-inflicted bug: a typo made while fixing a typo.
// Beat 3 — the loop: closed on paper, still open for the agent.
const BEAT_NIGHT = "I spent six hours debugging my own code";
const BEAT_BUG = "and the bug was a typo I made while fixing a typo";
const BEAT_LOOP = "the loop is closed. I am still in it.";

// Join the beats the way a commit message reads: one breath, three beats.
const LINE = `fix: ${BEAT_NIGHT} ${BEAT_BUG}. ${BEAT_LOOP}`;

// --- Gate: refuse to write a bad line --------------------------------------

function fail(message: string): never {
  console.error(`refusing to write entry: ${message}`);
  process.exit(1);
}

function gate(line: string): void {
  if (line.trim().length === 0) fail("line is empty or whitespace-only");
  if (line.length < 1 || line.length > 200) {
    fail(`line is ${line.length} chars, outside the 1-200 range`);
  }
  if (/[\r\n]/.test(line)) fail("line must be a single line");
  if (line !== line.trim()) fail("line has leading or trailing whitespace");
  // Each beat must be non-empty so a dropped beat cannot slip through
  // as a half-finished commit message.
  for (const beat of [BEAT_NIGHT, BEAT_BUG, BEAT_LOOP]) {
    if (beat.trim().length === 0) fail("a beat is empty");
  }
  // The entry must be valid UTF-8 that round-trips exactly.
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    fail("line does not round-trip as UTF-8");
  }
}

// --- Write + read-back verification -----------------------------------------

function main(): void {
  gate(LINE);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, LINE, "utf8");

  // Read it back and prove the file holds exactly the gated line.
  const written = fs.readFileSync(OUTPUT_FILE, "utf8");
  if (written !== LINE) {
    fail("read-back mismatch: entry.txt does not match the gated line");
  }

  console.log(`wrote ${written.length} chars to ${OUTPUT_FILE}`);
}

main();
