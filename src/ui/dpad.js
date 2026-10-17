// Controles de dirección en pantalla (cruz de cuatro botones) para jugar con el
// ratón o con el dedo. Son opcionales:
//   - sin preferencia guardada, se muestran solo en dispositivos táctiles (lo decide el CSS);
//   - la casilla "Mostrar controles" fuerza mostrarlos u ocultarlos y se recuerda.
// Mantener pulsado un botón repite el movimiento, como mantener una flecha del teclado.
import { REPETICION } from '../config.js';

const BOTONES = [
  { direccion: 'up', simbolo: '▲', etiqueta: 'Mover arriba' },
  { direccion: 'left', simbolo: '◀', etiqueta: 'Mover a la izquierda' },
  { direccion: 'right', simbolo: '▶', etiqueta: 'Mover a la derecha' },
  { direccion: 'down', simbolo: '▼', etiqueta: 'Mover abajo' },
];

const CLAVE_PREFERENCIA = 'laberinto.controles';
const CONSULTA_TACTIL = '(hover: none) and (pointer: coarse)';

function almacenPorDefecto() {
  try {
    return globalThis.localStorage;
  } catch {
    return null; // acceso bloqueado (modo privado, cookies deshabilitadas…)
  }
}

function esTactilPorDefecto() {
  return globalThis.matchMedia?.(CONSULTA_TACTIL).matches ?? false;
}

function leerPreferencia(almacen) {
  try {
    const valor = almacen?.getItem(CLAVE_PREFERENCIA);
    return valor === 'si' || valor === 'no' ? valor : null;
  } catch {
    return null;
  }
}

function guardarPreferencia(almacen, valor) {
  try {
    almacen?.setItem(CLAVE_PREFERENCIA, valor);
  } catch {
    // Sin almacenamiento: la preferencia solo dura mientras la página esté abierta
  }
}

// Un pulsador con repetición. El movimiento ocurre al pulsar (pointerdown); el
// `click` solo se atiende si viene del teclado (detail === 0) para no mover dos veces.
function instalarPulsador(boton, direccion, alMover) {
  let espera = null;
  let repeticion = null;

  const detener = () => {
    clearTimeout(espera);
    clearInterval(repeticion);
    espera = repeticion = null;
  };

  boton.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault(); // evita la selección de texto y el foco por arrastre
    boton.setPointerCapture?.(event.pointerId); // seguir recibiendo eventos aunque el dedo se mueva
    detener();
    alMover(direccion);
    espera = setTimeout(() => {
      repeticion = setInterval(() => alMover(direccion), REPETICION.intervalo);
    }, REPETICION.retraso);
  });

  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((tipo) =>
    boton.addEventListener(tipo, detener)
  );
  boton.addEventListener('contextmenu', (event) => event.preventDefault()); // pulsación larga en móvil
  boton.addEventListener('click', (event) => {
    if (event.detail === 0) alMover(direccion);
  });
}

// alMover(direccion) se llama con 'up' | 'down' | 'left' | 'right'.
// `opciones` permite sustituir el almacenamiento y la detección táctil (para pruebas).
export function crearControlesDireccion(contenedor, alMover, opciones = {}) {
  const { almacen = almacenPorDefecto(), esTactil = esTactilPorDefecto } = opciones;

  const interruptor = document.createElement('label');
  interruptor.className = 'controles-interruptor';
  const casilla = document.createElement('input');
  casilla.type = 'checkbox';
  interruptor.appendChild(casilla);
  interruptor.appendChild(document.createTextNode(' Mostrar controles'));

  const cruz = document.createElement('div');
  cruz.className = 'dpad';
  BOTONES.forEach(({ direccion, simbolo, etiqueta }) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = `dpad-${direccion}`;
    boton.textContent = simbolo;
    boton.setAttribute('aria-label', etiqueta);
    instalarPulsador(boton, direccion, alMover);
    cruz.appendChild(boton);
  });

  // data-controles="si" | "no" fuerza la visibilidad; sin atributo decide el CSS (táctil)
  const preferencia = leerPreferencia(almacen);
  if (preferencia) contenedor.dataset.controles = preferencia;
  casilla.checked = preferencia ? preferencia === 'si' : esTactil();
  casilla.addEventListener('change', () => {
    const valor = casilla.checked ? 'si' : 'no';
    contenedor.dataset.controles = valor;
    guardarPreferencia(almacen, valor);
  });

  contenedor.appendChild(interruptor);
  contenedor.appendChild(cruz);
}
