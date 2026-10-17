// Utilidades para probar el juego en Node, sin navegador ni dependencias:
// instala un `Image`/`requestAnimationFrame` falsos y crea juegos sobre un canvas falso.
import { LEVELS } from '../src/levels.js';

// Nombre histórico de cada nivel (claves de golden.json) -> id en levels.js
export const STAGES = {
  stageZero: 'zero',
  stageOne: 'one',
  stageTwo: 'two',
  stageThree: 'three',
  stageFour: 'four',
  stageFive: 'five',
  stageSix: 'six',
  stageSeven: 'seven',
};

export const nivelPorId = (id) => LEVELS.find((n) => n.id === id);

class FakeImage {
  set src(v) {
    this._src = v;
    queueMicrotask(() => this.onload?.());
  }
  get src() {
    return this._src;
  }
}
let rafId = 0;
// Deben existir antes de importar assets.js / game.js
Object.assign(globalThis, {
  Image: FakeImage,
  requestAnimationFrame: () => ++rafId,
  cancelAnimationFrame: () => {},
});

// Canvas falso. `rect` simula el tamaño con el que se muestra en pantalla
// (por defecto igual al interno, es decir, sin escala).
export function crearCanvasFalso({ rect = { left: 0, top: 0, width: 600, height: 600 } } = {}) {
  const listeners = {};
  const ctx = new Proxy({}, { get: () => () => {}, set: () => true });
  const canvas = {
    width: 600,
    height: 600,
    getContext: () => ctx,
    getBoundingClientRect: () => rect,
    addEventListener: (type, fn) => {
      listeners[type] = fn;
    },
  };
  return { canvas, listeners };
}

// Crea un juego nuevo y aislado (game.js no tiene estado global ni efectos al importarse).
export async function createGame(opciones) {
  const { crearJuego } = await import('../src/game.js');
  const { canvas, listeners } = crearCanvasFalso(opciones);
  return { game: crearJuego(canvas), canvas, listeners };
}
