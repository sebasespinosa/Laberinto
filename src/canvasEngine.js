export function crearPuntos(filas, columnas) {
  const puntos = [];
  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      const x = columna * 60 + 30;
      const y = fila * 60 + 30;
      puntos.push({ x, y, fila, columna });
      dibujarPunto(x, y);
    }
  }
  return puntos;
}

export function redibujarPuntos(puntos) {
  puntos.forEach(p => dibujarPunto(p.x, p.y));
}

export function dibujarPunto(x, y) {
  const canvas = document.getElementById('miCanvas');
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#3498db';
  ctx.fill();
  ctx.closePath();
}