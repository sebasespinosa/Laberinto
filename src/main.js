// Arranque de la página: crea el juego y conecta teclado, ratón y menú.
import { LEVELS } from './levels.js';
import { crearJuego } from './game.js';
import { instalarTeclado } from './input/keyboard.js';
import { instalarEditor } from './input/editor.js';
import { crearMenuNiveles } from './ui/levelMenu.js';
import { crearControlesDireccion } from './ui/dpad.js';

const canvas = document.getElementById('miCanvas');
const juego = crearJuego(canvas);

instalarTeclado((direccion) => juego.mover(direccion));
instalarEditor(canvas, juego);
crearControlesDireccion(document.getElementById('controles'), (direccion) =>
  juego.mover(direccion)
);
crearMenuNiveles(document.getElementById('menuNiveles'), LEVELS, (nivel) =>
  juego.cargarNivel(nivel)
);

// Las imágenes ya están cargadas (assets.js usa top-level await)
juego.cargarNivel(LEVELS[0]);
