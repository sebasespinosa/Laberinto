const canvas = document.getElementById('miCanvas');
const ctx = canvas.getContext('2d');
let puntos = [];
let lineas = [];
const puentes = new Map();
let filas = 8;
let columnas = 8;
const separacion = 60;
const FORBIDDEN_MOVES = new Set();
let siEntraPuente = false;
let siBajaPuente = false;
const sprite = new Image(); // Objeto de imagen para el sprite
sprite.src = 'sprite2.png'; // URL de un sprite de ejemplo
const bridgeSprite = new Image();
bridgeSprite.src = 'woodenBridge60.png'
const bridgeSpriteRotated = new Image();
bridgeSpriteRotated.src = 'woodenBridge60Rotated.png'
const unicorn = new Image();
unicorn.src = 'unicornio.png'
let spritePos = null; // Posición actual del sprite
let unicornioPos = null;
let spriteArea = null; // Área delimitada por los cuatro puntos cercanos
let unicornioArea = null;
let primerPunto = null;
// Imagen de los corazones
const heartImage = new Image();
heartImage.src = 'corazon.png'; // Ruta de tu imagen
// Configuración de los corazones
let hearts = [];
const heartCount = 10; // Número de corazones
let animationId;
const stageZubSero = [
    ['.', '-', '.', '-', '.', '-', '.'],
    ['|', ' ', ' ', ' ', ' ', ' ', '|'],
    ['.', ' ', '.', '*', '.', ' ', '.'],
    ['*', ' ', '*', ' ', ' ', ' ', '|'],
    ['.', ' ', '.', '*', '.', ' ', '.'],
    ['|', ' ', ' ', ' ', ' ', ' ', '|'],
    ['.', '-', '.', '-', '.', '-', '.']
];
const stageZero = [
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.']
];
const stageOne = [
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', '-', '.', '-', '.', ' ', '.'],
  ['|', ' ', '|', ' ', '|', ' ', '|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', '-', '.', '*', '.', '-', '.'],
  ['|', ' ', '*', ' ', '*', ' ', '*', ' ', '*', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', '-', '.', '*', '.', ' ', '.'],
  ['|', ' ', '|', ' ', '|', ' ', '|', ' ', '|', ' ', ' ', ' ', '|', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', '-', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', '|', ' ', '|', ' ', '|'],
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', '|', ' ', '|', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.']
];
const stageTwo = [
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '-', '.', '*', '.', '-', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '|'],
  ['.', ' ', '.', '-', '.', '*', '.', '-', '.', '-', '.', ' ', '.', '-', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '*', ' ', '*', ' ', '|'],
  ['.', '-', '.', '-', '.', '*', '.', '-', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '|'],
  ['.', ' ', '.', ' ', '.', '*', '.', '-', '.', '-', '.', ' ', '.', ' ', '.'],
  ['|', ' ', '|', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|'],
  ['.', ' ', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.']
];
const stageThree = [
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', ' ', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|'],
  ['.', ' ', '.', ' ', '.', '-', '.', '-', '.', '-', '.', ' ', '.', ' ', '.'],
  ['|', ' ', '*', ' ', '*', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '|'],
  ['.', '-', '.', ' ', '.', '*', '.', '-', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '|', ' ', '|'],
  ['.', ' ', '.', '-', '.', '*', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '|', ' ', '|'],
  ['.', '-', '.', '-', '.', '*', '.', '-', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '|'],
  ['.', ' ', '.', '-', '.', '-', '.', '-', '.', '-', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|'],
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.']
];
const stageFour = [
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '-', '.', '*', '.', '-', '.', '-', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '*', '.', '*', '.', '*', '.', '-', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', '*', '.', '*', '.', '*', '.', '-', '.'],
  ['|', ' ', ' ', ' ', '|', ' ', '|', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '-', '.', ' ', '.', '-', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.']
];
const stageFive = [
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', '-', '.', '-', '.', ' ', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', '-', '.', '*', '.', '-', '.'],
  ['|', ' ', '*', ' ', '*', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', '-', '.', ' ', '.', '-', '.', '*', '.', ' ', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', '|', ' ', '|', ' ', '|'],
  ['.', ' ', '.', '-', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.']
];
const stageSix = [
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', '-', '.', ' ', '.', ' ', '.', '-', '.', '-', '.', '-', '.', ' ', '.'],
  ['|', ' ', '|', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', '-', '.', '-', '.', '-', '.', ' ', '.', ' ', '.', '-', '.'],
  ['|', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '*', '.', '-', '.', ' ', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', '*', '.', '-', '.', '-', '.'],
  ['|', ' ', '|', ' ', '|', ' ', '|', ' ', '|', ' ', '|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', '-', '.', '-', '.', ' ', '.'],
  ['|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', '|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', ' ', '.', ' ', '.', ' ', '.', '-', '.', '-', '.'], 
  ['|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', '|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', '-', '.', '-', '.', ' ', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', '-', '.', '-', '.', '-', '.', '-', '.', ' ', '.', ' ', '.', '-', '.', '-', '.'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.']
];
const stageSeven = [
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', '-', '.', '-', '.', ' ', '.'],
  ['|', ' ', '*', ' ', '*', ' ', '*', ' ', ' ', ' ', '|', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', '-', '.', '*', '.', ' ', '.'],
  ['|', ' ', '|', ' ', '|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' ', '.', '*', '.', ' ', '.'],
  ['|', ' ', '|', ' ', '|', ' ', '|', ' ', '|', ' ', '|', ' ', '|'],
  ['.', ' ', '.', ' ', '.', ' ', '.', '-', '.', ' ', '.', ' ', '.'],
  ['|', ' ', '|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|'],
  ['.', ' ', '.', ' ', '.', '-', '.', '-', '.', '-', '.', ' ', '.'],
  ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.', '-', '.']
];
const parseMapToLines = (mapa, puntos) => {
  const lineas = [];

  const getPoint = (fila, columna) => {
    return puntos.find(p => p.fila === fila && p.columna === columna);
  };

  const isLineDuplicate = (p1, p2) => {
    return lineas.some(line => 
      (line.p1 === p1 && line.p2 === p2) || 
      (line.p1 === p2 && line.p2 === p1)
    );
  };

  mapa.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === '-' || cell === '|' || cell === '*') {
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
          // Coordenadas del punto central del muro especial
        const fila = Math.floor(i / 2);
        const columna = Math.floor(j / 2);

        // Obtener los puntos adyacentes si existen
        const leftPoint = j > 0 && mapa[i][j - 1] === '.' ? getPoint(fila, Math.floor((j - 1) / 2)) : null;
        const rightPoint = j < row.length - 1 && mapa[i][j + 1] === '.' ? getPoint(fila, Math.floor((j + 1) / 2)) : null;
        const topPoint = i > 0 && mapa[i - 1][j] === '.' ? getPoint(Math.floor((i - 1) / 2), columna) : null;
        const bottomPoint = i < mapa.length - 1 && mapa[i + 1][j] === '.' ? getPoint(Math.floor((i + 1) / 2), columna) : null;

        // Agregar líneas según las conexiones detectadas
        if (leftPoint && rightPoint) {
          // Conexión horizontal
          lineas.push({ p1: leftPoint, p2: rightPoint, especial: true });
        }
        if (topPoint && bottomPoint) {
          // Conexión vertical
          lineas.push({ p1: topPoint, p2: bottomPoint, especial: true });
        }
        }
      }
    });
  });

  // Si no se alcanzan 32 líneas, se puede ajustar manualmente o revisar la entrada.
  if (lineas.length !== 32) {
    console.warn(`Se esperaban 32 líneas, pero se detectaron ${lineas.length}`);
  }

  return lineas;
};

