import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDir = path.join(root, "app");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name === "page.tsx") files.push(full);
  }
  return files;
}

function pascalToKebab(componentName) {
  const base = componentName.replace(/Page$/, "");
  return (
    base
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
      .toLowerCase() + "-page"
  );
}

function getComponentName(content) {
  const match = content.match(
    /export default (?:async )?function ([A-Z][A-Za-z0-9]*)/
  );
  return match?.[1] ?? null;
}

for (const pagePath of walk(appDir)) {
  const content = fs.readFileSync(pagePath, "utf8");
  const dir = path.dirname(pagePath);
  const componentName = getComponentName(content);

  if (!componentName) {
    console.warn("Skip (no named default export):", pagePath);
    continue;
  }

  const fileBase = pascalToKebab(componentName);
  const namedPath = path.join(dir, `${fileBase}.tsx`);

  if (path.basename(namedPath) === "page.tsx") continue;

  const existingNamed = fs.existsSync(namedPath)
    ? fs.readFileSync(namedPath, "utf8")
    : null;

  if (
    existingNamed &&
    content.trim().startsWith(`export { default`) &&
    content.includes(`from "./${fileBase}"`)
  ) {
    console.log("Already split:", pagePath);
    continue;
  }

  fs.writeFileSync(namedPath, content, "utf8");

  const exports = ["default"];
  if (/export const metadata\b/.test(content)) exports.push("metadata");
  if (/export async function generateMetadata\b/.test(content)) {
    exports.push("generateMetadata");
  }

  const reExport = `export { ${exports.join(", ")} } from "./${fileBase}";\n`;
  fs.writeFileSync(pagePath, reExport, "utf8");
  console.log("Split:", path.relative(root, pagePath), "→", `${fileBase}.tsx`);
}
