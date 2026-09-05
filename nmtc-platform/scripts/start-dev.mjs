import { spawn } from "node:child_process";
import path from "node:path";

import { killStaleDevServer } from "./kill-dev-ports.mjs";
import {
  WEBPACK_CACHE_DIR,
  isOneDrivePath,
  isBrokenNextDir,
  removeDirSafe,
  removeLegacyExternalNext,
  sanitizeNextDir,
} from "./dev-paths.mjs";

const clean = process.argv.includes("--clean");
const projectRoot = process.cwd();
const projectNext = path.join(projectRoot, ".next");
const onOneDrive = isOneDrivePath(projectRoot);

for (const port of [3000, 3001]) {
  killStaleDevServer(port);
}

removeLegacyExternalNext();

if (clean) {
  removeDirSafe(projectNext);
  removeDirSafe(WEBPACK_CACHE_DIR);
  console.log("Cleared .next and webpack caches");
} else {
  sanitizeNextDir(projectNext);
  if (isBrokenNextDir(projectNext)) {
    removeDirSafe(WEBPACK_CACHE_DIR);
  }
}

if (onOneDrive) {
  console.log(
    "OneDrive detected — using in-memory webpack cache to protect CSS/JS chunks."
  );
  console.log(
    "Tip: exclude nmtc-platform\\.next from OneDrive sync for best results."
  );
}

console.log("Open http://localhost:3000 after Ready");
console.log("If styles look wrong: Ctrl+Shift+R, then npm run dev:clean");

const child = spawn("npx --no-install next dev", {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NMTC_ONEDRIVE: onOneDrive ? "1" : "",
  },
});

child.on("exit", (code) => process.exit(code ?? 0));
