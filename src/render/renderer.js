// Única capa que dibuja en el canvas. `render(escena)` pinta el estado completo
// con un orden de capas fijo:
//   puntos → muros → punto seleccionado → [personajes / muros especiales y puentes] → corazones
//
// escena = {
//   board,              Board con puntos, muros y puentes
//   jugador,            { x, y }  posición en píxeles del sprite
//   unicornio,          { x, y }
//   bajoPuente,         true si el sprite pasa por debajo de un puente
//   puntoSeleccionado,  punto marcado por el usuario al editar (o null)
//   corazones,          corazones de la animación de victoria (o [])
// }
import {
  RADIO_PUNTO,
  ANCHO_LINEA,
  COLORES,
  SPRITE_TAMANO,
  SPRITE_ELEVACION,
  PUENTE_TAMANO,
  CORAZONES,
} from '../config.js';
import { sprite, bridgeSprite, bridgeSpriteRotated, unicorn, heartImage } from '../assets.js';
import { puentesDeLinea } from '../model/bridges.js';

export function crearRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function dibujarPunto(punto, color) {
    ctx.beginPath();
    ctx.arc(punto.x, punto.y, RADIO_PUNTO, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  function dibujarLinea(linea, color) {
    ctx.beginPath();
    ctx.moveTo(linea.p1.x, linea.p1.y);
    ctx.lineTo(linea.p2.x, linea.p2.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = ANCHO_LINEA;
    ctx.stroke();
    ctx.closePath();
  }

  function dibujarPuente(puente) {
    const imagen = puente.orientacion === 'vertical' ? bridgeSpriteRotated : bridgeSprite;
    ctx.drawImage(imagen, puente.x, puente.y, PUENTE_TAMANO, PUENTE_TAMANO);
  }

  // Cada muro especial se pinta en rojo seguido de los puentes que forma con otros.
  function dibujarEspeciales(board) {
    board.lineas
      .filter((linea) => linea.especial === true)
      .forEach((linea) => {
        dibujarLinea(linea, COLORES.resalte);
        puentesDeLinea(board.lineas, linea.p1, linea.p2).forEach(dibujarPuente);
      });
  }

  function dibujarPersonajes(jugador, unicornioPos, elevado) {
    const y = elevado ? jugador.y - SPRITE_ELEVACION : jugador.y;
    ctx.drawImage(sprite, jugador.x, y, SPRITE_TAMANO, SPRITE_TAMANO);
    ctx.drawImage(unicorn, unicornioPos.x, unicornioPos.y, SPRITE_TAMANO, SPRITE_TAMANO);
  }

  function dibujarCorazones(corazones) {
    corazones.forEach((corazon) => {
      ctx.drawImage(
        heartImage,
        0,
        0,
        CORAZONES.frame,
        CORAZONES.frame,
        corazon.x,
        corazon.y,
        corazon.size,
        corazon.size
      );
    });
  }

  function render({ board, jugador, unicornio, bajoPuente, puntoSeleccionado, corazones }) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    board.puntos.forEach((punto) => dibujarPunto(punto, COLORES.base));
    board.lineas.forEach((linea) => dibujarLinea(linea, COLORES.base));
    if (puntoSeleccionado) dibujarPunto(puntoSeleccionado, COLORES.resalte);

    if (bajoPuente) {
      // El sprite pasa por debajo: se pinta antes que los puentes
      dibujarPersonajes(jugador, unicornio, false);
      dibujarEspeciales(board);
    } else {
      dibujarEspeciales(board);
      dibujarPersonajes(jugador, unicornio, true);
    }

    dibujarCorazones(corazones);
  }

  return { render };
}
