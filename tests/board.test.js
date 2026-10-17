// Pruebas del modelo (Board, puentes) y de la edición en caliente del juego.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Board } from '../src/model/board.js';
import { detectarPuentes } from '../src/model/bridges.js';

const mapa = (filas) => filas.map((f) => [...f]);

test('Board: crea la rejilla de puntos', () => {
  const b = new Board(3, 4);
  assert.equal(b.puntos.length, 12);
  assert.deepEqual(b.puntoEn(1, 2), { x: 2 * 60 + 30, y: 60 + 30, fila: 1, columna: 2 });
});

test('Board.cargarMapa: muros normales y especiales', () => {
  const b = new Board(2, 2);
  b.cargarMapa(mapa(['.-.', '| |', '.*.']));
  assert.equal(b.lineas.length, 4); // arriba, izquierda, derecha y abajo (especial)
  assert.equal(b.lineas.filter((l) => l.especial).length, 1);
  assert.equal(b.puentes.size, 0);
});

test('Board.agregarLinea: crea un tramo por celda, en cualquier sentido, sin duplicar', () => {
  const b = new Board(3, 4);
  const nuevas = b.agregarLinea(b.puntoEn(1, 3), b.puntoEn(1, 0)); // de derecha a izquierda
  assert.equal(nuevas.length, 3);
  assert.equal(b.lineas.length, 3);
  // Los tramos referencian los puntos del tablero (misma identidad)
  assert.ok(b.lineas.every((l) => b.puntos.includes(l.p1) && b.puntos.includes(l.p2)));
  assert.equal(
    b.agregarLinea(b.puntoEn(1, 0), b.puntoEn(1, 2)).length,
    0,
    'tramos ya existentes no se repiten'
  );
  assert.equal(
    b.agregarLinea(b.puntoEn(0, 1), b.puntoEn(2, 1)).length,
    2,
    'vertical, de arriba abajo'
  );
  assert.equal(b.lineas.length, 5);
});

test('Board.eliminarLinea: quita el tramo y conserva el resto', () => {
  const b = new Board(2, 3);
  b.agregarLinea(b.puntoEn(0, 0), b.puntoEn(0, 2));
  b.eliminarLinea(b.puntoEn(0, 1), b.puntoEn(0, 0)); // sentido inverso
  assert.equal(b.lineas.length, 1);
  assert.equal(b.tieneLinea(b.puntoEn(0, 1), b.puntoEn(0, 2)), true);
  assert.equal(b.tieneLinea(b.puntoEn(0, 0), b.puntoEn(0, 1)), false);
});

test('puentes: dos muros especiales paralelos y contiguos forman un puente; desmarcar uno lo elimina', () => {
  const b = new Board(3, 2);
  const [a] = b.agregarLinea(b.puntoEn(0, 0), b.puntoEn(0, 1));
  const [c] = b.agregarLinea(b.puntoEn(1, 0), b.puntoEn(1, 1));
  assert.equal(b.puentes.size, 0);
  b.alternarEspecial(a);
  assert.equal(b.puentes.size, 0, 'un solo muro especial no basta');
  b.alternarEspecial(c);
  assert.equal(b.puentes.size, 1);
  const [puente] = b.puentes.values();
  assert.equal(puente.orientacion, 'vertical');
  assert.deepEqual([puente.x, puente.y], [30, 30]);
  assert.equal(puente.puntos.length, 4);
  b.alternarEspecial(a);
  assert.equal(b.puentes.size, 0, 'ya no queda un puente "fantasma"');
});

test('puentes: muros verticales contiguos forman un puente horizontal', () => {
  const b = new Board(2, 3);
  const [a] = b.agregarLinea(b.puntoEn(0, 0), b.puntoEn(1, 0));
  const [c] = b.agregarLinea(b.puntoEn(0, 1), b.puntoEn(1, 1));
  a.especial = c.especial = true;
  const puentes = detectarPuentes(b.lineas);
  assert.equal(puentes.size, 1);
  assert.equal([...puentes.values()][0].orientacion, 'horizontal');
});
