// Reglas de movimiento (model/movement.js) sobre tableros pequeños.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Board } from '../src/model/board.js';
import { crearJugador, mover } from '../src/model/movement.js';
import { createGame, nivelPorId } from './harness.js';

function tablero(mapa) {
  const filas = (mapa.length + 1) / 2;
  const columnas = (mapa[0].length + 1) / 2;
  const board = new Board(filas, columnas);
  board.cargarMapa(mapa.map((f) => [...f]));
  return board;
}

// Aplica una lista de movimientos y devuelve el jugador final
const recorrer = (board, jugador, ...dirs) => dirs.reduce((j, d) => mover(board, j, d), jugador);
const celda = (j) => [j.fila, j.columna, j.capa];

// 3 celdas de alto x 3 de ancho. Puente "vertical": dos muros especiales
// horizontales (filas de puntos 1 y 2, columna 1) -> cubierta en la celda (1,1).
const PUENTE_VERTICAL = tablero([
  '.-.-.-.',
  '|     |',
  '. .*. .',
  '|     |',
  '. .*. .',
  '|     |',
  '.-.-.-.',
]);

// Puente "horizontal": dos muros especiales verticales -> cubierta en (1,1).
const PUENTE_HORIZONTAL = tablero([
  '.-.-.-.',
  '|     |',
  '. . . .',
  '| * * |',
  '. . . .',
  '|     |',
  '.-.-.-.',
]);

test('muros normales bloquean y los bordes del tablero también', () => {
  const b = tablero(['.-.-.', '| | |', '. . .', '|   |', '.-.-.']);
  let j = crearJugador(0, 0);
  assert.deepEqual(
    celda(mover(b, j, 'right')),
    [0, 0, 'suelo'],
    'muro vertical entre (0,0) y (0,1)'
  );
  assert.deepEqual(celda(mover(b, j, 'up')), [0, 0, 'suelo'], 'borde superior');
  assert.deepEqual(celda(mover(b, j, 'left')), [0, 0, 'suelo'], 'borde izquierdo');
  j = mover(b, j, 'down');
  assert.deepEqual(celda(j), [1, 0, 'suelo']);
  assert.deepEqual(
    celda(recorrer(b, j, 'right', 'right')),
    [1, 1, 'suelo'],
    'no hay más celdas a la derecha'
  );
});

test('mover devuelve el mismo objeto cuando el movimiento no es posible', () => {
  const j = crearJugador(0, 0);
  assert.equal(mover(PUENTE_VERTICAL, j, 'up'), j);
  assert.equal(mover(PUENTE_VERTICAL, j, 'diagonal'), j);
});

test('por encima de un puente vertical: solo se puede avanzar o retroceder en su eje', () => {
  const j = recorrer(PUENTE_VERTICAL, crearJugador(0, 1), 'down');
  assert.deepEqual(celda(j), [1, 1, 'sobre']);
  assert.equal(mover(PUENTE_VERTICAL, j, 'left'), j);
  assert.equal(mover(PUENTE_VERTICAL, j, 'right'), j);
  assert.deepEqual(celda(mover(PUENTE_VERTICAL, j, 'up')), [0, 1, 'suelo'], 'retroceder');
  assert.deepEqual(
    celda(mover(PUENTE_VERTICAL, j, 'down')),
    [2, 1, 'suelo'],
    'salir por el otro extremo'
  );
  // Y al salir ya se puede girar
  assert.deepEqual(celda(recorrer(PUENTE_VERTICAL, j, 'down', 'left')), [2, 0, 'suelo']);
});

test('por debajo de un puente vertical: solo se puede avanzar en perpendicular', () => {
  const j = recorrer(PUENTE_VERTICAL, crearJugador(1, 0), 'right');
  assert.deepEqual(celda(j), [1, 1, 'bajo']);
  assert.equal(mover(PUENTE_VERTICAL, j, 'up'), j);
  assert.equal(mover(PUENTE_VERTICAL, j, 'down'), j);
  assert.deepEqual(celda(mover(PUENTE_VERTICAL, j, 'right')), [1, 2, 'suelo']);
  assert.deepEqual(celda(mover(PUENTE_VERTICAL, j, 'left')), [1, 0, 'suelo']);
});

