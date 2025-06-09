const stageMaps = {
  stageZero: [
    { tipo: 'linea', p1: { fila: 1, columna: 1 }, p2: { fila: 1, columna: 2 } },
    { tipo: 'linea', p1: { fila: 2, columna: 2 }, p2: { fila: 3, columna: 2 } },
    { tipo: 'puente', p1: { fila: 4, columna: 4 }, p2: { fila: 4, columna: 5 }, orientacion: 'horizontal' }
  ],
  stageOne: [
    { tipo: 'linea', p1: { fila: 0, columna: 0 }, p2: { fila: 0, columna: 1 } },
    { tipo: 'puente', p1: { fila: 5, columna: 3 }, p2: { fila: 6, columna: 3 }, orientacion: 'vertical' }
  ]
};

export function renderizarStagePorNombre(nombreStage, puntos) {
  const mapa = stageMaps[nombreStage];
  if (!mapa) return;

  mapa.forEach(config => {
    const canvas = document.getElementById('miCanvas');
    const ctx = canvas.getContext('2d');

    const p1 = puntos.find(p => p.fila === config.p1.fila && p.columna === config.p1.columna);
    const p2 = puntos.find(p => p.fila === config.p2.fila && p.columna === config.p2.columna);

    if (!p1 || !p2) return;

    if (config.tipo === 'linea') {
      import('./lineManager.js').then(({ dibujarLinea, agregarLinea }) => {
        dibujarLinea(ctx, p1, p2);
        agregarLinea(p1, p2);
      });
    } else if (config.tipo === 'puente') {
      import('./bridgeManager.js').then(({ dibujarPuente, registrarPuente }) => {
        const puenteImg = document.getElementById('puenteImg');
        dibujarPuente(ctx, [p1, p2], config.orientacion, puenteImg);
        registrarPuente([p1, p2], config.orientacion);
      });
    }
  });
}