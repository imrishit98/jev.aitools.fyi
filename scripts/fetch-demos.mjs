/**
 * @deprecated Use sync-showcase-demo-media.mjs; showcase videos are never committed.
 * Kept as an alias for `pnpm fetch:demos`.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sync = path.join(__dirname, "sync-showcase-demo-media.mjs");

const child = spawn(process.execPath, [sync, ...process.argv.slice(2)], {
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));
