import { derivarSecciones, type Bloque, type Leccion } from "@/lib/cursos";

// Curso de Introducción a SQLite con Python.
//
// Todo el curso pasa por el módulo sqlite3 de la biblioteca estándar.
// Se cita la documentación de Python para la API del módulo y la de
// sqlite.org para la semántica del motor y del lenguaje SQL.
//
// Mismas reglas de redacción que el curso de Python:
//   1. Sin emojis en títulos ni subtítulos.
//   2. Casi todo ejemplo cita la documentación oficial.
//   3. Un concepto por bloque de código.
//   4. Cada símbolo se nombra la primera vez que aparece; ningún sujeto
//      queda sin antecedente.
//   5. La precisión técnica que no cabe arriba va en `nota`, plegada.

const P = {
  modulo: { titulo: "sqlite3", url: "https://docs.python.org/3/library/sqlite3.html" },
  connect: { titulo: "sqlite3.connect()", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.connect" },
  conexion: { titulo: "Connection", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.Connection" },
  cursor: { titulo: "Cursor", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.Cursor" },
  execute: { titulo: "Cursor.execute()", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.Cursor.execute" },
  executemany: { titulo: "Cursor.executemany()", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.Cursor.executemany" },
  fetchall: { titulo: "Cursor.fetchall()", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.Cursor.fetchall" },
  fetchone: { titulo: "Cursor.fetchone()", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.Cursor.fetchone" },
  commit: { titulo: "Connection.commit()", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.Connection.commit" },
  close: { titulo: "Connection.close()", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.Connection.close" },
  rowFactory: { titulo: "Connection.row_factory", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.Connection.row_factory" },
  row: { titulo: "sqlite3.Row", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.Row" },
  marcadores: { titulo: "Marcadores de posición", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3-placeholders" },
  transacciones: { titulo: "Control de transacciones", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3-controlling-transactions" },
  excepciones: { titulo: "Excepciones de sqlite3", url: "https://docs.python.org/3/library/sqlite3.html#exceptions" },
  integrityError: { titulo: "IntegrityError", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3.IntegrityError" },
  howto: { titulo: "Guías de uso", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3-howtos" },
  adaptadores: { titulo: "Adaptar tipos de Python", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3-adapters" },
  contextManager: { titulo: "La conexión como gestor de contexto", url: "https://docs.python.org/3/library/sqlite3.html#sqlite3-connection-context-manager" },
} as const;

const S = {
  about: { titulo: "Qué es SQLite", url: "https://sqlite.org/about.html" },
  cuandoUsar: { titulo: "Usos apropiados", url: "https://sqlite.org/whentouse.html" },
  tipos: { titulo: "Tipos de datos", url: "https://sqlite.org/datatype3.html" },
  afinidad: { titulo: "Afinidad de tipo", url: "https://sqlite.org/datatype3.html#type_affinity" },
  strict: { titulo: "Tablas STRICT", url: "https://sqlite.org/stricttables.html" },
  createTable: { titulo: "CREATE TABLE", url: "https://sqlite.org/lang_createtable.html" },
  restricciones: { titulo: "Restricciones de columna", url: "https://sqlite.org/lang_createtable.html#constraints" },
  rowid: { titulo: "Tablas con ROWID", url: "https://sqlite.org/rowidtable.html" },
  autoinc: { titulo: "AUTOINCREMENT", url: "https://sqlite.org/autoinc.html" },
  insert: { titulo: "INSERT", url: "https://sqlite.org/lang_insert.html" },
  select: { titulo: "SELECT", url: "https://sqlite.org/lang_select.html" },
  update: { titulo: "UPDATE", url: "https://sqlite.org/lang_update.html" },
  del: { titulo: "DELETE", url: "https://sqlite.org/lang_delete.html" },
  expresiones: { titulo: "Expresiones", url: "https://sqlite.org/lang_expr.html" },
  nulls: { titulo: "Manejo de NULL", url: "https://sqlite.org/nulls.html" },
  agregacion: { titulo: "Funciones de agregación", url: "https://sqlite.org/lang_aggfunc.html" },
  core: { titulo: "Funciones básicas", url: "https://sqlite.org/lang_corefunc.html" },
  fechas: { titulo: "Funciones de fecha y hora", url: "https://sqlite.org/lang_datefunc.html" },
  join: { titulo: "Cláusula JOIN", url: "https://sqlite.org/syntax/join-clause.html" },
  foreignKeys: { titulo: "Claves foráneas", url: "https://sqlite.org/foreignkeys.html" },
  indices: { titulo: "CREATE INDEX", url: "https://sqlite.org/lang_createindex.html" },
  eqp: { titulo: "EXPLAIN QUERY PLAN", url: "https://sqlite.org/eqp.html" },
  transacciones: { titulo: "TRANSACTION", url: "https://sqlite.org/lang_transaction.html" },
  wal: { titulo: "Registro de escritura anticipada", url: "https://sqlite.org/wal.html" },
  pragma: { titulo: "Sentencias PRAGMA", url: "https://sqlite.org/pragma.html" },
  quirks: { titulo: "Peculiaridades de SQLite", url: "https://sqlite.org/quirks.html" },
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
  t(`# Qué es SQLite

SQLite es un motor de base de datos relacional que guarda toda la información en un solo archivo del disco. No hay un servidor al que conectarse ni un proceso que administrar.`, {
    docs: [S.about, S.cuandoUsar],
    nota: "SQLite es una biblioteca enlazada dentro del proceso de la aplicación, no un servicio separado. La documentación oficial lo compara con fopen(), no con PostgreSQL: compite con leer y escribir archivos propios, no con un servidor de base de datos.",
  }),

  t(`## Por qué se usa desde Python

El módulo \`sqlite3\` forma parte de la biblioteca estándar de Python. No hay que instalar nada ni levantar ningún servicio: importar el módulo basta.`, {
    docs: [P.modulo],
    nota: "El módulo implementa la especificación DB-API 2.0 descrita en el PEP 249, la misma interfaz que usan los conectores de PostgreSQL y MySQL. Lo que se aprende aquí se traslada casi sin cambios a esos motores.",
  }),

  c(`import sqlite3

print(sqlite3.sqlite_version)`, `3.45.1`, { docs: [P.modulo] }),

  t(`# Conectarse a una base de datos

La función \`connect()\` recibe la ruta del archivo y devuelve un objeto de conexión. Si el archivo no existe, SQLite lo crea en la primera escritura.`, {
    docs: [P.connect],
    nota: "El archivo se crea de verdad recién cuando se escribe algo. Conectar a un nombre inexistente y cerrar sin crear tablas no deja ningún archivo en el disco.",
  }),

  c(`conexion = sqlite3.connect("tienda.db")`, null, { docs: [P.connect] }),

  t(`Pasar la cadena \`":memory:"\` en lugar de una ruta crea una base que vive solo en la memoria y desaparece al cerrar la conexión. Es lo habitual en pruebas.`, {
    docs: [P.connect],
    nota: "Cada conexión a ':memory:' crea una base independiente. Dos conexiones en memoria dentro del mismo programa no comparten datos, salvo que se use el modo URI con caché compartida.",
  }),

  c(`conexion = sqlite3.connect(":memory:")`, null, { docs: [P.connect] }),

  t(`# El cursor

El cursor es el objeto que envía las sentencias SQL y recorre los resultados. Se obtiene desde la conexión.`, {
    docs: [P.cursor],
    nota: "Una conexión admite varios cursores a la vez. Cada uno mantiene su propia posición de lectura, por lo que dos consultas simultáneas no interfieren entre sí.",
  }),

  c(`cursor = conexion.cursor()`, null, { docs: [P.cursor] }),

  t(`El método \`execute()\` envía una sentencia al motor.`, { docs: [P.execute] }),

  c(`cursor.execute("SELECT sqlite_version()")
print(cursor.fetchone())`, `('3.45.1',)`, { docs: [P.execute, P.fetchone] }),

  t(`# Tipos de datos

SQLite tiene exactamente cinco clases de almacenamiento: \`NULL\`, \`INTEGER\`, \`REAL\`, \`TEXT\` y \`BLOB\`. No hay más. Cada una se recorre a continuación con su equivalente en Python.`, {
    docs: [S.tipos, P.adaptadores],
    nota: "La función typeof() del motor devuelve el nombre de la clase de almacenamiento del valor, no el tipo declarado de la columna. Es la herramienta para comprobar qué guardó SQLite realmente.",
  }),

  t(`Para los ejemplos se usa una tabla con una sola columna sin tipo declarado, de forma que cada valor conserve su clase original.`, { docs: [S.afinidad] }),

  c(`cursor.execute("CREATE TABLE tipos (valor)")`, null, { docs: [S.createTable] }),

  t(`## NULL

Representa la ausencia de valor. En Python le corresponde \`None\`.`, {
    docs: [S.tipos, S.nulls],
    nota: "NULL no es cero ni cadena vacía: significa que el dato no está. Esa distinción cambia el resultado de las comparaciones y de las funciones de agregación, y se trata en detalle en la sesión 3.",
  }),

  c(`cursor.execute("INSERT INTO tipos VALUES (?)", (None,))
cursor.execute("SELECT valor, typeof(valor) FROM tipos")
print(cursor.fetchone())`, `(None, 'null')`, { docs: [S.tipos] }),

  t(`## INTEGER

Guarda números enteros con signo. En Python le corresponde \`int\`.`, {
    docs: [S.tipos],
    nota: "SQLite almacena el entero en 1, 2, 3, 4, 6 u 8 bytes según su magnitud, y elige el tamaño solo. El rango máximo es el de 8 bytes con signo, de -9223372036854775808 a 9223372036854775807. Un int de Python mayor que eso provoca un OverflowError.",
  }),

  c(`cursor.execute("DELETE FROM tipos")
cursor.execute("INSERT INTO tipos VALUES (?)", (2500,))
cursor.execute("SELECT valor, typeof(valor) FROM tipos")
print(cursor.fetchone())`, `(2500, 'integer')`, { docs: [S.tipos] }),

  t(`## REAL

Guarda números con parte decimal. En Python le corresponde \`float\`.`, {
    docs: [S.tipos],
    nota: "REAL es un número de punto flotante de 8 bytes según el estándar IEEE 754, el mismo formato que usa float en Python. Arrastra por tanto las mismas imprecisiones: 0.1 + 0.2 no da exactamente 0.3. Para importes de dinero conviene guardar céntimos como INTEGER.",
  }),

  c(`cursor.execute("DELETE FROM tipos")
cursor.execute("INSERT INTO tipos VALUES (?)", (2500.50,))
cursor.execute("SELECT valor, typeof(valor) FROM tipos")
print(cursor.fetchone())`, `(2500.5, 'real')`, { docs: [S.tipos] }),

  t(`## TEXT

Guarda cadenas de caracteres. En Python le corresponde \`str\`.`, {
    docs: [S.tipos],
    nota: "SQLite guarda el texto en la codificación de la base, que por omisión es UTF-8. El módulo sqlite3 devuelve siempre un str ya decodificado, de modo que los acentos y la eñe no requieren ningún tratamiento adicional.",
  }),

  c(`cursor.execute("DELETE FROM tipos")
cursor.execute("INSERT INTO tipos VALUES (?)", ("Ana Quispe",))
cursor.execute("SELECT valor, typeof(valor) FROM tipos")
print(cursor.fetchone())`, `('Ana Quispe', 'text')`, { docs: [S.tipos] }),

  t(`## BLOB

Guarda datos binarios tal cual, sin interpretarlos. En Python le corresponde \`bytes\`.`, {
    docs: [S.tipos],
    nota: "BLOB significa binary large object. Sirve para imágenes, archivos o cualquier secuencia de bytes. La documentación oficial señala que guardar archivos pequeños, por debajo de unos 100 kB, resulta más rápido dentro de la base que como archivos sueltos en el disco.",
  }),

  c(`cursor.execute("DELETE FROM tipos")
cursor.execute("INSERT INTO tipos VALUES (?)", (b"\x89PNG",))
cursor.execute("SELECT valor, typeof(valor) FROM tipos")
print(cursor.fetchone())`, `(b'\x89PNG', 'blob')`, { docs: [S.tipos] }),

  t(`## Los tipos de Python que no tienen equivalente

Solo esos cinco tipos viajan de forma directa. Cualquier otro, como \`datetime\`, \`Decimal\` o \`list\`, produce un error salvo que se registre un adaptador.`, {
    docs: [P.adaptadores],
    nota: "La correspondencia completa es None con NULL, int con INTEGER, float con REAL, str con TEXT y bytes con BLOB. Para el resto hay que convertir de forma explícita antes de insertar, o registrar un adaptador con sqlite3.register_adapter().",
  }),

  c(`from decimal import Decimal

cursor.execute("INSERT INTO tipos VALUES (?)", (Decimal("10.5"),))`, `sqlite3.ProgrammingError: Error binding parameter 1: type 'Decimal' is not supported`, { docs: [P.adaptadores, P.excepciones] }),

  t(`## Afinidad de tipo

El tipo declarado en la columna es una preferencia, llamada afinidad, no una restricción. Una columna declarada \`INTEGER\` puede terminar guardando texto.`, {
    docs: [S.afinidad, S.quirks],
    nota: "La afinidad se deduce del nombre declarado: si contiene INT, la afinidad es INTEGER; si contiene CHAR, CLOB o TEXT, es TEXT. Por eso VARCHAR(10) es válido, pero el número 10 no limita nada en absoluto.",
  }),

  c(`cursor.execute("CREATE TABLE prueba (valor INTEGER)")
cursor.execute("INSERT INTO prueba VALUES ('hola')")
cursor.execute("SELECT valor, typeof(valor) FROM prueba")
print(cursor.fetchone())`, `('hola', 'text')`, { docs: [S.afinidad, S.core] }),

  t(`## Tablas STRICT

Añadir la palabra \`STRICT\` al final de la sentencia \`CREATE TABLE\` obliga a que cada columna acepte solo su tipo declarado. Está disponible desde la versión 3.37 del motor.`, {
    docs: [S.strict],
    nota: "En una tabla STRICT los tipos permitidos se reducen a INT, INTEGER, REAL, TEXT, BLOB y ANY. Cualquier otro nombre, como VARCHAR, produce un error al crear la tabla.",
  }),

  c(`cursor.execute("CREATE TABLE estricta (valor INTEGER) STRICT")
cursor.execute("INSERT INTO estricta VALUES ('hola')")`, `sqlite3.IntegrityError: cannot store TEXT value in INTEGER column estricta.valor`, { docs: [S.strict, P.integrityError] }),

  t(`# Crear una tabla

La sentencia \`CREATE TABLE\` define el nombre de la tabla y sus columnas. En Python se envía como una cadena, normalmente entre comillas triples para que ocupe varias líneas.`, { docs: [S.createTable] }),

  c(`cursor.execute("""
    CREATE TABLE vendedores (
        id     INTEGER PRIMARY KEY,
        nombre TEXT    NOT NULL,
        region TEXT    NOT NULL
    )
""")`, null, {
    docs: [S.createTable],
    nota: "Una columna declarada exactamente como INTEGER PRIMARY KEY no crea una columna nueva: se vuelve un alias del rowid interno que toda tabla ya tiene. Es el acceso más rápido posible a una fila.",
  }),

  t(`# Restricciones

Una restricción es una regla que el motor verifica en cada escritura. Son cuatro las de uso corriente, y cada una se recorre por separado a continuación.`, { docs: [S.restricciones] }),

  t(`## NOT NULL

Obliga a que la columna tenga siempre un valor. Rechaza cualquier intento de guardar \`NULL\` en ella.`, {
    docs: [S.restricciones],
    nota: "Una columna sin NOT NULL admite NULL aunque nunca se le pase ese valor de forma explícita: si el INSERT no la menciona y no tiene DEFAULT, SQLite guarda NULL.",
  }),

  c(`cursor.execute("CREATE TABLE t1 (nombre TEXT NOT NULL)")
try:
    cursor.execute("INSERT INTO t1 (nombre) VALUES (?)", (None,))
except sqlite3.IntegrityError as e:
    print(e)`, `NOT NULL constraint failed: t1.nombre`, { docs: [S.restricciones] }),

  t(`## UNIQUE

Impide que dos filas tengan el mismo valor en esa columna.`, {
    docs: [S.restricciones],
    nota: "SQLite implementa UNIQUE creando un índice único por debajo, de modo que la restricción acelera además las búsquedas por esa columna. Salvedad importante: varios NULL sí se admiten, porque dos valores ausentes no se consideran iguales entre sí.",
  }),

  c(`cursor.execute("CREATE TABLE t2 (correo TEXT UNIQUE)")
cursor.execute("INSERT INTO t2 VALUES (?)", ("ana@correo.com",))
try:
    cursor.execute("INSERT INTO t2 VALUES (?)", ("ana@correo.com",))
except sqlite3.IntegrityError as e:
    print(e)`, `UNIQUE constraint failed: t2.correo`, { docs: [S.restricciones] }),

  t(`## DEFAULT

Indica el valor que se guarda cuando el \`INSERT\` no menciona esa columna.`, {
    docs: [S.restricciones],
    nota: "El valor por defecto debe ser una constante o una de las expresiones especiales CURRENT_TIME, CURRENT_DATE y CURRENT_TIMESTAMP. No puede referirse a otra columna ni llamar a una función arbitraria.",
  }),

  c(`cursor.execute("CREATE TABLE t3 (nombre TEXT, activo INTEGER DEFAULT 1)")
cursor.execute("INSERT INTO t3 (nombre) VALUES (?)", ("Laptop",))
cursor.execute("SELECT nombre, activo FROM t3")
print(cursor.fetchone())`, `('Laptop', 1)`, { docs: [S.restricciones] }),

  t(`## CHECK

Verifica una condición sobre la fila antes de guardarla.`, {
    docs: [S.restricciones],
    nota: "CHECK se evalúa en cada INSERT y UPDATE. No puede consultar otras tablas ni usar subconsultas, porque debe poder verificarse con la fila a la vista. Si la condición da NULL, la restricción se considera cumplida.",
  }),

  c(`cursor.execute("CREATE TABLE t4 (precio REAL CHECK (precio > 0))")
try:
    cursor.execute("INSERT INTO t4 VALUES (?)", (-100,))
except sqlite3.IntegrityError as e:
    print(e)`, `CHECK constraint failed: precio > 0`, { docs: [S.restricciones] }),

  t(`## Las cuatro juntas

Una tabla real combina varias restricciones en la misma definición.`, { docs: [S.restricciones] }),

  c(`cursor.execute("""
    CREATE TABLE productos (
        id     INTEGER PRIMARY KEY,
        nombre TEXT    NOT NULL UNIQUE,
        precio REAL    NOT NULL CHECK (precio > 0),
        activo INTEGER NOT NULL DEFAULT 1
    )
""")`, null, { docs: [S.restricciones] }),

  t(`Al violar una restricción, el módulo lanza \`sqlite3.IntegrityError\`. Esa excepción hereda de \`sqlite3.DatabaseError\`.`, {
    docs: [P.excepciones, P.integrityError],
    nota: "La jerarquía completa está definida por el PEP 249: Warning y Error cuelgan de Exception, y de Error descienden InterfaceError y DatabaseError. IntegrityError cubre las violaciones de restricción, incluidas UNIQUE, NOT NULL, CHECK y clave foránea.",
  }),

  c(`try:
    cursor.execute("INSERT INTO productos (nombre, precio) VALUES ('Laptop', -100)")
except sqlite3.IntegrityError as e:
    print("Rechazado:", e)`, `Rechazado: CHECK constraint failed: precio > 0`, { docs: [P.integrityError] }),

  t(`## Sobre AUTOINCREMENT

La palabra \`AUTOINCREMENT\` casi nunca hace falta. Sin ella, SQLite ya asigna identificadores solo a una columna \`INTEGER PRIMARY KEY\`.`, {
    docs: [S.autoinc, S.rowid],
    nota: "La única diferencia es que AUTOINCREMENT garantiza que un identificador nunca se reutilice tras borrar filas. A cambio mantiene una tabla interna llamada sqlite_sequence y añade una escritura por inserción. La documentación oficial recomienda evitarla salvo que esa garantía sea necesaria.",
  }),
];

// ---------------------------------------------------------------------------
// Sesión 2
// ---------------------------------------------------------------------------
const s2: Bloque[] = [
  t(`# Insertar filas

La sentencia \`INSERT INTO\` recibe la lista de columnas y, tras la palabra \`VALUES\`, los valores en ese mismo orden.`, { docs: [S.insert] }),

  t(`## Los valores nunca van dentro de la cadena

Esta es la regla más importante del módulo. El signo de interrogación (?) actúa como marcador de posición, y los valores se pasan aparte en una tupla.`, {
    docs: [P.marcadores],
    nota: "Concatenar el valor dentro de la cadena SQL abre la puerta a una inyección: un valor como \\\"' OR 1=1 --\\\" cambia el significado de la consulta. Con marcadores de posición eso no puede ocurrir, porque el valor viaja por un canal distinto y nunca se analiza como SQL.",
  }),

  c(`cursor.execute(
    "INSERT INTO vendedores (nombre, region) VALUES (?, ?)",
    ("Ana Quispe", "Norte"),
)`, null, { docs: [P.marcadores, S.insert] }),

  t(`La tupla de un solo elemento necesita una coma final. Sin ella, Python no la interpreta como tupla.`, {
    docs: [P.marcadores],
    nota: 'Escribir ("Norte") entrega una cadena, no una tupla, y el módulo lanza ValueError porque intenta usar cada carácter como un parámetro distinto. La coma final, ("Norte",), es lo que crea la tupla.',
  }),

  c(`cursor.execute(
    "SELECT * FROM vendedores WHERE region = ?",
    ("Norte",),
)`, null, { docs: [P.marcadores] }),

  t(`## Marcadores con nombre

En lugar del signo de interrogación puede usarse dos puntos seguidos de un nombre (:nombre), y pasar un diccionario. Con muchas columnas resulta más legible.`, { docs: [P.marcadores] }),

  c(`cursor.execute(
    "INSERT INTO vendedores (nombre, region) VALUES (:nombre, :region)",
    {"nombre": "Luis Mendoza", "region": "Sur"},
)`, null, { docs: [P.marcadores] }),

  t(`## Insertar muchas filas

El método \`executemany()\` repite la misma sentencia sobre cada elemento de una secuencia, en una sola llamada.`, {
    docs: [P.executemany],
    nota: "executemany() es mucho más rápido que un bucle con execute(): el motor analiza la sentencia una sola vez y confirma una sola transacción, en lugar de una por fila.",
  }),

  c(`vendedores = [
    ("Rosa Ttito", "Norte"),
    ("Carlos Paz", "Centro"),
]
cursor.executemany(
    "INSERT INTO vendedores (nombre, region) VALUES (?, ?)",
    vendedores,
)`, null, { docs: [P.executemany] }),

  t(`# Confirmar los cambios

Las escrituras quedan dentro de una transacción abierta hasta llamar a \`commit()\`. Sin esa llamada, se descartan al cerrar la conexión.`, {
    docs: [P.commit, P.transacciones],
    nota: "El módulo abre una transacción de forma implícita antes de la primera sentencia que modifica datos. Las consultas de solo lectura no la necesitan, y por eso SELECT funciona sin commit().",
  }),

  c(`conexion.commit()`, null, { docs: [P.commit] }),

  t(`## La conexión como gestor de contexto

Usar la conexión con la palabra \`with\` confirma la transacción al salir del bloque sin error, y la revierte si se lanza una excepción.`, {
    docs: [P.contextManager],
    nota: "El bloque with sobre la conexión gestiona la transacción, no la conexión en sí: al salir no cierra el archivo. Cerrarlo sigue siendo responsabilidad de close().",
  }),

  c(`with conexion:
    conexion.execute(
        "INSERT INTO vendedores (nombre, region) VALUES (?, ?)",
        ("Pedro Rojas", "Sur"),
    )`, null, { docs: [P.contextManager] }),

  t(`# Leer resultados

El método \`fetchall()\` devuelve todas las filas restantes como una lista de tuplas.`, { docs: [P.fetchall] }),

  c(`cursor.execute("SELECT nombre, region FROM vendedores")
print(cursor.fetchall())`, `[('Ana Quispe', 'Norte'), ('Luis Mendoza', 'Sur')]`, { docs: [P.fetchall] }),

  t(`El método \`fetchone()\` devuelve una sola fila, o \`None\` cuando ya no quedan.`, {
    docs: [P.fetchone],
    nota: "fetchall() carga todo el resultado en memoria. Con tablas grandes conviene recorrer el cursor directamente en un bucle for, porque entrega las filas de a poco.",
  }),

  c(`cursor.execute("SELECT nombre FROM vendedores")
print(cursor.fetchone())
print(cursor.fetchone())`, `('Ana Quispe',)
('Luis Mendoza',)`, { docs: [P.fetchone] }),

  t(`El cursor también es iterable, y esa es la forma recomendada para resultados grandes.`, { docs: [P.cursor] }),

  c(`for fila in cursor.execute("SELECT nombre FROM vendedores"):
    print(fila[0])`, `Ana Quispe
Luis Mendoza
Rosa Ttito`, { docs: [P.cursor] }),

  t(`## Acceder a las columnas por nombre

Por omisión cada fila es una tupla, y las columnas se leen por posición. Asignar \`sqlite3.Row\` al atributo \`row_factory\` permite leerlas por nombre.`, {
    docs: [P.rowFactory, P.row],
    nota: "sqlite3.Row admite acceso por índice y por nombre, distingue mayúsculas de minúsculas solo en el índice, y ocupa menos memoria que un diccionario. Leer por posición hace que la consulta se rompa en silencio si alguien reordena las columnas.",
  }),

  c(`conexion.row_factory = sqlite3.Row
cursor = conexion.cursor()

cursor.execute("SELECT nombre, region FROM vendedores")
fila = cursor.fetchone()
print(fila["nombre"], fila["region"])`, `Ana Quispe Norte`, { docs: [P.rowFactory, P.row] }),

  t(`# Modificar y borrar

La sentencia \`UPDATE\` cambia valores de filas existentes. La cláusula \`WHERE\` decide a cuáles se aplica.`, {
    docs: [S.update],
    nota: "Sin cláusula WHERE, el UPDATE afecta a todas las filas de la tabla y nadie pide confirmación. El atributo cursor.rowcount indica cuántas filas cambió la última sentencia.",
  }),

  c(`cursor.execute(
    "UPDATE vendedores SET region = ? WHERE nombre = ?",
    ("Oriente", "Carlos Paz"),
)
print(cursor.rowcount)`, `1`, { docs: [S.update, P.cursor] }),

  t(`La sentencia \`DELETE FROM\` elimina filas. La misma advertencia sobre la cláusula \`WHERE\` aplica.`, { docs: [S.del] }),

  c(`cursor.execute("DELETE FROM vendedores WHERE region = ?", ("Oriente",))
conexion.commit()`, null, { docs: [S.del] }),

  t(`# Cerrar la conexión

El método \`close()\` libera el archivo. Los cambios sin confirmar se pierden.`, { docs: [P.close] }),

  c(`conexion.close()`, null, { docs: [P.close] }),
];

// ---------------------------------------------------------------------------
// Sesión 3
// ---------------------------------------------------------------------------
const s3: Bloque[] = [
  t(`# Filtrar con WHERE

La cláusula \`WHERE\` deja pasar solo las filas que cumplen una condición. Las condiciones se combinan con los operadores \`AND\` y \`OR\`.`, { docs: [S.select, S.expresiones] }),

  c(`cursor.execute(
    "SELECT nombre FROM productos WHERE precio > ? AND activo = ?",
    (100, 1),
)
print(cursor.fetchall())`, `[('Laptop',), ('Monitor',)]`, { docs: [S.expresiones] }),

  t(`## Comparar texto con LIKE

El operador \`LIKE\` compara una columna con un patrón. Tiene dos comodines, y cada uno se recorre por separado.`, {
    docs: [S.expresiones],
    nota: "LIKE no distingue mayúsculas de minúsculas, pero solo en los caracteres ASCII. Las letras acentuadas y la eñe sí se distinguen, salvo que SQLite se compile con la extensión ICU.",
  }),

  t(`### El porcentaje

El signo de porcentaje (%) representa cualquier cantidad de caracteres, incluida ninguna.`, { docs: [S.expresiones] }),

  c(`cursor.execute("SELECT nombre FROM vendedores WHERE nombre LIKE ?", ("Ana%",))
print(cursor.fetchall())`, `[('Ana Quispe',)]`, { docs: [S.expresiones] }),

  t(`Colocado a ambos lados, busca el fragmento en cualquier posición del texto.`, { docs: [S.expresiones] }),

  c(`cursor.execute("SELECT nombre FROM vendedores WHERE nombre LIKE ?", ("%pe%",))
print(cursor.fetchall())`, `[('Ana Quispe',)]`, { docs: [S.expresiones] }),

  t(`### El guion bajo

El guion bajo (_) representa exactamente un carácter, ni más ni menos.`, {
    docs: [S.expresiones],
    nota: "Para buscar un porcentaje o un guion bajo literales, hay que declarar un carácter de escape con la cláusula ESCAPE: LIKE '100!%' ESCAPE '!' busca el texto 100% tal cual.",
  }),

  c(`cursor.execute("SELECT nombre FROM productos WHERE nombre LIKE ?", ("Mo____",))
print(cursor.fetchall())`, `[('Monitor',)]`, { docs: [S.expresiones] }),

  t(`# El valor NULL

\`NULL\` significa dato ausente, no cero ni cadena vacía. Cualquier comparación con \`NULL\` mediante el operador de igualdad (=) devuelve \`NULL\`, nunca verdadero.`, {
    docs: [S.nulls],
    nota: "Como WHERE solo deja pasar las filas cuya condición es verdadera, y NULL no lo es, una fila con NULL nunca se selecciona con una comparación normal. Ni siquiera NULL = NULL es verdadero.",
  }),

  c(`cursor.execute("SELECT nombre FROM vendedores WHERE region = ?", (None,))
print(cursor.fetchall())`, `[]`, { docs: [S.nulls] }),

  t(`Para preguntar por ausencia de valor se usan los operadores \`IS NULL\` e \`IS NOT NULL\`. No admiten marcador de posición, porque forman parte de la sintaxis y no son un valor.`, { docs: [S.nulls] }),

  c(`cursor.execute("SELECT nombre FROM vendedores WHERE region IS NULL")
print(cursor.fetchall())`, `[('Pedro Rojas',)]`, { docs: [S.nulls] }),

  t(`# Ordenar y limitar

La cláusula \`ORDER BY\` ordena el resultado. La palabra \`ASC\` ordena de menor a mayor y es el comportamiento por omisión; \`DESC\` ordena de mayor a menor. La cláusula \`LIMIT\` restringe la cantidad de filas.`, {
    docs: [S.select],
    nota: "Sin ORDER BY, el orden de las filas no está garantizado. Puede parecer estable durante meses y cambiar al añadir un índice, porque depende de cómo el planificador decida recorrer los datos.",
  }),

  c(`cursor.execute("""
    SELECT nombre, precio FROM productos
    ORDER BY precio DESC
    LIMIT 2
""")
print(cursor.fetchall())`, `[('Laptop', 2500.0), ('Monitor', 1200.0)]`, { docs: [S.select] }),

  t(`# Funciones de agregación

Una función de agregación calcula un solo valor a partir de muchas filas. Son cinco las de uso corriente, y cada una se recorre por separado.`, { docs: [S.agregacion] }),

  t(`## COUNT

Cuenta filas. Con el asterisco (*) cuenta todas las del grupo.`, { docs: [S.agregacion] }),

  c(`cursor.execute("SELECT COUNT(*) FROM ventas")
print(cursor.fetchone()[0])`, `12`, { docs: [S.agregacion] }),

  t(`## SUM

Suma los valores de una columna numérica.`, {
    docs: [S.agregacion],
    nota: "SUM() devuelve NULL, no cero, cuando no hay ninguna fila que sumar. La función TOTAL() hace lo mismo pero devuelve 0.0 en ese caso, y es específica de SQLite.",
  }),

  c(`cursor.execute("SELECT SUM(cantidad * precio) FROM ventas")
print(cursor.fetchone()[0])`, `21600.0`, { docs: [S.agregacion] }),

  t(`## AVG

Calcula el promedio aritmético de una columna numérica.`, {
    docs: [S.agregacion],
    nota: "AVG() divide entre la cantidad de valores no nulos, no entre el total de filas. Con datos ausentes el resultado difiere de dividir SUM() entre COUNT(*).",
  }),

  c(`cursor.execute("SELECT AVG(precio) FROM ventas")
print(round(cursor.fetchone()[0], 2))`, `1250.0`, { docs: [S.agregacion] }),

  t(`## MIN

Devuelve el valor más bajo de la columna.`, {
    docs: [S.agregacion],
    nota: "MIN() con un solo argumento es una función de agregación y recorre las filas. Con dos o más argumentos es otra función distinta, escalar, que compara valores dentro de una misma fila.",
  }),

  c(`cursor.execute("SELECT MIN(precio) FROM ventas")
print(cursor.fetchone()[0])`, `45.0`, { docs: [S.agregacion] }),

  t(`## MAX

Devuelve el valor más alto de la columna.`, {
    docs: [S.agregacion],
    nota: "Al usar MIN() o MAX() junto a otras columnas sin agrupar, SQLite sí devuelve los valores de la fila que produjo ese extremo. Es la única excepción documentada a la regla de las columnas fuera del grupo.",
  }),

  c(`cursor.execute("SELECT MAX(precio) FROM ventas")
print(cursor.fetchone()[0])`, `2500.0`, { docs: [S.agregacion] }),

  t(`\`COUNT(*)\` cuenta filas. \`COUNT(columna)\` cuenta solo los valores no nulos de esa columna.`, {
    docs: [S.agregacion, S.nulls],
    nota: "Todas las funciones de agregación salvo COUNT(*) ignoran los NULL. Por eso AVG() promedia sobre los valores presentes, no sobre el total de filas, y puede dar un resultado distinto al esperado.",
  }),

  c(`cursor.execute("SELECT COUNT(*), COUNT(descuento) FROM ventas")
print(cursor.fetchone())`, `(12, 9)`, { docs: [S.agregacion] }),

  t(`# Agrupar con GROUP BY

La cláusula \`GROUP BY\` divide las filas en grupos según el valor de una columna, y la función de agregación se calcula dentro de cada grupo.`, { docs: [S.select] }),

  c(`cursor.execute("""
    SELECT categoria, SUM(cantidad * precio) AS total
    FROM ventas
    GROUP BY categoria
""")
for fila in cursor.fetchall():
    print(fila["categoria"], fila["total"])`, `Accesorios 1350.0
Electronica 18700.0
Oficina 1550.0`, { docs: [S.select, S.agregacion] }),

  t(`## Filtrar grupos con HAVING

La cláusula \`WHERE\` filtra filas antes de agrupar. Para filtrar los grupos ya calculados se usa \`HAVING\`.`, {
    docs: [S.select],
    nota: "El orden de evaluación es FROM, WHERE, GROUP BY, HAVING y por último SELECT. Por eso WHERE no puede usar el resultado de una agregación: cuando se evalúa, ese resultado todavía no existe.",
  }),

  c(`cursor.execute("""
    SELECT categoria, SUM(cantidad * precio) AS total
    FROM ventas
    GROUP BY categoria
    HAVING total > 5000
""")
print(cursor.fetchall()[0]["categoria"])`, `Electronica`, { docs: [S.select] }),

  t(`# Unir tablas con JOIN

Un \`JOIN\` combina filas de dos tablas usando una columna que ambas comparten. La condición va tras la palabra \`ON\`.`, {
    docs: [S.join],
    nota: "Las letras v y vt del ejemplo son alias de tabla: nombres cortos válidos solo dentro de esa consulta. Sirven para desambiguar cuando dos tablas tienen columnas con el mismo nombre.",
  }),

  c(`cursor.execute("""
    SELECT v.nombre, vt.producto
    FROM ventas vt
    JOIN vendedores v ON vt.vendedor_id = v.id
""")
print(cursor.fetchall()[0]["nombre"])`, `Ana Quispe`, { docs: [S.join] }),

  t(`## INNER JOIN y LEFT JOIN

El \`JOIN\` por omisión es \`INNER\`: devuelve solo las filas con coincidencia en ambas tablas, de modo que un vendedor sin ventas no aparece. \`LEFT JOIN\` conserva todas las filas de la tabla izquierda, que es la nombrada tras \`FROM\`.`, {
    docs: [S.join],
    nota: "SQLite implementa INNER JOIN y LEFT JOIN desde siempre, y desde la versión 3.39 también RIGHT JOIN y FULL OUTER JOIN. Antes de esa versión, un RIGHT JOIN se escribía invirtiendo el orden de las tablas.",
  }),

  c(`cursor.execute("""
    SELECT v.nombre, COUNT(vt.id) AS num_ventas
    FROM vendedores v
    LEFT JOIN ventas vt ON vt.vendedor_id = v.id
    GROUP BY v.id, v.nombre
""")
for fila in cursor.fetchall():
    print(fila["nombre"], fila["num_ventas"])`, `Ana Quispe 2
Luis Mendoza 1
Rosa Ttito 0`, { docs: [S.join] }),

  t(`Nótese que se usa \`COUNT(vt.id)\` y no \`COUNT(*)\`. Con \`COUNT(*)\` el vendedor sin ventas contaría 1, porque el \`LEFT JOIN\` produce una fila para él con las columnas de la derecha en \`NULL\`.`, {
    docs: [S.agregacion],
    nota: "Es el error más frecuente al combinar LEFT JOIN con agregación. COUNT(columna) ignora los NULL y por eso devuelve el cero correcto.",
  }),

  t(`# Claves foráneas

Una clave foránea declara que una columna debe corresponder al identificador de otra tabla. Impide registrar una venta de un vendedor que no existe.`, { docs: [S.foreignKeys] }),

  c(`cursor.execute("""
    CREATE TABLE ventas (
        id          INTEGER PRIMARY KEY,
        vendedor_id INTEGER NOT NULL REFERENCES vendedores(id),
        producto    TEXT    NOT NULL,
        cantidad    INTEGER NOT NULL
    )
""")`, null, { docs: [S.foreignKeys] }),

  t(`## Las claves foráneas están desactivadas por omisión

SQLite no verifica las claves foráneas salvo que se activen explícitamente en cada conexión.`, {
    docs: [S.foreignKeys, S.pragma],
    nota: "La verificación está desactivada por compatibilidad con versiones anteriores a la 3.6.19. El PRAGMA afecta solo a la conexión actual y no queda guardado en el archivo: hay que ejecutarlo cada vez que se abre la base.",
  }),

  c(`conexion.execute("PRAGMA foreign_keys = ON")`, null, { docs: [S.pragma] }),

  c(`try:
    cursor.execute(
        "INSERT INTO ventas (vendedor_id, producto, cantidad) VALUES (?, ?, ?)",
        (999, "Laptop", 1),
    )
except sqlite3.IntegrityError as e:
    print("Rechazado:", e)`, `Rechazado: FOREIGN KEY constraint failed`, { docs: [S.foreignKeys, P.integrityError] }),
];

// ---------------------------------------------------------------------------
// Sesión 4
// ---------------------------------------------------------------------------
const s4: Bloque[] = [
  t(`# Transacciones

Una transacción agrupa varias sentencias en una sola operación indivisible: o se aplican todas, o no se aplica ninguna.`, {
    docs: [S.transacciones, P.transacciones],
    nota: "SQLite garantiza las propiedades ACID incluso ante un corte de energía o un fallo del sistema operativo. El módulo de Python abre y confirma las transacciones por su cuenta, con el comportamiento que define el parámetro isolation_level de connect().",
  }),

  c(`with conexion:
    conexion.execute("UPDATE cuentas SET saldo = saldo - ? WHERE id = ?", (100, 1))
    conexion.execute("UPDATE cuentas SET saldo = saldo + ? WHERE id = ?", (100, 2))`, null, { docs: [P.contextManager] }),

  t(`Si el bloque lanza una excepción, la transacción se revierte entera y ninguna de las dos actualizaciones queda aplicada.`, { docs: [P.contextManager] }),

  c(`try:
    with conexion:
        conexion.execute("DELETE FROM ventas")
        raise ValueError("algo salió mal")
except ValueError:
    print(conexion.execute("SELECT COUNT(*) FROM ventas").fetchone()[0])`, `12`, { docs: [P.contextManager] }),

  t(`## Transacciones y velocidad

Cada sentencia suelta se ejecuta dentro de su propia transacción implícita, y cada transacción obliga a escribir en el disco. Agrupar muchas inserciones en una sola transacción reduce ese trabajo a una vez.`, {
    docs: [S.transacciones],
    nota: "La diferencia es de dos a tres órdenes de magnitud en cargas masivas. Es la primera causa a revisar cuando una carga de datos en SQLite parece inexplicablemente lenta.",
  }),

  t(`# Índices

Un índice es una estructura auxiliar que permite localizar filas sin recorrer la tabla entera.`, {
    docs: [S.indices],
    nota: "SQLite usa árboles B para los índices. Aceleran las lecturas que filtran u ordenan por la columna indexada, y en contrapartida ocupan espacio y encarecen cada escritura, porque el índice se actualiza junto con la tabla.",
  }),

  c(`conexion.execute("CREATE INDEX idx_ventas_vendedor ON ventas(vendedor_id)")`, null, { docs: [S.indices] }),

  t(`## Comprobar si un índice se usa

La sentencia \`EXPLAIN QUERY PLAN\` muestra cómo el planificador piensa resolver una consulta, sin ejecutarla.`, {
    docs: [S.eqp],
    nota: "En la salida, SCAN significa que recorre la tabla completa y SEARCH que usa un índice. Ver SCAN sobre una tabla grande en una consulta frecuente es la señal de que falta un índice.",
  }),

  c(`plan = conexion.execute("""
    EXPLAIN QUERY PLAN
    SELECT * FROM ventas WHERE vendedor_id = ?
""", (3,)).fetchall()

for paso in plan:
    print(paso["detail"])`, `SEARCH ventas USING INDEX idx_ventas_vendedor (vendedor_id=?)`, { docs: [S.eqp] }),

  t(`Sin el índice, el mismo plan muestra un recorrido completo de la tabla.`, { docs: [S.eqp] }),

  c(`conexion.execute("DROP INDEX idx_ventas_vendedor")

plan = conexion.execute("""
    EXPLAIN QUERY PLAN
    SELECT * FROM ventas WHERE vendedor_id = ?
""", (3,)).fetchall()

print(plan[0]["detail"])`, `SCAN ventas`, { docs: [S.eqp] }),

  t(`# Modo WAL

El modo de registro de escritura anticipada, \`WAL\`, cambia la forma en que SQLite guarda los cambios y permite que las lecturas no bloqueen a la escritura.`, {
    docs: [S.wal],
    nota: "En el modo por omisión, un escritor bloquea a todos los lectores. En WAL, los lectores siguen viendo la última versión confirmada mientras alguien escribe. Sigue admitiendo un solo escritor a la vez, y crea dos archivos auxiliares junto a la base.",
  }),

  c(`print(conexion.execute("PRAGMA journal_mode = WAL").fetchone()[0])`, `wal`, { docs: [S.wal, S.pragma] }),

  t(`# Fechas

SQLite no tiene un tipo de dato para fechas. Se guardan como texto en formato ISO 8601, y un conjunto de funciones del motor opera sobre ellas.`, {
    docs: [S.fechas, P.adaptadores],
    nota: "El formato AAAA-MM-DD es el recomendado porque su orden alfabético coincide con el cronológico. Desde Python 3.12 los adaptadores automáticos para date y datetime están obsoletos: la documentación recomienda convertir a texto de forma explícita.",
  }),

  c(`from datetime import date

conexion.execute(
    "INSERT INTO ventas (fecha, producto) VALUES (?, ?)",
    (date(2026, 8, 23).isoformat(), "Laptop"),
)`, null, { docs: [P.adaptadores] }),

  c(`print(conexion.execute("SELECT date('now', '+7 days')").fetchone()[0])`, `2026-08-12`, { docs: [S.fechas] }),

  t(`# Un programa completo

Estas son las piezas anteriores en un solo archivo ejecutable.`, { docs: [P.howto] }),

  c(`import sqlite3

with sqlite3.connect(":memory:") as conexion:
    conexion.row_factory = sqlite3.Row
    conexion.execute("PRAGMA foreign_keys = ON")

    conexion.execute("""
        CREATE TABLE vendedores (
            id     INTEGER PRIMARY KEY,
            nombre TEXT    NOT NULL,
            region TEXT    NOT NULL
        )
    """)

    conexion.executemany(
        "INSERT INTO vendedores (nombre, region) VALUES (?, ?)",
        [("Ana Quispe", "Norte"), ("Luis Mendoza", "Sur")],
    )

    for fila in conexion.execute("SELECT nombre, region FROM vendedores"):
        print(fila["nombre"], "-", fila["region"])`, `Ana Quispe - Norte
Luis Mendoza - Sur`, { docs: [P.howto] }),

  t(`# Cierre

Con esto ya es posible diseñar un esquema, consultarlo desde Python y hacerlo rendir. El paso siguiente natural es PostgreSQL: el lenguaje SQL es casi el mismo y la interfaz de Python también, porque ambos conectores siguen la misma especificación DB-API.

Los documentos sobre peculiaridades del motor y sobre cuándo usar SQLite merecen una lectura completa antes de llevar nada a producción.`, { docs: [S.quirks, S.cuandoUsar, P.modulo] }),
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

export const leccionesSqlite: Leccion[] = [
  armar(1, "El motor, la conexión y las tablas", s1),
  armar(2, "Insertar, leer y confirmar", s2),
  armar(3, "Consultas, agregación y JOIN", s3),
  armar(4, "Transacciones, índices y rendimiento", s4),
];
