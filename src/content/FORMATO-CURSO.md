# Formato de un curso en Markdown

Un curso es una carpeta dentro de `src/content/`. Dentro van un `curso.md` con
la ficha y un archivo por sesión.

```
src/content/ia-generativa/
├── curso.md
├── sesion-1.md
├── sesion-2.md
├── sesion-3.md
└── sesion-4.md
```

Para publicarlo, se añade una línea en `src/lib/cursos.ts`:

```ts
cargarCurso("ia-generativa"),
```

Esa es la única línea de TypeScript que un curso necesita. Todo lo demás es
Markdown.

Las reglas de redacción están en `LINEAMIENTOS.md`, en la raíz.

---

## `curso.md` — la ficha

```markdown
---
slug: ia-generativa
titulo: "Introducción a la IA generativa con Python"
resumen: "El SDK oficial de Google para Gemini: cliente, configuración…"
area: "Inteligencia Artificial"
nivel: INTRODUCCIÓN
horas: 16
icono: gemini
paquetes: ["google-genai"]
precio: 20
estado: borrador
acceso_libre: false
orden: 99
ruta:
  slug: inteligencia-artificial
  nombre: "Inteligencia artificial"
  descripcion: "De los fundamentos a aplicaciones que se pueden evaluar."
  orden: 4
  posicion: 1
  requisitos: []
---

```preludio
from google import genai

client = genai.Client(api_key="clave-de-practica")
```
```

| Campo | Obligatorio | Qué es |
|---|---|---|
| `slug` | sí | La parte de la URL: `/cursos/<slug>/…` |
| `titulo` | sí | Se muestra en el catálogo y en la barra lateral |
| `resumen` | sí | Una o dos frases para la tarjeta |
| `area` | sí | Una de las de `AREAS` en `src/lib/cursos.ts` |
| `nivel` | sí | `INTRODUCCIÓN`, `INTERMEDIO`, `AVANZADO` o `HARDMODE` |
| `horas` | sí | Duración total |
| `icono` | sí | Logotipo del producto o símbolo de la materia. Se valida contra `src/lib/iconos-curso.ts`; Fortran usa `fortran` |
| `paquetes` | no | Paquetes de PyPI que hacen falta para ejecutar el código |
| `precio` | no | Precio en soles. Al actualizar, si se omite conserva el precio existente; en un curso nuevo usa 20 |
| `estado` | no | `borrador`, `publico` o `archivado`. Al actualizar, si se omite conserva el estado existente |
| `acceso_libre` | no | `true` permite matricularse sin pago; `false` exige compra o acceso administrativo |
| `orden` | no | Posición del curso en el catálogo; usa 99 por omisión en cursos nuevos |
| `ruta` | no | Objeto que crea o actualiza una ruta y coloca el curso dentro de ella |

Dentro de `ruta`, `slug`, `nombre`, `orden` y `posicion` son obligatorios para
una ruta nueva. `descripcion` puede omitirse. `requisitos` es una lista de slugs
de cursos que deben existir antes de publicar esta ficha. Cuando `curso.md`
declara estos datos, el formulario de `/panel/cursos` actualiza la ficha, la
ruta, la posición y los prerrequisitos junto con el contenido. No hace falta
editar TypeScript, escribir SQL ni volver a desplegar.

El bloque **`preludio`** es código que se ejecuta una vez antes que cualquier
otro, para dejar preparado lo que las sesiones dan por hecho: una conexión, un
cliente, unos datos de ejemplo. Sin él, quien entre directo a la sesión 3 se
encuentra un `NameError`.

---

## `sesion-N.md` — una sesión

```markdown
---
numero: 1
titulo: "El cliente y la primera respuesta"
---

# Título del punto

Párrafo de teoría. Todo el texto corrido hasta el siguiente elemento forma un
solo bloque.

> Nota: la precisión técnica que no cabe arriba. Se muestra plegada.

> Doc: [Título del enlace](https://url.oficial/apartado)

```python
print("hola")
```

```salida
hola
```
```

| Campo | Obligatorio | Qué es |
|---|---|---|
| `numero` | sí | Ordena las sesiones. El nombre del archivo no importa |
| `titulo` | sí | Título de la sesión |
| `slug` | no | Por defecto `sesion-<numero>` |
| `paquetes` | no | Manda sobre los del curso, para no descargar en la sesión 1 algo que solo hace falta en la 4 |
| `preludio` | no | Igual, pero por sesión |

---

## Los elementos

