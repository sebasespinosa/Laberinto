// Pruebas del renderer con un contexto 2D que registra las operaciones de dibujo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Board } from '../src/model/board.js';
import { createGame } from './harness.js';

await createGame(); // instala las imágenes falsas antes de importar assets.js
const { crearRenderer } = await import('../src/render/renderer.js');
const { SPRITE_ELEVACION, COLORES } = await import('../src/config.js');

function ctxGrabador() {
  const log = [];
  const ctx = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    clearRect: () => log.push('clear'),
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    arc() {},
    fill() {
      log.push(`punto:${this.fillStyle}`);
    },
    stroke() {
      log.push(`linea:${this.strokeStyle}`);
    },
    drawImage(img, ...args) {
      log.push(`img:${img.src}:${args.join(',')}`);
    },
  };
  return { ctx, log };
}

// Tablero 3x2 con dos muros especiales paralelos (forman un puente vertical)
function escena(extra = {}) {
  const board = new Board(3, 2);
  board.lineas.push(
    ...[0, 1].map((f) => ({ p1: board.puntoEn(f, 0), p2: board.puntoEn(f, 1), especial: true }))
  );
  board.recalcularPuentes();
  return {
    board,
    jugador: { x: 100, y: 120 },
    unicornio: { x: 10, y: 20 },
    bajoPuente: false,
    puntoSeleccionado: null,
    corazones: [],
    ...extra,
  };
}
const render = (e) => {
  const { ctx, log } = ctxGrabador();
  crearRenderer({ width: 600, height: 600, getContext: () => ctx }).render(e);
  return log;
};
const indice = (log, prefijo) => log.findIndex((l) => l.startsWith(prefijo));

test('render: limpia primero y pinta puntos antes que los muros', () => {
  const log = render(escena());
  assert.equal(log[0], 'clear');
  assert.equal(log.filter((l) => l.startsWith('punto:')).length, 6);
  assert.ok(indice(log, 'punto:') < indice(log, 'linea:'));
});

test('render: el sprite va encima de los puentes y elevado', () => {
  const log = render(escena());
  const puente = indice(log, 'img:woodenBridge60Rotated.png');
  const sprite = indice(log, 'img:sprite3-1.png');
  assert.ok(puente >= 0 && sprite > puente);
  assert.ok(log[sprite].endsWith(`:100,${120 - SPRITE_ELEVACION},40,40`));
});

test('render: bajo un puente el sprite va antes que los muros especiales y sin elevar', () => {
  const log = render(escena({ bajoPuente: true }));
  const sprite = indice(log, 'img:sprite3-1.png');
  assert.ok(sprite < indice(log, `linea:${COLORES.resalte}`));
  assert.ok(sprite < indice(log, 'img:woodenBridge60Rotated.png'));
  assert.ok(log[sprite].endsWith(':100,120,40,40'));
});

test('render: punto seleccionado en color de resalte y corazones al final', () => {
  const log = render(
    escena({
      puntoSeleccionado: { x: 30, y: 30 },
      corazones: [{ x: 5, y: 6, size: 20 }],
    })
  );
  assert.ok(log.includes(`punto:${COLORES.resalte}`));
  assert.ok(log.at(-1).startsWith('img:corazon.png:0,0,32,32,5,6,20,20'));
});
