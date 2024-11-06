const canvas = document.getElementById('miCanvas');
const ctx = canvas.getContext('2d');
const puntos = [];
const lineas = [];
const filas = 5;
const columnas = 10;
const separacion = 60;
const sprite = new Image(); // Objeto de imagen para el sprite
sprite.src = 'sprite.png'; // URL de un sprite de ejemplo
let spritePos = null; // Posición actual del sprite
let spriteArea = null; // Área delimitada por los cuatro puntos cercanos
let primerPunto = null;
function inicializarCanvas(){

    // Crear los puntos en el canvas
    crearPuntos();
    // Agregar algunas líneas al momento de cargar la página
    //agregarLineasDefecto();
    // Ubicar el sprite en una posición determinada
    colocarSpriteEnAreaCercana(71, 59);
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
      ctx.drawImage(sprite, spritePos.x, spritePos.y, 30, 30); // Dibujar el sprite
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
        
        // Mover el sprite en la dirección deseada        
        if (direccion === 'up' && spritePos.fila > 0 && !lineasDetectadas.some(x => x.orientacion === direccion)) {
          spritePos.y -= separacion; // Mover hacia arriba
          spritePos.fila--;
        } else if (direccion === 'down' && spritePos.fila < filas - 2 && !lineasDetectadas.some(x => x.orientacion === direccion)) {
          spritePos.y += separacion; // Mover hacia abajo
          spritePos.fila++;        
        } else if (direccion === 'left' && spritePos.columna > 0 && !lineasDetectadas.some(x => x.orientacion === direccion)) {
          spritePos.x -= separacion; // Mover hacia la izquierda
          spritePos.columna--;
        } else if (direccion === 'right' && spritePos.columna < columnas - 2 && !lineasDetectadas.some(x => x.orientacion === direccion)) {
          spritePos.x += separacion; // Mover hacia la derecha
          spritePos.columna++;
        }
        console.log("Final move sprite x: " + spritePos.x + ' y: ' + spritePos.y + " Fila: " + spritePos.fila + " Columna: " + spritePos.columna);
        // Redibujar el canvas y el sprite en la nueva posición
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
        redibujarPuntos(); // Redibujar los puntos
        ctx.drawImage(sprite, spritePos.x, spritePos.y, 30, 30); // Dibujar el sprite en la nueva posición
        redibujarLineas();
      }
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
      ctx.drawImage(sprite, spritePos.x, spritePos.y, 30, 30);
      // Redibuja todas las líneas restantes
      lineas.forEach(linea => dibujarLinea(linea.p1, linea.p2));
      console.log(lineas);
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

    // Función para verificar si dos puntos están en la misma fila o columna
    function estanEnLinea(punto1, punto2) {
      return punto1.fila === punto2.fila || punto1.columna === punto2.columna;
    }

    // Función para manejar clics en el canvas
    canvas.addEventListener('click', (event) => {
      const { offsetX, offsetY } = event;
      const puntoCercano = puntos.find(punto => 
        Math.hypot(punto.x - offsetX, punto.y - offsetY) < 10
      );
      if (puntoCercano) seleccionarPunto(puntoCercano);
    });
    
  
 