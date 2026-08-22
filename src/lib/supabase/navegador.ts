import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para componentes de cliente.
 * Usa la clave publicable, que es la que puede viajar al navegador:
 * la protección real la da RLS en la base, no ocultar la clave.
 */
export function clienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
