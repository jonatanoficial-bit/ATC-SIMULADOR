import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const extensions = new Set(['.js', '.mjs', '.py', '.json', '.md', '.txt', '.html', '.css']);
const ignored = new Set(['.git', 'node_modules', 'audit', 'dist']);
const replacements = [
  [/C:\\Users\\jonat\\Desktop\\GAME\\¨2026\\ATC 3 NOVO/gi, '<PROJECT_ROOT>'],
  [/\/c\/Users\/jonat\/Desktop\/GAME\/¨2026\/ATC 3 NOVO/gi, '<PROJECT_ROOT>'],
  [/C:\\Users\\jonat/gi, '<USER_HOME>'],
  [/\/c\/Users\/jonat/gi, '<USER_HOME>']
];
let changed = 0;

const visit = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(absolute);
      continue;
    }
    if (!extensions.has(path.extname(entry.name).toLowerCase())) continue;
    const before = fs.readFileSync(absolute, 'utf8');
    const after = replacements.reduce((text, [pattern, value]) => text.replace(pattern, value), before);
    if (after !== before) {
      fs.writeFileSync(absolute, after);
      changed += 1;
    }
  }
};

visit(ROOT);
console.log(`Sanitized personal paths in ${changed} files.`);
