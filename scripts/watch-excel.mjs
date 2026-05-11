import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const excelPath = path.resolve(process.cwd(), "data/kpi-data.xlsx");

let isRunning = false;
let pending = false;
let debounceTimer = null;

function runConvert() {
  if (isRunning) {
    pending = true;
    return;
  }

  isRunning = true;
  const child = spawn(process.execPath, ["scripts/excel-to-ts.mjs"], {
    stdio: "inherit",
    shell: false,
  });

  child.on("close", () => {
    isRunning = false;
    if (pending) {
      pending = false;
      runConvert();
    }
  });
}

function scheduleConvert() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runConvert, 400);
}

if (!fs.existsSync(excelPath)) {
  console.error(`Missing Excel file: ${excelPath}`);
  process.exit(1);
}

console.log("Watching Excel changes:", excelPath);
runConvert();

fs.watch(path.dirname(excelPath), (_, filename) => {
  if (!filename) return;
  if (filename.toLowerCase() === "kpi-data.xlsx") {
    scheduleConvert();
  }
});

