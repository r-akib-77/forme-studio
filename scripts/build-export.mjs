/**
 * Cross-platform static export build.
 * Sets NEXT_OUTPUT=export so next.config.ts switches to `output: "export"`.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");

const result = spawnSync(process.execPath, [nextBin, "build"], {
  stdio: "inherit",
  cwd: root,
  env: { ...process.env, NEXT_OUTPUT: "export" },
});

process.exit(result.status ?? 1);
