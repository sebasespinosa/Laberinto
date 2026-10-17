# Checklist manual de regresión

Desde la fase 3 el juego usa módulos ES y **no funciona con doble clic** (`file://`). Arrancar un servidor con `npm start` y abrir <http://localhost:8000/> (con la consola abierta) y verificar tras cada fase del refactor.
Los tests automáticos (`npm test`) cubren parseo de mapas, puentes y movimiento; esto cubre lo visual y la interacción.

## Niveles

- [ ] Al cargar aparece "Crea un laberinto!" (stageZero) con puntos, muros, sprite y unicornio visibles.
- [ ] Cada uno de los 8 botones carga su nivel y se dibuja igual que antes.
- [ ] Cambiar de nivel varias veces seguidas no deja restos del dibujo anterior.

## Movimiento

- [ ] Las 4 flechas mueven al sprite una celda.
- [ ] Los muros normales (azules) bloquean el paso; los bordes del tablero también.
- [ ] Muros especiales (rojos) + puente: cruzar **por encima** del puente en su eje (el otro eje queda bloqueado).
- [ ] Pasar **por debajo** del puente en el eje perpendicular (el sprite se dibuja detrás del puente).
- [ ] Al llegar al unicornio suben corazones; al alejarse se detienen y desaparecen.

## Edición en caliente

- [ ] Clic en dos puntos alineados dibuja el muro entre ellos (también varios tramos).
- [ ] Clic en dos puntos con un muro ya existente lo elimina.
- [ ] Clic en el punto medio de un muro lo marca/desmarca como especial (rojo).
- [ ] Dos muros especiales paralelos y contiguos forman un puente (sprite de madera); al desmarcar desaparece.
- [ ] Al desmarcar un muro que formaba un puente, el puente desaparece de inmediato (fase 4) y ya no se puede cruzar.
- [ ] Dibujar un muro de varios tramos sobre uno existente no duplica los tramos (fase 4).
- [ ] Tras editar, el sprite y el unicornio siguen en su lugar.

## Visual (fase 5: un único render)

- [ ] Al cargar un nivel el sprite aparece ya elevado (como después de moverse), no 10px más abajo.
- [ ] Tras añadir/quitar/marcar un muro, el sprite no «salta» de posición.
- [ ] El punto seleccionado (primer clic al dibujar un muro) se ve en rojo y se mantiene aunque muevas el sprite.
- [ ] Los corazones siguen subiendo mientras el sprite está sobre el unicornio.

## Movimiento (fase 6)

- [ ] Marcar un solo muro como especial (sin pareja) y cruzarlo: después se puede girar con normalidad (antes quedaba bloqueado).
- [ ] Cambiar de nivel estando sobre un puente: el sprite arranca libre en el nuevo nivel.

## Entrada y menú (fase 7)

- [ ] Hacer zoom del navegador (o reducir la ventana) para que el canvas se vea más pequeño: los clics siguen cayendo en el punto correcto.
- [ ] Clic en cualquier parte de un muro (no solo en su centro) lo marca/desmarca como especial.
- [ ] Clic en un punto cercano a un muro selecciona el punto, no el muro.
- [ ] Los 8 botones del menú siguen cargando su nivel.
