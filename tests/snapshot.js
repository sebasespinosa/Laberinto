// Calcula el "snapshot" de comportamiento del juego. Lo usan tanto el
// generador del golden file como el test.
import crypto from 'node:crypto';
import { createGame, STAGES, nivelPorId } from './harness.js';

const DIRS = ['up', 'down', 'left', 'right'];
const MOVES_PER_STAGE = 400;

// PRNG determinista (LCG) para que la secuencia de movimientos sea reproducible.
function lcg(seed) {
  let s = seed >>> 0;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32;
}

async function snapshotStage(stage, seed) {
  const { game } = await createGame();
  game.cargarNivel(nivelPorId(STAGES[stage]));

  const e = game.obtenerEstado();
  const snap = {
    lineas: e.lineas.length,
    especiales: e.lineas.filter((l) => l.especial).length,
    puentes: e.puentes.size,
    filas: e.filas,
    columnas: e.columnas,
    sprite: { fila: e.jugador.fila, columna: e.jugador.columna },
    unicornio: { fila: e.unicornio.fila, columna: e.unicornio.columna },
  };

  const rand = lcg(seed);
  const trace = [];
  for (let i = 0; i < MOVES_PER_STAGE; i++) {
    game.mover(DIRS[Math.floor(rand() * 4)]);
    const s = game.obtenerEstado();
    trace.push(
      [s.jugador.fila, s.jugador.columna, s.jugador.capa === 'bajo', s.animando].join(',')
    );
  }
  snap.traceHash = crypto.createHash('sha256').update(trace.join('|')).digest('hex');
  snap.traceFinal = trace[trace.length - 1];
  snap.traceDistinctCells = new Set(trace.map((t) => t.split(',').slice(0, 2).join(','))).size;
  return snap;
}

export async function snapshotAll() {
  const out = {};
  const stages = Object.keys(STAGES);
  for (let i = 0; i < stages.length; i++) out[stages[i]] = await snapshotStage(stages[i], 1000 + i);
  return out;
}
