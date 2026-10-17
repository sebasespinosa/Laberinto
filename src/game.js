import { SEPARACION, MARGEN_TABLERO, SPRITE_CENTRADO } from './config.js';
import { Board } from './model/board.js';
import { crearJugador, mover } from './model/movement.js';
import { crearRenderer } from './render/renderer.js';
import { crearCorazones, avanzarCorazones } from './render/hearts.js';

// Centro de una celda (fila, columna) en píxeles. Las celdas son los cuadros
// delimitados por cuatro puntos; el primer punto está en (30, 30).
function centroDeCelda(fila, columna) {
  return {
    x: columna * SEPARACION + MARGEN_TABLERO + SEPARACION / 2,
    y: fila * SEPARACION + MARGEN_TABLERO + SEPARACION / 2,
  };
}

// Esquina superior izquierda del sprite que está en la celda (centrado en ella).
function posicionDeSprite(celda) {
  const centro = centroDeCelda(celda.fila, celda.columna);
  return { x: centro.x - SPRITE_CENTRADO, y: centro.y - SPRITE_CENTRADO };
}

// Dos puntos están alineados si comparten fila o columna
function estanEnLinea(punto1, punto2) {
  return punto1.fila === punto2.fila || punto1.columna === punto2.columna;
}

// Crea el juego sobre un canvas. No registra eventos: de eso se encargan
// los módulos de input (teclado, editor) usando la API que devuelve.
export function crearJuego(canvas) {
  const renderer = crearRenderer(canvas);

  let board = null; // Board del nivel actual (puntos, muros y puentes)
  let jugador = null; // { fila, columna, capa, eje } (ver model/movement.js)
  let unicornio = null; // { fila, columna } celda del unicornio (meta)
  let primerPunto = null; // primer punto marcado al editar muros
  let hearts = [];
  let animationId = null;

  // Dibuja el estado actual (único punto de entrada al renderer).
  function dibujar() {
    renderer.render({
      board,
      jugador: posicionDeSprite(jugador),
      unicornio: posicionDeSprite(unicornio),
      bajoPuente: jugador.capa === 'bajo',
      puntoSeleccionado: primerPunto,
      corazones: hearts,
    });
  }

  // Animación de victoria: dibuja y hace subir los corazones en cada frame.
  function animarCorazones() {
    dibujar();
    avanzarCorazones(hearts, canvas.width, canvas.height);
    animationId = requestAnimationFrame(animarCorazones);
  }

  function detenerCorazones() {
    cancelAnimationFrame(animationId);
    animationId = null;
    hearts = [];
  }

  // Carga un nivel de LEVELS (ver levels.js) y deja el tablero listo para jugar.
  function cargarNivel(nivel) {
    const mapa = nivel.mapa.map((fila) => [...fila]);
    // El mapa tiene 2n-1 filas/columnas de caracteres para n puntos.
    board = new Board((mapa.length + 1) / 2, (mapa[0].length + 1) / 2);
    board.cargarMapa(mapa);
    detenerCorazones();
    primerPunto = null;
    jugador = crearJugador(nivel.inicio.fila, nivel.inicio.columna);
    unicornio = { fila: nivel.unicornio.fila, columna: nivel.unicornio.columna };
    dibujar();
  }

  // Intenta mover al jugador una celda ('up' | 'down' | 'left' | 'right').
  function moverJugador(direccion) {
    if (!jugador) return;
    jugador = mover(board, jugador, direccion);

    const enMeta = jugador.fila === unicornio.fila && jugador.columna === unicornio.columna;
    if (!enMeta && animationId !== null) detenerCorazones();
    dibujar();
    if (enMeta && animationId === null) {
      hearts = crearCorazones(canvas.width, canvas.height);
      animarCorazones();
    }
  }

  // Edición: dos puntos alineados dibujan el muro entre ellos, o lo eliminan si ya existe.
  function seleccionarPunto(punto) {
    if (!primerPunto) {
      primerPunto = punto;
    } else {
      if (estanEnLinea(primerPunto, punto)) {
        if (board.tieneLinea(primerPunto, punto)) {
          board.eliminarLinea(primerPunto, punto);
        } else {
          board.agregarLinea(primerPunto, punto);
        }
      }
      primerPunto = null;
    }
    dibujar();
  }

  // Edición: marca o desmarca un muro como especial (parte de un puente).
  function alternarEspecial(linea) {
    board.alternarEspecial(linea);
    dibujar();
  }

  // Lectura del estado interno (para el editor, las pruebas y la depuración).
  function obtenerEstado() {
    return {
      board,
      lineas: board?.lineas,
      puentes: board?.puentes,
      filas: board?.filas,
      columnas: board?.columnas,
      jugador,
      unicornio,
      animando: animationId !== null,
    };
  }

  return { cargarNivel, mover: moverJugador, seleccionarPunto, alternarEspecial, obtenerEstado };
}
