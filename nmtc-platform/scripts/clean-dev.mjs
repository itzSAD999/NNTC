import { execSync, spawn } from "node:child_process";
import { rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const WEBPACK_CACHE = path.join(os.tmpdir(), "nmtc-next-webpack");

function killStaleDevServer(port = 3000) {
  if (process.platform !== "win32") return;

  try {
    const out = execSync(`netstat -ano | findstr ":${port}"`, {
      encoding: "utf8",
    });
    const pids = new Set();

    for (const line of out.split("\n")) {
      if (!line.includes("LISTENING")) continue;
      const pid = line.trim().split(/\s+/).at(-1);
      if (pid && pid !== "0") pids.add(pid);
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Stopped stale dev server on port ${port} (PID ${pid})`);
      } catch {
        // ignore if already exited
      }
    }
  } catch {
    // nothing listening on that port
  }
}

killStaleDevServer(3000);
killStaleDevServer(3001);

try {
  rmSync(".next", { recursive: true, force: true });
  console.log("Removed .next cache");
} catch {
  // ignore if missing
}

try {
  rmSync(WEBPACK_CACHE, { recursive: true, force: true });
  console.log("Removed webpack cache (faster deserialization on next compile)");
} catch {
  // ignore if missing
}

const child = spawn("npx next dev", {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