test('puente horizontal: por encima en horizontal, por debajo en vertical', () => {
  assert.equal(PUENTE_HORIZONTAL.puentes.size, 1);
  const sobre = recorrer(PUENTE_HORIZONTAL, crearJugador(1, 0), 'right');
  assert.deepEqual(celda(sobre), [1, 1, 'sobre']);
  assert.equal(mover(PUENTE_HORIZONTAL, sobre, 'up'), sobre);
  assert.deepEqual(celda(mover(PUENTE_HORIZONTAL, sobre, 'right')), [1, 2, 'suelo']);

  const bajo = recorrer(PUENTE_HORIZONTAL, crearJugador(0, 1), 'down');
  assert.deepEqual(celda(bajo), [1, 1, 'bajo']);
  assert.equal(mover(PUENTE_HORIZONTAL, bajo, 'left'), bajo);
  assert.deepEqual(celda(mover(PUENTE_HORIZONTAL, bajo, 'down')), [2, 1, 'suelo']);
});

test('un muro especial suelto (sin pareja) se cruza sin dejar al jugador bloqueado', () => {
  // Regresión: antes, si el nivel no tenía ningún puente, cruzar un muro
  // especial dejaba bloqueados para siempre los movimientos perpendiculares.
  const b = tablero(['.-.-.-.', '|  *  |', '. . . .', '|     |', '.-.-.-.']);
  assert.equal(b.puentes.size, 0);
  const j = recorrer(b, crearJugador(0, 0), 'right');
  assert.deepEqual(celda(j), [0, 1, 'suelo']);
  assert.deepEqual(celda(mover(b, j, 'down')), [1, 1, 'suelo']);
});

test('puentes encadenados: se pasa de una cubierta a otra por encima', () => {
  // Tres muros especiales apilados en la misma columna: cubiertas en (1,1) y (2,1)
  const b = tablero([
    '.-.-.-.',
    '|     |',
    '. .*. .',
    '|     |',
    '. .*. .',
    '|     |',
    '. .*. .',
    '|     |',
    '.-.-.-.',
  ]);
  assert.equal(b.puentes.size, 2);
  const j = recorrer(b, crearJugador(0, 1), 'down', 'down');
  assert.deepEqual(celda(j), [2, 1, 'sobre']);
  assert.equal(mover(b, j, 'left'), j);
  assert.deepEqual(celda(recorrer(b, j, 'down')), [3, 1, 'suelo']);
});

test('juego: al cargar otro nivel el jugador vuelve a empezar libre (sin restos de un puente)', async () => {
  const { game } = await createGame();
  const nivel = {
    ...nivelPorId('zero'),
    mapa: [
      '.-.-.-.-.-.-.-.',
      '|             |',
      '. . .*. . . . .',
      '|             |',
      '. . .*. . . . .',
      '|             |',
      '. . . . . . . .',
      '|             |',
      '. . . . . . . .',
      '|             |',
      '. . . . . . . .',
      '|             |',
      '. . . . . . . .',
      '|             |',
      '.-.-.-.-.-.-.-.',
    ],
    inicio: { fila: 0, columna: 2 },
  };
  game.cargarNivel(nivel);
  game.mover('down');
  assert.equal(game.obtenerEstado().jugador.capa, 'sobre');
  game.cargarNivel(nivelPorId('zero'));
  const { jugador } = game.obtenerEstado();
  assert.deepEqual([jugador.fila, jugador.columna, jugador.capa], [0, 0, 'suelo']);
  game.mover('right');
  game.mover('down');
  assert.deepEqual(
    [game.obtenerEstado().jugador.fila, game.obtenerEstado().jugador.columna],
    [1, 1]
  );
});
