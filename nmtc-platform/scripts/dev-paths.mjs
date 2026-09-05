import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const WEBPACK_CACHE_DIR = path.join(os.tmpdir(), "nmtc-next-webpack");

export function isOneDrivePath(dir) {
  return /onedrive/i.test(dir);
}

export function removeDirSafe(dir) {
  if (!dir || !fs.existsSync(dir)) return;

  try {
    const stat = fs.lstatSync(dir);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(dir);
      return;
    }
  } catch {
    // fall through to rmSync
  }

  try {
    fs.rmSync(dir, {
      recursive: true,
      force: true,
      maxRetries: 8,
      retryDelay: 300,
    });
  } catch (error) {
    console.warn(`Could not fully remove ${dir}: ${error.message}`);
    console.warn("Run npm run dev:clean after closing other dev servers.");
  }
}

/** Detect broken .next from OneDrive sync or failed junction experiments. */
export function isBrokenNextDir(projectNext) {
  if (!fs.existsSync(projectNext)) return false;

  try {
    if (fs.lstatSync(projectNext).isSymbolicLink()) {
      return true;
    }
  } catch {
    return true;
  }

  try {
    const pkgPath = path.join(projectNext, "package.json");
    if (!fs.existsSync(pkgPath)) return true;
    JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  } catch {
    return true;
  }

  return false;
}

export function sanitizeNextDir(projectNext) {
  if (isBrokenNextDir(projectNext)) {
    console.log("Removing broken .next cache…");
    removeDirSafe(projectNext);
  }
}

/** Remove leftover AppData cache from abandoned junction experiment. */
export function removeLegacyExternalNext() {
  const legacy = path.join(
    process.env.LOCALAPPDATA || os.tmpdir(),
    "nmtc-platform"
  );
  if (fs.existsSync(legacy)) {
    removeDirSafe(legacy);
  }
}
