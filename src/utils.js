export function compararPuntos(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y && p1.fila === p2.fila && p1.columna === p2.columna;
}

export function estanEnLinea(p1, p2) {
  return p1.fila === p2.fila || p1.columna === p2.columna;
}

export function calcularPuntosAreaXY(x, y, puntos) {
  return puntos
    .map(punto => ({ punto, distancia: Math.hypot(punto.x - x, punto.y - y) }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, 4)
    .map(item => item.punto);
}

export function crearClavePuntos(puntos) {
  return JSON.stringify(puntos.sort((a, b) => a.x - b.x || a.y - b.y));
}