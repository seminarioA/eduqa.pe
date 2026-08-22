import { derivarSecciones, type Bloque, type Leccion } from "@/lib/cursos";

// Curso de Introducción a Python.
//
// Reglas de redacción de este contenido:
//   1. Sin emojis en títulos ni subtítulos.
//   2. Casi todo ejemplo cita la documentación oficial.
//   3. Un concepto por bloque de código.
//   4. Texto principal directo y sin coloquialismos. La precisión técnica
//      que no cabe ahí va en `nota`, debajo y en pequeño. Introductorio
//      no significa impreciso.

const D = {
  stdtypes: { titulo: "Tipos incorporados", url: "https://docs.python.org/3/library/stdtypes.html" },
  modeloDatos: { titulo: "Modelo de datos", url: "https://docs.python.org/3/reference/datamodel.html" },
  asignacion: { titulo: "Sentencias de asignación", url: "https://docs.python.org/3/reference/simple_stmts.html#assignment-statements" },
  numeric: { titulo: "Tipos numéricos", url: "https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex" },
  int: { titulo: "int()", url: "https://docs.python.org/3/library/functions.html#int" },
  float: { titulo: "float()", url: "https://docs.python.org/3/library/functions.html#float" },
  floatingPoint: { titulo: "Aritmética de punto flotante", url: "https://docs.python.org/3/tutorial/floatingpoint.html" },
  str: { titulo: "Cadenas de texto", url: "https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str" },
  strMethods: { titulo: "Métodos de cadena", url: "https://docs.python.org/3/library/stdtypes.html#string-methods" },
  bool: { titulo: "bool()", url: "https://docs.python.org/3/library/functions.html#bool" },
  truth: { titulo: "Valor de verdad", url: "https://docs.python.org/3/library/stdtypes.html#truth-value-testing" },
  type: { titulo: "type()", url: "https://docs.python.org/3/library/functions.html#type" },
  print: { titulo: "print()", url: "https://docs.python.org/3/library/functions.html#print" },
  input: { titulo: "input()", url: "https://docs.python.org/3/library/functions.html#input" },
  len: { titulo: "len()", url: "https://docs.python.org/3/library/functions.html#len" },
  round: { titulo: "round()", url: "https://docs.python.org/3/library/functions.html#round" },
  decimal: { titulo: "decimal", url: "https://docs.python.org/3/library/decimal.html" },
  fstrings: { titulo: "Literales de cadena formateados", url: "https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals" },
  formatSpec: { titulo: "Mini lenguaje de formato", url: "https://docs.python.org/3/library/string.html#format-specification-mini-language" },
  listas: { titulo: "Más sobre listas", url: "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists" },
  listType: { titulo: "Listas", url: "https://docs.python.org/3/library/stdtypes.html#lists" },
  secuencias: { titulo: "Operaciones sobre secuencias", url: "https://docs.python.org/3/library/stdtypes.html#common-sequence-operations" },
  slicing: { titulo: "Introducción informal: listas", url: "https://docs.python.org/3/tutorial/introduction.html#lists" },
  tuplas: { titulo: "Tuplas", url: "https://docs.python.org/3/library/stdtypes.html#tuples" },
  dict: { titulo: "Diccionarios", url: "https://docs.python.org/3/library/stdtypes.html#mapping-types-dict" },
  sets: { titulo: "Conjuntos", url: "https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset" },
  comparaciones: { titulo: "Comparaciones", url: "https://docs.python.org/3/library/stdtypes.html#comparisons" },
  booleanOps: { titulo: "Operaciones booleanas", url: "https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not" },
  if: { titulo: "La sentencia if", url: "https://docs.python.org/3/tutorial/controlflow.html#if-statements" },
  for: { titulo: "La sentencia for", url: "https://docs.python.org/3/tutorial/controlflow.html#for-statements" },
  iterador: { titulo: "Tipos iteradores", url: "https://docs.python.org/3/library/stdtypes.html#iterator-types" },
  range: { titulo: "range()", url: "https://docs.python.org/3/library/stdtypes.html#range" },
  while: { titulo: "La sentencia while", url: "https://docs.python.org/3/reference/compound_stmts.html#the-while-statement" },
  breakContinue: { titulo: "break y continue", url: "https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements" },
  enumerate: { titulo: "enumerate()", url: "https://docs.python.org/3/library/functions.html#enumerate" },
  zip: { titulo: "zip()", url: "https://docs.python.org/3/library/functions.html#zip" },
  comprensiones: { titulo: "Comprensiones de lista", url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions" },
  funciones: { titulo: "Definir funciones", url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" },
  porDefecto: { titulo: "Argumentos por defecto", url: "https://docs.python.org/3/tutorial/controlflow.html#default-argument-values" },
  clave: { titulo: "Argumentos por palabra clave", url: "https://docs.python.org/3/tutorial/controlflow.html#keyword-arguments" },
  docstrings: { titulo: "Cadenas de documentación", url: "https://docs.python.org/3/tutorial/controlflow.html#documentation-strings" },
  ambito: { titulo: "Ámbitos y espacios de nombres", url: "https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces" },
  modulos: { titulo: "Módulos", url: "https://docs.python.org/3/tutorial/modules.html" },
  math: { titulo: "math", url: "https://docs.python.org/3/library/math.html" },
  datetime: { titulo: "datetime", url: "https://docs.python.org/3/library/datetime.html" },
  statistics: { titulo: "statistics", url: "https://docs.python.org/3/library/statistics.html" },
  errores: { titulo: "Errores y excepciones", url: "https://docs.python.org/3/tutorial/errors.html" },
  excepciones: { titulo: "Jerarquía de excepciones", url: "https://docs.python.org/3/library/exceptions.html" },
  pep8: { titulo: "PEP 8, guía de estilo", url: "https://peps.python.org/pep-0008/" },
  sorted: { titulo: "sorted()", url: "https://docs.python.org/3/library/functions.html#sorted" },
  sum: { titulo: "sum()", url: "https://docs.python.org/3/library/functions.html#sum" },
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

// ---------------------------------------------------------------------------
// Sesión 1
// ---------------------------------------------------------------------------
const s1: Bloque[] = [
  t(`# Variables

Una variable es un nombre asociado a un valor. Se crea con el operador de asignación (=). No hay que declarar de qué tipo es el valor.`, {
    docs: [D.asignacion],
    nota: "Un nombre es una referencia a un objeto en memoria. La asignación vincula el nombre al objeto, no copia el valor. Dos nombres pueden referirse al mismo objeto.",
  }),

  c(`producto = "Laptop"`),

  t(`## Nombres válidos

El nombre de una variable admite letras, números y guion bajo (_). No puede empezar por un número ni contener espacios.`, {
    docs: [D.pep8],
    nota: "La convención de PEP 8 para variables y funciones es snake_case: minúsculas con guion bajo entre palabras.",
  }),

  c(`precio unitario = 2500`, `SyntaxError: invalid syntax`),

  t(`# Números enteros

El tipo \`int\` guarda números enteros, sin decimales.`, {
    docs: [D.int, D.numeric],
    nota: "int es de precisión arbitraria: no tiene un ancho fijo de 32 o 64 bits como en C o Java. El único límite es la memoria disponible.",
  }),

  c(`cantidad = 10
print(cantidad)`, `10`, { docs: [D.print] }),

  t(`## Números con decimales

El tipo \`float\` guarda números con parte decimal. Se escribe con punto decimal (.), no con coma.`, {
    docs: [D.float],
    nota: "float implementa el binario de doble precisión de IEEE 754: 53 bits de mantisa, unas 15 a 17 cifras decimales significativas.",
  }),

  c(`tasa_igv = 0.18
print(tasa_igv)`, `0.18`),

  t(`## Por qué los decimales dan resultados inesperados

Un \`float\` se almacena en base dos. Fracciones como 0.1 no tienen representación exacta en esa base, y el resultado arrastra un error mínimo.`, {
    docs: [D.floatingPoint],
    nota: "El comportamiento lo define IEEE 754 y se reproduce en cualquier lenguaje que lo implemente. Para importes donde el redondeo debe ser exacto, la biblioteca estándar ofrece decimal.Decimal, que opera en base diez.",
  }),

  c(`print(0.1 + 0.2)`, `0.30000000000000004`, { docs: [D.floatingPoint] }),

  t(`Al mostrar el resultado a una persona se redondea.`, {
    docs: [D.round, D.decimal],
    nota: "round() aplica redondeo al par más cercano cuando el valor queda a la mitad: round(0.5) devuelve 0 y round(1.5) devuelve 2. Es el comportamiento que exige IEEE 754, no un error.",
  }),

  c(`print(round(0.1 + 0.2, 2))`, `0.3`, { docs: [D.round] }),

  t(`# Texto

El tipo \`str\` guarda texto. Se delimita con comillas simples (') o dobles (\"), y las de apertura y cierre deben ser del mismo tipo.`, {
    docs: [D.str],
    nota: "str es una secuencia inmutable de puntos de código Unicode. Inmutable significa que ninguna operación modifica la cadena original: todas devuelven una nueva.",
  }),

  c(`ciudad = "Lima"
print(ciudad)`, `Lima`),

  t(`## Concatenar y repetir

El operador de suma (+) concatena dos cadenas. El de multiplicación (*) repite una cadena tantas veces como indique el número.`, { docs: [D.secuencias] }),

  c(`print("Data" + "Engineering")`, `DataEngineering`),

  c(`print("-" * 20)`, `--------------------`),

  t(`## Métodos de texto

Un método es una función que pertenece a un objeto y se invoca con la notación de punto (.) tras el nombre del objeto.`, {
    docs: [D.strMethods],
    nota: "Los métodos de str devuelven una cadena nueva porque el tipo es inmutable. Asignar el resultado es obligatorio si se quiere conservar el cambio.",
  }),

  c(`nombre = "  ana quispe  "
print(nombre.strip())`, `ana quispe`, { docs: [D.strMethods] }),

  c(`print("ana quispe".title())`, `Ana Quispe`, { docs: [D.strMethods] }),

  t(`# Booleanos

El tipo \`bool\` admite dos valores: \`True\` y \`False\`, con mayúscula inicial.`, {
    docs: [D.bool, D.truth],
    nota: "bool es subclase de int: True equivale a 1 y False a 0, y pueden usarse en operaciones aritméticas. sum([True, False, True]) devuelve 2.",
  }),

  c(`activo = True
print(activo)`, `True`),

  t(`# Consultar el tipo de un valor

La función \`type()\` devuelve el tipo del objeto que recibe.`, {
    docs: [D.type, D.modeloDatos],
    nota: "En Python el tipo pertenece al objeto, no al nombre. Un mismo nombre puede referirse a un int y después a un str sin error.",
  }),

  c(`print(type(10))
print(type(0.18))`, `<class 'int'>
<class 'float'>`, { docs: [D.type] }),

  c(`print(type("Lima"))
print(type(True))`, `<class 'str'>
<class 'bool'>`, { docs: [D.type] }),

  t(`# Operaciones aritméticas

Los operadores habituales se comportan como en aritmética estándar.`, { docs: [D.numeric] }),

  c(`print(20 + 3)
print(20 - 3)`, `23
17`),

  c(`print(20 * 3)
print(20 / 3)`, `60
6.666666666666667`),

  t(`## División entera y módulo

El operador de división (/) devuelve siempre \`float\`, aunque el resultado sea exacto. El de división entera (//) descarta la parte decimal, y el de módulo (%) devuelve el resto.`, {
    docs: [D.numeric],
    nota: "// no trunca hacia cero, redondea hacia menos infinito: -7 // 2 devuelve -4, no -3. El signo del resultado de % sigue al del divisor.",
  }),

  c(`print(20 // 3)
print(20 % 3)`, `6
2`, { docs: [D.numeric] }),

  c(`print(10 % 2)
print(7 % 2)`, `0
1`),

  t(`# Interpolar valores en un texto

Un f-string inserta el valor de una expresión dentro de una cadena. Se antepone una \`f\` a la comilla de apertura y la expresión va entre llaves ({}).`, {
    docs: [D.fstrings],
    nota: "Las expresiones del f-string se evalúan en tiempo de ejecución y su resultado pasa por el protocolo de formato del objeto.",
  }),

  c(`vendedora = "Ana"
print(f"Vendedora: {vendedora}")`, `Vendedora: Ana`, { docs: [D.fstrings] }),

  c(`precio = 2500
print(f"Con IGV: {precio * 1.18}")`, `Con IGV: 2950.0`),

  t(`## Formato dentro del f-string

Dentro de las llaves, tras los dos puntos (:), se indica el formato de salida. El especificador \`.2f\` fija dos decimales.`, {
    docs: [D.formatSpec],
    nota: "La especificación completa admite separador de miles, alineación, relleno y signo. Por ejemplo {precio:>12,.2f} alinea a la derecha en doce caracteres con separador de miles.",
  }),

  c(`print(f"Con IGV: {precio * 1.18:.2f}")`, `Con IGV: 2950.00`, { docs: [D.formatSpec] }),

  t(`# Leer datos del usuario

La función \`input()\` detiene la ejecución hasta que se escribe una línea. Devuelve siempre \`str\`.`, {
    docs: [D.input],
    nota: "input() lee de la entrada estándar hasta el salto de línea y lo descarta del resultado. Si la entrada se cierra antes, lanza EOFError.",
  }),

  c(`edad = input("Tu edad: ")
print(type(edad))`, `Tu edad: 30
<class 'str'>`, { docs: [D.input, D.type] }),

  t(`Para operar con el valor como número hay que convertirlo.`, {
    docs: [D.int],
    nota: "int() lanza ValueError si la cadena no representa un entero. La sesión 4 cubre cómo capturar ese error.",
  }),

  c(`edad = int(input("Tu edad: "))
print(edad + 1)`, `Tu edad: 30
31`, { docs: [D.int] }),
];

// ---------------------------------------------------------------------------
// Sesión 2
// ---------------------------------------------------------------------------
const s2: Bloque[] = [
  t(`# Listas

Una lista guarda varios valores en orden y se escribe entre corchetes ([]), separando los elementos con comas.`, {
    docs: [D.listType, D.listas],
    nota: "list es una secuencia mutable de referencias a objetos. Admite tipos distintos en la misma lista, aunque lo habitual es que sean homogéneos.",
  }),

  c(`ventas = [1200, 850, 1400, 990]
print(ventas)`, `[1200, 850, 1400, 990]`),

  t(`## Cantidad de elementos

La función \`len()\` devuelve el número de elementos.`, {
    docs: [D.len],
    nota: "len() invoca el método __len__ del objeto. Funciona sobre cualquier tipo que lo implemente: str, list, tuple, dict y set.",
  }),

  c(`print(len(ventas))`, `4`, { docs: [D.len] }),

  t(`## Acceso por posición

El índice de una lista empieza en cero: el primer elemento ocupa la posición 0, el segundo la 1, y así sucesivamente.`, {
    docs: [D.slicing],
    nota: "El acceso por índice en una lista es de tiempo constante: no recorre la secuencia, calcula la dirección directamente.",
  }),

  c(`print(ventas[0])
print(ventas[1])`, `1200
850`),

  t(`Los índices negativos cuentan desde el final: -1 es el último elemento, -2 el penúltimo.`, { docs: [D.slicing] }),

  c(`print(ventas[-1])`, `990`),

  t(`Un índice fuera de rango lanza una excepción.`, {
    docs: [D.errores],
    nota: "IndexError hereda de LookupError, que a su vez hereda de Exception. Esa jerarquía permite capturar por categoría.",
  }),

  c(`print(ventas[10])`, `IndexError: list index out of range`, { docs: [D.errores] }),

  t(`## Rebanadas

Dos puntos (:) dentro de los corchetes extraen un tramo. El índice inicial se incluye y el final se excluye.`, {
    docs: [D.slicing],
    nota: "La rebanada devuelve una lista nueva con las mismas referencias, no copias de los elementos. Es una copia superficial.",
  }),

  c(`print(ventas[0:2])`, `[1200, 850]`, { docs: [D.slicing] }),

  c(`print(ventas[2:])
print(ventas[:2])`, `[1400, 990]
[1200, 850]`, { docs: [D.slicing] }),

  t(`# Modificar una lista

A diferencia de \`str\`, una lista admite cambios después de creada.`, { docs: [D.listas] }),

  c(`ventas[0] = 1300
print(ventas)`, `[1300, 850, 1400, 990]`),

  t(`\`append()\` agrega un elemento al final.`, {
    docs: [D.listas],
    nota: "append() modifica la lista en sitio y devuelve None. Asignar su resultado a una variable deja None, no la lista.",
  }),

  c(`ventas.append(2000)
print(ventas)`, `[1300, 850, 1400, 990, 2000]`, { docs: [D.listas] }),

  t(`\`remove()\` elimina la primera aparición de un valor.`, {
    docs: [D.listas],
    nota: "Si el valor no está, lanza ValueError. Para eliminar por posición se usa pop(indice), que además devuelve el elemento retirado.",
  }),

  c(`ventas.remove(850)
print(ventas)`, `[1300, 1400, 990, 2000]`, { docs: [D.listas] }),

  t(`# Cálculos sobre una lista

\`sum()\`, \`min()\` y \`max()\` son funciones del lenguaje, no métodos de la lista: reciben cualquier secuencia.`, { docs: [D.sum] }),

  c(`print(sum(ventas))`, `5690`, { docs: [D.sum] }),

  c(`print(min(ventas))
print(max(ventas))`, `990
2000`),

  t(`El promedio no tiene función incorporada. Se calcula dividiendo o se importa de \`statistics\`.`, {
    docs: [D.statistics],
    nota: "statistics.mean acepta cualquier iterable numérico y trabaja con Fraction y Decimal, no solo con float.",
  }),

  c(`print(sum(ventas) / len(ventas))`, `1422.5`),

  t(`# Ordenar

\`sorted()\` devuelve una lista nueva ordenada y deja intacta la original.`, {
    docs: [D.sorted],
    nota: "sorted() usa Timsort: complejidad O(n log n) y estable, es decir que los elementos con igual clave conservan su orden relativo previo. El método list.sort() ordena en sitio y devuelve None.",
  }),

  c(`print(sorted(ventas))
print(ventas)`, `[990, 1300, 1400, 2000]
[1300, 1400, 990, 2000]`, { docs: [D.sorted] }),

  c(`print(sorted(ventas, reverse=True))`, `[2000, 1400, 1300, 990]`, { docs: [D.sorted] }),

  t(`# Tuplas

Una tupla es una secuencia que no admite cambios después de creada. Se escribe entre paréntesis (()), separando los elementos con comas.`, {
    docs: [D.tuplas],
    nota: "Al ser inmutable, una tupla puede usarse como clave de diccionario o elemento de conjunto, cosa que una lista no permite.",
  }),

  c(`coordenada = (-12.05, -77.04)
print(coordenada[0])`, `-12.05`),

  t(`Intentar modificarla lanza una excepción. Esa restricción es el motivo de usarla: representa datos que no deben cambiar.`, { docs: [D.tuplas, D.errores] }),

  c(`coordenada[0] = 0`, `TypeError: 'tuple' object does not support item assignment`),

  t(`# Diccionarios

Un diccionario guarda pares de clave y valor. El acceso es por clave, no por posición.`, {
    docs: [D.dict],
    nota: "dict es una tabla hash: la búsqueda por clave es de tiempo constante promedio. Desde Python 3.7 conserva el orden de inserción, y eso es una garantía del lenguaje, no un detalle de implementación.",
  }),

  c(`vendedor = {"nombre": "Ana", "region": "Norte"}
print(vendedor["nombre"])`, `Ana`),

  t(`Acceder con una clave que no existe lanza \`KeyError\`. El método \`get()\` devuelve \`None\` en lugar de fallar.`, { docs: [D.dict] }),

  c(`print(vendedor.get("meta"))`, `None`, { docs: [D.dict] }),

  t(`\`get()\` admite un segundo argumento con el valor a devolver cuando la clave falta.`, {
    docs: [D.dict],
    nota: "El valor por defecto se evalúa siempre, aunque la clave exista. Si construirlo es costoso, conviene comprobar la clave antes.",
  }),

  c(`print(vendedor.get("meta", 0))`, `0`, { docs: [D.dict] }),

  t(`## Agregar y recorrer claves

Asignar sobre una clave inexistente la crea.`, { docs: [D.dict] }),

  c(`vendedor["meta"] = 15000
print(vendedor)`, `{'nombre': 'Ana', 'region': 'Norte', 'meta': 15000}`),

  c(`print(list(vendedor.keys()))`, `['nombre', 'region', 'meta']`, {
    docs: [D.dict],
    nota: "keys() devuelve una vista, no una lista: refleja los cambios posteriores del diccionario y no ocupa memoria adicional.",
  }),

  t(`# Conjuntos

Un conjunto no admite elementos repetidos ni mantiene un orden.`, {
    docs: [D.sets],
    nota: "set es una tabla hash sin valores asociados. Comprobar pertenencia con el operador in es de tiempo constante promedio, frente al recorrido lineal de una lista.",
  }),

  c(`regiones = ["Norte", "Sur", "Norte", "Centro"]
print(set(regiones))`, `{'Centro', 'Norte', 'Sur'}`, { docs: [D.sets] }),
];

// ---------------------------------------------------------------------------
// Sesión 3
// ---------------------------------------------------------------------------
const s3: Bloque[] = [
  t(`# Comparaciones

Una comparación devuelve un booleano. El operador de igualdad (==) compara dos valores; el de asignación (=) vincula un nombre a un valor. Son operadores distintos.`, {
    docs: [D.comparaciones],
    nota: "== compara el valor de los objetos. El operador is compara identidad, es decir si ambos nombres apuntan al mismo objeto en memoria. Son preguntas distintas.",
  }),

  c(`print(10 > 5)
print(10 == 5)`, `True
False`, { docs: [D.comparaciones] }),

  c(`print(10 != 5)
print(10 >= 10)`, `True
True`, { docs: [D.comparaciones] }),

  t(`# Operadores lógicos

\`and\` requiere que ambas condiciones se cumplan. \`or\` requiere al menos una. \`not\` invierte el valor.`, {
    docs: [D.booleanOps],
    nota: "Ambos evalúan en cortocircuito: and no evalúa el segundo operando si el primero es falso, y or no lo evalúa si el primero es verdadero. Además devuelven uno de los operandos, no necesariamente True o False.",
  }),

  c(`print(True and False)
print(True or False)`, `False
True`, { docs: [D.booleanOps] }),

  c(`print(not True)`, `False`, { docs: [D.booleanOps] }),

  t(`# La sentencia if

Ejecuta un bloque de código cuando la condición es verdadera. Los dos puntos (:) al final de la línea abren el bloque, y la indentación de las líneas siguientes delimita qué pertenece a él.`, {
    docs: [D.if],
    nota: "La condición no tiene que ser un bool. Cualquier objeto tiene valor de verdad: 0, la cadena vacía, la lista vacía y None son falsos; el resto es verdadero.",
  }),

  c(`stock = 15

if stock > 0:
    print("Hay stock")`, `Hay stock`, { docs: [D.if] }),

  t(`## La indentación forma parte de la sintaxis

La sangría no es una convención estética: delimita el bloque. Sin ella el programa no compila.`, {
    docs: [D.if, D.pep8],
    nota: "El analizador léxico emite tokens INDENT y DEDENT a partir de la sangría. PEP 8 fija cuatro espacios por nivel.",
  }),

  c(`if stock > 0:
print("Hay stock")`, `IndentationError: expected an indented block`, { docs: [D.errores] }),

  t(`## else

Cubre el caso contrario.`, { docs: [D.if] }),

  c(`stock = 0

if stock > 0:
    print("Hay stock")
else:
    print("Sin stock")`, `Sin stock`, { docs: [D.if] }),

  t(`## elif

Encadena condiciones. Python las evalúa en orden y se detiene en la primera verdadera.`, {
    docs: [D.if],
    nota: "Solo se ejecuta una rama. El orden importa: si una condición amplia va primero, las siguientes quedan inalcanzables.",
  }),

  c(`monto = 750

if monto < 500:
    print("Venta pequeña")
elif monto < 2000:
    print("Venta mediana")
else:
    print("Venta grande")`, `Venta mediana`, { docs: [D.if] }),

  t(`# La sentencia for

Recorre los elementos de una secuencia, uno por vez.`, {
    docs: [D.for, D.iterador],
    nota: "for opera sobre cualquier objeto que implemente el protocolo de iteración, es decir los métodos __iter__ y __next__. Por eso funciona igual sobre listas, cadenas, diccionarios y archivos.",
  }),

  c(`productos = ["Laptop", "Mouse", "Monitor"]

for producto in productos:
    print(producto)`, `Laptop
Mouse
Monitor`, { docs: [D.for] }),

  t(`## Acumular un total

La variable que acumula el total se declara antes del bucle, porque debe sobrevivir a cada iteración, y se actualiza dentro.`, { docs: [D.for] }),

  c(`ventas = [1200, 850, 1400]
total = 0

for venta in ventas:
    total = total + venta

print(total)`, `3450`),

  t(`## range

\`range()\` produce una secuencia de números. Se usa para repetir un bloque una cantidad determinada de veces.`, {
    docs: [D.range],
    nota: "range no construye la lista en memoria: genera cada valor cuando se le pide. range(1000000) ocupa lo mismo que range(10).",
  }),

  c(`for i in range(3):
    print(i)`, `0
1
2`, { docs: [D.range] }),

  t(`Con dos argumentos, \`range()\` recibe el inicio y el fin. El inicio se incluye y el fin se excluye, por lo que \`range(1, 4)\` produce 1, 2 y 3.`, { docs: [D.range] }),

  c(`for i in range(1, 4):
    print(i)`, `1
2
3`, { docs: [D.range] }),

  t(`## enumerate

Entrega la posición junto al valor, sin necesidad de llevar un contador manual.`, {
    docs: [D.enumerate],
    nota: "Acepta un segundo argumento con el índice inicial: enumerate(productos, 1) empieza a contar desde uno.",
  }),

  c(`for i, producto in enumerate(productos):
    print(i, producto)`, `0 Laptop
1 Mouse
2 Monitor`, { docs: [D.enumerate] }),

  t(`## zip

Recorre dos secuencias en paralelo.`, {
    docs: [D.zip],
    nota: "Se detiene en la secuencia más corta y descarta el resto sin avisar. Con strict=True, disponible desde Python 3.10, lanza ValueError si los largos difieren.",
  }),

  c(`precios = [2500, 85, 1200]

for producto, precio in zip(productos, precios):
    print(producto, precio)`, `Laptop 2500
Mouse 85
Monitor 1200`, { docs: [D.zip] }),

  t(`# La sentencia while

Repite mientras la condición sea verdadera. No recorre una secuencia.`, {
    docs: [D.while],
    nota: "Si la condición nunca se vuelve falsa, el bucle no termina. Algo dentro del cuerpo tiene que modificar el estado que evalúa la condición.",
  }),

  c(`stock = 3

while stock > 0:
    print("Quedan", stock)
    stock = stock - 1`, `Quedan 3
Quedan 2
Quedan 1`, { docs: [D.while] }),

  t(`# break y continue

\`break\` termina el bucle. \`continue\` salta a la siguiente iteración.`, {
    docs: [D.breakContinue],
    nota: "Ambos afectan solo al bucle más interno que los contiene. Un for o while admite además una cláusula else, que se ejecuta si el bucle terminó sin pasar por break.",
  }),

  c(`for venta in [1200, 850, -50, 1400]:
    if venta < 0:
        break
    print(venta)`, `1200
850`, { docs: [D.breakContinue] }),

  c(`for venta in [1200, 850, -50, 1400]:
    if venta < 0:
        continue
    print(venta)`, `1200
850
1400`, { docs: [D.breakContinue] }),

  t(`# Comprensiones de lista

Construyen una lista a partir de otra en una sola expresión.`, {
    docs: [D.comprensiones],
    nota: "La comprensión tiene su propio ámbito: la variable del bucle no queda definida al terminar. Un for equivalente sí la deja definida.",
  }),

  c(`precios = [2500, 85, 1200]
con_igv = [p * 1.18 for p in precios]
print(con_igv)`, `[2950.0, 100.3, 1416.0]`, { docs: [D.comprensiones] }),

  t(`Una condición \`if\` al final de la comprensión descarta los elementos que no la cumplen.`, { docs: [D.comprensiones] }),

  c(`caros = [p for p in precios if p > 1000]
print(caros)`, `[2500, 1200]`, { docs: [D.comprensiones] }),
];

// ---------------------------------------------------------------------------
// Sesión 4
// ---------------------------------------------------------------------------
const s4: Bloque[] = [
  t(`# Definir una función

Una función agrupa código bajo un nombre para reutilizarlo. Se declara con \`def\` y entrega un valor con \`return\`.`, {
    docs: [D.funciones],
    nota: "def crea un objeto función y lo vincula a un nombre. Las funciones son objetos de primera clase: pueden asignarse a variables, pasarse como argumento y devolverse desde otra función.",
  }),

  c(`def calcular_igv(precio):
    return precio * 0.18`, null, { docs: [D.funciones] }),

  t(`Definir una función no ejecuta su cuerpo. Para que corra hay que invocarla escribiendo su nombre seguido de paréntesis.`, { docs: [D.funciones] }),

  c(`print(calcular_igv(1000))`, `180.0`),

  t(`## Función sin return

Sin \`return\`, la función devuelve \`None\`. Imprimir y devolver son operaciones distintas.`, {
    docs: [D.funciones],
    nota: "print escribe en la salida estándar y no produce un valor reutilizable. return entrega un objeto a quien llamó. Una función que solo imprime no sirve para componer cálculos.",
  }),

  c(`def saludar(nombre):
    print("Hola", nombre)

resultado = saludar("Ana")
print(resultado)`, `Hola Ana
None`),

  t(`## Varios parámetros

Los parámetros se separan por comas en la definición, y los argumentos se pasan en ese mismo orden al llamar la función.`, { docs: [D.funciones] }),

  c(`def total(cantidad, precio):
    return cantidad * precio

print(total(3, 250))`, `750`),

  t(`# Argumentos por palabra clave

Al escribir el nombre del parámetro en la llamada, el orden de los argumentos deja de importar.`, {
    docs: [D.clave],
    nota: "Los argumentos posicionales deben ir antes que los nombrados. Un asterisco (*) suelto en la lista de parámetros obliga a que todos los declarados después se pasen siempre por nombre.",
  }),

  c(`print(total(precio=250, cantidad=3))`, `750`, { docs: [D.clave] }),

  t(`# Valores por defecto

Un parámetro puede declarar un valor de reserva, que la función usa cuando quien la llama no le pasa ese argumento.`, { docs: [D.porDefecto] }),

  c(`def precio_final(precio, igv=0.18):
    return precio * (1 + igv)

print(precio_final(1000))`, `1180.0`, { docs: [D.porDefecto] }),

  c(`print(precio_final(1000, igv=0))`, `1000.0`, { docs: [D.porDefecto] }),

  t(`## Valores por defecto mutables

El valor por defecto de un parámetro se evalúa una sola vez, en el momento de definir la función, no en cada llamada. Si ese valor es una lista, todas las llamadas comparten el mismo objeto y los cambios se acumulan.`, {
    docs: [D.porDefecto],
    nota: "Los valores por defecto quedan almacenados en el atributo __defaults__ del objeto función, no se recrean en cada llamada. Por eso solo afecta a los tipos mutables: list, dict y set.",
  }),

  c(`def agregar(item, lista=[]):
    lista.append(item)
    return lista

print(agregar("a"))
print(agregar("b"))`, `['a']
['a', 'b']`, { docs: [D.porDefecto] }),

  t(`La solución convencional usa \`None\` como valor por defecto y crea la lista dentro.`, { docs: [D.porDefecto] }),

  c(`def agregar(item, lista=None):
    if lista is None:
        lista = []
    lista.append(item)
    return lista

print(agregar("a"))
print(agregar("b"))`, `['a']
['b']`),

  t(`# Documentar una función

Una cadena entre comillas triples (""") escrita como primera línea del cuerpo de la función es su docstring.`, {
    docs: [D.docstrings],
    nota: "Queda accesible en el atributo __doc__ y es lo que muestra help(). Los editores y los generadores de documentación la leen de ahí.",
  }),

  c(`def calcular_igv(precio):
    """Devuelve el IGV peruano, 18 por ciento, de un precio."""
    return precio * 0.18

print(calcular_igv.__doc__)`, `Devuelve el IGV peruano, 18 por ciento, de un precio.`, { docs: [D.docstrings] }),

  t(`# Ámbito de las variables

Una variable creada dentro de una función existe solo durante su ejecución.`, {
    docs: [D.ambito],
    nota: "La resolución de nombres sigue el orden LEGB: local, enclosing, global y builtins. Python busca en ese orden y usa la primera coincidencia.",
  }),

  c(`def calcular():
    interno = 42
    return interno

calcular()
print(interno)`, `NameError: name 'interno' is not defined`, { docs: [D.errores] }),

  t(`# Módulos

Un módulo es un archivo con código reutilizable. La biblioteca estándar incluye varios ya disponibles.`, {
    docs: [D.modulos],
    nota: "import ejecuta el módulo una sola vez y guarda el resultado en sys.modules. Los import posteriores del mismo módulo reutilizan ese objeto.",
  }),

  c(`import math

print(math.sqrt(16))`, `4.0`, { docs: [D.math, D.modulos] }),

  t(`En lugar del módulo completo puede importarse un nombre concreto, que queda disponible sin anteponer el nombre del módulo.`, { docs: [D.modulos] }),

  c(`from math import sqrt

print(sqrt(25))`, `5.0`, { docs: [D.modulos] }),

  t(`## Fechas

El módulo \`datetime\` maneja fechas y horas.`, {
    docs: [D.datetime],
    nota: "date representa una fecha sin hora. Para instantes con zona horaria se usa datetime con tzinfo; sin ella el objeto es ingenuo y no admite comparaciones fiables entre zonas.",
  }),

  c(`from datetime import date

print(date(2026, 8, 23))`, `2026-08-23`, { docs: [D.datetime] }),

  t(`## Estadística

\`statistics\` incluye promedio y mediana.`, { docs: [D.statistics] }),

  c(`from statistics import mean

print(mean([1200, 850, 1400]))`, `1150`, { docs: [D.statistics] }),

  t(`# Manejar errores

Una excepción no capturada detiene el programa. \`try\` y \`except\` permiten continuar cuando el fallo es previsible.`, {
    docs: [D.errores, D.excepciones],
    nota: "Las excepciones son objetos con jerarquía: ValueError hereda de Exception, que hereda de BaseException. Capturar Exception atrapa los errores de programa pero deja pasar KeyboardInterrupt y SystemExit, que heredan directamente de BaseException.",
  }),

  c(`try:
    edad = int("treinta")
except ValueError:
    print("Eso no es un número")`, `Eso no es un número`, { docs: [D.errores] }),

  t(`Conviene capturar la excepción concreta. Un \`except\` sin tipo oculta fallos que había que ver.`, {
    docs: [D.excepciones],
    nota: "La cláusula else se ejecuta si no hubo excepción, y finally se ejecuta siempre, haya fallado o no. finally es el lugar para liberar recursos.",
  }),

  t(`# Cierre

Con estos elementos ya es posible leer y escribir Python de trabajo. El paso siguiente es Pandas, que aplica estas mismas ideas sobre tablas de datos.

La documentación oficial está enlazada en casi todos los bloques de forma deliberada: consultarla es parte del oficio, no un recurso de emergencia.`, { docs: [D.stdtypes, D.pep8] }),
];

function armar(numero: number, titulo: string, bloques: Bloque[]): Leccion {
  return {
    slug: `sesion-${numero}`,
    numero,
    titulo,
    bloques,
    secciones: derivarSecciones(bloques),
  };
}

export const leccionesPython: Leccion[] = [
  armar(1, "Variables, tipos y operaciones", s1),
  armar(2, "Listas, diccionarios y conjuntos", s2),
  armar(3, "Condicionales y bucles", s3),
  armar(4, "Funciones, módulos y errores", s4),
];
