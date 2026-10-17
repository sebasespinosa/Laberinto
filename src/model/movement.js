// Reglas de movimiento del jugador. Funciones puras: no tocan el DOM ni el canvas.
//
// El jugador ocupa una celda (fila, columna) y está en una capa:
//   'suelo'  en una celda normal;
//   'sobre'  cruzando un puente por encima (se mueve a lo largo del puente);
//   'bajo'   pasando por debajo de un puente (se mueve en perpendicular).
// Mientras está sobre la cubierta de un puente solo puede avanzar o retroceder
// en el eje por el que entró; no puede girar hasta salir.

export const DIRECCIONES = {
  up: { df: -1, dc: 0, eje: 'vertical' },
  down: { df: 1, dc: 0, eje: 'vertical' },
  left: { df: 0, dc: -1, eje: 'horizontal' },
  right: { df: 0, dc: 1, eje: 'horizontal' },
};

export function crearJugador(fila, columna) {
  return { fila, columna, capa: 'suelo', eje: null };
}

// Extremos del lado de la celda (fila, columna) que mira hacia `direccion`.
function ladoDeCelda(board, fila, columna, direccion) {
  switch (direccion) {
    case 'up':
      return [board.puntoEn(fila, columna), board.puntoEn(fila, columna + 1)];
    case 'down':
      return [board.puntoEn(fila + 1, columna), board.puntoEn(fila + 1, columna + 1)];
    case 'left':
      return [board.puntoEn(fila, columna), board.puntoEn(fila + 1, columna)];
    default:
      return [board.puntoEn(fila, columna + 1), board.puntoEn(fila + 1, columna + 1)];
  }
}

// Devuelve el jugador tras intentar moverse; si el movimiento no es posible
// devuelve el mismo objeto recibido.
export function mover(board, jugador, direccion) {
  const d = DIRECCIONES[direccion];
  if (!d) return jugador;

  // Sobre la cubierta de un puente solo se permite el eje de entrada
  if (jugador.capa !== 'suelo' && d.eje !== jugador.eje) return jugador;

  const fila = jugador.fila + d.df;
  const columna = jugador.columna + d.dc;
  // El tablero tiene (filas - 1) x (columnas - 1) celdas
  if (fila < 0 || columna < 0 || fila >= board.filas - 1 || columna >= board.columnas - 1)
    return jugador;

  const [a, b] = ladoDeCelda(board, jugador.fila, jugador.columna, direccion);
  if (board.bloqueaPaso(a, b)) return jugador;

  const [puente] = board.puentesEn(fila, columna);
  if (!puente) return crearJugador(fila, columna);

  // El eje de un puente "vertical" es vertical (se cruza de arriba abajo)
  const capa = d.eje === puente.orientacion ? 'sobre' : 'bajo';
  return { fila, columna, capa, eje: d.eje };
}
