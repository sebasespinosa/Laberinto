// Teclado: traduce las flechas a direcciones de movimiento.

const TECLAS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

// alMover(direccion) se llama con 'up' | 'down' | 'left' | 'right'.
export function instalarTeclado(alMover, destino = window) {
  destino.addEventListener('keydown', (event) => {
    const direccion = TECLAS[event.key];
    if (!direccion) return;
    event.preventDefault(); // Evita que las flechas hagan scroll en la página
    alMover(direccion);
  });
}
