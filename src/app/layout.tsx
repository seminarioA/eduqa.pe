import type { Metadata } from "next";
import { Exo_2, Inter } from "next/font/google";
import { marca } from "@/lib/catalogo";
import { ProveedorTema } from "@/components/Tema";
import { GUION_ARRANQUE } from "@/lib/cromatismo";
import { BotonReporte } from "@/components/reportes/BotonReporte";
import { BotonModoAdmin } from "@/components/BotonModoAdmin";
import { Isla } from "@/components/Isla";
import { cerrarSesion } from "@/app/acceder/acciones";
import { perfilActual } from "@/lib/matriculas";
import { esInterno } from "@/lib/roles";
import { usuarioActual } from "@/lib/supabase/servidor";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const exo2 = Exo_2({ variable: "--font-exo2", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${marca.nombre} — ${marca.lema}`,
  description: marca.gancho,
  openGraph: {
    title: `${marca.nombre} — ${marca.lema}`,
    description: marca.gancho,
    type: "website",
    locale: "es_PE",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // El botón de reportar solo aparece con sesión: sin cuenta no hay a quién
  // atribuir el reporte ni con quién seguir la conversación.
  const usuario = await usuarioActual();
  const perfil = usuario ? await perfilActual() : null;
  return (
    <html
      lang="es-PE"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${exo2.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* Antes de nada: si la preferencia guardada es monocromo, la clase
            tiene que estar puesta ya en el primer pintado. */}
        <script dangerouslySetInnerHTML={{ __html: GUION_ARRANQUE }} />
        <ProveedorTema>
          <Isla
            autenticado={Boolean(usuario)}
            esAdmin={perfil?.es_admin ?? false}
            esInterno={esInterno(perfil)}
            onSalir={cerrarSesion}
          />
          {children}
          {usuario && <BotonReporte esAdmin={perfil?.es_admin ?? false} />}
          {perfil?.es_admin && <BotonModoAdmin />}
        </ProveedorTema>
      </body>
    </html>
  );
}
