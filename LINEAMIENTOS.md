# Lineamientos de redacción de los cursos — EDUQA.PE

Cómo se escribe el contenido de un curso: teoría, ejemplos, notas técnicas y
ejercicios.

Solo eso. El texto de la interfaz —botones, avisos, correos, la portada— se
escribe con otro criterio y no es objeto de este documento.

---

## 1. Registro

### 1.1 Nombra la operación, no la metáfora

El problema de escribir «el paquete **habla** con la API» no es que sea llano:
es que **personifica**. Un paquete no habla. Y al personificar se pierde lo
único que importaba decir, que es qué hace exactamente.

La corrección tampoco es subir de registro por subir. «Solicita» es más formal
que «pide» y sigue sin decir nada. Lo que hay que hacer es **nombrar la
operación**.

| No | Sí |
|---|---|
| un paquete que **habla con** la API de Gemini | un paquete que **envía peticiones a** la API de Gemini |
| `generate_content()` **pide** una respuesta al modelo | `generate_content()` **envía la petición al modelo y devuelve su respuesta** |
| el navegador **habla con** ese servidor | el navegador **solo se comunica con** ese servidor |
| si el proceso **se cae** | si el proceso **termina de forma anormal** |
| eso **tira** el proceso entero | eso **interrumpe** el proceso entero |
| nadie tiene que **acordarse de** limpiarlo | nadie tiene que **limpiarlo a mano** |

Verbos que casi siempre esconden una operación sin nombrar: *hablar, pedir,
decirle, avisar, encargarse de, ocuparse de, saber, entender, darse cuenta*.

Ojo con el exceso contrario: sustituir todo verbo llano por uno culto produce
prosa administrativa. «Devuelve», «recorre», «guarda» o «compara» son precisos y
no hay que tocarlos.

### 1.2 El registro: explicación técnica escrita

Un curso se escribe en el registro de una **explicación técnica escrita**. No es
una conversación transcrita ni un documento administrativo, y los dos extremos
se reconocen por el mismo síntoma: el verbo deja de nombrar lo que ocurre.

**El principio.** Cada verbo debe nombrar la relación concreta entre las cosas
de las que se habla. Si un verbo funcionaría igual en una frase sobre cualquier
otro tema, no está nombrando nada.

> «De ahí **sale** la frase» no es incorrecto por vulgar, sino por impreciso:
> una frase no se desplaza, **se origina** en una situación. El coloquialismo
> sustituye una relación —origen, causa, consecuencia, condición— por un
> movimiento vago que podría aplicarse a cualquier cosa.

**La prueba.** Antes de dar una frase por buena, léela como si formara parte de
la documentación oficial de la herramienta que se está explicando. Si desentona
por informal, sobra registro coloquial; si desentona por solemne, sobra registro
administrativo. Las dos correcciones apuntan al mismo sitio: **el verbo exacto**.

**Los dos extremos, con el mismo remedio.**

| Extremo | Ejemplo | Corrección |
|---|---|---|
| conversación | de ahí **sale** que el orden importe | de ahí **se deduce** que el orden importe |
| conversación | lo que **toca** es rotar la credencial | lo que **corresponde** es rotar la credencial |
| oficina | se **procede a la verificación de** la salida | se **verifica** la salida |
| oficina | **con el objetivo de** obtener el resultado | **para** obtener el resultado |

**Lo que no hay que tocar.** *Devuelve, recorre, guarda, compara, acota, mide,
recibe.* Son verbos llanos y precisos a la vez. Sustituirlos por sinónimos
cultos empeora el texto.

**Cómo revisarlo sin una lista de palabras prohibidas.** Al releer, ante cada
verbo pregúntate qué relación afirma. Si la respuesta es «que algo pasa» o «que
algo se mueve», el verbo no está haciendo su trabajo. Los coloquialismos
habituales —*salir, tocar, costar, pillar, comerse, hacer falta*— se detectan
solos con esa pregunta, y también los que no estén en ninguna lista.

### 1.3 Rigor sin ambigüedad

Que un curso sea introductorio **no autoriza a que sea impreciso**. Si el
concepto exacto no cabe en el texto principal sin enturbiarlo, va en una nota
técnica plegada. No se omite.

> Una variable es un nombre asociado a un valor.
>
> *Nota técnica:* Una variable es una referencia a una dirección de memoria por
> nombre. La asignación no copia el valor: liga el nombre al objeto.

