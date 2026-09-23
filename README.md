# EDUQA

[![CI](https://github.com/seminarioA/eduqa-landing/actions/workflows/ci.yml/badge.svg)](https://github.com/seminarioA/eduqa-landing/actions/workflows/ci.yml)

Plataforma educativa de EDUQA: catálogo de cursos técnicos en vivo, matrícula con pago, aulas con contenido por sesión, certificados y panel de gestión.

**Sitio en producción:** [https://eduqa-pe.vercel.app](https://eduqa-pe.vercel.app)

## Stack

<a href="https://nextjs.org"><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/next_js.png" width="24" alt="Next.js"/></a>
<a href="https://react.dev"><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/react.png" width="24" alt="React"/></a>
<a href="https://www.typescriptlang.org"><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/typescript.png" width="24" alt="TypeScript"/></a>
<a href="https://tailwindcss.com"><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/tailwind_css.png" width="24" alt="Tailwind CSS"/></a>
<a href="https://supabase.com"><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/supabase.png" width="24" alt="Supabase"/></a>
<a href="https://www.postgresql.org"><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/postgresql.png" width="24" alt="PostgreSQL"/></a>
<a href="https://nodejs.org"><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/node_js.png" width="24" alt="Node.js"/></a>
<a href="https://www.npmjs.com"><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/npm.png" width="24" alt="npm"/></a>
<a href="https://lucide.dev"><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/lucide.png" width="24" alt="Lucide"/></a>
<a href="https://www.python.org"><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/python.png" width="24" alt="Python (Pyodide)"/></a>
<a href="https://github.com/features/actions"><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/githubactions.png" width="24" alt="GitHub Actions"/></a>

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) · React 19 |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4 |
| Base de datos y auth | Supabase (PostgreSQL + Auth + Storage) |
| UI | Radix UI · Lucide Icons |
| Código en el navegador | Shiki (resaltado) · Pyodide (ejercicios de Python) |
| Pagos | Niubiz · Yape / Plin |
| CI/CD | GitHub Actions · Vercel |

## Estructura

```
src/
├── app/                  # Rutas (App Router)
│   ├── cursos/           # Catálogo y aula por curso/lección
│   ├── panel/            # Gestión: cursos, avisos, reportes
│   ├── pagar/            # Flujo de pago (QR, Niubiz)
│   ├── certificados/     # Emisión y vista previa
│   └── api/              # Route handlers (webhooks, API v1)
├── components/           # Componentes compartidos
├── content/<curso>/      # Contenido de cursos en Markdown
├── lib/                  # Acceso a datos, Supabase, precios, lógica
└── proxy.ts              # Middleware
supabase/migrations/      # Migraciones SQL numeradas
```

Los cursos se publican como Markdown desde `/panel/cursos` y se almacenan en Supabase, sin modificar TypeScript ni desplegar de nuevo. Supabase es la única fuente de cursos en runtime; la aplicación no descubre ni recupera cursos desde `src/content`. El formato de importación está documentado en [`src/content/FORMATO-CURSO.md`](src/content/FORMATO-CURSO.md) y las reglas de redacción en [`LINEAMIENTOS.md`](LINEAMIENTOS.md).

## Requisitos

- Node.js ≥ 20
- npm ≥ 10
- Proyecto de Supabase (URL y claves de API)

## Puesta en marcha

```bash
git clone https://github.com/seminarioA/eduqa-landing.git
cd eduqa-landing
npm install          # también instala los hooks de husky
cp .env.example .env.local   # completar credenciales
```

Variables de entorno (`Settings → API` en Supabase):

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave pública (cliente) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service role — **solo servidor**, nunca con prefijo `NEXT_PUBLIC_` |

Aplicar migraciones:

```bash
npx supabase db push
# o manualmente, en orden numérico, desde supabase/migrations/
```

### Scripts

```bash
npm run dev         # servidor de desarrollo
npm run build       # build de producción
npm run lint        # eslint
npm run typecheck   # next typegen + tsc --noEmit
```

## Convención de commits

Los mensajes siguen este formato, validado localmente (husky + commitlint) y en CI:

```
[tipo] (ámbito opcional): descripción breve y objetiva
```

Tipos permitidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

```
[feat] (cursos): agregar modal de matrícula
[fix]: corregir validación de reportes
```

Cada commit debe vincular uno o más tickets reales de este repositorio en el
cuerpo. El hook local y CI validan la referencia; una entrega sin ticket no se
promueve.

```
[fix] (catálogo): mostrar una sola acción para limpiar la búsqueda

Refs: #6
```

## CI

El workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) corre en cada push y PR hacia `main`:

1. **commits** — valida los mensajes nuevos con commitlint
2. **verify** — `npm ci`, lint y typecheck

## Despliegue

Vercel despliega automáticamente cada push a `main`. Las variables de entorno se configuran en el proyecto de Vercel; las migraciones de base de datos se aplican contra Supabase.

---

© EDUQA — repositorio privado.
