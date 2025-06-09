import { calcularPuntosAreaXY } from './utils.js';
import { agregarLinea, dibujarLinea } from './lineManager.js';
import { moverSprite } from './spriteController.js';

let ultimoPuntoSeleccionado = null;
let puntos = [];

export function setPuntos(p) {
  puntos = p;
}

export function manejarClickEnCanvas(x, y) {
  const canvas = document.getElementById('miCanvas');
  const ctx = canvas.getContext('2d');

  const [puntoCercano] = calcularPuntosAreaXY(x, y, puntos);
  if (!puntoCercano) return;

  if (!ultimoPuntoSeleccionado) {
    ultimoPuntoSeleccionado = puntoCercano;
    return;
  }

  dibujarLinea(ctx, ultimoPuntoSeleccionado, puntoCercano);
  agregarLinea(ultimoPuntoSeleccionado, puntoCercano);
  ultimoPuntoSeleccionado = null;
}

export function setupKeyboardControls() {
  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp': moverSprite('up'); break;
      case 'ArrowDown': moverSprite('down'); break;
      case 'ArrowLeft': moverSprite('left'); break;
      case 'ArrowRight': moverSprite('right'); break;
    }
  });
}

export function setupClickHandler() {
  const canvas = document.getElementById('miCanvas');
  canvas.addEventListener('click', (event) => {
    const { offsetX, offsetY } = event;
    manejarClickEnCanvas(offsetX, offsetY);
  });
}