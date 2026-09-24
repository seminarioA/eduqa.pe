import type { MetadataRoute } from "next";
import { SITE_URL, urlAbsoluta } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/panel/",
          "/pagar/",
          "/perfil/",
          "/ajustes/",
          "/compras/",
          "/certificaciones/",
          "/acceder",
          "/registro",
          "/calendario",
          "/recursos/",
          "/proximos-cursos",
          "/rutas/",
        ],
      },
    ],
    sitemap: urlAbsoluta("/sitemap.xml"),
    host: SITE_URL,
  };
}
