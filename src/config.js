// Constantes del juego: medidas, colores y parámetros de animación.

// Tablero
export const SEPARACION = 60; // distancia en píxeles entre puntos contiguos
export const MARGEN_TABLERO = 30; // posición (x e y) del primer punto

// Puntos y líneas
export const RADIO_PUNTO = 5;
export const ANCHO_LINEA = 2;
export const COLORES = {
  base: '#3498db', // puntos y muros normales
  resalte: '#e74c3c', // punto seleccionado y muros especiales
};

// Personajes
export const SPRITE_TAMANO = 40; // lado del sprite (sprite y unicornio)
export const SPRITE_CENTRADO = 15; // ajuste histórico para centrar el sprite en su celda
export const SPRITE_ELEVACION = 10; // el sprite se dibuja 10px más arriba cuando está sobre un puente

// Puentes
export const PUENTE_TAMANO = 60;

// Edición con el ratón
export const RADIO_CLIC_PUNTO = 10; // distancia máxima al punto para seleccionarlo
export const UMBRAL_CLIC_LINEA = 8; // distancia máxima a un muro (en cualquier punto de su longitud) para marcarlo

// Animación de corazones al llegar al unicornio
export const CORAZONES = {
  cantidad: 10,
  velocidadMin: 1,
  velocidadExtra: 2, // velocidad = min + random * extra
  tamanoMin: 16,
  tamanoExtra: 16, // tamaño = min + random * extra
  margenInferior: 100, // los corazones nacen hasta 100px por debajo del canvas
  frame: 32, // lado del frame en la imagen corazon.png
};

// Botones de dirección: al mantener pulsado uno, el movimiento se repite
export const REPETICION = {
  retraso: 350, // ms hasta la primera repetición
  intervalo: 150, // ms entre repeticiones
};
