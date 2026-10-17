// Tests de caracterización: congelan el comportamiento actual del juego
// (parseo de mapas, puentes y movimiento) para detectar regresiones al refactorizar.
//   npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { snapshotAll } from './snapshot.js';

const golden = JSON.parse(fs.readFileSync(new URL('./golden.json', import.meta.url), 'utf8'));
const actual = await snapshotAll();

for (const stage of Object.keys(golden)) {
  test(`caracterización: ${stage}`, () => {
    assert.deepEqual(actual[stage], golden[stage]);
  });
}
