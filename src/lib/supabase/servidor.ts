import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para Server Components, Server Actions y route handlers.
 * En Next 16 cookies() es asíncrono: el acceso síncrono se eliminó.
 */
export async function clienteServidor() {
  const almacen = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return almacen.getAll();
        },
        setAll(cookiesNuevas) {
          try {
            cookiesNuevas.forEach(({ name, value, options }) =>
              almacen.set(name, value, options),
            );
          } catch {
            // Un Server Component no puede escribir cookies. Se ignora porque
            // el refresco de sesión ya lo hace proxy.ts en cada petición.
          }
        },
      },
    },
  );
}

/**
 * Devuelve el usuario verificado contra el servidor de autenticación.
 *
 * Se usa getUser() y no getSession(): getSession() lee la cookie sin
 * comprobar la firma, de modo que un cliente puede falsificarla. getUser()
 * consulta a Supabase y por eso es la única fuente fiable en el servidor.
 */
export async function usuarioActual() {
  const supabase = await clienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
