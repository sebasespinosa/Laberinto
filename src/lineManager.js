import { compararPuntos } from './utils.js';

let lineas = [];

export function agregarLinea(p1, p2) {
  lineas.push({ p1, p2 });
}

export function eliminarLinea(p1, p2) {
  lineas = lineas.filter(linea =>
    !(compararPuntos(linea.p1, p1) && compararPuntos(linea.p2, p2)) &&
    !(compararPuntos(linea.p1, p2) && compararPuntos(linea.p2, p1))
  );
}

export function obtenerLineas() {
  return lineas;
}

export function limpiarLineas() {
  lineas.length = 0;
}

export function existeLinea(p1, p2) {
  return lineas.some(linea =>
    (compararPuntos(linea.p1, p1) && compararPuntos(linea.p2, p2)) ||
    (compararPuntos(linea.p1, p2) && compararPuntos(linea.p2, p1))
  );
}

export function resaltarLinea(ctx, p1, p2, color = '#e74c3c') {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

export function dibujarLinea(ctx, p1, p2, color = '#3498db') {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}