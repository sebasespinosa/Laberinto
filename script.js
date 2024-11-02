document.addEventListener("DOMContentLoaded", () =>{
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

    // Función para crear puntos en posiciones específicas
    function crearPuntos() {
      for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
          const x = columna * separacion + 30;
          const y = fila * separacion + 30;
          puntos.push({ x, y, fila, columna });
          dibujarPunto(x, y);
        }
      }
    }

    // Función para dibujar un punto
    function dibujarPunto(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#3498db';
      ctx.fill();
      ctx.closePath();
    }

    // Función para manejar clics en el canvas
    canvas.addEventListener('click', (event) => {
      const { offsetX, offsetY } = event;
      colocarSpriteEnAreaCercana(offsetX, offsetY);
    });

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

      // Dibuja el rectángulo delimitador
      ctx.beginPath();
      ctx.rect(xMin, yMin, xMax - xMin, yMax - yMin);
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)'; // Color del borde
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      // Colocar el sprite en el centro del rectángulo
      spritePos = {
        x: xMin + (xMax - xMin) / 2 - 15, // Ajuste para centrar el sprite
        y: yMin + (yMax - yMin) / 2 - 15,
        columna: parseInt((xMin + (xMax - xMin) / 2 - 15) / separacion, 10),
        fila: parseInt((yMin + (yMax - yMin) / 2 - 15) / separacion, 10),
      };
      spriteArea = puntosCercanos; // Guardar área del sprite
      console.log("Ubicando sprite x: " + spritePos.x + ' y: ' + spritePos.y);
      // Dibujar el sprite en la nueva posición
      ctx.drawImage(sprite, spritePos.x, spritePos.y, 30, 30); // Dibujar el sprite
    }

    // Función para mover el sprite
    function moverSprite(direccion) {
      if (spritePos) {
        const currentArea = spriteArea;
        console.log("Init move sprite x: " + spritePos.x + ' y: ' + spritePos.y + " Fila: " + spritePos.fila + " Columna: " + spritePos.columna);
        // Obtener índices de los puntos en el área actual
        const xIndex = currentArea.findIndex(p => p.x === currentArea[0].x);
        const yIndex = currentArea.findIndex(p => p.y === currentArea[0].y);
        console.log("filas: " + filas + ". columna: " + columnas);
        // Mover el sprite en la dirección deseada
        
        if (direccion === 'up' && spritePos.fila > 0) {
          spritePos.y -= separacion; // Mover hacia arriba
          spritePos.fila--;
        } else if (direccion === 'down' && spritePos.fila < filas - 2) {
          spritePos.y += separacion; // Mover hacia abajo
          spritePos.fila++;        
        } else if (direccion === 'left' && spritePos.columna > 0) {
          spritePos.x -= separacion; // Mover hacia la izquierda
          spritePos.columna--;
        } else if (direccion === 'right' && spritePos.columna < columnas - 2) {
          spritePos.x += separacion; // Mover hacia la derecha
          spritePos.columna++;
        }
        console.log("Final move sprite x: " + spritePos.x + ' y: ' + spritePos.y + " Fila: " + spritePos.fila + " Columna: " + spritePos.columna);
        // Redibujar el canvas y el sprite en la nueva posición
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
        crearPuntos(); // Redibujar los puntos
        ctx.drawImage(sprite, spritePos.x, spritePos.y, 30, 30); // Dibujar el sprite en la nueva posición
        redibujarLineas();
      }
    }

    // Función para agregar una línea entre dos puntos
    function agregarLinea(punto1, punto2) {
      lineas.push({ p1: punto1, p2: punto2 });
      dibujarLinea(punto1, punto2);
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

    // Crear los puntos en el canvas
    crearPuntos();
    agregarLineasDefecto();
});