// Detección de puentes. Funciones puras: dependen solo de las líneas del tablero.
//
// Un puente aparece cuando dos muros especiales son paralelos y contiguos:
//   - dos muros horizontales uno encima del otro forman un puente "vertical"
//     (se cruza de arriba abajo);
//   - dos muros verticales uno junto al otro forman un puente "horizontal".
// La celda entre los dos muros es la cubierta del puente: se puede cruzar por
// encima (a lo largo del puente) o pasar por debajo (en perpendicular).

// Clave estable de un conjunto de puntos: se ordenan por x e y y se serializan.
export function crearClavePuntos(puntos) {
  puntos.sort((a, b) => a.x - b.x || a.y - b.y);
  return JSON.stringify(puntos);
}

function crearPuente(punto1, punto2, otra, orientacion) {
  const puntos = [
    { x: punto1.x, y: punto1.y },
    { x: punto2.x, y: punto2.y },
    { x: otra.p1.x, y: otra.p1.y },
    { x: otra.p2.x, y: otra.p2.y },
  ];
  const ubicacion = crearClavePuntos(puntos); // `puntos` queda ordenado
  const esquinas = [punto1, punto2, otra.p1, otra.p2];
  return {
    id: `${ubicacion}|${orientacion}`,
    ubicacion,
    puntos,
    orientacion,
    // Celda que forma la cubierta del puente (los cuatro puntos son sus esquinas)
    fila: Math.min(...esquinas.map((p) => p.fila)),
    columna: Math.min(...esquinas.map((p) => p.columna)),
    // Esquina superior izquierda del área del puente (donde se dibuja su sprite)
    x: Math.min(punto1.x, punto2.x, otra.p1.x, otra.p2.x),
    y: Math.min(punto1.y, punto2.y, otra.p1.y, otra.p2.y),
  };
}

// Puentes que forma el muro (punto1, punto2) con otros muros especiales.
export function puentesDeLinea(lineas, punto1, punto2) {
  const puentes = [];

  if (punto1.fila === punto2.fila) {
    // Muro horizontal: busca otro especial en la fila anterior o posterior
    lineas
      .filter(
        (x) =>
          (x.p1.fila === punto1.fila - 1 || x.p1.fila === punto1.fila + 1) &&
          x.p1.columna === punto1.columna &&
          x.p2.columna === punto2.columna &&
          x.especial
      )
      .forEach((otra) => puentes.push(crearPuente(punto1, punto2, otra, 'vertical')));
  }

  if (punto1.columna === punto2.columna) {
    // Muro vertical: busca otro especial en la columna anterior o posterior
    lineas
      .filter(
        (x) =>
          (x.p1.columna === punto1.columna - 1 || x.p1.columna === punto1.columna + 1) &&
          x.p1.fila === punto1.fila &&
          x.p2.fila === punto2.fila &&
          x.especial
      )
      .forEach((otra) => puentes.push(crearPuente(punto1, punto2, otra, 'horizontal')));
  }

  return puentes;
}

// Todos los puentes del tablero, indexados por id (cada puente se encuentra
// desde sus dos muros, el Map evita duplicados).
export function detectarPuentes(lineas) {
  const puentes = new Map();
  lineas
    .filter((linea) => linea.especial === true)
    .forEach((linea) => {
      puentesDeLinea(lineas, linea.p1, linea.p2).forEach((puente) => {
        if (!puentes.has(puente.id)) puentes.set(puente.id, puente);
      });
    });
  return puentes;
}
