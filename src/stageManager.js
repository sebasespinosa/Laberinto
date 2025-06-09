import { renderizarStagePorNombre } from './stageRender.js';
import { crearPuntos, redibujarPuntos } from './canvasEngine.js';
import { colocarElementoEnAreaCercana } from './spriteController.js';
import { setPuntosGlobal } from './spriteController.js';
import { setPuntos } from './eventHandlers.js';

let puntos = [], hearts = [], lineas = [], puentes = new Map();

export function inicializarCanvas(stage, spriteX, spriteY, unicornX, unicornY, filas, columnas) {
  const canvas = document.getElementById('miCanvas');
  const ctx = canvas.getContext('2d');

  puentes.clear();
  hearts.length = 0;
  if (puntos.length !== filas * columnas) {
    puntos = crearPuntos(filas, columnas);
    setPuntos(puntos);
    setPuntosGlobal(puntos);
  } else {
    redibujarPuntos(puntos);
  }

  colocarElementoEnAreaCercana(spriteX, spriteY, 'sprite', puntos);
  colocarElementoEnAreaCercana(unicornX, unicornY, 'unicorn', puntos);
  renderizarStagePorNombre(stage, puntos);
}