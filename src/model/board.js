// Modelo del tablero: puntos, muros (líneas) y puentes. No dibuja nada.
import { SEPARACION, MARGEN_TABLERO } from '../config.js';
import { parseMapToLines } from './mapParser.js';
import { detectarPuentes } from './bridges.js';

export function compararPuntos(puntoA, puntoB) {
  return (
    puntoA.x === puntoB.x &&
    puntoA.y === puntoB.y &&
    puntoA.fila === puntoB.fila &&
    puntoA.columna === puntoB.columna
  );
}

export class Board {
  constructor(filas, columnas) {
    this.filas = filas;
    this.columnas = columnas;
    this.puntos = [];
    for (let fila = 0; fila < filas; fila++) {
      for (let columna = 0; columna < columnas; columna++) {
        this.puntos.push({
          x: columna * SEPARACION + MARGEN_TABLERO,
          y: fila * SEPARACION + MARGEN_TABLERO,
          fila,
          columna,
        });
      }
    }
    this.lineas = [];
    this.puentes = new Map();
  }

  puntoEn(fila, columna) {
    return this.puntos[fila * this.columnas + columna];
  }

  // Sustituye los muros por los del mapa ASCII (arreglo de arreglos de caracteres).
  cargarMapa(mapa) {
    this.lineas = parseMapToLines(mapa, this.puntos);
    this.recalcularPuentes();
  }

  // Los puentes se derivan siempre de los muros especiales actuales.
  recalcularPuentes() {
    this.puentes = detectarPuentes(this.lineas);
  }

  // ¿Existe un muro entre estos dos puntos (en cualquier sentido)?
  tieneLinea(punto1, punto2) {
    return this.lineas.some(
      (linea) =>
        (compararPuntos(linea.p1, punto1) && compararPuntos(linea.p2, punto2)) ||
        (compararPuntos(linea.p1, punto2) && compararPuntos(linea.p2, punto1))
    );
  }

  // ¿Hay un muro que impida el paso entre estos dos puntos? Los muros
  // especiales (parte de un puente) no bloquean.
  bloqueaPaso(punto1, punto2) {
    return this.lineas.some(
      (linea) =>
        !linea.especial &&
        ((compararPuntos(linea.p1, punto1) && compararPuntos(linea.p2, punto2)) ||
          (compararPuntos(linea.p1, punto2) && compararPuntos(linea.p2, punto1)))
    );
  }

  // Puentes cuya cubierta es la celda (fila, columna).
  puentesEn(fila, columna) {
    return [...this.puentes.values()].filter((p) => p.fila === fila && p.columna === columna);
  }

  // Agrega los muros de cada tramo entre dos puntos alineados (en una misma
  // fila o columna). Omite los tramos que ya existen. Devuelve los tramos nuevos.
  agregarLinea(punto1, punto2) {
    const nuevas = [];
    const agregarTramo = (a, b) => {
      if (this.tieneLinea(a, b)) return;
      const linea = { p1: a, p2: b };
      this.lineas.push(linea);
      nuevas.push(linea);
    };

    if (punto1.fila === punto2.fila) {
      const desde = Math.min(punto1.columna, punto2.columna);
      const hasta = Math.max(punto1.columna, punto2.columna);
      for (let c = desde; c < hasta; c++) {
        agregarTramo(this.puntoEn(punto1.fila, c), this.puntoEn(punto1.fila, c + 1));
      }
    }
    if (punto1.columna === punto2.columna) {
      const desde = Math.min(punto1.fila, punto2.fila);
      const hasta = Math.max(punto1.fila, punto2.fila);
      for (let f = desde; f < hasta; f++) {
        agregarTramo(this.puntoEn(f, punto1.columna), this.puntoEn(f + 1, punto1.columna));
      }
    }
    return nuevas;
  }

  // Elimina el muro entre dos puntos contiguos.
  eliminarLinea(punto1, punto2) {
    this.lineas = this.lineas.filter(
      (linea) =>
        !(compararPuntos(linea.p1, punto1) && compararPuntos(linea.p2, punto2)) &&
        !(compararPuntos(linea.p1, punto2) && compararPuntos(linea.p2, punto1))
    );
    this.recalcularPuentes();
  }

  // Marca o desmarca un muro como especial. Devuelve si quedó especial.
  alternarEspecial(linea) {
    linea.especial = !linea.especial;
    this.recalcularPuentes();
    return linea.especial;
  }
}