### Encabezados

`#`, `##` y `###` abren sección. Salen en el índice lateral, con sangría según
el nivel, y su identificador se deriva del título: «Crear el cliente» pasa a
ser `#crear-el-cliente`, que es lo que aparece en la URL al leer.

**Todo bloque de teoría empieza con un encabezado.** Es lo que separa un bloque
del siguiente.

### Código

La valla lleva el lenguaje. El bloque se muestra resaltado y, si la sesión es
ejecutable, con su consola.

````markdown
```python
print(2 + 2)
```
````

Un bloque que **no se puede ejecutar aquí** —porque necesita una clave de API,
una red o un archivo— lleva el modificador `!sin-consola`:

````markdown
```python !sin-consola
respuesta = client.models.generate_content(model="gemini-3.5-flash", contents="Hola")
print(respuesta.text)
```
````

### Salida

Va inmediatamente después del bloque de código al que pertenece.

````markdown
```salida
4
```
````

**La salida se obtiene ejecutando el código, no se escribe a mano.** Si no es
determinista —la respuesta de un modelo, una marca de tiempo— el bloque va con
`!sin-consola` y la salida se presenta como ejemplo en el texto.

### Notas

`> Nota:` va después del bloque al que pertenece, sea de teoría o de código, y
se muestra plegada. Puede ocupar varias líneas mientras sigan citadas:

```markdown
> Nota: primera línea de la nota.
> Segunda línea de la misma nota.
```

Una nota explica **por qué** o precisa un límite. No repite lo de arriba con
otras palabras.

### Citas de documentación

`> Doc:` con un enlace en formato Markdown. Se pueden encadenar varias, y
también van después del bloque al que acompañan.

```markdown
> Doc: [round()](https://docs.python.org/3/library/functions.html#round)
> Doc: [Aritmética de punto flotante](https://docs.python.org/3/tutorial/floatingpoint.html)
```

Enlazan al apartado concreto, no a la portada de la documentación.

### Ejercicios

Uno por sección como mucho. Va al final de la sección a la que pertenece: el
lector lo encuentra plegado, después de lo que acaba de leer.

````markdown
```ejercicio
# Enunciado
Completa la clase que construye el cliente del SDK.

# Plantilla
cliente = genai.___(api_key="clave")
print(type(cliente).__name__)

# Esperado
Client

# Pista
Seis letras, en inglés y con mayúscula inicial.
```
````

- **La plantilla lleva un único hueco**, marcado con `___`. Dos huecos
  convierten la corrección en adivinanza.
- **`Esperado` es la salida** que produce la solución correcta. Se compara con
  lo que imprime el intérprete, no con el texto que escribió el alumno, así que
  vale cualquier expresión que dé ese resultado.
- El ejercicio se ejecuta **aislado**: lo que definió uno no le resuelve el
  siguiente. El preludio del curso o de la sesión sí se aplica.

El ejercicio se asocia a la sección donde está escrito. No hay ningún índice
aparte que mantener sincronizado.

---

## Lo que el formato comprueba solo

Al cargar el curso falla, con el archivo y el motivo, si:

- una sesión no tiene `numero` o `titulo`;
- un curso no tiene ninguna sesión;
- una salida aparece sin bloque de código delante;
- una nota o una cita aparecen sin bloque delante;
- un ejercicio está fuera de toda sección;
- hay dos ejercicios para la misma sección;
- un ejercicio no tiene enunciado, plantilla o pista;
- la plantilla de un ejercicio no tiene hueco.

Son errores de compilación, no páginas rotas en producción.

## Diagramas de conjuntos

Una valla ```venn dibuja un diagrama de dos conjuntos. Va declarado, no como
SVG: así todos salen iguales, heredan los colores del tema —incluido el
monocromático— y quien escribe no necesita dibujar.

```venn
izquierda: python
derecha: sql
resalta: interseccion
pie: INNER JOIN devuelve solo las filas que casan en ambas tablas
```

`resalta` acepta: `interseccion`, `izquierda`, `derecha`, `union`,
`solo-izquierda`, `solo-derecha`, `diferencia-simetrica`,
`complemento-interseccion`, `complemento-union` y `ninguna`. Las dos de
complemento dibujan además el marco del conjunto universal, porque «todo lo que
no está en a» no significa nada sin un borde respecto del cual esté fuera. Un valor
que no esté en esa lista rompe la carga del curso a propósito, para que no
salga un diagrama vacío que nadie note. `pie` es opcional.
