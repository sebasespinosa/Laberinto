// Controles de dirección en pantalla (ui/dpad.js) con un DOM mínimo falso.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearControlesDireccion } from '../src/ui/dpad.js';
import { REPETICION } from '../src/config.js';

class Elemento {
  constructor(etiqueta) {
    this.etiqueta = etiqueta;
    this.hijos = [];
    this.atributos = {};
    this.dataset = {};
    this.listeners = {};
  }
  appendChild(hijo) {
    this.hijos.push(hijo);
    return hijo;
  }
  setAttribute(nombre, valor) {
    this.atributos[nombre] = valor;
  }
  addEventListener(tipo, fn) {
    (this.listeners[tipo] ??= []).push(fn);
  }
  // Simula un evento del navegador
  emitir(tipo, evento = {}) {
    const e = { preventDefault() {}, ...evento };
    (this.listeners[tipo] ?? []).forEach((fn) => fn(e));
  }
}

function montar(opciones = {}) {
  globalThis.document = {
    createElement: (etiqueta) => new Elemento(etiqueta),
    createTextNode: (texto) => ({ texto }),
  };
  const contenedor = new Elemento('div');
  const llamadas = [];
  crearControlesDireccion(contenedor, (d) => llamadas.push(d), {
    almacen: null,
    esTactil: () => false,
    ...opciones,
  });
  delete globalThis.document;

  const [interruptor, cruz] = contenedor.hijos;
  const casilla = interruptor.hijos[0];
  const botones = Object.fromEntries(cruz.hijos.map((b) => [b.className.replace('dpad-', ''), b]));
  return { contenedor, llamadas, casilla, botones, cruz };
}

const almacenFalso = (inicial = {}) => {
  const datos = { ...inicial };
  return {
    datos,
    getItem: (k) => datos[k] ?? null,
    setItem: (k, v) => {
      datos[k] = v;
    },
  };
};

test('crea cuatro botones accesibles, uno por dirección', () => {
  const { botones, cruz } = montar();
  assert.equal(cruz.hijos.length, 4);
  assert.deepEqual(Object.keys(botones).sort(), ['down', 'left', 'right', 'up']);
  for (const boton of cruz.hijos) {
    assert.equal(boton.type, 'button');
    assert.match(boton.atributos['aria-label'], /^Mover /);
  }
  assert.equal(botones.up.textContent, '▲');
});

test('pulsar un botón mueve una vez; el click del puntero no duplica el movimiento', () => {
  const { botones, llamadas } = montar();
  botones.left.emitir('pointerdown', { button: 0, pointerId: 1 });
  botones.left.emitir('pointerup');
  botones.left.emitir('click', { detail: 1 }); // click generado tras el toque: se ignora
  assert.deepEqual(llamadas, ['left']);
});

test('el teclado (Enter/Espacio sobre el botón) también funciona', () => {
  const { botones, llamadas } = montar();
  botones.down.emitir('click', { detail: 0 });
  assert.deepEqual(llamadas, ['down']);
});

test('otros botones del ratón no mueven', () => {
  const { botones, llamadas } = montar();
  botones.up.emitir('pointerdown', { button: 2 });
  assert.deepEqual(llamadas, []);
});

test('mantener pulsado repite el movimiento y soltar lo detiene', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const { botones, llamadas } = montar();

  botones.right.emitir('pointerdown', { button: 0, pointerId: 1 });
  assert.equal(llamadas.length, 1, 'movimiento inmediato');

  t.mock.timers.tick(REPETICION.retraso - 1);
  assert.equal(llamadas.length, 1, 'aún dentro del retraso inicial');

  t.mock.timers.tick(1); // vence el retraso y arranca la repetición
  t.mock.timers.tick(REPETICION.intervalo * 3);
  assert.equal(llamadas.length, 1 + 3, 'una repetición por intervalo');

  botones.right.emitir('pointerup');
  t.mock.timers.tick(REPETICION.intervalo * 10);
  assert.equal(llamadas.length, 4, 'ya no se repite');
  assert.ok(llamadas.every((d) => d === 'right'));
});

test('cancelar el gesto (pointercancel) también detiene la repetición', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const { botones, llamadas } = montar();
  botones.up.emitir('pointerdown', { button: 0 });
  t.mock.timers.tick(REPETICION.retraso);
  t.mock.timers.tick(REPETICION.intervalo);
  assert.equal(llamadas.length, 2);
  botones.up.emitir('pointercancel');
  t.mock.timers.tick(5000);
  assert.equal(llamadas.length, 2);
});

test('visibilidad: sin preferencia la casilla refleja si el dispositivo es táctil', () => {
  assert.equal(montar({ esTactil: () => true }).casilla.checked, true);
  const escritorio = montar({ esTactil: () => false });
  assert.equal(escritorio.casilla.checked, false);
  assert.equal(escritorio.contenedor.dataset.controles, undefined, 'decide el CSS');
});

test('visibilidad: la casilla fuerza mostrar u ocultar y lo recuerda', () => {
  const almacen = almacenFalso();
  const { casilla, contenedor } = montar({ almacen });

  casilla.checked = true;
  casilla.emitir('change');
  assert.equal(contenedor.dataset.controles, 'si');
  assert.equal(almacen.datos['laberinto.controles'], 'si');

  casilla.checked = false;
  casilla.emitir('change');
  assert.equal(contenedor.dataset.controles, 'no');
  assert.equal(almacen.datos['laberinto.controles'], 'no');
});

test('visibilidad: una preferencia guardada manda sobre la detección táctil', () => {
  const guardadoNo = montar({
    almacen: almacenFalso({ 'laberinto.controles': 'no' }),
    esTactil: () => true,
  });
  assert.equal(guardadoNo.contenedor.dataset.controles, 'no');
  assert.equal(guardadoNo.casilla.checked, false);

  const guardadoSi = montar({
    almacen: almacenFalso({ 'laberinto.controles': 'si' }),
    esTactil: () => false,
  });
  assert.equal(guardadoSi.contenedor.dataset.controles, 'si');
  assert.equal(guardadoSi.casilla.checked, true);
});

test('visibilidad: un valor guardado inválido o un almacenamiento que falla se ignoran', () => {
  const invalido = montar({ almacen: almacenFalso({ 'laberinto.controles': 'quizá' }) });
  assert.equal(invalido.contenedor.dataset.controles, undefined);

  const roto = {
    getItem() {
      throw new Error('bloqueado');
    },
    setItem() {
      throw new Error('bloqueado');
    },
  };
  const { casilla, contenedor } = montar({ almacen: roto });
  casilla.checked = true;
  assert.doesNotThrow(() => casilla.emitir('change'));
  assert.equal(contenedor.dataset.controles, 'si', 'la sesión actual sí lo respeta');
});
