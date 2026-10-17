// Regenera tests/golden.json a partir del código ACTUAL.
// Ejecutar solo cuando un cambio de comportamiento sea intencional:
//   node tests/generate-golden.js
import fs from 'node:fs';
import { snapshotAll } from './snapshot.js';

const file = new URL('./golden.json', import.meta.url);
fs.writeFileSync(file, JSON.stringify(await snapshotAll(), null, 2) + '\n');
console.log('Golden file escrito en', file.pathname);
