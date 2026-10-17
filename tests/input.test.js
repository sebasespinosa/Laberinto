// Teclado, edición con el ratón y menú de niveles.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, nivelPorId } from './harness.js';
import { LEVELS } from '../src/levels.js';
import { Board } from '../src/model/board.js';
import { instalarTeclado } from '../src/input/keyboard.js';
import {
  instalarEditor,
  coordenadasDeCanvas,
  distanciaPuntoASegmento,
  buscarPunto,
  buscarLinea,
} from '../src/input/editor.js';
import { crearMenuNiveles } from '../src/ui/levelMenu.js';

test('teclado: las flechas llaman preventDefault y mueven; otras teclas se ignoran', () => {
  let keydown;
  const destino = {
    addEventListener: (tipo, fn) => {
      if (tipo === 'keydown') keydown = fn;
    },
  };
  const movimientos = [];
  instalarTeclado((d) => movimientos.push(d), destino);

  const pulsar = (key) => {
    let prevenido = false;
    keydown({
      key,
      preventDefault: () => {
        prevenido = true;
      },
    });
    return prevenido;
  };
  assert.equal(pulsar('ArrowUp'), true);
  assert.equal(pulsar('ArrowRight'), true);
  assert.equal(pulsar('a'), false);
  assert.deepEqual(movimientos, ['up', 'right']);
});

test('coordenadasDeCanvas: corrige la escala cuando el canvas se muestra más pequeño', () => {
  const canvas = {
    width: 600,
    height: 600,
    getBoundingClientRect: () => ({ left: 100, top: 50, width: 300, height: 300 }),
  };
  assert.deepEqual(coordenadasDeCanvas(canvas, { clientX: 100 + 45, clientY: 50 + 45 }), {
    x: 90,
    y: 90,
  });
});

test('distanciaPuntoASegmento: dentro del tramo y más allá de los extremos', () => {
  const a = { x: 0, y: 0 };
  const b = { x: 60, y: 0 };
  assert.equal(distanciaPuntoASegmento(30, 5, a, b), 5);
  assert.equal(
    distanciaPuntoASegmento(-3, 4, a, b),
    5,
    'más allá del extremo: distancia al extremo'
  );
  assert.equal(distanciaPuntoASegmento(3, 4, a, a), 5, 'segmento de longitud cero');
});

test('buscarPunto / buscarLinea: radios y umbrales', () => {
  const b = new Board(2, 2);
  const [muro] = b.agregarLinea(b.puntoEn(0, 0), b.puntoEn(0, 1)); // de (30,30) a (90,30)
  assert.equal(buscarPunto(b, 35, 33), b.puntoEn(0, 0));
  assert.equal(buscarPunto(b, 60, 60), undefined);
  assert.equal(buscarLinea(b, 60, 30), muro, 'centro del muro');
  assert.equal(buscarLinea(b, 45, 36), muro, 'a lo largo del muro, no solo en su centro');
  assert.equal(buscarLinea(b, 60, 45), null, 'demasiado lejos');
});

test('edición en caliente: clics en puntos añaden/quitan un muro; clic sobre un muro lo marca como puente', async () => {
  const { game, canvas, listeners } = await createGame();
  instalarEditor(canvas, game);
  game.cargarNivel(nivelPorId('zero'));
  const clic = (x, y) => listeners.click({ clientX: x, clientY: y });
  const n = () => game.obtenerEstado().lineas.length;
  const base = n();

  // Muro entre (90,90) y (150,90)
  clic(90, 90);
  clic(150, 90);
  assert.equal(n(), base + 1);
  // Segundo muro paralelo, una fila más abajo
  clic(90, 150);
  clic(150, 150);
  assert.equal(n(), base + 2);

  // Marcarlos como especiales (clic sobre ellos, no solo en su centro) forma un puente
  clic(120, 90);
  assert.equal(game.obtenerEstado().puentes.size, 0);
  clic(105, 152);
  assert.equal(game.obtenerEstado().puentes.size, 1);
  // Desmarcar uno deshace el puente
  clic(120, 90);
  assert.equal(game.obtenerEstado().puentes.size, 0);

  // Repetir los clics sobre un muro existente lo elimina
  clic(90, 90);
  clic(150, 90);
  assert.equal(n(), base + 1);
});

test('edición en caliente: funciona con el canvas escalado por CSS', async () => {
  const { game, canvas, listeners } = await createGame({
    rect: { left: 10, top: 20, width: 300, height: 300 },
  });
  instalarEditor(canvas, game);
  game.cargarNivel(nivelPorId('zero'));
  const base = game.obtenerEstado().lineas.length;
  // El canvas se ve a la mitad: el punto (90,90) está en pantalla en (10+45, 20+45)
  listeners.click({ clientX: 55, clientY: 65 });
  listeners.click({ clientX: 85, clientY: 65 }); // (150,90)
  assert.equal(game.obtenerEstado().lineas.length, base + 1);
});

test('editor: un clic antes de cargar un nivel no hace nada', async () => {
  const { game, canvas, listeners } = await createGame();
  instalarEditor(canvas, game);
  assert.doesNotThrow(() => listeners.click({ clientX: 90, clientY: 90 }));
});

test('menú de niveles: un botón por nivel que carga ese nivel', () => {
  const creados = [];
  globalThis.document = {
    createElement: () => {
      const boton = {
        listeners: {},
        addEventListener(t, fn) {
          this.listeners[t] = fn;
        },
      };
      creados.push(boton);
      return boton;
    },
  };
  const contenedor = {
    hijos: [],
    appendChild(h) {
      this.hijos.push(h);
    },
  };
  const elegidos = [];
  crearMenuNiveles(contenedor, LEVELS, (n) => elegidos.push(n.id));
  delete globalThis.document;

  assert.equal(contenedor.hijos.length, LEVELS.length);
  assert.deepEqual(
    contenedor.hijos.map((b) => b.textContent),
    LEVELS.map((n) => n.label)
  );
  contenedor.hijos[1].listeners.click();
  assert.deepEqual(elegidos, [LEVELS[1].id]);
});

test('juego: cargar un nivel no deja restos de la selección de punto anterior', async () => {
  const { game, canvas, listeners } = await createGame();
  instalarEditor(canvas, game);
  game.cargarNivel(nivelPorId('zero'));
  listeners.click({ clientX: 90, clientY: 90 }); // primer punto seleccionado
  game.cargarNivel(nivelPorId('zero'));
  const base = game.obtenerEstado().lineas.length;
  listeners.click({ clientX: 150, clientY: 90 }); // si quedara selección, esto dibujaría un muro
  assert.equal(game.obtenerEstado().lineas.length, base);
});
