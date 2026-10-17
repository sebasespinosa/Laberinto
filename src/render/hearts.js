// Estado de la animación de corazones (sin dibujar). La imagen la pinta el renderer.
import { CORAZONES } from '../config.js';

export function crearCorazones(ancho, alto) {
  const corazones = [];
  for (let i = 0; i < CORAZONES.cantidad; i++) {
    corazones.push({
      x: Math.random() * ancho,
      y: alto + Math.random() * CORAZONES.margenInferior,
      speed: CORAZONES.velocidadMin + Math.random() * CORAZONES.velocidadExtra,
      size: CORAZONES.tamanoMin + Math.random() * CORAZONES.tamanoExtra,
    });
  }
  return corazones;
}

// Sube cada corazón; al salir por arriba reaparece por abajo en otra posición.
export function avanzarCorazones(corazones, ancho, alto) {
  corazones.forEach((corazon) => {
    corazon.y -= corazon.speed;
    if (corazon.y + corazon.size < 0) {
      corazon.y = alto + Math.random() * CORAZONES.margenInferior;
      corazon.x = Math.random() * ancho;
    }
  });
}
