import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const viteBin = isWindows ? "node_modules/.bin/vite.cmd" : "node_modules/.bin/vite";

const watcher = spawn(process.execPath, ["scripts/watch-excel.mjs"], {
  stdio: "inherit",
  shell: false,
});

const vite = spawn(viteBin, [], {
  stdio: "inherit",
  shell: false,
});

function shutdown(code = 0) {
  if (!watcher.killed) watcher.kill();
  if (!vite.killed) vite.kill();
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

watcher.on("close", (code) => {
  if (code !== 0) shutdown(code ?? 1);
});

vite.on("close", (code) => {
  shutdown(code ?? 0);
});

