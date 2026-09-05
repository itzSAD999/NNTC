import { execSync } from "node:child_process";

/** Stop ghost dev servers that cause 500s and broken CSS on the wrong port. */
export function killStaleDevServer(port) {
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
        // already exited
      }
    }
  } catch {
    // nothing listening
  }
}
