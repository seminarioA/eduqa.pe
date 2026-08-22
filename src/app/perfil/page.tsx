import { redirect } from "next/navigation";

/**
 * El perfil se absorbió en Ajustes. Se mantiene la ruta redirigiendo porque
 * hay enlaces repartidos por la aplicación y porque alguien puede tenerla
 * guardada.
 */
export default function Page() {
  redirect("/ajustes");
}
