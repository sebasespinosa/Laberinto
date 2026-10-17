// Edición en caliente con el ratón.
//   clic en un punto            -> selecciona el extremo de un muro (dos puntos alineados lo dibujan o lo quitan)
//   clic sobre un muro existente -> lo marca o desmarca como especial (puente)
// Las funciones de búsqueda son puras (no tocan el DOM) para poder probarlas.
import { RADIO_CLIC_PUNTO, UMBRAL_CLIC_LINEA } from '../config.js';

// Convierte un evento del ratón a coordenadas del canvas, teniendo en cuenta que
// el canvas puede mostrarse con un tamaño distinto al de su resolución interna.
export function coordenadasDeCanvas(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height),
  };
}

// Distancia de un punto (px, py) al segmento a-b.
export function distanciaPuntoASegmento(px, py, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const longitudCuadrada = dx * dx + dy * dy;
  const t =
    longitudCuadrada === 0
      ? 0
      : Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / longitudCuadrada));
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
}

// Punto del tablero a menos de `radio` píxeles de (x, y), si lo hay.
export function buscarPunto(board, x, y, radio = RADIO_CLIC_PUNTO) {
  return board.puntos.find((punto) => Math.hypot(punto.x - x, punto.y - y) < radio);
}

// Muro más cercano a (x, y) a menos de `umbral` píxeles, o null.
export function buscarLinea(board, x, y, umbral = UMBRAL_CLIC_LINEA) {
  let mejor = null;
  let mejorDistancia = Infinity;
  for (const linea of board.lineas) {
    const distancia = distanciaPuntoASegmento(x, y, linea.p1, linea.p2);
    if (distancia <= umbral && distancia < mejorDistancia) {
      mejor = linea;
      mejorDistancia = distancia;
    }
  }
  return mejor;
}

export function instalarEditor(canvas, juego) {
  canvas.addEventListener('click', (event) => {
    const { board } = juego.obtenerEstado();
    if (!board) return;
    const { x, y } = coordenadasDeCanvas(canvas, event);

    // Los puntos tienen prioridad sobre los muros (los muros terminan en puntos)
    const punto = buscarPunto(board, x, y);
    if (punto) {
      juego.seleccionarPunto(punto);
      return;
    }
    const linea = buscarLinea(board, x, y);
    if (linea) juego.alternarEspecial(linea);
  });
}
