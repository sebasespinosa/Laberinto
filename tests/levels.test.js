// Valida la forma de los datos de levels.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS } from '../src/levels.js';

test('hay 8 niveles con ids y etiquetas únicos', () => {
  assert.equal(LEVELS.length, 8);
  assert.equal(new Set(LEVELS.map((n) => n.id)).size, LEVELS.length);
  assert.equal(new Set(LEVELS.map((n) => n.label)).size, LEVELS.length);
});

for (const nivel of LEVELS) {
  test(`nivel ${nivel.id}: mapa bien formado y celdas dentro del tablero`, () => {
    const alto = nivel.mapa.length;
    const ancho = nivel.mapa[0].length;
    assert.equal(alto % 2, 1, 'el mapa debe tener un número impar de filas');
    assert.ok(
      nivel.mapa.every((f) => f.length === ancho),
      'todas las filas con el mismo ancho'
    );
    assert.match(nivel.mapa.join(''), /^[.\-|* ]+$/, 'solo caracteres válidos');
    // Los puntos están en las posiciones (par, par)
    nivel.mapa.forEach((fila, i) =>
      [...fila].forEach((c, j) => {
        assert.equal(
          c === '.',
          i % 2 === 0 && j % 2 === 0,
          `punto esperado/inesperado en ${i},${j}`
        );
      })
    );
    const celdasFilas = (alto - 1) / 2;
    const celdasColumnas = (ancho - 1) / 2;
    for (const celda of [nivel.inicio, nivel.unicornio]) {
      assert.ok(celda.fila >= 0 && celda.fila < celdasFilas);
      assert.ok(celda.columna >= 0 && celda.columna < celdasColumnas);
    }
    assert.notDeepEqual(nivel.inicio, nivel.unicornio);
  });
}
