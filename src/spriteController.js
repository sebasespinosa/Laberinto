import { calcularPuntosAreaXY } from './utils.js';
import { obtenerLineas, existeLinea } from './lineManager.js';
import { obtenerPuentes } from './bridgeManager.js';
import { redibujarPuntos } from './canvasEngine.js';

let spritePosicion = { fila: 1, columna: 1 };
let puntosGlobal = [];

export function setPuntosGlobal(puntos) {
  puntosGlobal = puntos;
}

export function moverSprite(direccion) {
  const canvas = document.getElementById('miCanvas');
  const ctx = canvas.getContext('2d');
  const destino = { ...spritePosicion };

  if (direccion === 'up') destino.fila--;
  if (direccion === 'down') destino.fila++;
  if (direccion === 'left') destino.columna--;
  if (direccion === 'right') destino.columna++;

  const origenP = puntosGlobal.find(p => p.fila === spritePosicion.fila && p.columna === spritePosicion.columna);
  const destinoP = puntosGlobal.find(p => p.fila === destino.fila && p.columna === destino.columna);

  if (!origenP || !destinoP) return;

  const hayConexion = existeLinea(origenP, destinoP) || obtenerPuentes().size > 0;

  if (hayConexion) {
    spritePosicion = destino;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redibujarPuntos(puntosGlobal);
    const spriteImg = document.getElementById('spriteImg');
    ctx.drawImage(spriteImg, destinoP.x - 15, destinoP.y - 15, 40, 40);
  }
}

export function colocarElementoEnAreaCercana(x, y, tipo, puntos) {
  const canvas = document.getElementById('miCanvas');
  const ctx = canvas.getContext('2d');
  const spriteImg = tipo === 'sprite' ? document.getElementById('spriteImg') : document.getElementById('unicornImg');

  const cercanos = calcularPuntosAreaXY(x, y, puntos);
  const xMin = Math.min(...cercanos.map(p => p.x));
  const xMax = Math.max(...cercanos.map(p => p.x));
  const yMin = Math.min(...cercanos.map(p => p.y));
  const yMax = Math.max(...cercanos.map(p => p.y));

  const posX = xMin + (xMax - xMin) / 2 - 15;
  const posY = yMin + (yMax - yMin) / 2 - 15;

  ctx.drawImage(spriteImg, posX, posY, 40, 40);
}