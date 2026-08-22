/**
 * Modo monocromático: la interfaz sin el rojo de la identidad.
 *
 * Es un eje aparte del tema claro/oscuro, no un tercer tema. Claro y oscuro
 * responden a cuánta luz hay alrededor; esto responde a si se quiere color de
 * marca o no. Mezclarlos en una sola lista obligaría a elegir entre modo
 * oscuro y modo monocromático, que son preferencias independientes.
 *
 * Lo que cambia son los tokens de color, así que ningún componente necesita
 * saber que este modo existe. La clase en <html> la pone también un script
 * que corre antes del primer pintado; aquí solo se mantiene sincronizada.
 */
const CLAVE = "eduqa:monocromo";
export const CLASE = "mono";

let activo: boolean | null = null;
const oyentes = new Set<() => void>();

function leer() {
  if (activo === null) {
    // El script de arranque ya decidió: se lee del DOM y no de localStorage,
    // para que ambos no puedan discrepar.
    activo =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains(CLASE);
  }
  return activo;
}

export function monocromoActivo() {
  return leer();
}

/** En el servidor no hay preferencia todavía: se pinta el modo con color. */
export function monocromoEnServidor() {
  return false;
}

export function alternarMonocromo() {
  activo = !leer();
  document.documentElement.classList.toggle(CLASE, activo);
  try {
    window.localStorage.setItem(CLAVE, activo ? "1" : "0");
  } catch {
    // Navegación privada con almacenamiento bloqueado: la preferencia vale
    // para esta pestaña y se pierde al cerrarla, que es mejor que romper.
  }
  oyentes.forEach((avisar) => avisar());
}

export function suscribirseMonocromo(avisar: () => void) {
  oyentes.add(avisar);
  return () => {
    oyentes.delete(avisar);
  };
}

/**
 * Se inyecta tal cual antes de que pinte la página. Sin esto, el primer
 * fotograma sale con el rojo puesto y se ve el cambio de golpe.
 */
export const GUION_ARRANQUE = `try{if(localStorage.getItem("${CLAVE}")==="1")document.documentElement.classList.add("${CLASE}")}catch(e){}`;
