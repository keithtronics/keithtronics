// Packs app/index.html into the Scriptable script: node app/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, 'index.html'), 'utf8')
  // the page is inlined, so the manifest and icon links have nothing to point at
  .replace(/^\s*<link rel="(manifest|apple-touch-icon|icon)"[^>]*>\n/gm, '');
const template = readFileSync(join(here, 'scriptable', 'Bureau.template.js'), 'utf8');
// function replacer: a string replacement would expand `$&` and `$1` sequences inside the page's own code
const json = JSON.stringify(html).replace(/<\/script/gi, '<\\/script');
const out = template.replace('__HTML_JSON__', () => json);
writeFileSync(join(here, 'Bureau.js'), out);
console.log('wrote app/Bureau.js', out.length, 'bytes');
