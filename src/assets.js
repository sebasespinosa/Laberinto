// Carga las imágenes del juego. Usa top-level await: quien importe este módulo
// recibe las imágenes ya cargadas (sin carreras con el primer dibujado).

function cargarImagen(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    // Una imagen faltante no debe impedir que el juego arranque (antes simplemente no se dibujaba)
    img.onerror = () => {
      console.warn(`No se pudo cargar la imagen: ${src}`);
      resolve(img);
    };
    img.src = src;
  });
}

export const [sprite, bridgeSprite, bridgeSpriteRotated, unicorn, heartImage] = await Promise.all([
  cargarImagen('sprite3-1.png'),
  cargarImagen('woodenBridge60.png'),
  cargarImagen('woodenBridge60Rotated.png'),
  cargarImagen('unicornio.png'),
  cargarImagen('corazon.png'),
]);
