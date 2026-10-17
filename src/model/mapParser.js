// Convierte el dibujo ASCII de un nivel en líneas entre puntos del tablero.
//   '-' muro horizontal   '|' muro vertical   '*' muro especial (puede formar puentes)

export function parseMapToLines(mapa, puntos) {
  const lineas = [];

  const getPoint = (fila, columna) => {
    return puntos.find((p) => p.fila === fila && p.columna === columna);
  };

  const isLineDuplicate = (p1, p2) => {
    return lineas.some(
      (line) => (line.p1 === p1 && line.p2 === p2) || (line.p1 === p2 && line.p2 === p1)
    );
  };

  mapa.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === '-') {
        // Línea horizontal
        const p1 = getPoint(Math.floor(i / 2), Math.floor((j - 1) / 2));
        const p2 = getPoint(Math.floor(i / 2), Math.floor((j + 1) / 2));
        if (p1 && p2 && !isLineDuplicate(p1, p2)) {
          lineas.push({ p1, p2 });
        }
      } else if (cell === '|') {
        // Línea vertical
        const p1 = getPoint(Math.floor((i - 1) / 2), Math.floor(j / 2));
        const p2 = getPoint(Math.floor((i + 1) / 2), Math.floor(j / 2));
        if (p1 && p2 && !isLineDuplicate(p1, p2)) {
          lineas.push({ p1, p2 });
        }
      } else if (cell === '*') {
        const fila = Math.floor(i / 2);
        const columna = Math.floor(j / 2);

        // Obtener los puntos adyacentes si existen
        const leftPoint =
          j > 0 && mapa[i][j - 1] === '.' ? getPoint(fila, Math.floor((j - 1) / 2)) : null;
        const rightPoint =
          j < row.length - 1 && mapa[i][j + 1] === '.'
            ? getPoint(fila, Math.floor((j + 1) / 2))
            : null;
        const topPoint =
          i > 0 && mapa[i - 1][j] === '.' ? getPoint(Math.floor((i - 1) / 2), columna) : null;
        const bottomPoint =
          i < mapa.length - 1 && mapa[i + 1][j] === '.'
            ? getPoint(Math.floor((i + 1) / 2), columna)
            : null;

        // Agregar líneas según las conexiones detectadas
        if (leftPoint && rightPoint) {
          lineas.push({ p1: leftPoint, p2: rightPoint, especial: true });
        }
        if (topPoint && bottomPoint) {
          lineas.push({ p1: topPoint, p2: bottomPoint, especial: true });
        }
      }
    });
  });

  return lineas;
}