### 1.4 Cada símbolo se nombra la primera vez

| No | Sí |
|---|---|
| El operador más une dos cadenas | El operador de concatenación (`+`) une dos cadenas |
| Se separa con dos puntos | Se separa con dos puntos (`:`) |
| Lleva dos asteriscos | Lleva el operador de potencia (`**`) |

### 1.5 Ningún sujeto sin antecedente

| No | Sí |
|---|---|
| El nombre admite letras, números y guion bajo | El nombre de la variable admite letras, números y guion bajo |
| Devuelve None si no existe | `get()` devuelve `None` si la clave no existe |
| Esa decisión explica su rendimiento | La contigüidad en memoria explica el rendimiento del arreglo |

Al releer, por cada «lo», «eso», «el nombre», «devuelve»: preguntarse *¿de qué?*
Si la respuesta no está en la misma frase o en la anterior, falta.

### 1.6 Claridad antes que brevedad

No se simplifica, no se generaliza y no se salta ningún punto. Si hay seis
operadores de comparación, se muestran los seis con un ejemplo cada uno. Cuatro
ejemplos para seis operadores es una omisión, no una síntesis.

> Si el curso de introducción tiene que durar cincuenta horas, dura cincuenta
> horas.

---

## 2. Estructura

1. **Sin emojis** en títulos ni subtítulos. En ningún sitio del curso.
2. **Un concepto por bloque de código.** Nada de fragmentos largos que enseñan
   cinco cosas a la vez.
3. **Casi todo ejemplo cita la documentación oficial**, con enlace al apartado
   concreto y no a la portada.
4. **La precisión que no cabe arriba va en `nota`**, plegada por defecto.
5. **Un ejercicio por punto**, plegado y opcional. El motor corresponde a la
   competencia: código para practicar código; verdadero/falso u opción múltiple
   para discriminar conceptos; ordenar para secuencias; relacionar para
   correspondencias. No se introduce un lenguaje de programación solo para
   poder corregir una pregunta conceptual.
6. **Cada sección cierra el punto que abrió.** Si el título promete «Detectar
   los latidos», el apartado termina con los latidos detectados.
7. **El cierre de cada sesión** dice qué quedó cubierto y qué viene después.

### Las notas técnicas

Una nota explica **por qué**, o precisa un límite. No repite lo de arriba con
otras palabras.

| Sirve | No sirve |
|---|---|
| «`round()` aplica redondeo bancario: los empates van al par más cercano, de modo que `round(2.5)` da 2» | «`round()` sirve para redondear números» |
| «`zip()` se detiene en la secuencia más corta, sin avisar» | «`zip()` recorre dos secuencias» |

---

## 3. Introductorio no es vago

«Introducción» dice a quién va dirigido, no cuánto se cuenta. Va dirigido a
quien entra al tema por primera vez, y por eso mismo **hay que explicar más, no
menos**: quien ya sabe puede rellenar un hueco de memoria, quien empieza no.

Escribir «se arranca en segundo plano con `-d`» es un ejemplo de lo que no vale.
Dice qué teclear y deja fuera lo único que hace falta para no volver a
consultarlo nunca: que `-d` es de *detach*, que significa desacoplar el proceso
de la terminal, y que por eso el contenedor sigue vivo cuando cierras la
ventana. Con esa frase el estudiante memoriza un símbolo; con la explicación,
entiende un mecanismo y deduce el resto.

La regla es concreta:

- **Toda opción, palabra clave o símbolo se nombra.** `-d` es *detach*, `-v` es
  *volume*, `-p` es *publish*, `&` es la intersección, `**` es la potencia. Un
  carácter sin nombre es un carácter que no se puede buscar ni recordar.
- **Después del nombre, el porqué.** No basta con «`-d` es detach»: hay que
  decir qué consecuencia tiene desacoplarse, que es lo que el estudiante
  necesita para decidir cuándo usarlo.
- **Nada de «simplemente», «basta con» ni «no te preocupes por esto ahora».**
  Si algo no se va a explicar, se dice por qué y dónde se explica; no se tapa.
- **Un acrónimo se expande la primera vez que aparece.** Siempre, aunque parezca
  obvio: CMD es *command*, AUC es *area under the curve*, RLS es *row level
  security*.
