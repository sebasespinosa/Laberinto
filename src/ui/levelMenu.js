// Menú de niveles: un botón por nivel.

// alSeleccionar(nivel) se llama al pulsar un botón.
export function crearMenuNiveles(contenedor, niveles, alSeleccionar) {
  niveles.forEach((nivel) => {
    const boton = document.createElement('button');
    boton.id = nivel.id;
    boton.title = nivel.label;
    boton.textContent = nivel.label;
    boton.addEventListener('click', () => alSeleccionar(nivel));
    contenedor.appendChild(boton);
  });
}
