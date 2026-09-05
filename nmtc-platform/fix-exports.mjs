import fs from 'fs';
import path from 'path';

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      const regex = /export\s+{\s*default(?:,\s*([^}]+))?\s*}\s*from\s*(['"][^'"]+['"]);/g;
      let changed = false;
      content = content.replace(regex, (match, extras, source) => {
        changed = true;
        let extrasStr = extras ? extras.trim() : '';
        let extraImports = extrasStr ? `, { ${extrasStr} }` : '';
        let extraExports = extrasStr ? `\nexport { ${extrasStr} };` : '';
        
        let sourceName = source.replace(/['"]/g, '').split('/').pop().replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/^./, (g) => g.toUpperCase());
        sourceName = sourceName.replace(/[^a-zA-Z0-9]/g, '');
        
        return `import ${sourceName}${extraImports} from ${source};\n\nexport default ${sourceName};${extraExports}`;
      });
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}
processDir('./app');
