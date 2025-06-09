import { crearClavePuntos } from './utils.js';

const puentes = new Map();

export function registrarPuente(puntos, orientacion) {
  const clave = crearClavePuntos(puntos);
  const identificador = `${clave}|${orientacion}`;

  if (!puentes.has(identificador)) {
    puentes.set(identificador, {
      ubicacion: clave,
      orientacion: orientacion
    });
  }
  return identificador;
}

export function obtenerPuentes() {
  return puentes;
}

export function limpiarPuentes() {
  puentes.clear();
}

export function dibujarPuente(ctx, puntos, orientacion, imagen) {
  const x = Math.min(...puntos.map(p => p.x));
  const y = Math.min(...puntos.map(p => p.y));
  ctx.drawImage(imagen, x, y, 60, 60);
}