function renderizarStage(stageData){
  lineas = parseMapToLines(stageData, puntos);
  // Redibuja todas las líneas 
  lineas.forEach(linea => 
    dibujarLinea(linea.p1, linea.p2)        
  );
  resaltarLineas();
}
function initializeHearts() {
  hearts = []; // Vaciar lista de corazones
  for (let i = 0; i < heartCount; i++) {
    hearts.push({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      speed: 1 + Math.random() * 2,
      size: 16 + Math.random() * 16,
    });
  }
}
// Función de animación
function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas
  redibujarPuntos(); 
  redibujarLineas();
  resaltarLineas(); 
  ctx.drawImage(sprite, spritePos.x, spritePos.y-10, 40, 40); 
  ctx.drawImage(unicorn, unicornioPos.x, unicornioPos.y, 40, 40);
  hearts.forEach((heart) => {
    // Dibujar cada corazón
    ctx.drawImage(
      heartImage,
      0, 0, 32, 32,
      heart.x, heart.y,
      heart.size, heart.size
    );

    // Actualizar posición
    heart.y -= heart.speed;

    // Reiniciar posición si sale de pantalla
    if (heart.y + heart.size < 0) {
      heart.y = canvas.height + Math.random() * 100;
      heart.x = Math.random() * canvas.width;
    }
  });

  // Continuar la animación
  animationId = requestAnimationFrame(animateHearts);
}
function inicializarCanvas(stage, spritePosX, spritePosY, unicornPosX, unicornPosY, totalFilas, totalColumnas){

    //Establecer total filas y total columnas
    filas = totalFilas;
    columnas = totalColumnas;
    // Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Quitar puentes
    puentes.clear();
    // Crear los puntos en el canvas
    if(puntos.length !== filas * columnas){
      puntos = [];
      crearPuntos();      
    }
    else{
      redibujarPuntos();
    }
   

    // Agregar algunas líneas al momento de cargar la página
    //agregarLineasDefecto();
    // Ubicar el sprite en una posición determinada
    colocarSpriteEnAreaCercana(spritePosX, spritePosY);
    colocarUnicornioAreaCercana(unicornPosX, unicornPosY);
    if(stage === 'stageZero'){
      renderizarStage(stageZero);
    }
    if(stage === 'stageOne'){
      renderizarStage(stageOne);
    }
    if(stage === 'stageTwo'){
      renderizarStage(stageTwo);
    }
    if(stage === 'stageThree'){
      renderizarStage(stageThree);
    }
    if(stage === 'stageFour'){
      renderizarStage(stageFour);
    }
    if(stage === 'stageFive'){
      renderizarStage(stageFive);
    }
    if(stage === 'stageSix'){
      renderizarStage(stageSix);
    }
    if(stage === 'stageSeven'){
      renderizarStage(stageSeven);
    }
}
    

    // Función para crear puntos en posiciones específicas
    function crearPuntos() {
      if(puntos.length == 0)
      {
        for (let fila = 0; fila < filas; fila++) {
          for (let columna = 0; columna < columnas; columna++) {
            const x = columna * separacion + 30;
            const y = fila * separacion + 30;
            puntos.push({ x, y, fila, columna });
            dibujarPunto(x, y);
          }
        }
      }
    }

    function redibujarPuntos(){
      puntos.forEach(punto => dibujarPunto(punto.x, punto.y));
    }
    // Función para dibujar un punto
    function dibujarPunto(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#3498db';
      ctx.fill();
      ctx.closePath();
    }
    function calcularPuntosAreaXY (x, y) {
      return puntos
        .map(punto => ({
          punto,
          distancia: Math.hypot(punto.x - x, punto.y - y),
        }))
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, 4) // Obtener los cuatro más cercanos
        .map(item => item.punto);
    }
    function calcularSpriteAreaXY (x, y) {
      const puntosCercanos = puntos
        .map(punto => ({
          punto,
          distancia: Math.hypot(punto.x - x, punto.y - y),
        }))
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, 4) // Obtener los cuatro más cercanos
        .map(item => item.punto);
        // Calcular el rectángulo delimitado por los puntos cercanos
        const xMin = Math.min(...puntosCercanos.map(p => p.x));
        const xMax = Math.max(...puntosCercanos.map(p => p.x));
        const yMin = Math.min(...puntosCercanos.map(p => p.y));
        const yMax = Math.max(...puntosCercanos.map(p => p.y));
        
        spriteArea = puntosCercanos; // Guardar área del sprite
        // Aquí dibuja el rectángulo delimitador
        ctx.beginPath();
        ctx.rect(xMin, yMin, xMax - xMin, yMax - yMin);
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)'; // Color del borde
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
       
    }
    
    function colocarUnicornioAreaCercana(x, y)
    {
      // Obtener los cuatro puntos más cercanos
      const puntosCercanos = puntos
        .map(punto => ({
          punto,
          distancia: Math.hypot(punto.x - x, punto.y - y),
        }))
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, 4) // Obtener los cuatro más cercanos
        .map(item => item.punto);

      // Calcular el rectángulo delimitado por los puntos cercanos
      const xMin = Math.min(...puntosCercanos.map(p => p.x));
      const xMax = Math.max(...puntosCercanos.map(p => p.x));
      const yMin = Math.min(...puntosCercanos.map(p => p.y));
      const yMax = Math.max(...puntosCercanos.map(p => p.y));

      // Colocar el sprite en el centro del rectángulo
      unicornioPos = {
        x: xMin + (xMax - xMin) / 2 - 15, // Ajuste para centrar el sprite
        y: yMin + (yMax - yMin) / 2 - 15,
        columna: parseInt((xMin + (xMax - xMin) / 2 - 15) / separacion, 10),
        fila: parseInt((yMin + (yMax - yMin) / 2 - 15) / separacion, 10),
      };
      unicornioAreaArea = puntosCercanos; // Guardar área del sprite
      
      ctx.drawImage(unicorn, unicornioPos.x, unicornioPos.y, 40, 40); // Dibujar el sprite
    }
    // Función para colocar un sprite en el área delimitada por los cuatro puntos más cercanos
    function colocarSpriteEnAreaCercana(x, y) {
      // Obtener los cuatro puntos más cercanos
      const puntosCercanos = puntos
        .map(punto => ({
          punto,
          distancia: Math.hypot(punto.x - x, punto.y - y),
        }))
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, 4) // Obtener los cuatro más cercanos
        .map(item => item.punto);

      // Calcular el rectángulo delimitado por los puntos cercanos
      const xMin = Math.min(...puntosCercanos.map(p => p.x));
      const xMax = Math.max(...puntosCercanos.map(p => p.x));
      const yMin = Math.min(...puntosCercanos.map(p => p.y));
      const yMax = Math.max(...puntosCercanos.map(p => p.y));

      // Aquí dibuja el rectángulo delimitador
      // ctx.beginPath();
      // ctx.rect(xMin, yMin, xMax - xMin, yMax - yMin);
      // ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)'; // Color del borde
      // ctx.lineWidth = 2;
      // ctx.stroke();
      // ctx.closePath();

      // Colocar el sprite en el centro del rectángulo
      spritePos = {
        x: xMin + (xMax - xMin) / 2 - 15, // Ajuste para centrar el sprite
        y: yMin + (yMax - yMin) / 2 - 15,
        columna: parseInt((xMin + (xMax - xMin) / 2 - 15) / separacion, 10),
        fila: parseInt((yMin + (yMax - yMin) / 2 - 15) / separacion, 10),
      };
      spriteArea = puntosCercanos; // Guardar área del sprite
      //console.log("Ubicando sprite x: " + spritePos.x + ' y: ' + spritePos.y);
      // Dibujar el sprite en la nueva posición
      ctx.drawImage(sprite, spritePos.x, spritePos.y, 40, 40); // Dibujar el sprite
    }

    // Función para mover el sprite
    function moverSprite(direccion) {
      if (spritePos) {
        calcularSpriteAreaXY(spritePos.x, spritePos.y);
        const currentArea = spriteArea;
        
        console.log("Current area: " 
          + currentArea[0].x + "|" + currentArea[0].y +".  "
          + currentArea[1].x + "|" + currentArea[1].y +".  "
          + currentArea[2].x + "|" + currentArea[2].y +".  "
          + currentArea[3].x + "|" + currentArea[3].y +".  "
          );
        var lineasDetectadas = detectarLineasCurrentArea(lineas, currentArea);
        console.log("La posición actual tiene una línea? " + lineasDetectadas.length);
        console.log(lineasDetectadas);
        console.info("Si entra a puente: " + siEntraPuente);
        console.info("Si pasa bajo puente: " + siBajaPuente);
        console.info("Coordenada de puentes: " + puentes);
        // Mover el sprite en la dirección deseada        
        if (direccion === 'up' && spritePos.fila > 0 
          && !lineasDetectadas.some(x => x.orientacion === direccion && !x.especial)
          && !FORBIDDEN_MOVES.has(direccion)) {
          if(lineasDetectadas.some(x => x.orientacion === direccion && x.especial))
          {
            if(!siEntraPuente){
              //entra al puente
              FORBIDDEN_MOVES.add('left');
              FORBIDDEN_MOVES.add('right');  
              siEntraPuente = true;  
            }  
            else {
              //sale al puente
              FORBIDDEN_MOVES.clear();
              siEntraPuente = false;
            }     
          }
          //Calcular para cuándo pase debajo del puente
          //Calcular puntos del área a la cuál se va a desplazar
          let puntosAreaFutura = calcularPuntosAreaXY(spritePos.x, spritePos.y - separacion);
          for(const puente of puentes)
          {            
            if(sonIguales(JSON.parse(puente[1].ubicacion), puntosAreaFutura))
            {
              FORBIDDEN_MOVES.add('left');
              FORBIDDEN_MOVES.add('right');
              var coincidencias = encontrarCoincidencias(currentArea, puntosAreaFutura);
              //Con el par de puntos coincidentes, verificar si no es una línea especial
              var lineasCoincidentes = encontrarLineasCoincidentes(coincidencias, lineas);
              siBajaPuente = lineasCoincidentes.length === 0 || puente[1].orientacion === "horizontal";; 
              break;             
            }
            FORBIDDEN_MOVES.clear();
            siBajaPuente = false;
          }
          spritePos.y -= separacion; // Mover hacia arriba
          spritePos.fila--;
        } else if (direccion === 'down' && spritePos.fila < filas - 2 
          && !lineasDetectadas.some(x => x.orientacion === direccion && !x.especial)
          && !FORBIDDEN_MOVES.has(direccion)) {
          if(lineasDetectadas.some(x => x.orientacion === direccion && x.especial))
          {
            if(!siEntraPuente){
              //entra al puente
              FORBIDDEN_MOVES.add('left');
              FORBIDDEN_MOVES.add('right');  
              siEntraPuente = true;  
            }  
            else {
              //sale al puente
              FORBIDDEN_MOVES.clear();
              siEntraPuente = false;
            }                
          }
          //Calcular para cuándo pase debajo del puente
          //Calcular puntos del área a la cuál se va a desplazar
          let puntosAreaFutura = calcularPuntosAreaXY(spritePos.x, spritePos.y + separacion);
          for(const puente of puentes)
          {            
            if(sonIguales(JSON.parse(puente[1].ubicacion), puntosAreaFutura))
            {
              FORBIDDEN_MOVES.add('left');
              FORBIDDEN_MOVES.add('right');
              var coincidencias = encontrarCoincidencias(currentArea, puntosAreaFutura);
              //Con el par de puntos coincidentes, verificar si no es una línea especial
              var lineasCoincidentes = encontrarLineasCoincidentes(coincidencias, lineas);
              siBajaPuente = lineasCoincidentes.length === 0 || puente[1].orientacion === "horizontal";; 
              
              break;             
            }
            FORBIDDEN_MOVES.clear();
            siBajaPuente = false;
          }
          spritePos.y += separacion; // Mover hacia abajo
          spritePos.fila++;        
        } else if (direccion === 'left' && spritePos.columna > 0 
          && !lineasDetectadas.some(x => x.orientacion === direccion && !x.especial)
          && !FORBIDDEN_MOVES.has(direccion)) {
          if(lineasDetectadas.some(x => x.orientacion === direccion && x.especial))
          {
            if(!siEntraPuente){
              //entra al puente
              FORBIDDEN_MOVES.add('up');
              FORBIDDEN_MOVES.add('down');  
              siEntraPuente = true;  
            }  
            else {
              //sale al puente
              FORBIDDEN_MOVES.clear();
              siEntraPuente = false;
            }         
          }
          //Calcular para cuándo pase debajo del puente
          //Calcular puntos del área a la cuál se va a desplazar
          let puntosAreaFutura = calcularPuntosAreaXY(spritePos.x - separacion, spritePos.y);
          for(const puente of puentes)
          {            
            if(sonIguales(JSON.parse(puente[1].ubicacion), puntosAreaFutura))
            {
              FORBIDDEN_MOVES.add('up');
              FORBIDDEN_MOVES.add('down');
              var coincidencias = encontrarCoincidencias(currentArea, puntosAreaFutura);
              //Con el par de puntos coincidentes, verificar si no es una línea especial
              var lineasCoincidentes = encontrarLineasCoincidentes(coincidencias, lineas);
              siBajaPuente = lineasCoincidentes.length === 0 || puente[1].orientacion === "vertical";; 
              
              break;             
            }
            FORBIDDEN_MOVES.clear();
            siBajaPuente = false;
          }
          spritePos.x -= separacion; // Mover hacia la izquierda
          spritePos.columna--;  
        } else if (direccion === 'right' && spritePos.columna < columnas - 2 
          && !lineasDetectadas.some(x => x.orientacion === direccion && !x.especial)
          && !FORBIDDEN_MOVES.has(direccion)) {
          //Calcular para cuándo pase sobre el puente
          if(lineasDetectadas.some(x => x.orientacion === direccion && x.especial))
          {
            if(!siEntraPuente){
              //entra al puente
              FORBIDDEN_MOVES.add('up');
              FORBIDDEN_MOVES.add('down');  
              siEntraPuente = true;  
            }  
            else {
              //sale al puente
              FORBIDDEN_MOVES.clear();
              siEntraPuente = false;
            }            
          }
          //Calcular para cuándo pase debajo del puente
          //Calcular puntos del área a la cuál se va a desplazar
          let puntosAreaFutura = calcularPuntosAreaXY(spritePos.x + separacion, spritePos.y);
          for(const puente of puentes)
          {            
            if(sonIguales(JSON.parse(puente[1].ubicacion), puntosAreaFutura))
            {
              FORBIDDEN_MOVES.add('up');
              FORBIDDEN_MOVES.add('down');
              var coincidencias = encontrarCoincidencias(currentArea, puntosAreaFutura);
              //Con el par de puntos coincidentes, verificar si no es una línea especial
              var lineasCoincidentes = encontrarLineasCoincidentes(coincidencias, lineas);
              siBajaPuente = lineasCoincidentes.length === 0 || puente[1].orientacion === "vertical"; 
               
              break;             
            }
            FORBIDDEN_MOVES.clear();
            siBajaPuente = false;
          }
          spritePos.x += separacion; // Mover hacia la derecha
          spritePos.columna++;
        }
        console.log("Final move sprite x: " + spritePos.x + ' y: ' + spritePos.y + " Fila: " + spritePos.fila + " Columna: " + spritePos.columna);
        // Redibujar el canvas y el sprite en la nueva posición
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
        redibujarPuntos(); // Redibujar los puntos
        redibujarLineas();
        if(siBajaPuente){
          
          ctx.drawImage(sprite, spritePos.x, spritePos.y, 40, 40); // Dibujar el sprite en la nueva posición          
          ctx.drawImage(unicorn, unicornioPos.x, unicornioPos.y, 40, 40); 
          resaltarLineas();     
        }
        else {  
          resaltarLineas(); 
          ctx.drawImage(sprite, spritePos.x, spritePos.y-10, 40, 40); 
          ctx.drawImage(unicorn, unicornioPos.x, unicornioPos.y, 40, 40);
        }
        if(spritePos.columna === unicornioPos.columna && spritePos.fila === unicornioPos.fila)
        {
          if (!animationId) {
            initializeHearts(); // Recrear corazones
            animateHearts(); // Iniciar animación
          }
        }    
        else{
          if (animationId !== undefined && animationId !== null) {
            cancelAnimationFrame(animationId); // Detener animación
            animationId = null; // Reiniciar estado
        
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas
            redibujarPuntos(); 
            redibujarLineas();
            resaltarLineas(); 
            ctx.drawImage(sprite, spritePos.x, spritePos.y-10, 40, 40); 
            ctx.drawImage(unicorn, unicornioPos.x, unicornioPos.y, 40, 40);
            hearts = []; // Eliminar corazones
          }
        }    
      }
    }

    function encontrarCoincidencias(arr1, arr2) {
      // Filtra los elementos en arr1 que tengan coincidencias en arr2
      return arr1.filter(item1 =>
        arr2.some(item2 => item1.x === item2.x && item1.y === item2.y)
      );
    }

    function encontrarLineasCoincidentes(puntos, lineas) {
      return lineas.filter(linea =>
        linea.especial && 
        puntos.some(punto1 =>
          puntos.some(punto2 =>
            (
              (punto1.x === linea.p1.x && punto1.y === linea.p1.y &&
               punto2.x === linea.p2.x && punto2.y === linea.p2.y) ||
              (punto1.x === linea.p2.x && punto1.y === linea.p2.y &&
               punto2.x === linea.p1.x && punto2.y === linea.p1.y)
            )
          )
        )
      );
    }

    function sonIguales(array1, array2) {
      // Si la longitud de los arreglos es diferente, no son iguales
      if (array1.length !== array2.length) {
        return false;
      }
    
      // Creamos una función para comparar sólo `x` e `y` de los objetos
      function comparador(objA, objB) {
        return objA.x === objB.x && objA.y === objB.y;
      }
    
      // Validamos que cada objeto en array1 tenga su equivalente en array2
      return array1.every(obj1 =>
        array2.some(obj2 => comparador(obj1, obj2))
      );
    }

    function detectarLineasCurrentArea(arregloPrincipal, objetoFiltro) {
      var lineasDetectadas = arregloPrincipal.filter(obj => {
        // Verifica si `p1` coincide con algún objeto en `objetoFiltro`
        const p1Coincide = objetoFiltro.some(filtroObj =>
          filtroObj.x === obj.p1.x &&
          filtroObj.y === obj.p1.y 
        );    
        // Verifica si `p2` coincide con algún objeto en `objetoFiltro`
        const p2Coincide = objetoFiltro.some(filtroObj =>
          filtroObj.x === obj.p2.x &&
          filtroObj.y === obj.p2.y 
        );    
        // Solo incluye el objeto si ambos, `p1` y `p2`, coinciden con algún objeto en `objetoFiltro`
        return p1Coincide && p2Coincide;
      });
      //Detectar que orientación del objetoFiltro (CurrentArea) son las líneas detectadas.
      lineasDetectadas.forEach(linea => {
        if(linea.p1.fila === linea.p2.fila && linea.p1.fila < Math.max(objetoFiltro[0].fila,objetoFiltro[1].fila,objetoFiltro[2].fila,objetoFiltro[3].fila))
        {
          linea.orientacion = "up";
        }
        if(linea.p1.fila === linea.p2.fila && linea.p1.fila === Math.max(objetoFiltro[0].fila,objetoFiltro[1].fila,objetoFiltro[2].fila,objetoFiltro[3].fila))
        {
          linea.orientacion = "down";
        }
        if(linea.p1.columna === linea.p2.columna && linea.p1.columna < Math.max(objetoFiltro[0].columna,objetoFiltro[1].columna,objetoFiltro[2].columna,objetoFiltro[3].columna))
        {
          linea.orientacion = "left";
        }
        if(linea.p1.columna === linea.p2.columna && linea.p1.columna === Math.max(objetoFiltro[0].columna,objetoFiltro[1].columna,objetoFiltro[2].columna,objetoFiltro[3].columna))
        {
          linea.orientacion = "right";
        }
      });
      return lineasDetectadas;
    }
    // Función para agregar una línea entre dos puntos
    function agregarLinea(punto1, punto2) {
      if(punto1.fila === punto2.fila)
      {
        //Se trata de una línea horizontal izquierda a derecha.
        if(punto1.columna < punto2.columna)
        {
          let offsetColumna = punto1.columna;
          for(let i = punto1.x; i < punto2.x; i = i + separacion)
          {
            const puntoX = {x: i, y: punto1.y, fila:punto1.fila, columna: offsetColumna };
            offsetColumna = offsetColumna + 1;
            const puntoY = {x: i + separacion, y: punto1.y, fila:punto1.fila, columna: offsetColumna };
            lineas.push({ p1: puntoX, p2: puntoY });
            dibujarLinea(puntoX, puntoY);
          }
        }
        //Se trata de una línea horizontal derecha a izquierda.
        if(punto2.columna < punto1.columna)
        {
          let offsetColumna = punto2.columna;
          for(let i = punto2.x; i < punto1.x; i = i + separacion)
          {
            const puntoX = {x: i, y: punto2.y, fila:punto2.fila, columna: offsetColumna };
            offsetColumna = offsetColumna + 1;
            const puntoY = {x: i + separacion, y: punto2.y, fila:punto2.fila, columna: offsetColumna };
            lineas.push({ p1: puntoX, p2: puntoY });
            dibujarLinea(puntoX, puntoY);
          }
        }
      }
      if(punto1.columna === punto2.columna)
      {       
        //Se trata de una línea vertical arriba hacia abajo
        if(punto1.fila < punto2.fila)
        {
          let offsetFila = punto1.fila;
          for(let i = punto1.y; i < punto2.y; i = i + separacion)
          {
            const puntoX = {x: punto1.x, y: i, fila:offsetFila, columna:  punto1.columna };
            offsetFila = offsetFila + 1;
            const puntoY = {x: punto1.x, y: i + separacion, fila:offsetFila, columna: punto1.columna };
            lineas.push({ p1: puntoX, p2: puntoY });
            dibujarLinea(puntoX, puntoY);
          }
        }
        //Se trata de una línea vertical arriba hacia abajo
        if(punto2.fila < punto1.fila)
        {
          let offsetFila = punto2.fila;
          for(let i = punto2.y; i < punto1.y; i = i + separacion)
          {
            const puntoX = {x: punto2.x, y: i, fila:offsetFila, columna:  punto2.columna };
            offsetFila = offsetFila + 1;
            const puntoY = {x: punto2.x, y: i + separacion, fila:offsetFila, columna: punto2.columna };
            lineas.push({ p1: puntoX, p2: puntoY });
            dibujarLinea(puntoX, puntoY);
          }
        }
      }       
    }

    // Función para eliminar una línea entre dos puntos
    function eliminarLinea(punto1, punto2) {
      // Filtrar la línea que queremos eliminar del array de líneas
      const nuevasLineas = lineas.filter(linea => 
        !(compararPuntos(linea.p1, punto1) && compararPuntos(linea.p2, punto2)) &&
        !(compararPuntos(linea.p1, punto2) && compararPuntos(linea.p2, punto1))
      );
      lineas.length = 0;
      puentes.clear();
      lineas.push(...nuevasLineas);
      redibujarCanvas();
    }

    // Función para dibujar una línea entre dos puntos
    function dibujarLinea(punto1, punto2) {
      ctx.beginPath();
      ctx.moveTo(punto1.x, punto1.y);
      ctx.lineTo(punto2.x, punto2.y);
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    }

    // Función para redibujar el canvas completo
    function redibujarCanvas() {
      // Limpia el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redibuja todos los puntos
      puntos.forEach(punto => dibujarPunto(punto.x, punto.y));

      //Poner Sprite
      ctx.drawImage(sprite, spritePos.x, spritePos.y, 40, 40);
      // Redibuja todas las líneas restantes
      lineas.forEach(linea => 
        dibujarLinea(linea.p1, linea.p2)        
      );
      resaltarLineas();
    }
    // Agrega ciertas líneas por defecto
    function agregarLineasDefecto()
    {
      agregarLinea({x: 30, y: 30, fila: 0, columna: 0}, {x: 90, y: 30, fila: 0, columna: 1});
      agregarLinea({x: 150, y: 30, fila: 0, columna: 2}, {x: 90, y: 30, fila: 0, columna: 1});
    }
    function redibujarLineas() {
      
      // Redibuja todas las líneas restantes
      lineas.forEach(linea => dibujarLinea(linea.p1, linea.p2));
      
    }
    function resaltarLineas(){
      var lineasResaltadas = lineas.filter(linea => 
      linea.especial === true);
      lineasResaltadas.forEach(linea => resaltarLinea(linea.p1, linea.p2));
    }
    // Función para manejar eventos de teclado
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':          
          moverSprite('up');
          break;
        case 'ArrowDown':         
          moverSprite('down');
          break;
        case 'ArrowLeft':          
          moverSprite('left');
          break;
        case 'ArrowRight':          
          moverSprite('right');
          break;
      }
    });

    function compararPuntos (puntoA, puntoB) {
      return puntoA.x === puntoB.x &&
      puntoA.y === puntoB.y &&
      puntoA.fila === puntoB.fila &&
      puntoA.columna === puntoB.columna;
    }
    // Función para manejar la selección de puntos y dibujar/eliminar líneas
    function seleccionarPunto(punto) {
      if (!primerPunto) {
        primerPunto = punto;
        resaltarPunto(punto, '#e74c3c');
      } else {
        if (estanEnLinea(primerPunto, punto)) {         
          const lineaExiste = lineas.some(linea => 
            (compararPuntos(linea.p1, primerPunto) && compararPuntos(linea.p2, punto)) ||
            (compararPuntos(linea.p1, punto) && compararPuntos(linea.p2, primerPunto))
          );

          if (lineaExiste) {
            eliminarLinea(primerPunto, punto);
          } else {
            agregarLinea(primerPunto, punto);
          }
        }
        resaltarPunto(primerPunto, '#3498db');
        primerPunto = null;
      }
    }
    
    // Función para resaltar un punto
    function resaltarPunto(punto, color) {
      ctx.beginPath();
      ctx.arc(punto.x, punto.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }

    function seleccionarLinea (linea){
      if(linea.especial){
        linea.especial = false;
        noResaltarLinea(linea.p1, linea.p2);
      }
      else{ 
        linea.especial = true;
        resaltarLinea(linea.p1, linea.p2);
      }
    }
    function noResaltarLinea(punto1, punto2) {
      ctx.beginPath();
      ctx.moveTo(punto1.x, punto1.y);
      ctx.lineTo(punto2.x, punto2.y);
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    }
    function resaltarLinea(punto1, punto2) {
      ctx.beginPath();
      ctx.moveTo(punto1.x, punto1.y);
      ctx.lineTo(punto2.x, punto2.y);
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
      //Detectar si hay otra línea resaltada para que se pueda crear el puente.
      //Si los dos puntos forman una línea
      if(punto1.fila === punto2.fila)
      {
        //detectar si hay una línea especial en la fila anterior para la posición
        //detectar si hay una línea especial en la fila posterior para la posición
        var lineasFiltradas = lineas.filter(x => 
          (x.p1.fila === punto1.fila - 1 || x.p1.fila === punto1.fila + 1) &&
          x.p1.columna === punto1.columna &&
          x.p2.columna === punto2.columna &&
          x.especial
        );
        if(lineasFiltradas.length > 0)
        {
          lineasFiltradas.forEach(function(linea) { 
            //almacenar área circundante por cada linea filtrada.. TO FO
            /*ctx.beginPath();
            ctx.rect(punto1.x, punto1.y, linea.p2.x - punto1.x, linea.p2.y - punto1.y);
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)'; // Color del borde            
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.closePath();*/
            let puntos = [
              { x: punto1.x, y: punto1.y },
              { x: punto2.x, y: punto2.y },
              { x: linea.p1.x, y: linea.p1.y },
              { x: linea.p2.x, y: linea.p2.y }
            ];
            let clave = crearClavePuntos(puntos);
            const identificador = `${clave}|vertical`;
            if (!puentes.has(identificador)) {
              // Si no existe, agregar la clave al Set
              puentes.set(identificador, {
                ubicacion: clave,
                orientacion: "vertical"
              });
            }
            ctx.drawImage(bridgeSpriteRotated, 
              Math.min(punto1.x,punto2.x,linea.p1.x,linea.p2.x), 
              Math.min(punto1.y,punto2.y,linea.p1.y,linea.p2.y), 60, 60);
          });
        }
      }
      //Detectar si hay otra línea resaltada para que se pueda crear el puente.
      //Si los dos puntos forman una columna
      if(punto1.columna === punto2.columna)
        {
          //detectar si hay una línea especial en la columna anterior para la posición
          //detectar si hay una línea especial en la columna posterior para la posición
          var lineasFiltradas = lineas.filter(x => 
            (x.p1.columna === punto1.columna - 1 || x.p1.columna === punto1.columna + 1) &&
            x.p1.fila === punto1.fila &&
            x.p2.fila === punto2.fila &&
            x.especial
          );
          if(lineasFiltradas.length > 0)
          {
            lineasFiltradas.forEach(function(linea) { 
              //almacenar área circundante por cada linea filtrada.. TO FO
              /*ctx.beginPath();
              ctx.rect(punto1.x, punto1.y, linea.p2.x - punto1.x, linea.p2.y - punto1.y);
              ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)'; // Color del borde            
              ctx.lineWidth = 5;
              ctx.stroke();
              ctx.closePath();*/
              let puntos = [
                { x: punto1.x, y: punto1.y },
                { x: punto2.x, y: punto2.y },
                { x: linea.p1.x, y: linea.p1.y },
                { x: linea.p2.x, y: linea.p2.y }
              ];
              let clave = crearClavePuntos(puntos);
              const identificador = `${clave}|horizontal`;
              if (!puentes.has(identificador)) {
                // Si no existe, agregar la clave al Set
                puentes.set(identificador, {
                  ubicacion: clave,
                  orientacion: "horizontal"
                });
              }
              ctx.drawImage(bridgeSprite, 
                Math.min(punto1.x,punto2.x,linea.p1.x,linea.p2.x), 
                Math.min(punto1.y,punto2.y,linea.p1.y,linea.p2.y), 60, 60);
            });
          }
        }
    }
    function crearClavePuntos(puntos) {
      // Ordena los puntos en el array de manera consistente
      puntos.sort((a, b) => a.x - b.x || a.y - b.y);
      
      // Convierte el array ordenado a una cadena JSON
      return JSON.stringify(puntos);
    }
    // Función para verificar si dos puntos están en la misma fila o columna
    function estanEnLinea(punto1, punto2) {
      return punto1.fila === punto2.fila || punto1.columna === punto2.columna;
    }

    function distanciaPuntoALinea(px, py, linea) {
      const { x: x1, y: y1 } = linea.p1;
      const { x: x2, y: y2 } = linea.p2;
    
      const dx = x2 - x1;
      const dy = y2 - y1;
    
      const longitudCuadrado = dx * dx + dy * dy;
      let t = ((px - x1) * dx + (py - y1) * dy) / longitudCuadrado;
    
      // Limita t al rango [0, 1] para que quede dentro del segmento
      t = Math.max(0, Math.min(1, t));
    
      // Encuentra el punto más cercano en el segmento
      const cercanoX = x1 + t * dx;
      const cercanoY = y1 + t * dy;
    
      // Calcula la distancia desde el punto del clic hasta el punto más cercano
      return Math.hypot(px - cercanoX, py - cercanoY);
    }
    function distanciaPuntoAPunto(px, py, qx, qy) {
      return Math.hypot(px - qx, py - qy);
    }
    
    function puntoMedio(linea) {
      const medioX = (linea.p1.x + linea.p2.x) / 2;
      const medioY = (linea.p1.y + linea.p2.y) / 2;
      return { x: medioX, y: medioY };
    }
    // Función para manejar clics en el canvas
    canvas.addEventListener('click', (event) => {
      const umbral = 5; // Máxima distancia permitida en píxeles
      const { offsetX, offsetY } = event;
      const puntoCercano = puntos.find(punto => 
        Math.hypot(punto.x - offsetX, punto.y - offsetY) < 10
      );
      const lineaCercana = lineas.reduce((lineaMasCercana, lineaActual) => {
        const { x: medioX, y: medioY } = puntoMedio(lineaActual);
        const distanciaActual = distanciaPuntoAPunto(offsetX, offsetY, medioX, medioY);
        
        if (distanciaActual <= umbral && distanciaActual < lineaMasCercana.distancia) {
          return { linea: lineaActual, distancia: distanciaActual };
        }
        return lineaMasCercana;
      }, { linea: null, distancia: Infinity });
      if (puntoCercano) seleccionarPunto(puntoCercano);
      if (lineaCercana.linea) {
        //console.log("Línea más cercana:", lineaCercana.linea);
        seleccionarLinea(lineaCercana.linea);
      } else {
        //console.log("No hay una línea cercana dentro del umbral de distancia.");
      }
    });
    
  
 