- **Los valores por omisión se nombran como tales.** «Si no se pone etiqueta,
  Docker asume `latest`» explica; «usa `latest`» no.

Lo que sí se recorta en un curso introductorio es la **extensión**: menos casos
límite, menos variantes, menos historia. Lo que no se recorta nunca es la
**profundidad de lo que sí se cuenta**. Es mejor explicar cinco opciones
enteras que quince a medias.

## 4. Los ejemplos

- **Cada bloque de código se ejecuta solo**, sin depender de que el lector haya
  ejecutado los anteriores, salvo cuando el encadenamiento es lo que se está
  enseñando. Si depende, la sesión trae un preludio que lo deja preparado.
- **Los datos del ejemplo salen del dominio del curso.** En un curso de
  bioingeniería se mide temperatura corporal, no `foo` y `bar`.
- **Nada de `ejemplo`, `prueba`, `x` o `dato`** como nombres cuando existe el
  nombre real de la cosa.

---

## 5. Verificación: lo que no se comprueba, no se publica

Esta sección existe porque **se han publicado datos inventados**. Los tres casos
reales, todos detectados ejecutando el código:

- `imc(82, 1.68)` se escribió como `29.0`. El resultado real es `29.1`.
- La media y la desviación de una señal se escribieron a ojo: `0.0251` y
  `0.1349`. Los valores reales eran `0.0313` y `0.1455`.
- Las sesiones 2, 3 y 4 de un curso usaban una variable definida en la sesión 1.
  Quien entrara directo a la 3 se encontraba un `NameError`.

Reglas que salen de ahí:

- **Toda salida de un bloque se obtiene ejecutándolo.** Ninguna se escribe a
  mano, por evidente que parezca.
- **Todo ejercicio se resuelve y se comprueba** antes de publicar, con la
  respuesta correcta y con alguna incorrecta.
- **Cada sesión se ejecuta desde cero**, como quien entra directo a ella.
- **Toda versión de biblioteca se consulta, no se recuerda.** Las APIs cambian:
  el SDK de Gemini pasó de `vertexai=True` a `enterprise=True` y de
  `response_schema` a `response_json_schema`.
- **Si la salida no es determinista** —un modelo generativo, una marca de
  tiempo, un identificador— el bloque no promete una salida literal.

---

## 6. Contenido sensible

Cuando el curso toca un campo donde una decisión mal tomada hace daño —salud,
dinero, datos personales—, **la advertencia es parte del texto, no una nota al
pie**, y se repite al abrir y al cerrar.

El curso de bioingeniería usa umbrales de presión arterial como ejemplo de
`elif`. Dice en la primera nota y en el cierre que esos umbrales sirven para
practicar con el lenguaje, que los reales dependen de la guía clínica que se
siga, y que nada de lo escrito ahí es un dispositivo médico.

**No se afirma nada que no se haya verificado**, ni siquiera de pasada. Si un
dato depende de una norma, una versión o una tarifa, se cita la fuente o no se
escribe.

---

## 7. Repaso final

Antes de dar un curso por terminado, releerlo entero de una vez —no párrafo a
párrafo mientras se escribe— buscando:

- **Opciones y símbolos sin nombrar.** Buscar cada `-` seguido de letra, cada
  acrónimo y cada operador, y comprobar uno a uno que en algún punto se dice qué
  significan.

- **Verbos que no nombran nada.** Ante cada verbo, preguntarse qué relación
  afirma. Si la respuesta es «que algo pasa», falta el verbo exacto.
- **Muletillas repetidas.** El mismo giro tres veces en una sesión se nota.
- **Personificaciones** que se colaron.
- **Sujetos sin antecedente.**
- **Cosas dichas dos veces** en distinto apartado.
- **Enumeraciones incompletas**: seis elementos nombrados, cuatro con ejemplo.
- **Cifras que no se ejecutaron.**


## Regla del índice de los cursos de Python

Cada ítem del índice desarrolla una sola función, método u operación. Se prohíbe agrupar operaciones nuevas, aunque pertenezcan al mismo módulo o tema. Cada una tiene título, explicación, ejemplo autónomo y práctica propios. Las funciones del proyecto también se enseñan por separado; la integración reutiliza contenidos ya desarrollados.

La revisión editorial debe rechazar un apartado que incumpla esta regla. El parser comprueba la estructura del Markdown; no puede demostrar por sí solo que una explicación tenga un único objetivo pedagógico.
