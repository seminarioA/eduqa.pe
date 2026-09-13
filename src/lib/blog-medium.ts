import "server-only";

import { cache } from "react";

export type ArticuloBlog = {
  guid: string;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  portada: string | null;
  fecha: string;
  fechaIso: string;
  autor: string;
  enlaceMedium: string;
  categorias: string[];
  minutosLectura: number;
};

const ARTICULOS_RESPALDO: ArticuloBlog[] = [
  {
    guid: "art-001",
    slug: "por-que-los-transformers-reemplazaron-a-las-redes-recurrentes",
    titulo: "¿Por qué los Transformers reemplazaron a las redes recurrentes?",
    resumen:
      "Un análisis técnico y práctico sobre los mecanismos de atención, la paralelización del cómputo matricial y por qué la arquitectura Transformer domina la IA moderna.",
    contenido: `
<p>Durante años, el procesamiento de lenguaje natural y el modelado de secuencias temporales dependieron exclusivamente de arquitecturas recurrentes como <strong>RNN</strong>, <strong>LSTM</strong> y <strong>GRU</strong>. Sin embargo, en 2017 el artículo <em>«Attention Is All You Need»</em> transformó radicalmente este paradigma.</p>

<h2>El cuello de botella recurrente</h2>
<p>Las redes recurrentes procesan la información paso a paso: para calcular el estado oculto en el instante <code>t</code>, es indispensable haber procesado previamente el instante <code>t-1</code>. Esta dependencia secuencial impide la paralelización eficiente en GPUs modernas, limitando severamente la capacidad de entrenar con conjuntos de datos masivos.</p>

<h2>Mecanismos de atención escalada (Scaled Dot-Product Attention)</h2>
<p>El corazón de los Transformers es la matriz de atención calculada sobre proyecciones lineales de las entradas: <strong>Queries (Q)</strong>, <strong>Keys (K)</strong> y <strong>Values (V)</strong>:</p>

<pre><code class="language-python">import numpy as np

def atencion_escalada(Q, K, V, mascara=None):
    d_k = Q.shape[-1]
    puntuaciones = np.matmul(Q, K.swapaxes(-1, -2)) / np.sqrt(d_k)
    if mascara is not None:
        puntuaciones = np.where(mascara == 0, -1e9, puntuaciones)
    pesos = np.exp(puntuaciones - np.max(puntuaciones, axis=-1, keepdims=True))
    pesos = pesos / np.sum(pesos, axis=-1, keepdims=True)
    return np.matmul(pesos, V), pesos
</code></pre>

<h2>Conclusión</h2>
<p>La capacidad de calcular todas las interacciones de una secuencia en paralelo, combinada con la atención multi-cabeza (Multi-Head Attention), permite capturar dependencias de largo alcance sin degradación del gradiente ni pérdida secuencial de contexto.</p>
    `.trim(),
    portada: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    fecha: "10 de septiembre de 2026",
    fechaIso: "2026-09-10T12:00:00.000Z",
    autor: "EDUQA.PE",
    enlaceMedium: "https://medium.com/@seminarioA",
    categorias: ["Machine Learning", "Transformers", "Python", "Deep Learning"],
    minutosLectura: 6,
  },
  {
    guid: "art-002",
    slug: "de-cero-a-produccion-construyendo-microservicios-con-fastapi-y-docker",
    titulo: "De cero a producción: Microservicios eficientes con FastAPI y Docker",
    resumen:
      "Patrones de diseño, validación asíncrona con Pydantic V2 y empaquetado multicapa con Docker para APIs de alta concurrencia.",
    contenido: `
<p>Construir APIs rápidas ya no es una opción; es un requisito fundamental para cualquier sistema que procese datos en tiempo real o atienda modelos de inferencia.</p>

<h2>¿Por qué FastAPI en producción?</h2>
<p>FastAPI combina la velocidad de Starlette y la robustez de Pydantic con la facilidad sintáctica de Python moderno (tipado estático con <code>typing</code>). Esto permite:</p>
<ul>
  <li>Validación automática de esquemas en tiempo de ejecución.</li>
  <li>Documentación interactiva Swagger/OpenAPI autogenerada.</li>
  <li>Ejecución asíncrona nativa sobre ASGI (Uvicorn).</li>
</ul>

<h2>Contenedores ligeros y seguros</h2>
<p>Un Dockerfile multicapa permite reducir el tamaño de la imagen final de ~1GB a menos de 120MB, eliminando compiladores y dependencias de construcción innecesarias.</p>
    `.trim(),
    portada: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    fecha: "5 de septiembre de 2026",
    fechaIso: "2026-09-05T15:30:00.000Z",
    autor: "EDUQA.PE",
    enlaceMedium: "https://medium.com/@seminarioA",
    categorias: ["Backend", "FastAPI", "Docker", "DevOps"],
    minutosLectura: 5,
  },
  {
    guid: "art-003",
    slug: "optimizacion-de-pipelines-de-datos-con-polars-y-sql",
    titulo: "Optimización de pipelines de datos: Polars vs Pandas en producción",
    resumen:
      "Comparativa de rendimiento en memoria, ejecución perezosa (LazyFrame) y vectorización SIMD con Rust para procesamiento de datos a gran escala.",
    contenido: `
<p>Cuando los volúmenes de datos superan unos pocos gigabytes, las operaciones estándar con Pandas suelen encontrarse con problemas de consumo de memoria (OOM) y cuellos de botella monohilo.</p>

<h2>La ventaja del motor de Polars</h2>
<p>Escrito en Rust y basado en Apache Arrow, Polars ejecuta transformaciones utilizando múltiples hilos de CPU sin el bloqueo del GIL de Python y optimiza el plan de consulta automáticamente antes de ejecutarlo.</p>
    `.trim(),
    portada: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    fecha: "28 de agosto de 2026",
    fechaIso: "2026-08-28T09:00:00.000Z",
    autor: "EDUQA.PE",
    enlaceMedium: "https://medium.com/@seminarioA",
    categorias: ["Ingeniería de Datos", "Polars", "Python", "Rendimiento"],
    minutosLectura: 7,
  },
];

