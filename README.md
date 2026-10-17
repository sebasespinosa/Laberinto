# Laberinto de papel

Pequeño juego de laberintos sobre un canvas. Llevas al sprite hasta el unicornio moviéndote por las celdas con las flechas del teclado, y puedes **modificar el laberinto mientras juegas**: dibujar y quitar muros y convertirlos en puentes.

## Cómo ejecutarlo

El juego usa módulos ES, así que no funciona abriendo el HTML con doble clic (`file://`). Hace falta un servidor local:

```bash
npm start          # servidor en http://localhost:8000
```

Abre <http://localhost:8000/GridV5-1.html>. Solo necesitas Python 3 para el servidor; las dependencias de `npm install` son únicamente de desarrollo (pruebas y estilo).

## Cómo se juega

- **Flechas**: mueven al sprite una celda. Los muros azules bloquean el paso.
- **Botones**: cada uno carga un laberinto.
- **Llegar al unicornio** lanza una lluvia de corazones.

### Editar en caliente

- **Clic en dos puntos alineados** (misma fila o columna): dibuja el muro entre ellos, o lo elimina si ya existe.
- **Clic sobre un muro**: lo marca o desmarca como _especial_ (rojo). Un muro especial no bloquea el paso.

### Puentes

Dos muros especiales paralelos y contiguos forman un **puente**. La celda que queda entre ellos es su cubierta:

- Se puede cruzar **por encima**, avanzando a lo largo del puente (en la cubierta no se puede girar).
- Se puede pasar **por debajo**, en perpendicular al puente (el sprite se dibuja detrás de él).

Un muro especial suelto, sin pareja, no forma puente y se cruza con normalidad.

## Estructura

```
GridV5-1.html           página del juego (canvas + menú)
css/styles.css
src/
  main.js               arranque: crea el juego y conecta teclado, ratón y menú
  game.js               crearJuego(canvas): estado de la partida y API pública
  levels.js             datos de los niveles (mapas ASCII, inicio y meta)
  config.js             constantes: medidas, colores, umbrales de clic, corazones
  assets.js             carga de imágenes (top-level await)
  model/                lógica del juego, sin DOM ni canvas
    board.js            tablero: puntos, muros y puentes
    mapParser.js        mapa ASCII -> muros
    bridges.js          detección de puentes (funciones puras)
    movement.js         reglas de movimiento (funciones puras)
  render/
    renderer.js         única capa que dibuja: render(escena)
    hearts.js           estado de la animación de corazones
  input/
    keyboard.js         flechas -> direcciones
    editor.js           clics -> edición de muros y puentes
  ui/levelMenu.js       botones de nivel
tests/                  pruebas (ver abajo)
```

La dependencia va siempre hacia el modelo: `model/` no importa nada de `render/`, `input/` ni `ui/`, y `game.js` es el único que une modelo y renderer.

### Formato de un nivel

Cada nivel de [src/levels.js](src/levels.js) es un objeto de datos:

```js
{
  id: 'six',                       // id del botón
  label: 'Laberinto 1',            // texto del botón
  inicio: { fila: 0, columna: 0 }, // celda inicial del sprite
  unicornio: { fila: 8, columna: 8 },
  mapa: [                          // dibujo ASCII de 2n-1 filas para n filas de puntos
    '.-.-.-.',                     //   '.' punto
    '| |   |',                     //   '-' y '|' muros
    '. .*. .',                     //   '*' muro especial (puente)
    '|     |',                     //   ' ' vacío
    '.-.-.-.',
  ],
}
```

El tamaño del tablero se deduce del mapa. Para añadir un nivel basta con añadir un objeto a `LEVELS`; el menú se genera solo.

## Desarrollo

```bash
npm install         # instala ESLint, Prettier (solo desarrollo)
npm test            # pruebas (node --test, sin dependencias de prueba)
npm run lint        # ESLint
npm run format      # Prettier (escribe)
npm run check       # lint + formato + pruebas (lo que conviene pasar antes de un commit)
```

### Pruebas

- `characterization.test.js`: congela el comportamiento del juego en los 8 niveles (muros, puentes y 400 movimientos aleatorios reproducibles por nivel, comparados con [tests/golden.json](tests/golden.json)). Si un cambio de comportamiento es **intencional**, regenera el archivo con `node tests/generate-golden.js` y revisa el diff.
- `movement`, `board`, `renderer`, `input`, `levels`: pruebas unitarias del modelo, del orden de dibujo (con un contexto 2D que graba las llamadas), de la entrada y de los datos de los niveles.

Las pruebas corren en Node con un `Image` y un canvas falsos (ver [tests/harness.js](tests/harness.js)); no necesitan navegador.

### Revisión manual

Lo visual y la interacción real se revisan con [CHECKLIST_MANUAL.md](CHECKLIST_MANUAL.md).
