import {
  derivarSecciones,
  idsDeSecciones,
  type Bloque,
  type Ejercicio,
  type Leccion,
} from "@/lib/cursos";

// Curso de Introducción a Python aplicado a la bioingeniería.
//
// Enseña Python desde cero, pero cada ejemplo sale de un problema real de
// bioingeniería: constantes vitales, series de medidas, criterios clínicos y
// señales biomédicas. La última sesión pasa a NumPy y SciPy, que es lo que se
// usa de verdad para procesar una señal.
//
// Mismas reglas de redacción que los demás cursos:
//   1. Sin emojis en títulos ni subtítulos.
//   2. Casi todo ejemplo cita la documentación oficial.
//   3. Un concepto por bloque de código.
//   4. Cada símbolo se nombra la primera vez que aparece; ningún sujeto
//      queda sin antecedente.
//   5. La precisión técnica que no cabe arriba va en `nota`, plegada.
//
// Aviso que atraviesa todo el curso: los umbrales que aparecen sirven para
// practicar con Python, no para decidir sobre nadie. Ningún cálculo de aquí
// es un dispositivo médico.

const P = {
  tipos: { titulo: "Tipos numéricos", url: "https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex" },
  float: { titulo: "Aritmética de punto flotante", url: "https://docs.python.org/3/tutorial/floatingpoint.html" },
  round: { titulo: "round()", url: "https://docs.python.org/3/library/functions.html#round" },
  fstring: { titulo: "Literales de cadena formateados", url: "https://docs.python.org/3/reference/lexical_analysis.html#f-strings" },
  formato: { titulo: "Mini lenguaje de formato", url: "https://docs.python.org/3/library/string.html#format-specification-mini-language" },
  int: { titulo: "int()", url: "https://docs.python.org/3/library/functions.html#int" },
  floatFn: { titulo: "float()", url: "https://docs.python.org/3/library/functions.html#float" },
  comparaciones: { titulo: "Comparaciones", url: "https://docs.python.org/3/library/stdtypes.html#comparisons" },
  bool: { titulo: "Operaciones booleanas", url: "https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not" },
  listas: { titulo: "Listas", url: "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists" },
  secuencias: { titulo: "Operaciones con secuencias", url: "https://docs.python.org/3/library/stdtypes.html#common-sequence-operations" },
  rebanadas: { titulo: "Rebanadas", url: "https://docs.python.org/3/reference/expressions.html#slicings" },
  for: { titulo: "La sentencia for", url: "https://docs.python.org/3/tutorial/controlflow.html#for-statements" },
  sum: { titulo: "sum()", url: "https://docs.python.org/3/library/functions.html#sum" },
  min: { titulo: "min()", url: "https://docs.python.org/3/library/functions.html#min" },
  max: { titulo: "max()", url: "https://docs.python.org/3/library/functions.html#max" },
  len: { titulo: "len()", url: "https://docs.python.org/3/library/functions.html#len" },
  comprension: { titulo: "Listas por comprensión", url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions" },
  zip: { titulo: "zip()", url: "https://docs.python.org/3/library/functions.html#zip" },
  enumerate: { titulo: "enumerate()", url: "https://docs.python.org/3/library/functions.html#enumerate" },
  def: { titulo: "Definir funciones", url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" },
  defaults: { titulo: "Valores por defecto de los argumentos", url: "https://docs.python.org/3/tutorial/controlflow.html#default-argument-values" },
  tuplas: { titulo: "Tuplas", url: "https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences" },
  if: { titulo: "La sentencia if", url: "https://docs.python.org/3/tutorial/controlflow.html#if-statements" },
  excepciones: { titulo: "Errores y excepciones", url: "https://docs.python.org/3/tutorial/errors.html" },
  raise: { titulo: "raise", url: "https://docs.python.org/3/reference/simple_stmts.html#raise" },
  valueError: { titulo: "ValueError", url: "https://docs.python.org/3/library/exceptions.html#ValueError" },
  dicc: { titulo: "Diccionarios", url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries" },
  items: { titulo: "dict.items()", url: "https://docs.python.org/3/library/stdtypes.html#dict.items" },
  while: { titulo: "La sentencia while", url: "https://docs.python.org/3/reference/compound_stmts.html#the-while-statement" },
  statistics: { titulo: "statistics", url: "https://docs.python.org/3/library/statistics.html" },
} as const;

const N = {
  array: { titulo: "numpy.array", url: "https://numpy.org/doc/stable/reference/generated/numpy.array.html" },
  arange: { titulo: "numpy.arange", url: "https://numpy.org/doc/stable/reference/generated/numpy.arange.html" },
  vectorizacion: { titulo: "Fundamentos de la difusión", url: "https://numpy.org/doc/stable/user/basics.broadcasting.html" },
  mean: { titulo: "numpy.mean", url: "https://numpy.org/doc/stable/reference/generated/numpy.mean.html" },
  std: { titulo: "numpy.std", url: "https://numpy.org/doc/stable/reference/generated/numpy.std.html" },
  indexado: { titulo: "Indexado", url: "https://numpy.org/doc/stable/user/basics.indexing.html" },
  diff: { titulo: "numpy.diff", url: "https://numpy.org/doc/stable/reference/generated/numpy.diff.html" },
  round: { titulo: "numpy.round", url: "https://numpy.org/doc/stable/reference/generated/numpy.round.html" },
  guia: { titulo: "Guía de NumPy para principiantes", url: "https://numpy.org/doc/stable/user/absolute_beginners.html" },
} as const;

const S = {
  signal: { titulo: "scipy.signal", url: "https://docs.scipy.org/doc/scipy/reference/signal.html" },
  findPeaks: { titulo: "scipy.signal.find_peaks", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.find_peaks.html" },
  butter: { titulo: "scipy.signal.butter", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.butter.html" },
  filtfilt: { titulo: "scipy.signal.filtfilt", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.filtfilt.html" },
  detrend: { titulo: "scipy.signal.detrend", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.detrend.html" },
} as const;

type Extra = { docs?: Bloque["docs"]; nota?: string };

const t = (contenido: string, extra: Extra = {}): Bloque => ({
  tipo: "teoria",
  contenido,
  ...extra,
});

const c = (
  contenido: string,
  salida: string | null = null,
  extra: Extra = {},
): Bloque => ({
  tipo: "codigo",
  contenido,
  lenguaje: "python",
  salida,
  ...extra,
});

const e = (
  enunciado: string,
  plantilla: string,
  esperado: string,
  pista: string,
): Ejercicio => ({ enunciado, plantilla, esperado, pista });

// ---------------------------------------------------------------------------
// Sesión 1
// ---------------------------------------------------------------------------

const s1: Bloque[] = [
  t(`# Qué hace un bioingeniero con Python

La bioingeniería mide el cuerpo. Un electrocardiógrafo entrega miles de voltajes por minuto, una báscula un peso, un espirómetro un volumen de aire. Todo eso llega como números, y con números en cantidad hace falta un lenguaje que los ordene.

Python se usa para tres cosas en este campo: limpiar la señal que sale del instrumento, calcular a partir de ella una magnitud que signifique algo, y comprobar si esa magnitud cae dentro de un rango.

Este curso enseña Python desde cero con esos tres objetivos.`, {
    nota: "Los umbrales que aparecen a lo largo del curso están para practicar con el lenguaje, no para decidir sobre nadie. Un cálculo escrito en una clase no es un dispositivo médico: eso exige validación clínica, trazabilidad y certificación, que son otro oficio.",
  }),

  t(`# Guardar una medida

Una variable es un nombre asociado a un valor. Se crea con el operador de asignación, el signo igual (\`=\`), y no hay que declarar de qué tipo es el valor.

En una toma de constantes vitales cada medida va a su propia variable, con el nombre de lo que mide.`, {
    docs: [P.tipos],
    nota: "El nombre admite letras, números y guion bajo (_), y no puede empezar por número. Por convención se escribe en minúsculas y con guion bajo entre palabras, de modo que frecuencia_cardiaca es preferible a FrecuenciaCardiaca.",
  }),

  c(`frecuencia_cardiaca = 72
print(frecuencia_cardiaca)`, `72`, { docs: [P.tipos] }),

  t(`# Enteros y decimales

El tipo \`int\` guarda números enteros, sin parte decimal. Un recuento de latidos por minuto es un entero: no existen setenta y dos latidos y medio en una cuenta.

El tipo \`float\` guarda números con parte decimal. Una temperatura corporal es un float, porque la diferencia entre 36.9 y 37.4 importa.`, {
    docs: [P.tipos],
    nota: "El separador decimal en Python es el punto, no la coma, con independencia del idioma del sistema. Escribir 36,9 no produce un error: produce una tupla de dos enteros, que es un valor perfectamente válido y completamente distinto.",
  }),

  c(`latidos = 72
temperatura = 36.9
print(type(latidos))
print(type(temperatura))`, `<class 'int'>
<class 'float'>`, { docs: [P.tipos] }),

  t(`# Por qué los decimales dan resultados inesperados

Un float no guarda el número decimal exacto, sino la fracción binaria más cercana que cabe en su representación. Por eso sumar dos valores aparentemente simples puede dar un resultado con cola.

En bioingeniería esto importa donde se acumulan muchas sumas: un caudal de infusión sumado miles de veces arrastra el error de cada paso.`, {
    docs: [P.float],
  }),

  c(`print(0.1 + 0.2)`, `0.30000000000000004`, { docs: [P.float] }),

  t(`# Redondear para informar

La función \`round()\` devuelve el número redondeado a los decimales indicados. Se usa al presentar el resultado, no al calcular: redondear en medio de una cadena de operaciones propaga el error en lugar de corregirlo.`, {
    docs: [P.round],
  }),

  c(`dosis = 0.1 + 0.2
print(round(dosis, 2))`, `0.3`, {
    docs: [P.round],
    nota: "round() aplica redondeo bancario: los empates van al par más cercano, de modo que round(2.5) da 2 y round(3.5) da 4. Cuando el criterio de redondeo forma parte de un protocolo, el módulo decimal permite fijarlo de forma explícita.",
  }),

  t(`# Operaciones aritméticas

Los operadores son la suma (\`+\`), la resta (\`-\`), la multiplicación (\`*\`) y la división (\`/\`). La división siempre devuelve un float, aunque el resultado sea exacto.

El índice de masa corporal es un ejemplo de las cuatro juntas: divide el peso en kilogramos entre el cuadrado de la altura en metros. El operador de potencia son dos asteriscos (\`**\`).`, {
    docs: [P.tipos],
  }),

  c(`peso = 70
altura = 1.75
imc = peso / altura ** 2
print(round(imc, 1))`, `22.9`, {
    docs: [P.tipos],
    nota: "El operador de potencia tiene más precedencia que la división, así que altura ** 2 se calcula antes de dividir. Escribir peso / altura ** 2 y peso / (altura ** 2) da el mismo resultado; los paréntesis solo hacen explícito lo que ya ocurre.",
  }),

  t(`# Interpolar valores en un texto

Un literal de cadena formateado, o f-string, lleva la letra \`f\` delante de la comilla de apertura. Dentro, lo que va entre llaves se sustituye por el valor de esa expresión.

Es la forma de componer la línea de un informe sin concatenar trozos a mano.`, {
    docs: [P.fstring],
  }),

  c(`paciente = "H-4471"
temperatura = 37.4
print(f"Paciente {paciente}: {temperatura} grados")`, `Paciente H-4471: 37.4 grados`, {
    docs: [P.fstring],
  }),

  t(`# Fijar los decimales al presentar

Dentro de las llaves, tras los dos puntos (\`:\`), se indica el formato de salida. El especificador \`.2f\` fija dos decimales, rellenando con ceros si hace falta.

En un informe clínico esto no es estética: una tabla donde cada fila muestra un número de decimales distinto se lee mal y se compara peor.`, {
    docs: [P.formato],
  }),

  c(`imc = 70 / 1.75 ** 2
print(f"IMC: {imc:.2f}")`, `IMC: 22.86`, { docs: [P.formato] }),

  t(`# Convertir lo que llega como texto

Un instrumento que escribe en un archivo entrega texto, no números. La función \`int()\` convierte a entero y la función \`float()\` convierte a decimal.

Sin la conversión, el operador más uniría dos cadenas en lugar de sumar, o fallaría al mezclar tipos distintos.`, {
    docs: [P.int, P.floatFn],
  }),

  c(`lectura = "36.8"
temperatura = float(lectura)
print(temperatura + 0.5)`, `37.3`, {
    docs: [P.floatFn],
    nota: "float() acepta espacios alrededor y notación científica, de modo que float(\" 3.6e1 \") devuelve 36.0. Lo que rechaza con ValueError es cualquier cosa que no sea un número, incluida la cadena vacía que deja un sensor cuando no midió nada.",
  }),

  t(`# Comparar contra un rango

Los operadores de comparación son mayor que (\`>\`), menor que (\`<\`), mayor o igual (\`>=\`), menor o igual (\`<=\`), igual (\`==\`) y distinto (\`!=\`). Todos devuelven un valor del tipo \`bool\`, que solo puede ser \`True\` o \`False\`.

Comprobar si una medida cae en un rango es la operación más repetida de todo el campo.`, {
    docs: [P.comparaciones],
  }),

  c(`temperatura = 38.2
print(temperatura > 37.5)`, `True`, { docs: [P.comparaciones] }),

  t(`# Encadenar dos condiciones

El operador \`and\` da verdadero solo si las dos condiciones lo son. El operador \`or\` da verdadero si al menos una lo es.

Python además permite encadenar comparaciones, de modo que \`60 <= fc <= 100\` se escribe tal cual y se lee como en matemáticas.`, {
    docs: [P.bool],
  }),

  c(`fc = 72
print(60 <= fc <= 100)`, `True`, {
    docs: [P.bool],
    nota: "La forma encadenada evalúa fc una sola vez, mientras que escribirla como 60 <= fc and fc <= 100 la evalúa dos. Con una variable la diferencia es nula; con una llamada a función que tarda o que tiene efectos, no.",
  }),

  t(`# Cierre

Con esto ya se puede tomar una medida, calcular a partir de ella una magnitud y comprobar si cae en un rango, que son los tres pasos de cualquier control de constantes.

La sesión siguiente pasa de la medida suelta a la serie: qué hacer cuando en lugar de una temperatura hay diez mil muestras seguidas.`),
];

const ej1: Record<string, Ejercicio> = {
  "guardar-una-medida": e(
    "Asigna el valor 118 a la variable presion_sistolica para que la línea siguiente lo imprima.",
    "presion_sistolica = ___\nprint(presion_sistolica)",
    "118",
    "Una asignación de un número no lleva comillas.",
  ),
  "enteros-y-decimales": e(
    "Completa la función que devuelve el tipo de un valor, para que imprima la clase de una temperatura con decimales.",
    "print(___(36.9))",
    "<class 'float'>",
    "Cuatro letras: es la función incorporada que recibe un objeto y devuelve su clase.",
  ),
  "por-que-los-decimales-dan-resultados-inesperados": e(
    "Completa la suma que muestra el error de representación del punto flotante.",
    "print(0.1 + ___)",
    "0.30000000000000004",
    "Es el número que sumado a una décima debería dar tres décimas exactas.",
  ),
  "redondear-para-informar": e(
    "Completa la función que redondea el caudal a dos decimales antes de informarlo.",
    "caudal = 12.34567\nprint(___(caudal, 2))",
    "12.35",
    "Cinco letras: el verbo redondear en inglés.",
  ),
  "operaciones-aritmeticas": e(
    "Completa el operador de potencia para elevar la altura al cuadrado en el cálculo del índice de masa corporal.",
    "peso = 70\naltura = 1.75\nprint(round(peso / altura ___ 2, 1))",
    "22.9",
    "Son dos veces el mismo símbolo que también sirve para multiplicar.",
  ),
  "interpolar-valores-en-un-texto": e(
    "Marca la cadena como literal formateado para que la llave se sustituya por el valor.",
    'saturacion = 97\nprint(___"Saturación: {saturacion}%")',
    "Saturación: 97%",
    "Una sola letra delante de la comilla de apertura, sin espacio de por medio.",
  ),
  "fijar-los-decimales-al-presentar": e(
    "Completa el especificador que fija dos decimales, para que 22.857 se imprima como 22.86.",
    'imc = 22.857\nprint(f"IMC: {imc:___}")',
    "IMC: 22.86",
    "Un punto, la cantidad de decimales y la letra del formato de coma fija.",
  ),
  "convertir-lo-que-llega-como-texto": e(
    "Convierte la lectura del instrumento a decimal para poder sumarle medio grado.",
    'lectura = "36.8"\nprint(___(lectura) + 0.5)',
    "37.3",
    "La función lleva el mismo nombre que el tipo de los números con decimales.",
  ),
  "comparar-contra-un-rango": e(
    "Completa la comparación para que dé True: la temperatura tiene que superar el umbral.",
    "temperatura = 38.2\nprint(temperatura ___ 37.5)",
    "True",
    "Un solo carácter, el que se abre hacia el número más grande.",
  ),
  "encadenar-dos-condiciones": e(
    "Completa el operador que exige que se cumplan las dos condiciones a la vez.",
    "fc = 72\nprint(fc >= 60 ___ fc <= 100)",
    "True",
    "Tres letras: la conjunción copulativa en inglés.",
  ),
};

// ---------------------------------------------------------------------------
// Sesión 2
// ---------------------------------------------------------------------------

const s2: Bloque[] = [
  t(`# Una serie de medidas es una lista

Un registro no da una medida, da muchas seguidas. Una lista guarda esa secuencia en orden, entre corchetes (\`[\`, \`]\`) y con los elementos separados por comas.

El orden es el de la toma, así que la posición dentro de la lista es el instante en que se midió.`, {
    docs: [P.listas],
  }),

  c(`temperaturas = [36.4, 36.8, 37.1, 37.6, 38.2]
print(temperaturas)`, `[36.4, 36.8, 37.1, 37.6, 38.2]`, { docs: [P.listas] }),

  t(`# Acceder a una medida por su posición

La posición se indica entre corchetes y empieza en cero: el primer elemento ocupa la posición 0. Las posiciones negativas cuentan desde el final, de modo que la posición \`-1\` es la última medida tomada.`, {
    docs: [P.secuencias],
  }),

  c(`temperaturas = [36.4, 36.8, 37.1, 37.6, 38.2]
print(temperaturas[0])
print(temperaturas[-1])`, `36.4
38.2`, {
    docs: [P.secuencias],
    nota: "Pedir una posición que no existe lanza IndexError. En una serie que llega de un sensor conviene comprobar la longitud antes de acceder a una posición concreta, porque una toma interrumpida deja menos muestras de las previstas.",
  }),

  t(`# Recortar una ventana

Una rebanada devuelve un tramo de la lista. Se escribe con dos posiciones separadas por dos puntos (\`:\`): la primera se incluye y la segunda no.

Es la operación con la que se aísla el fragmento de señal que interesa, por ejemplo los diez segundos en los que el paciente hizo esfuerzo.`, {
    docs: [P.rebanadas],
  }),

  c(`temperaturas = [36.4, 36.8, 37.1, 37.6, 38.2]
print(temperaturas[1:4])`, `[36.8, 37.1, 37.6]`, {
    docs: [P.rebanadas],
    nota: "Que el extremo derecho quede fuera tiene una consecuencia práctica útil: la longitud del tramo es la resta de los dos índices, y dos rebanadas consecutivas como [0:3] y [3:6] no comparten ningún elemento ni se saltan ninguno.",
  }),

  t(`# Recorrer la serie

La sentencia \`for\` repite un bloque de código una vez por cada elemento de la secuencia. La variable que va delante de \`in\` toma en cada vuelta el valor del elemento correspondiente.`, {
    docs: [P.for],
  }),

  c(`temperaturas = [36.4, 37.6, 38.2]
for medida in temperaturas:
    print(medida)`, `36.4
37.6
38.2`, { docs: [P.for] }),

  t(`# Estadísticos con las funciones incorporadas

La función \`len()\` devuelve cuántos elementos hay, la función \`sum()\` los suma, la función \`min()\` devuelve el menor y la función \`max()\` el mayor.

Con esas cuatro se calcula la media, que es la suma dividida entre la cantidad.`, {
    docs: [P.len, P.sum, P.min, P.max],
  }),

  c(`temperaturas = [36.4, 36.8, 37.1, 37.6, 38.2]
media = sum(temperaturas) / len(temperaturas)
print(round(media, 2))
print(min(temperaturas), max(temperaturas))`, `37.22
36.4 38.2`, {
    docs: [P.sum, P.len],
    nota: "Para la desviación típica y la mediana está el módulo statistics de la biblioteca estándar, que evita reescribir fórmulas conocidas. En series largas, sin embargo, lo habitual es pasar a NumPy, que es la última sesión de este curso.",
  }),

  t(`# Quedarse solo con lo que interesa

Una lista por comprensión construye una lista nueva a partir de otra. Se escribe entre corchetes, con la expresión primero, después el \`for\` y al final la condición con \`if\`.

Es la forma de aislar las medidas que se salen de un rango sin escribir un bucle con una lista vacía y un \`append\`.`, {
    docs: [P.comprension],
  }),

  c(`temperaturas = [36.4, 36.8, 37.1, 37.6, 38.2]
fiebre = [x for x in temperaturas if x >= 37.5]
print(fiebre)`, `[37.6, 38.2]`, { docs: [P.comprension] }),

  t(`# Transformar toda la serie

La misma construcción, sin la condición, aplica una operación a cada elemento. Convertir una serie entera de grados Celsius a Fahrenheit cabe en una línea.`, {
    docs: [P.comprension],
  }),

  c(`celsius = [36.4, 37.6]
fahrenheit = [round(x * 9 / 5 + 32, 1) for x in celsius]
print(fahrenheit)`, `[97.5, 99.7]`, { docs: [P.comprension] }),

  t(`# Emparejar el instante con la medida

La función \`zip()\` recorre dos secuencias a la vez y entrega los elementos emparejados. Sirve para llevar juntos el eje de tiempo y el de valores.`, {
    docs: [P.zip],
  }),

  c(`minutos = [0, 5, 10]
temperaturas = [36.4, 37.6, 38.2]
for minuto, medida in zip(minutos, temperaturas):
    print(f"min {minuto}: {medida}")`, `min 0: 36.4
min 5: 37.6
min 10: 38.2`, {
    docs: [P.zip],
    nota: "zip() se detiene en la secuencia más corta, sin avisar. Cuando dos series deberían tener la misma longitud y no la tienen, ese silencio esconde el problema: el parámetro strict=True hace que la diferencia lance un error en lugar de recortar.",
  }),

  t(`# Numerar las muestras

La función \`enumerate()\` entrega, en cada vuelta, la posición y el elemento. Evita llevar un contador a mano, que es de donde salen los errores de desfase por uno.`, {
    docs: [P.enumerate],
  }),

  c(`temperaturas = [36.4, 37.6, 38.2]
for i, medida in enumerate(temperaturas):
    print(i, medida)`, `0 36.4
1 37.6
2 38.2`, {
    docs: [P.enumerate],
    nota: "El parámetro start fija desde qué número empieza a contar, de modo que enumerate(serie, start=1) numera las muestras desde uno. La posición dentro de la lista sigue siendo la misma; lo único que cambia es la etiqueta que se imprime.",
  }),

  t(`# Cierre

Con listas ya se puede guardar una serie completa, recortarla, recorrerla, resumirla y filtrarla.

La sesión siguiente agrupa esos cálculos en funciones y añade las decisiones: qué hacer cuando el valor obliga a tomar un camino u otro.`),
];

const ej2: Record<string, Ejercicio> = {
  "una-serie-de-medidas-es-una-lista": e(
    "Completa los signos que delimitan una lista.",
    "serie = ___36.4, 36.8, 37.1]\nprint(len(serie))",
    "3",
    "Es el corchete de apertura, el mismo que se usa para indexar.",
  ),
  "acceder-a-una-medida-por-su-posicion": e(
    "Completa la posición que devuelve la última medida de la serie.",
    "serie = [36.4, 36.8, 38.2]\nprint(serie[___])",
    "38.2",
    "Las posiciones negativas cuentan desde el final; la última es la menos uno.",
  ),
  "recortar-una-ventana": e(
    "Completa la rebanada que devuelve la segunda y la tercera medida.",
    "serie = [36.4, 36.8, 37.1, 37.6]\nprint(serie[___])",
    "[36.8, 37.1]",
    "Dos posiciones separadas por dos puntos; la de la derecha queda fuera.",
  ),
  "recorrer-la-serie": e(
    "Completa la palabra clave que abre el bucle sobre la secuencia.",
    "serie = [36.4, 37.6]\n___ medida in serie:\n    print(medida)",
    "36.4\n37.6",
    "Tres letras: la sentencia que repite una vez por elemento.",
  ),
  "estadisticos-con-las-funciones-incorporadas": e(
    "Completa la función que suma todos los elementos, para calcular la media.",
    "serie = [36.4, 36.8, 37.1]\nprint(round(___(serie) / len(serie), 2))",
    "36.77",
    "Tres letras: el verbo sumar en inglés.",
  ),
  "quedarse-solo-con-lo-que-interesa": e(
    "Completa la palabra clave que filtra los elementos de la comprensión.",
    "serie = [36.4, 37.6, 38.2]\nprint([x for x in serie ___ x >= 37.5])",
    "[37.6, 38.2]",
    "Dos letras: la misma palabra que introduce una condición.",
  ),
  "transformar-toda-la-serie": e(
    "Completa el sumando que cierra la conversión de grados Celsius a Fahrenheit.",
    "celsius = [36.4]\nprint([round(x * 9 / 5 + ___, 1) for x in celsius])",
    "[97.5]",
    "Es la temperatura en Fahrenheit a la que se congela el agua.",
  ),
  "emparejar-el-instante-con-la-medida": e(
    "Completa la función que recorre las dos series a la vez.",
    "minutos = [0, 5]\nserie = [36.4, 37.6]\nfor m, v in ___(minutos, serie):\n    print(m, v)",
    "0 36.4\n5 37.6",
    "Tres letras: la palabra inglesa de la cremallera que une dos lados.",
  ),
  "numerar-las-muestras": e(
    "Completa la función que entrega la posición junto con el elemento.",
    "serie = [36.4, 37.6]\nfor i, v in ___(serie):\n    print(i, v)",
    "0 36.4\n1 37.6",
    "Nueve letras: el verbo enumerar en inglés.",
  ),
};


// ---------------------------------------------------------------------------
// Sesión 3
// ---------------------------------------------------------------------------

const s3: Bloque[] = [
  t(`# Una función encapsula un cálculo

Una función agrupa unas líneas bajo un nombre para poder repetirlas sin copiarlas. Se define con la palabra clave \`def\`, seguida del nombre, los parámetros entre paréntesis y dos puntos. La palabra clave \`return\` indica qué devuelve.

El índice de masa corporal se calculó en la primera sesión con dos variables sueltas. Convertirlo en función permite aplicarlo a cualquier paciente y, sobre todo, corregir la fórmula en un solo sitio.`, {
    docs: [P.def],
  }),

  c(`def imc(peso, altura):
    return peso / altura ** 2

print(round(imc(70, 1.75), 1))
print(round(imc(82, 1.68), 1))`, `22.9
29.1`, {
    docs: [P.def],
    nota: "Una función sin return devuelve None. No es un error, pero sí una fuente de confusión frecuente: si el cálculo se imprime en lugar de devolverse, el valor se ve por pantalla y se pierde para quien llamó.",
  }),

  t(`# Parámetros con valor por defecto

Un parámetro puede traer un valor por defecto, que se usa cuando quien llama no lo indica. Se escribe con el signo igual en la propia definición.

Sirve para las constantes de un protocolo: se dejan puestas y se cambian solo en el caso que lo pida.`, {
    docs: [P.defaults],
  }),

  c(`def volumen_minuto(volumen_corriente, frecuencia=12):
    return volumen_corriente * frecuencia

print(volumen_minuto(500))
print(volumen_minuto(500, 20))`, `6000
10000`, {
    docs: [P.defaults],
    nota: "El valor por defecto se evalúa una sola vez, al definir la función. Por eso nunca debe ser una lista o un diccionario vacíos: esa misma lista se compartiría entre todas las llamadas y acumularía lo que dejó la anterior.",
  }),

  t(`# Devolver más de un valor

Una función puede devolver varios valores separados por comas. Lo que devuelve es una tupla, que se reparte en varias variables al asignarla.

Un resumen de una serie es el caso típico: interesa la media y el rango a la vez, y calcularlos en dos funciones distintas obligaría a recorrer la serie dos veces.`, {
    docs: [P.tuplas],
  }),

  c(`def resumen(serie):
    return min(serie), max(serie)

minimo, maximo = resumen([36.4, 37.6, 38.2])
print(minimo, maximo)`, `36.4 38.2`, { docs: [P.tuplas] }),

  t(`# Decidir entre varios casos

La sentencia \`if\` ejecuta un bloque cuando la condición es verdadera. La palabra clave \`elif\` añade otra condición que solo se comprueba si las anteriores fallaron, y \`else\` recoge lo que no encajó en ninguna.

El orden importa: la primera condición que se cumple gana, así que los tramos se escriben del más restrictivo al más amplio.`, {
    docs: [P.if],
  }),

  c(`def clasificar(sistolica):
    if sistolica >= 140:
        return "alta"
    elif sistolica >= 130:
        return "elevada"
    else:
        return "normal"

print(clasificar(145))
print(clasificar(132))
print(clasificar(118))`, `alta
elevada
normal`, {
    docs: [P.if],
    nota: "Estos cortes están puestos para practicar con la sentencia, no para clasificar a nadie: los umbrales reales dependen de la guía clínica que se siga, de la edad y de cómo se tomó la medida, y varían entre sociedades médicas.",
  }),

  t(`# Rechazar una entrada imposible

Una altura de cero metros no es un dato raro, es un dato imposible: dividir por ella no da un resultado malo, da un error. La sentencia \`raise\` interrumpe la función y señala el problema.

La excepción \`ValueError\` es la que corresponde cuando el tipo es correcto pero el valor no tiene sentido.`, {
    docs: [P.raise, P.valueError],
  }),

  c(`def imc(peso, altura):
    if altura <= 0:
        raise ValueError("La altura debe ser mayor que cero")
    return peso / altura ** 2

print(round(imc(70, 1.75), 1))`, `22.9`, {
    docs: [P.raise],
    nota: "Comprobar antes de calcular se llama validación de entrada, y en cualquier sistema que toque datos de personas es obligatorio. Un valor imposible que pasa sin avisar no desaparece: reaparece más adelante convertido en un resultado plausible pero falso.",
  }),

  t(`# Capturar el error

La sentencia \`try\` ejecuta un bloque y la palabra clave \`except\` recoge la excepción si se produce. Así el programa sigue en lugar de detenerse.

Al procesar un archivo con miles de filas, una línea corrupta no debería interrumpir el proceso entero.`, {
    docs: [P.excepciones],
  }),

  c(`lecturas = ["36.8", "", "37.4"]
for texto in lecturas:
    try:
        print(float(texto))
    except ValueError:
        print("lectura no válida")`, `36.8
lectura no válida
37.4`, {
    docs: [P.excepciones],
    nota: "Conviene capturar la excepción concreta y no un except a secas. Un except sin tipo atrapa también los errores de programación propios, como un nombre mal escrito, y los convierte en un mensaje tranquilizador que oculta un fallo real.",
  }),

  t(`# La ficha del paciente

Un diccionario asocia claves con valores. Se escribe entre llaves (\`{\`, \`}\`), con la clave y el valor separados por dos puntos.

Una lista sirve para una serie de la misma magnitud; un diccionario sirve para un conjunto de magnitudes distintas que describen a un mismo sujeto.`, {
    docs: [P.dicc],
  }),

  c(`paciente = {"codigo": "H-4471", "fc": 72, "temperatura": 37.4}
print(paciente["fc"])`, `72`, {
    docs: [P.dicc],
    nota: "Pedir una clave que no existe lanza KeyError. El método get() devuelve None en su lugar, o el valor que se le indique como segundo argumento, que es lo apropiado cuando un campo puede faltar legítimamente.",
  }),

  t(`# Recorrer la ficha

El método \`items()\` entrega, en cada vuelta, la clave y el valor. Es la forma de imprimir una ficha completa sin nombrar cada campo a mano.`, {
    docs: [P.items],
  }),

  c(`paciente = {"fc": 72, "temperatura": 37.4}
for campo, valor in paciente.items():
    print(f"{campo}: {valor}")`, `fc: 72
temperatura: 37.4`, { docs: [P.items] }),

  t(`# Repetir hasta cumplir una condición

La sentencia \`while\` repite mientras la condición sea verdadera. A diferencia de \`for\`, no recorre una secuencia: sirve cuando no se sabe de antemano cuántas vueltas harán falta.

El descenso de un fármaco en sangre por eliminación de primer orden es un ejemplo: se repite hasta bajar del umbral terapéutico.`, {
    docs: [P.while],
  }),

  c(`concentracion = 100.0
horas = 0
while concentracion > 25:
    concentracion = concentracion * 0.5
    horas += 4
print(horas, round(concentracion, 1))`, `8 25.0`, {
    docs: [P.while],
    nota: "Si la condición nunca se vuelve falsa, el bucle no termina. Aquí la concentración baja en cada vuelta, así que acaba cruzando el umbral; cuando el avance depende de un dato externo conviene añadir un tope de vueltas.",
  }),

  t(`# Cierre

Con funciones, condiciones, validación y diccionarios ya se puede escribir un cálculo reutilizable que rechaza lo imposible y no se cae con una fila corrupta.

La última sesión pasa a NumPy y SciPy, que es lo que se usa cuando la serie tiene decenas de miles de muestras y las listas de Python se quedan cortas.`),
];

const ej3: Record<string, Ejercicio> = {
  "una-funcion-encapsula-un-calculo": e(
    "Completa la palabra clave que define una función.",
    "___ imc(peso, altura):\n    return peso / altura ** 2\n\nprint(round(imc(70, 1.75), 1))",
    "22.9",
    "Tres letras: la abreviatura del verbo definir en inglés.",
  ),
  "parametros-con-valor-por-defecto": e(
    "Completa el valor por defecto de la frecuencia para que la llamada sin segundo argumento dé 6000.",
    "def volumen_minuto(vc, frecuencia=___):\n    return vc * frecuencia\n\nprint(volumen_minuto(500))",
    "6000",
    "Es el número de respiraciones por minuto que multiplicado por 500 da seis mil.",
  ),
  "devolver-mas-de-un-valor": e(
    "Completa la palabra clave que hace que la función entregue el par de valores.",
    "def resumen(serie):\n    ___ min(serie), max(serie)\n\nprint(resumen([36.4, 38.2]))",
    "(36.4, 38.2)",
    "Seis letras: el verbo devolver en inglés.",
  ),
  "decidir-entre-varios-casos": e(
    "Completa la palabra clave que añade una condición alternativa a un if.",
    'def clasificar(s):\n    if s >= 140:\n        return "alta"\n    ___ s >= 130:\n        return "elevada"\n    return "normal"\n\nprint(clasificar(132))',
    "elevada",
    "Cuatro letras: la contracción inglesa de «si no, si».",
  ),
  "rechazar-una-entrada-imposible": e(
    "Completa la sentencia que interrumpe la función señalando el problema.",
    'def imc(peso, altura):\n    if altura <= 0:\n        ___ ValueError("altura no válida")\n    return peso / altura ** 2\n\nprint(round(imc(70, 1.75), 1))',
    "22.9",
    "Cinco letras: el verbo levantar o lanzar en inglés.",
  ),
  "capturar-el-error": e(
    "Completa la palabra clave que recoge la excepción para que el bucle continúe.",
    'for texto in ["36.8", ""]:\n    try:\n        print(float(texto))\n    ___ ValueError:\n        print("no válida")',
    "36.8\nno válida",
    "Seis letras: la preposición inglesa que significa «excepto».",
  ),
  "la-ficha-del-paciente": e(
    "Completa el signo que abre un diccionario.",
    'paciente = ___"fc": 72}\nprint(paciente["fc"])',
    "72",
    "Es la llave de apertura, la misma que delimita una expresión dentro de un f-string.",
  ),
  "recorrer-la-ficha": e(
    "Completa el método que entrega la clave y el valor en cada vuelta.",
    'paciente = {"fc": 72}\nfor campo, valor in paciente.___():\n    print(campo, valor)',
    "fc 72",
    "Cinco letras: el plural inglés de «elemento».",
  ),
  "repetir-hasta-cumplir-una-condicion": e(
    "Completa la sentencia que repite mientras la condición se cumpla.",
    "c = 100.0\nhoras = 0\n___ c > 25:\n    c = c * 0.5\n    horas += 4\nprint(horas)",
    "8",
    "Cinco letras: la conjunción inglesa «mientras».",
  ),
};

// ---------------------------------------------------------------------------
// Sesión 4
// ---------------------------------------------------------------------------

// Deja listos NumPy, SciPy y una señal de electrocardiograma sintética, para
// que los ejercicios no tengan que reconstruirla cada uno. El temario sí la
// construye paso a paso: aquí solo se repite lo que allí se explica.
const PRELUDIO_BIO = `import numpy as np
from scipy.signal import find_peaks, butter, filtfilt, detrend

fs = 250
tiempo = np.arange(0, 4, 1 / fs)
ecg = np.zeros_like(tiempo)
for _latido in np.arange(0.4, 4, 0.8):
    ecg += np.exp(-((tiempo - _latido) ** 2) / (2 * 0.01 ** 2))`;

const s4: Bloque[] = [
  t(`# Por qué no basta con una lista

Una lista de Python guarda objetos de cualquier tipo, cada uno en su sitio de la memoria. Eso la hace flexible y lenta.

Un arreglo de NumPy guarda números del mismo tipo, contiguos en memoria, y opera sobre todos a la vez. Con diez mil muestras la diferencia deja de ser teórica.

NumPy no viene con Python: se instala con \`pip install numpy\`. Por convención se importa con el nombre corto \`np\`.`, {
    docs: [N.guia],
    nota: "La contigüidad es lo que permite que la operación se delegue a código compilado y a las instrucciones vectoriales del procesador, que aplican la misma cuenta a varios números en un solo ciclo. Una lista obliga a recorrer punteros uno por uno.",
  }),

  c(`import numpy as np

serie = np.array([36.4, 36.8, 37.1, 37.6, 38.2])
print(serie)
print(serie.dtype)`, `[36.4 36.8 37.1 37.6 38.2]
float64`, {
    docs: [N.array],
    nota: "El atributo dtype es el tipo de todos los elementos. Al mezclar enteros y decimales NumPy elige el tipo que los admite a todos, así que un solo decimal convierte el arreglo entero en float64.",
  }),

  t(`# Operar sobre toda la serie de una vez

Aplicar una operación a un arreglo la aplica a cada elemento, sin bucle. Esto se llama vectorización, y es la forma normal de escribir cálculos con NumPy.

La conversión de Celsius a Fahrenheit, que en la segunda sesión ocupó una comprensión de lista, aquí es la fórmula tal cual.`, {
    docs: [N.vectorizacion],
  }),

  c(`serie = np.array([36.4, 37.6])
print(np.round(serie * 9 / 5 + 32, 1))`, `[97.5 99.7]`, { docs: [N.round] }),

  t(`# El eje de tiempo

Una señal biomédica se muestrea a una frecuencia fija. Si el equipo toma 250 muestras por segundo, cada muestra dista de la siguiente una fracción de segundo igual a uno partido por esa frecuencia.

La función \`np.arange()\` construye ese eje: recibe el inicio, el final y el paso.`, {
    docs: [N.arange],
  }),

  c(`fs = 250
tiempo = np.arange(0, 4, 1 / fs)
print(len(tiempo))
print(tiempo[:4])`, `1000
[0.    0.004 0.008 0.012]`, {
    docs: [N.arange],
    nota: "El extremo derecho queda fuera, igual que en las rebanadas, así que el último instante es 3.996 y no 4. Con pasos decimales conviene np.linspace(), que recibe cuántos puntos se quieren y evita que el redondeo del paso acumule diferencias.",
  }),

  t(`# Un electrocardiograma sintético

Para practicar hace falta una señal. Esta se construye sumando una campana estrecha en cada latido, separados ocho décimas de segundo, que corresponden a setenta y cinco latidos por minuto.

No es un electrocardiograma real: es un modelo del complejo QRS, la deflexión más marcada del trazado, que es la que se usa para contar latidos.`, {
    docs: [N.vectorizacion],
  }),

  c(`ecg = np.zeros_like(tiempo)
for latido in np.arange(0.4, 4, 0.8):
    ecg += np.exp(-((tiempo - latido) ** 2) / (2 * 0.01 ** 2))
print(len(ecg))
print(round(float(ecg.max()), 2))`, `1000
1.0`, {
    docs: [N.array],
    nota: "np.zeros_like() crea un arreglo de ceros con la misma forma y el mismo tipo que el que recibe, que es la manera habitual de reservar el sitio del resultado. La campana es una gaussiana, y el 0.01 del denominador es su anchura en segundos.",
  }),

  t(`# Resumir la señal

Los métodos \`mean()\` y \`std()\` calculan la media y la desviación típica del arreglo. Sobre una señal biomédica la media indica dónde está la línea de base y la desviación cuánto se mueve alrededor de ella.`, {
    docs: [N.mean, N.std],
  }),

  c(`print(round(float(ecg.mean()), 4))
print(round(float(ecg.std()), 4))`, `0.0313
0.1455`, {
    docs: [N.mean, N.std],
    nota: "NumPy divide por n al calcular la desviación, mientras que el módulo statistics de la biblioteca estándar divide por n menos uno. Para pasar al segundo criterio, que es el habitual cuando la serie es una muestra y no la población, se usa el parámetro ddof=1.",
  }),

  t(`# Recortar una ventana

El indexado de un arreglo funciona como el de una lista, con la posición entre corchetes y las rebanadas con dos puntos.

Para pasar de segundos a posiciones se multiplica por la frecuencia de muestreo: el segundo uno está en la muestra 250.`, {
    docs: [N.indexado],
  }),

  c(`ventana = ecg[int(1 * fs):int(2 * fs)]
print(len(ventana))
print(round(float(ventana.max()), 2))`, `250
1.0`, { docs: [N.indexado] }),

  t(`# Seleccionar por condición

Comparar un arreglo con un número devuelve otro arreglo, del mismo tamaño, con un booleano por posición. Ese arreglo sirve como máscara: usado como índice, deja pasar solo las posiciones verdaderas.

Es la forma de quedarse con las muestras que superan un umbral sin escribir ningún bucle.`, {
    docs: [N.indexado],
  }),

  c(`altas = ecg[ecg > 0.5]
print(len(altas))`, `25`, {
    docs: [N.indexado],
    nota: "El método sum() sobre la máscara cuenta cuántas cumplen la condición, porque True vale uno y False vale cero. Es más barato que construir el arreglo filtrado cuando solo interesa el recuento.",
  }),

  t(`# Quitar la deriva de la línea de base

El trazado real no se mantiene plano: la respiración y el movimiento de los electrodos lo desplazan poco a poco. Esa deriva se llama vagabundeo de la línea de base.

La función \`detrend()\` de SciPy resta la tendencia lineal y devuelve la señal centrada.`, {
    docs: [S.detrend],
  }),

  c(`from scipy.signal import detrend

con_deriva = ecg + tiempo * 0.05
corregida = detrend(con_deriva)
print(round(float(con_deriva.mean()), 4))
print(round(float(corregida.mean()), 4))`, `0.1312
0.0`, {
    docs: [S.detrend],
    nota: "detrend() resta una recta ajustada por mínimos cuadrados, así que solo corrige derivas aproximadamente lineales. Cuando la línea de base ondula, lo apropiado es un filtro de paso alto con una frecuencia de corte por debajo de la del latido.",
  }),

  t(`# Filtrar el ruido de alta frecuencia

Un registro real trae ruido eléctrico por encima de la banda de interés. Un filtro de paso bajo lo atenúa dejando pasar lo que está por debajo de la frecuencia de corte.

La función \`butter()\` diseña el filtro y la función \`filtfilt()\` lo aplica. La frecuencia de corte se indica respecto a la frecuencia de Nyquist, que es la mitad de la de muestreo.`, {
    docs: [S.butter, S.filtfilt],
  }),

  c(`from scipy.signal import butter, filtfilt

b, a = butter(4, 40 / (fs / 2), btype="low")
suave = filtfilt(b, a, ecg)
print(round(float(suave.max()), 3))`, `0.979`, {
    docs: [S.filtfilt],
    nota: "filtfilt() recorre la señal hacia delante y hacia atrás, de modo que los desfases de las dos pasadas se cancelan y ningún pico se desplaza en el tiempo. Eso es imprescindible aquí, porque un latido movido unos milisegundos falsea el intervalo entre latidos.",
  }),

  t(`# Detectar los latidos

La función \`find_peaks()\` devuelve las posiciones de los máximos locales. El parámetro \`height\` descarta los que no superan una altura y el parámetro \`distance\` impide que dos detecciones caigan demasiado cerca.

Ese segundo parámetro es el que evita contar dos veces el mismo complejo: a 250 muestras por segundo, tres décimas de segundo son 75 muestras.`, {
    docs: [S.findPeaks],
  }),

  c(`from scipy.signal import find_peaks

picos, _ = find_peaks(ecg, height=0.5, distance=int(0.3 * fs))
print(len(picos))
print(picos)`, `5
[100 300 500 700 900]`, {
    docs: [S.findPeaks],
    nota: "El guion bajo recoge el segundo valor devuelto, un diccionario con las propiedades de cada pico, que aquí no se usa. Es una convención de Python para dejar claro que ese valor se descarta a propósito y no por olvido.",
  }),

  t(`# De los latidos a la frecuencia cardiaca

La función \`np.diff()\` devuelve las diferencias entre elementos consecutivos. Aplicada a las posiciones de los picos da los intervalos entre latidos en muestras; dividiendo entre la frecuencia de muestreo quedan en segundos.

La frecuencia cardiaca en latidos por minuto es sesenta partido por el intervalo medio.`, {
    docs: [N.diff],
  }),

  c(`intervalos = np.diff(picos) / fs
print(round(float(intervalos.mean()), 3))
print(round(float(60 / intervalos.mean()), 1))`, `0.8
75.0`, {
    docs: [N.diff],
    nota: "La desviación de esos intervalos es la variabilidad de la frecuencia cardiaca, un indicador de uso extendido en fisiología. Aquí sale cero porque la señal se construyó con latidos perfectamente regulares, cosa que no ocurre en ningún registro real.",
  }),

  t(`# Cierre

El recorrido completo está hecho: una señal, la limpieza de su línea de base, el filtrado del ruido, la detección de los latidos y el cálculo de una magnitud fisiológica a partir de ellos.

El paso siguiente natural es leer registros reales en lugar de sintéticos, con pandas para los archivos tabulados y matplotlib para verlos. Y conviene repetirlo: nada de lo escrito aquí es un dispositivo médico.`, {
    docs: [N.guia, S.signal],
  }),
];

const ej4: Record<string, Ejercicio> = {
  "por-que-no-basta-con-una-lista": e(
    "Completa la función que convierte una lista de Python en un arreglo de NumPy.",
    "serie = np.___([36.4, 36.8])\nprint(serie.dtype)",
    "float64",
    "Cinco letras: la palabra inglesa para arreglo.",
  ),
  "operar-sobre-toda-la-serie-de-una-vez": e(
    "Completa la función de NumPy que redondea todos los elementos a la vez.",
    "serie = np.array([36.44, 37.68])\nprint(np.___(serie, 1))",
    "[36.4 37.7]",
    "Cinco letras, el mismo nombre que la función incorporada de Python que redondea.",
  ),
  "el-eje-de-tiempo": e(
    "Completa la función que construye el eje de tiempo con inicio, final y paso.",
    "print(len(np.___(0, 4, 1 / 250)))",
    "1000",
    "Seis letras: el equivalente de range con pasos decimales.",
  ),
  "un-electrocardiograma-sintetico": e(
    "Completa la función que reserva un arreglo de ceros con la misma forma que otro.",
    "base = np.___(tiempo)\nprint(len(base), float(base.max()))",
    "1000 0.0",
    "Dos palabras unidas por guion bajo: ceros y «como».",
  ),
  "resumir-la-senal": e(
    "Completa el método que devuelve la media del arreglo.",
    "print(round(float(ecg.___()), 4))",
    "0.0313",
    "Cuatro letras: la palabra inglesa para media.",
  ),
  "recortar-una-ventana": e(
    "Completa la posición inicial de la rebanada para quedarte con el segundo número dos.",
    "ventana = ecg[int(___ * fs):int(2 * fs)]\nprint(len(ventana))",
    "250",
    "Es el instante en segundos donde empieza esa ventana.",
  ),
  "seleccionar-por-condicion": e(
    "Completa la comparación que deja pasar solo las muestras por encima del umbral.",
    "altas = ecg[ecg ___ 0.5]\nprint(len(altas))",
    "25",
    "Un solo carácter, el que se abre hacia el número más grande.",
  ),
  "quitar-la-deriva-de-la-linea-de-base": e(
    "Completa la función de SciPy que resta la tendencia lineal de la señal.",
    "corregida = ___(ecg + tiempo * 0.05)\nprint(round(float(corregida.mean()), 4))",
    "0.0",
    "Siete letras: el prefijo de negación en inglés seguido de la palabra tendencia.",
  ),
  "filtrar-el-ruido-de-alta-frecuencia": e(
    "Completa la función que aplica el filtro en los dos sentidos para no desplazar los picos.",
    'b, a = butter(4, 40 / (fs / 2), btype="low")\nprint(round(float(___(b, a, ecg).max()), 3))',
    "0.979",
    "Ocho letras: la palabra filtro repetida, una por cada sentido del recorrido.",
  ),
  "detectar-los-latidos": e(
    "Completa el parámetro que impide que dos detecciones caigan demasiado cerca.",
    "picos, _ = find_peaks(ecg, height=0.5, ___=int(0.3 * fs))\nprint(len(picos))",
    "5",
    "Ocho letras: la palabra distancia en inglés.",
  ),
  "de-los-latidos-a-la-frecuencia-cardiaca": e(
    "Completa la función que calcula las diferencias entre picos consecutivos.",
    "picos, _ = find_peaks(ecg, height=0.5, distance=int(0.3 * fs))\nintervalos = np.___(picos) / fs\nprint(round(float(60 / intervalos.mean()), 1))",
    "75.0",
    "Cuatro letras: la abreviatura inglesa de diferencia.",
  ),
};

function armar(
  numero: number,
  titulo: string,
  bloques: Bloque[],
  ejercicios: Record<string, Ejercicio>,
  extra: { paquetes?: string[]; preludio?: string } = {},
): Leccion {
  // Los ejercicios se indexan por el identificador de la sección, que sale del
  // título. Si un título cambia sin cambiar la clave, el ejercicio deja de
  // aparecer en silencio: esta comprobación lo convierte en un fallo visible.
  const ids = new Set(idsDeSecciones(bloques).values());
  for (const clave of Object.keys(ejercicios)) {
    if (!ids.has(clave)) {
      throw new Error(
        `El curso de bioingeniería tiene un ejercicio para la sección "${clave}" de la sesión ${numero}, pero ninguna sección se llama así.`,
      );
    }
  }

  return {
    slug: `sesion-${numero}`,
    numero,
    titulo,
    bloques,
    secciones: derivarSecciones(bloques),
    ejercicios,
    ...extra,
  };
}

export const leccionesBio: Leccion[] = [
  armar(1, "Magnitudes y medidas clínicas", s1, ej1),
  armar(2, "Series de medidas", s2, ej2),
  armar(3, "Funciones, decisiones y validación", s3, ej3),
  // NumPy y SciPy solo hacen falta aquí: declararlos en el curso entero
  // obligaría a descargarlos ya en la primera sesión.
  armar(4, "NumPy y SciPy para señales biomédicas", s4, ej4, {
    paquetes: ["numpy", "scipy"],
    preludio: PRELUDIO_BIO,
  }),
];
