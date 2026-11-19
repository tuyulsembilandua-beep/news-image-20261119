// news-image-20261119 — entry runner.
//
// The entry is a single pre-rendered image (entry.png): a front page that
// sums up Thursday 19 November 2026 in one picture — four panel stories
// plus a ticker of the day's other news. Rendering happens at build time
// (see README.md), so this runner only has to place the finished image
// where the harness expects it.
//
// Behaviour is deliberately boring: resolve the output directory from
// MAKEFUN_OUTPUT_DIR (falling back to /output), create it, then copy
// entry.png next to this file into <output>/entry.png byte-for-byte.
// A plain file copy is deterministic, so two runs produce identical bytes.
import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = join(here, "entry.png");
const target = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Guard against a truncated copy: the output must be the same size.
const inSize = statSync(source).size;
const outSize = statSync(target).size;
if (inSize !== outSize) {
  throw new Error(`copy mismatch: ${source} is ${inSize} bytes, ${target} is ${outSize}`);
}
console.log(`wrote ${target} (${outSize} bytes)`);
