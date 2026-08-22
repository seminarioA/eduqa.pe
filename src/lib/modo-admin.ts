/**
 * Modo administrador: ver la plataforma sin las barreras de alumno.
 *
 * Solo cambia lo que se muestra. Que un administrador pueda abrir cualquier
 * curso lo decide el servidor comprobando `es_admin`, no esta preferencia:
 * si la barrera dependiera de un valor guardado en el navegador, cualquiera
 * podría saltársela escribiéndolo a mano.
 */
const CLAVE = "eduqa:modo-admin";

let activo: boolean | null = null;
const oyentes = new Set<() => void>();

function leer() {
  if (activo === null) {
    activo =
      typeof window !== "undefined" &&
      window.localStorage.getItem(CLAVE) === "1";
  }
  return activo;
}

export function modoAdminActivo() {
  return leer();
}

export function alternarModoAdmin() {
  activo = !leer();
  window.localStorage.setItem(CLAVE, activo ? "1" : "0");
  oyentes.forEach((avisar) => avisar());
}

export function suscribirseModoAdmin(avisar: () => void) {
  oyentes.add(avisar);
  return () => {
    oyentes.delete(avisar);
  };
}