function extraerImagen(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function limpiarTexto(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function slugificar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Obtiene los artículos del blog sincronizados desde el feed de Medium de la empresa.
 * Si falla la conexión de red externa o el feed no está disponible, utiliza los
 * artículos de respaldo verificados para asegurar disponibilidad constante.
 */
export const obtenerArticulosMedium = cache(async (): Promise<ArticuloBlog[]> => {
  const feedUrl =
    process.env.MEDIUM_FEED_URL ||
    (process.env.NEXT_PUBLIC_MEDIUM_USERNAME
      ? `https://medium.com/feed/@${process.env.NEXT_PUBLIC_MEDIUM_USERNAME.replace(/^@/, "")}`
      : "https://medium.com/feed/@seminarioA");

  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 3600, tags: ["medium-blog"] },
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });

    if (!res.ok) {
      return ARTICULOS_RESPALDO;
    }

    const xml = await res.text();
    const articulos = parsearRssMedium(xml);
    return articulos.length > 0 ? articulos : ARTICULOS_RESPALDO;
  } catch (error) {
    console.warn("No se pudo sincronizar el feed de Medium en vivo, usando respaldo:", error);
    return ARTICULOS_RESPALDO;
  }
});

function parsearRssMedium(xml: string): ArticuloBlog[] {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/gi) ?? [];
  const articulos: ArticuloBlog[] = [];

  for (const item of items) {
    const sacar = (tag: string) => {
      const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      if (!match) return "";
      return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1").trim();
    };

    const titulo = sacar("title");
    const link = sacar("link");
    const guid = sacar("guid") || link;
    const pubDate = sacar("pubDate");
    const creator = sacar("dc:creator") || "EDUQA.PE";
    const content = sacar("content:encoded") || sacar("description");

    const categoriasMatches = item.match(/<category>([\s\S]*?)<\/category>/gi) ?? [];
    const categorias = categoriasMatches
      .map((c) => c.replace(/<category[^>]*>|<\/category>/gi, "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1").trim())
      .filter(Boolean);

    if (!titulo || !content) continue;

    const portada = extraerImagen(content);
    const textoPlano = limpiarTexto(content);
    const resumen = textoPlano.slice(0, 220).trim() + "...";
    const palabras = textoPlano.split(/\s+/).length;
    const minutosLectura = Math.max(1, Math.round(palabras / 180));

    const fechaObj = pubDate ? new Date(pubDate) : new Date();
    const fecha = fechaObj.toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    articulos.push({
      guid,
      slug: slugificar(titulo),
      titulo,
      resumen,
      contenido: content,
      portada,
      fecha,
      fechaIso: fechaObj.toISOString(),
      autor: creator,
      enlaceMedium: link,
      categorias: categorias.length > 0 ? categorias : ["Tecnología", "Ingeniería"],
      minutosLectura,
    });
  }

  return articulos;
}

export const buscarArticuloMedium = cache(async (slug: string): Promise<ArticuloBlog | undefined> => {
  const articulos = await obtenerArticulosMedium();
  return articulos.find((a) => a.slug === slug);
});

export const obtenerCategoriasBlog = cache(async (): Promise<string[]> => {
  const articulos = await obtenerArticulosMedium();
  const set = new Set<string>();
  for (const a of articulos) {
    for (const c of a.categorias) set.add(c);
  }
  return [...set];
});
