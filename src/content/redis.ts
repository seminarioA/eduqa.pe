import {
  derivarSecciones,
  idsDeSecciones,
  type Bloque,
  type Ejercicio,
  type Leccion,
} from "@/lib/cursos";

// Curso de Introducción a Redis con Python.
//
// Todo el curso pasa por redis-py, el cliente oficial. Se cita la
// documentación de redis.io para la semántica de cada comando y la de
// redis-py para la interfaz de Python.
//
// Mismas reglas de redacción que los cursos de Python y SQLite:
//   1. Sin emojis en títulos ni subtítulos.
//   2. Casi todo ejemplo cita la documentación oficial.
//   3. Un concepto por bloque de código.
//   4. Cada símbolo se nombra la primera vez que aparece; ningún sujeto
//      queda sin antecedente.
//   5. La precisión técnica que no cabe arriba va en `nota`, plegada.
//
// El código se ejecuta en el navegador contra fakeredis, que implementa la
// misma interfaz de redis-py en memoria. Lo que se escribe aquí funciona sin
// cambios contra un servidor Redis de verdad.

const R = {
  intro: { titulo: "Introducción a Redis", url: "https://redis.io/docs/latest/develop/get-started/" },
  tipos: { titulo: "Tipos de datos", url: "https://redis.io/docs/latest/develop/data-types/" },
  cadenas: { titulo: "Cadenas", url: "https://redis.io/docs/latest/develop/data-types/strings/" },
  listas: { titulo: "Listas", url: "https://redis.io/docs/latest/develop/data-types/lists/" },
  hashes: { titulo: "Hashes", url: "https://redis.io/docs/latest/develop/data-types/hashes/" },
  conjuntos: { titulo: "Conjuntos", url: "https://redis.io/docs/latest/develop/data-types/sets/" },
  ordenados: { titulo: "Conjuntos ordenados", url: "https://redis.io/docs/latest/develop/data-types/sorted-sets/" },
  claves: { titulo: "Nombres de clave", url: "https://redis.io/docs/latest/develop/using-commands/keyspace/" },
  caducidad: { titulo: "Caducidad de claves", url: "https://redis.io/docs/latest/develop/using-commands/keyspace/#key-expiration" },
  transacciones: { titulo: "Transacciones", url: "https://redis.io/docs/latest/develop/using-commands/transactions/" },
  canalizacion: { titulo: "Canalización", url: "https://redis.io/docs/latest/develop/using-commands/pipelining/" },
  set: { titulo: "SET", url: "https://redis.io/docs/latest/commands/set/" },
  get: { titulo: "GET", url: "https://redis.io/docs/latest/commands/get/" },
  del: { titulo: "DEL", url: "https://redis.io/docs/latest/commands/del/" },
  exists: { titulo: "EXISTS", url: "https://redis.io/docs/latest/commands/exists/" },
  expire: { titulo: "EXPIRE", url: "https://redis.io/docs/latest/commands/expire/" },
  ttl: { titulo: "TTL", url: "https://redis.io/docs/latest/commands/ttl/" },
  incr: { titulo: "INCR", url: "https://redis.io/docs/latest/commands/incr/" },
  incrby: { titulo: "INCRBY", url: "https://redis.io/docs/latest/commands/incrby/" },
  mset: { titulo: "MSET", url: "https://redis.io/docs/latest/commands/mset/" },
  mget: { titulo: "MGET", url: "https://redis.io/docs/latest/commands/mget/" },
  setnx: { titulo: "SETNX", url: "https://redis.io/docs/latest/commands/setnx/" },
  type: { titulo: "TYPE", url: "https://redis.io/docs/latest/commands/type/" },
  rpush: { titulo: "RPUSH", url: "https://redis.io/docs/latest/commands/rpush/" },
  lpush: { titulo: "LPUSH", url: "https://redis.io/docs/latest/commands/lpush/" },
  lrange: { titulo: "LRANGE", url: "https://redis.io/docs/latest/commands/lrange/" },
  lpop: { titulo: "LPOP", url: "https://redis.io/docs/latest/commands/lpop/" },
  rpop: { titulo: "RPOP", url: "https://redis.io/docs/latest/commands/rpop/" },
  llen: { titulo: "LLEN", url: "https://redis.io/docs/latest/commands/llen/" },
  ltrim: { titulo: "LTRIM", url: "https://redis.io/docs/latest/commands/ltrim/" },
  hset: { titulo: "HSET", url: "https://redis.io/docs/latest/commands/hset/" },
  hget: { titulo: "HGET", url: "https://redis.io/docs/latest/commands/hget/" },
  hgetall: { titulo: "HGETALL", url: "https://redis.io/docs/latest/commands/hgetall/" },
  hmget: { titulo: "HMGET", url: "https://redis.io/docs/latest/commands/hmget/" },
  hincrby: { titulo: "HINCRBY", url: "https://redis.io/docs/latest/commands/hincrby/" },
  hdel: { titulo: "HDEL", url: "https://redis.io/docs/latest/commands/hdel/" },
  sadd: { titulo: "SADD", url: "https://redis.io/docs/latest/commands/sadd/" },
  sismember: { titulo: "SISMEMBER", url: "https://redis.io/docs/latest/commands/sismember/" },
  smembers: { titulo: "SMEMBERS", url: "https://redis.io/docs/latest/commands/smembers/" },
  scard: { titulo: "SCARD", url: "https://redis.io/docs/latest/commands/scard/" },
  sinter: { titulo: "SINTER", url: "https://redis.io/docs/latest/commands/sinter/" },
  sunion: { titulo: "SUNION", url: "https://redis.io/docs/latest/commands/sunion/" },
  sdiff: { titulo: "SDIFF", url: "https://redis.io/docs/latest/commands/sdiff/" },
  zadd: { titulo: "ZADD", url: "https://redis.io/docs/latest/commands/zadd/" },
  zrange: { titulo: "ZRANGE", url: "https://redis.io/docs/latest/commands/zrange/" },
  zscore: { titulo: "ZSCORE", url: "https://redis.io/docs/latest/commands/zscore/" },
  zrank: { titulo: "ZRANK", url: "https://redis.io/docs/latest/commands/zrank/" },
  zincrby: { titulo: "ZINCRBY", url: "https://redis.io/docs/latest/commands/zincrby/" },
  scan: { titulo: "SCAN", url: "https://redis.io/docs/latest/commands/scan/" },
  keys: { titulo: "KEYS", url: "https://redis.io/docs/latest/commands/keys/" },
  persistencia: { titulo: "Persistencia", url: "https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" },
} as const;

const PY = {
  cliente: { titulo: "redis-py", url: "https://redis.readthedocs.io/en/stable/" },
  conexion: { titulo: "Redis.from_url()", url: "https://redis.readthedocs.io/en/stable/connections.html" },
  comandos: { titulo: "Comandos en redis-py", url: "https://redis.readthedocs.io/en/stable/commands.html" },
  pipeline: { titulo: "Pipeline", url: "https://redis.readthedocs.io/en/stable/advanced_features.html#pipelines" },
  fakeredis: { titulo: "fakeredis", url: "https://pypi.org/project/fakeredis/" },
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

// El preludio deja lista la conexión antes de cada ejercicio. Pedirla en cada
// enunciado sería repetir la misma línea veinte veces sin enseñar nada nuevo.
export const PRELUDIO_REDIS = `import fakeredis
r = fakeredis.FakeStrictRedis(decode_responses=True)`;

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
  t(`# Qué es Redis

Redis es un almacén de estructuras de datos en memoria. Guarda pares formados por una clave y un valor, y mantiene ambos en la memoria principal del servidor en lugar de en disco.

Esa decisión explica sus dos características más citadas. La primera es la latencia: una lectura tarda del orden de microsegundos, porque no hay ninguna cabeza de disco que mover ni ninguna página que traer. La segunda es el límite de tamaño: el conjunto de datos tiene que caber en la memoria disponible.

Redis no sustituye a una base de datos relacional. Se usa junto a ella, para lo que la relacional hace mal: cachés, contadores, colas, sesiones y rankings.`, {
    docs: [R.intro],
    nota: "Redis sí escribe en disco, pero para poder reconstruir el estado tras un reinicio, no para servir lecturas. Los dos mecanismos son RDB, que vuelca una instantánea cada cierto tiempo, y AOF, que registra cada operación de escritura. Ninguno de los dos interviene en el camino de una lectura.",
  }),

  t(`## Clave y valor

Una clave es una cadena de bytes que identifica un dato. Un valor es lo que hay guardado bajo esa clave.

La diferencia con un diccionario de Python está en el valor: en Redis no es un objeto cualquiera, sino uno de un conjunto cerrado de estructuras. Cada estructura trae sus propios comandos, y aplicar el comando de una estructura a otra es un error, no una conversión silenciosa.`, {
    docs: [R.tipos],
  }),

  t(`# Conectarse desde Python

El cliente oficial de Python es \`redis-py\`. Se instala con \`pip install redis\` y se importa como \`redis\`.

En este curso el servidor no existe: el código corre contra \`fakeredis\`, que implementa la misma interfaz en memoria dentro del propio navegador. Todo lo que aparece a continuación funciona sin cambiar una línea contra un Redis de verdad.`, {
    docs: [PY.cliente, PY.fakeredis],
    nota: "Contra un servidor real la conexión se abre con redis.Redis(host, port) o con redis.Redis.from_url(\"redis://...\"). El resto de la interfaz es idéntica, porque fakeredis hereda de las mismas clases de redis-py.",
  }),

  c(`import fakeredis

r = fakeredis.FakeStrictRedis(decode_responses=True)
print(r.ping())`, `True`, {
    docs: [PY.conexion],
    nota: "El parámetro decode_responses convierte a str los bytes que devuelve el servidor. Sin él, r.get() devolvería b'valor' en lugar de 'valor': Redis habla en bytes y quien decide la codificación es el cliente.",
  }),

  t(`# Guardar y leer una clave

El comando \`SET\` guarda un valor bajo una clave. El comando \`GET\` lo recupera. En \`redis-py\` son los métodos \`set()\` y \`get()\`.`, {
    docs: [R.set, R.get, R.cadenas],
  }),

  c(`r.set("curso", "Redis")
print(r.get("curso"))`, `Redis`, {
    docs: [R.set],
    nota: "SET sobrescribe sin avisar y sin importar qué tipo tenía antes la clave. También descarta la caducidad que tuviera puesta, salvo que se use la opción KEEPTTL.",
  }),

  t(`## Cuando la clave no existe

\`GET\` sobre una clave inexistente no es un error: devuelve el valor nulo, que en Python es \`None\`.

Es una diferencia importante con un diccionario, donde el acceso a una clave ausente lanza \`KeyError\`.`, {
    docs: [R.get],
  }),

  c(`print(r.get("no-existe"))`, `None`, { docs: [R.get] }),

  t(`# Comprobar si una clave existe

El comando \`EXISTS\` devuelve cuántas de las claves indicadas existen. Con una sola clave el resultado es 1 o 0.`, {
    docs: [R.exists],
  }),

  c(`r.set("curso", "Redis")
print(r.exists("curso"))
print(r.exists("no-existe"))`, `1
0`, {
    docs: [R.exists],
    nota: "EXISTS acepta varias claves y cuenta repeticiones: si una misma clave se pasa dos veces y existe, suma 2. Conviene tenerlo presente antes de usar el resultado como un booleano.",
  }),

  t(`# Borrar claves

El comando \`DEL\` elimina una o varias claves y devuelve cuántas ha eliminado de verdad. Las que no existían no cuentan.`, {
    docs: [R.del],
  }),

  c(`r.set("temporal", "1")
print(r.delete("temporal", "inexistente"))`, `1`, { docs: [R.del] }),

  t(`# Claves con caducidad

Una clave puede llevar un plazo de vida. El comando \`EXPIRE\` fija ese plazo en segundos, y el comando \`TTL\` consulta cuántos quedan.

Este mecanismo es lo que convierte a Redis en una caché: el dato se borra solo cuando deja de ser fiable, sin que nadie tenga que limpiarlo a mano.`, {
    docs: [R.expire, R.ttl, R.caducidad],
  }),

  c(`r.set("sesion:42", "activa")
r.expire("sesion:42", 300)
print(r.ttl("sesion:42"))`, `300`, {
    docs: [R.expire],
    nota: "TTL devuelve -1 si la clave existe pero no tiene caducidad, y -2 si la clave no existe. Distinguir los dos casos evita confundir «sin plazo» con «ya no está».",
  }),

  t(`## Fijar el valor y el plazo a la vez

El método \`set()\` acepta el parámetro \`ex\`, que aplica la caducidad en la misma operación. Hacerlo en dos pasos deja una ventana en la que la clave existe sin plazo: si el proceso termina de forma anormal justo ahí, esa clave se queda para siempre.`, {
    docs: [R.set],
  }),

  c(`r.set("sesion:43", "activa", ex=300)
print(r.ttl("sesion:43"))`, `300`, { docs: [R.set] }),

  t(`# Contadores atómicos

El comando \`INCR\` interpreta el valor como un número entero y le suma uno. La operación es atómica: aunque mil clientes la ejecuten a la vez, ninguno pisa el resultado de otro.

Esa garantía es la razón de usar \`INCR\` en lugar de leer, sumar en el cliente y volver a escribir. Esa secuencia de tres pasos pierde incrementos en cuanto hay concurrencia.`, {
    docs: [R.incr],
  }),

  c(`print(r.incr("visitas"))
print(r.incr("visitas"))`, `1
2`, {
    docs: [R.incr],
    nota: "Si la clave no existe, INCR la trata como si valiera 0 y devuelve 1. Si existe pero su contenido no es un entero, lanza un error de tipo en lugar de reiniciar la cuenta.",
  }),

  t(`## Sumar una cantidad distinta de uno

El comando \`INCRBY\` suma el entero que se le indique. Para restar existe \`DECRBY\`, aunque \`INCRBY\` con un número negativo hace lo mismo.`, {
    docs: [R.incrby],
  }),

  c(`r.set("stock", 100)
print(r.incrby("stock", -3))`, `97`, { docs: [R.incrby] }),

  t(`# Varias claves en una sola ida y vuelta

El comando \`MSET\` guarda varios pares a la vez y el comando \`MGET\` lee varios valores a la vez.

La ventaja no está en el servidor, que resolvería cada comando igual de rápido, sino en la red: tres \`GET\` son tres viajes de ida y vuelta, y un \`MGET\` de tres claves es uno solo.`, {
    docs: [R.mset, R.mget],
  }),

  c(`r.mset({"a": "1", "b": "2", "c": "3"})
print(r.mget("a", "b", "c"))`, `['1', '2', '3']`, {
    docs: [R.mset, R.mget],
    nota: "MGET devuelve una lista de la misma longitud que las claves pedidas, en el mismo orden, y coloca None en la posición de las que no existen. Nunca acorta la lista, de modo que las posiciones siguen siendo comparables con la petición.",
  }),

  t(`# Cómo nombrar las claves

Redis no tiene tablas ni esquemas: el nombre de la clave es toda la organización que hay. La convención establecida es separar las partes con dos puntos (\`:\`), de lo general a lo concreto.

Así, \`usuario:42:sesion\` se lee como «la sesión del usuario 42». Las herramientas de inspección aprovechan esa convención para agrupar claves, y quien lea el código dos años después entiende la jerarquía sin documentación aparte.`, {
    docs: [R.claves],
    nota: "El límite de longitud de una clave es de 512 MB, así que en la práctica no existe. Lo que sí importa es el coste: cada clave ocupa memoria por sí misma, de modo que nombres largos multiplicados por millones de claves se notan en la factura.",
  }),

  c(`r.set("usuario:42:nombre", "Ana")
r.set("usuario:42:plan", "gratis")
print(r.mget("usuario:42:nombre", "usuario:42:plan"))`, `['Ana', 'gratis']`, {
    docs: [R.claves],
  }),

  t(`# Cierre

Con lo visto ya se puede usar Redis como caché y como contador, que son sus dos usos más frecuentes. Todo ha pasado por un solo tipo de valor, la cadena.

La sesión siguiente entra en las estructuras que hacen a Redis distinto de un diccionario remoto: listas y hashes.`, {
    docs: [R.tipos],
  }),
];

const ej1: Record<string, Ejercicio> = {
  "conectarse-desde-python": e(
    "Completa la llamada que comprueba que la conexión responde. Devuelve True.",
    'import fakeredis\nr = fakeredis.FakeStrictRedis(decode_responses=True)\nprint(r.___())',
    "True",
    "Es el mismo nombre que el comando de Redis que sirve para saber si el servidor está vivo.",
  ),
  "guardar-y-leer-una-clave": e(
    "Guarda el valor bajo la clave y complétalo para que la línea siguiente lo imprima.",
    'r.___("ciudad", "Lima")\nprint(r.get("ciudad"))',
    "Lima",
    "El método lleva el mismo nombre que el comando que asigna un valor a una clave.",
  ),
  "comprobar-si-una-clave-existe": e(
    "Completa el método que devuelve cuántas de las claves indicadas existen.",
    'r.set("curso", "Redis")\nprint(r.___("curso"))',
    "1",
    "En redis-py el método se llama igual que el comando EXISTS, en minúsculas.",
  ),
  "borrar-claves": e(
    "Borra la clave y deja que se imprima cuántas se eliminaron.",
    'r.set("temporal", "1")\nprint(r.___("temporal"))',
    "1",
    "El comando es DEL, pero en Python esa palabra está reservada, así que el método tiene otro nombre más largo.",
  ),
  "claves-con-caducidad": e(
    "Completa el método que consulta los segundos que le quedan de vida a la clave.",
    'r.set("sesion", "activa", ex=120)\nprint(r.___("sesion"))',
    "120",
    "Son las tres letras del comando que devuelve el tiempo de vida restante.",
  ),
  "contadores-atomicos": e(
    "Completa el método que suma uno al contador de forma atómica.",
    'print(r.___("descargas"))',
    "1",
    "Cuatro letras. Sobre una clave que no existe, arranca en cero y devuelve uno.",
  ),
  "varias-claves-en-una-sola-ida-y-vuelta": e(
    "Lee las tres claves en una sola llamada.",
    'r.mset({"x": "10", "y": "20", "z": "30"})\nprint(r.___("x", "y", "z"))',
    "['10', '20', '30']",
    "Es la versión múltiple de get, con el mismo prefijo que mset.",
  ),
  "como-nombrar-las-claves": e(
    "Completa el separador que la convención de Redis usa para las partes de una clave.",
    'clave = "pedido" + "___" + "2026"\nr.set(clave, "pagado")\nprint(clave)',
    "pedido:2026",
    "Es un único signo de puntuación, el mismo que separa las horas de los minutos.",
  ),
};

// ---------------------------------------------------------------------------
// Sesión 2
// ---------------------------------------------------------------------------

const s2: Bloque[] = [
  t(`# Listas

Una lista de Redis es una secuencia ordenada de cadenas. Admite elementos repetidos y conserva el orden de inserción.

Está implementada como una lista doblemente enlazada, lo que fija su rendimiento: añadir o quitar por cualquiera de los dos extremos cuesta tiempo constante, y llegar a una posición del medio cuesta tiempo proporcional a la distancia hasta el extremo más cercano.

Por eso la lista es la estructura de las colas y de los registros recientes, y no la de las búsquedas.`, {
    docs: [R.listas],
  }),

  t(`## Añadir por la derecha

El comando \`RPUSH\` añade uno o más elementos al final de la lista y devuelve la longitud resultante. Si la clave no existe, la crea.`, {
    docs: [R.rpush],
  }),

  c(`print(r.rpush("tareas", "revisar", "enviar", "archivar"))`, `3`, {
    docs: [R.rpush],
  }),

  t(`## Añadir por la izquierda

El comando \`LPUSH\` hace lo mismo por el otro extremo. Con varios argumentos los inserta uno a uno, de modo que el último que se pasa acaba siendo el primero de la lista.`, {
    docs: [R.lpush],
  }),

  c(`r.delete("cola")
r.lpush("cola", "a", "b")
print(r.lrange("cola", 0, -1))`, `['b', 'a']`, {
    docs: [R.lpush],
    nota: "El orden invertido no es un capricho: LPUSH inserta cada argumento en cabeza, así que 'a' entra primero y 'b' se coloca delante. Cuando el orden importa, conviene hacer una llamada por elemento o usar RPUSH.",
  }),

  t(`# Leer un tramo

El comando \`LRANGE\` devuelve los elementos comprendidos entre dos posiciones, ambas incluidas. La posición cero es el primer elemento.

Los índices negativos cuentan desde el final, igual que en Python: la posición \`-1\` es el último elemento. Por eso \`0, -1\` significa «la lista entera».`, {
    docs: [R.lrange],
  }),

  c(`r.delete("tareas")
r.rpush("tareas", "revisar", "enviar", "archivar")
print(r.lrange("tareas", 0, -1))
print(r.lrange("tareas", 0, 1))`, `['revisar', 'enviar', 'archivar']
['revisar', 'enviar']`, {
    docs: [R.lrange],
    nota: "A diferencia del rebanado de Python, el segundo índice está incluido: lrange(0, 1) devuelve dos elementos, mientras que lista[0:1] devolvería uno.",
  }),

  t(`# Sacar elementos

El comando \`LPOP\` quita el primer elemento y lo devuelve. El comando \`RPOP\` hace lo mismo con el último.

La combinación de \`RPUSH\` para entrar y \`LPOP\` para salir es una cola: el primero que llega es el primero que sale.`, {
    docs: [R.lpop, R.rpop],
  }),

  c(`r.delete("cola")
r.rpush("cola", "primero", "segundo")
print(r.lpop("cola"))
print(r.lrange("cola", 0, -1))`, `primero
['segundo']`, {
    docs: [R.lpop],
    nota: "Sobre una lista vacía LPOP devuelve None. Existe además BLPOP, que en lugar de devolver el vacío se queda esperando hasta que alguien inserte algo o hasta agotar un plazo; esa variante es la que convierte una lista en una cola de trabajo entre procesos.",
  }),

  t(`# Cuántos elementos tiene

El comando \`LLEN\` devuelve la longitud de la lista. Sobre una clave que no existe devuelve cero, porque en Redis una clave ausente y una lista vacía son lo mismo.`, {
    docs: [R.llen],
  }),

  c(`r.delete("tareas")
r.rpush("tareas", "a", "b", "c")
print(r.llen("tareas"))`, `3`, {
    docs: [R.llen],
    nota: "Redis borra la clave en cuanto su colección se queda sin elementos. Eso explica que no exista el concepto de lista vacía: si no hay elementos, no hay clave.",
  }),

  t(`# Recortar la lista

El comando \`LTRIM\` conserva solo el tramo indicado y descarta el resto. Es la forma habitual de mantener un registro de los últimos N elementos sin que crezca sin límite.`, {
    docs: [R.ltrim],
  }),

  c(`r.delete("recientes")
r.rpush("recientes", "1", "2", "3", "4", "5")
r.ltrim("recientes", 0, 2)
print(r.lrange("recientes", 0, -1))`, `['1', '2', '3']`, {
    docs: [R.ltrim],
  }),

  t(`# Hashes

Un hash es un valor que contiene pares de campo y valor. Sirve para representar un objeto con varios atributos bajo una sola clave.

La alternativa sería una clave por atributo, con nombres como \`usuario:42:nombre\` y \`usuario:42:plan\`. El hash es preferible por dos razones: permite leer o escribir un atributo suelto sin tocar los demás, y consume bastante menos memoria cuando el número de campos es pequeño.`, {
    docs: [R.hashes],
    nota: "Redis codifica los hashes pequeños en una representación compacta llamada listpack, que guarda los pares de forma contigua. Al superar los umbrales de configuración hash-max-listpack-entries o hash-max-listpack-value, cambia a una tabla de dispersión y el consumo sube.",
  }),

  t(`## Escribir campos

El comando \`HSET\` fija uno o varios campos. En \`redis-py\` los varios se pasan con el parámetro \`mapping\`, que recibe un diccionario.`, {
    docs: [R.hset],
  }),

  c(`r.hset("usuario:42", mapping={"nombre": "Ana", "plan": "gratis"})
print(r.hget("usuario:42", "nombre"))`, `Ana`, {
    docs: [R.hset, R.hget],
  }),

  t(`# Leer el hash entero

El comando \`HGETALL\` devuelve todos los campos con sus valores. En Python llega como un diccionario.`, {
    docs: [R.hgetall],
  }),

  c(`print(r.hgetall("usuario:42"))`, `{'nombre': 'Ana', 'plan': 'gratis'}`, {
    docs: [R.hgetall],
    nota: "HGETALL trae el hash completo, así que sobre objetos con muchos campos conviene pedir solo los que hacen falta con HMGET. Un hash de miles de campos bloquea el servidor durante lo que tarde en serializarlo, porque Redis atiende un comando cada vez.",
  }),

  t(`# Leer campos concretos

El comando \`HMGET\` devuelve los valores de los campos indicados, en el mismo orden, y coloca el valor nulo en la posición de los que no existen.`, {
    docs: [R.hmget],
  }),

  c(`print(r.hmget("usuario:42", "nombre", "correo"))`, `['Ana', None]`, {
    docs: [R.hmget],
  }),

  t(`# Incrementar un campo

El comando \`HINCRBY\` suma un entero al valor de un campo, con la misma garantía de atomicidad que \`INCRBY\` sobre una clave suelta.`, {
    docs: [R.hincrby],
  }),

  c(`r.hset("usuario:42", "creditos", 10)
print(r.hincrby("usuario:42", "creditos", 5))`, `15`, {
    docs: [R.hincrby],
  }),

  t(`# Borrar campos

El comando \`HDEL\` elimina uno o varios campos y devuelve cuántos ha eliminado. Cuando se borra el último campo, la clave desaparece entera.`, {
    docs: [R.hdel],
  }),

  c(`print(r.hdel("usuario:42", "plan"))
print(r.hgetall("usuario:42"))`, `1
{'nombre': 'Ana', 'creditos': '15'}`, {
    docs: [R.hdel],
    nota: "Todos los valores vuelven como cadenas, incluidos los que se escribieron como enteros: el 15 sale como '15'. Redis guarda cadenas de bytes y solo las interpreta como números dentro de los comandos que lo requieren.",
  }),

  t(`# Cierre

Listas y hashes cubren las dos formas más comunes de estructurar datos en Redis: una secuencia con orden y un objeto con atributos.

La sesión siguiente trata las dos estructuras que sirven para responder preguntas sobre pertenencia y sobre orden por puntuación.`, {
    docs: [R.tipos],
  }),
];

const ej2: Record<string, Ejercicio> = {
  "anadir-por-la-derecha": e(
    "Completa el método que añade elementos al final de la lista.",
    'print(r.___("tareas", "revisar", "enviar"))',
    "2",
    "Tres letras terminadas en push. La primera indica el extremo derecho.",
  ),
  "anadir-por-la-izquierda": e(
    "Completa el método que inserta por la cabeza de la lista.",
    'r.___("cola", "urgente")\nprint(r.lrange("cola", 0, -1))',
    "['urgente']",
    "Tres letras terminadas en push. La primera indica el extremo izquierdo.",
  ),
  "leer-un-tramo": e(
    "Completa el índice final para que se imprima la lista entera.",
    'r.rpush("dias", "lun", "mar", "mie")\nprint(r.lrange("dias", 0, ___))',
    "['lun', 'mar', 'mie']",
    "Los índices negativos cuentan desde el final; el último elemento ocupa la posición menos uno.",
  ),
  "sacar-elementos": e(
    "Completa el método que quita y devuelve el primer elemento de la lista.",
    'r.rpush("cola", "primero", "segundo")\nprint(r.___("cola"))',
    "primero",
    "Cuatro letras. La primera indica el extremo izquierdo, que es donde está el primer elemento.",
  ),
  "cuantos-elementos-tiene": e(
    "Completa el método que devuelve la longitud de la lista.",
    'r.rpush("dias", "lun", "mar", "mie")\nprint(r.___("dias"))',
    "3",
    "Cuatro letras. La primera indica que se trata de una lista y las tres siguientes abrevian la palabra longitud en inglés.",
  ),
  "recortar-la-lista": e(
    "Completa el método que conserva solo el tramo indicado y descarta el resto.",
    'r.rpush("log", "1", "2", "3", "4")\nr.___("log", 0, 1)\nprint(r.lrange("log", 0, -1))',
    "['1', '2']",
    "Cinco letras. La primera indica que se trata de una lista y el resto es el verbo recortar en inglés.",
  ),
  "escribir-campos": e(
    "Completa el método que fija campos dentro de un hash.",
    'r.___("libro:1", mapping={"titulo": "Rayuela"})\nprint(r.hget("libro:1", "titulo"))',
    "Rayuela",
    "Cuatro letras. La primera indica que se trata de un hash y las tres siguientes son el verbo de asignar.",
  ),
  "leer-el-hash-entero": e(
    "Completa el método que devuelve todos los campos con sus valores.",
    'r.hset("libro:1", mapping={"titulo": "Rayuela", "anio": "1963"})\nprint(r.___("libro:1"))',
    "{'titulo': 'Rayuela', 'anio': '1963'}",
    "Siete letras: el prefijo de los hashes, el verbo de leer y la palabra que significa todos.",
  ),
  "leer-campos-concretos": e(
    "Completa el método que devuelve varios campos concretos en una sola llamada.",
    'r.hset("libro:1", mapping={"titulo": "Rayuela", "anio": "1963"})\nprint(r.___("libro:1", "titulo", "anio"))',
    "['Rayuela', '1963']",
    "Cinco letras: el prefijo de los hashes, la marca de múltiple y el verbo de leer.",
  ),
  "incrementar-un-campo": e(
    "Completa el método que suma una cantidad al valor de un campo del hash.",
    'r.hset("stats", "vistas", 10)\nprint(r.___("stats", "vistas", 5))',
    "15",
    "El prefijo de los hashes seguido del mismo nombre que el comando que suma una cantidad a una clave suelta.",
  ),
  "borrar-campos": e(
    "Completa el método que elimina un campo del hash.",
    'r.hset("libro:1", mapping={"titulo": "Rayuela", "anio": "1963"})\nprint(r.___("libro:1", "anio"))',
    "1",
    "Cuatro letras: el prefijo de los hashes y la abreviatura del verbo borrar.",
  ),
};


// ---------------------------------------------------------------------------
// Sesión 3
// ---------------------------------------------------------------------------

const s3: Bloque[] = [
  t(`# Conjuntos

Un conjunto de Redis es una colección de cadenas sin orden y sin repeticiones. Insertar dos veces el mismo elemento deja el conjunto igual que estaba.

Su fuerza está en el coste de la pregunta «¿está esto dentro?»: se responde en tiempo constante, sin recorrer nada. Esa es la razón de usar un conjunto en lugar de una lista para etiquetas, permisos o identificadores ya vistos.`, {
    docs: [R.conjuntos],
  }),

  t(`## Añadir miembros

El comando \`SADD\` añade uno o varios miembros y devuelve cuántos eran nuevos. Los que ya estaban no cuentan, y ahí se ve que la operación no duplica.`, {
    docs: [R.sadd],
  }),

  c(`print(r.sadd("etiquetas", "python", "redis", "python"))`, `2`, {
    docs: [R.sadd],
  }),

  t(`# Comprobar pertenencia

El comando \`SISMEMBER\` indica si un elemento pertenece al conjunto. Devuelve 1 cuando está y 0 cuando no.`, {
    docs: [R.sismember],
  }),

  c(`r.sadd("etiquetas", "python", "redis")
print(r.sismember("etiquetas", "redis"))
print(r.sismember("etiquetas", "java"))`, `1
0`, {
    docs: [R.sismember],
    nota: "El coste es constante y no depende del tamaño del conjunto, porque por debajo hay una tabla de dispersión. Esa misma pregunta sobre una lista costaría recorrerla entera con LPOS.",
  }),

  t(`# Ver todos los miembros

El comando \`SMEMBERS\` devuelve el conjunto completo. En Python llega como un objeto \`set\`, que tampoco tiene orden.`, {
    docs: [R.smembers],
  }),

  c(`r.delete("colores")
r.sadd("colores", "rojo")
print(r.smembers("colores"))`, `{'rojo'}`, {
    docs: [R.smembers],
    nota: "SMEMBERS trae todo el conjunto de una vez, así que sobre conjuntos grandes bloquea el servidor mientras lo serializa. Para esos casos existe SSCAN, que lo recorre por tramos.",
  }),

  t(`# Cuántos miembros tiene

El comando \`SCARD\` devuelve el cardinal, es decir, el número de miembros.`, {
    docs: [R.scard],
  }),

  c(`r.delete("etiquetas")
r.sadd("etiquetas", "python", "redis", "sql")
print(r.scard("etiquetas"))`, `3`, { docs: [R.scard] }),

  t(`# Operaciones entre conjuntos

Redis resuelve en el servidor las tres operaciones clásicas de la teoría de conjuntos. Traerse los dos conjuntos al cliente para compararlos allí sería mover por la red datos que no hacen falta.`, {
    docs: [R.sinter, R.sunion, R.sdiff],
  }),

  t(`## Intersección

El comando \`SINTER\` devuelve los miembros que están en todos los conjuntos indicados.`, {
    docs: [R.sinter],
  }),

  c(`r.delete("ana", "luis")
r.sadd("ana", "python", "sql", "docker")
r.sadd("luis", "python", "docker", "go")
print(sorted(r.sinter("ana", "luis")))`, `['docker', 'python']`, {
    docs: [R.sinter],
    nota: "El resultado llega como un set de Python, que no tiene orden estable. Aquí se ordena con sorted() solo para que la salida sea siempre la misma y se pueda comparar; en producción ese paso no hace falta.",
  }),

  t(`## Unión

El comando \`SUNION\` devuelve todos los miembros que estén en alguno de los conjuntos, sin repetir.`, {
    docs: [R.sunion],
  }),

  c(`print(sorted(r.sunion("ana", "luis")))`, `['docker', 'go', 'python', 'sql']`, {
    docs: [R.sunion],
  }),

  t(`## Diferencia

El comando \`SDIFF\` devuelve los miembros del primer conjunto que no están en los demás. El orden de los argumentos importa: no es una operación simétrica.`, {
    docs: [R.sdiff],
  }),

  c(`print(sorted(r.sdiff("ana", "luis")))`, `['sql']`, { docs: [R.sdiff] }),

  t(`# Conjuntos ordenados

Un conjunto ordenado asocia a cada miembro un número de coma flotante llamado puntuación, y mantiene los miembros ordenados por ella.

Los miembros siguen siendo únicos; las puntuaciones no. Cuando dos miembros empatan, Redis los ordena entre sí por su valor lexicográfico, de modo que el resultado nunca es ambiguo.

Esta es la estructura de los rankings y de todo lo que se consulte por rango.`, {
    docs: [R.ordenados],
  }),

  t(`## Añadir con puntuación

El comando \`ZADD\` inserta miembros con su puntuación. En \`redis-py\` se pasan como un diccionario que va del miembro a la puntuación.`, {
    docs: [R.zadd],
  }),

  c(`r.delete("ranking")
print(r.zadd("ranking", {"ana": 120, "luis": 95, "sara": 140}))`, `3`, {
    docs: [R.zadd],
    nota: "El diccionario va del miembro a la puntuación, que es el orden inverso al del comando ZADD en la línea de órdenes, donde la puntuación se escribe antes que el miembro. Es una fuente de confusión habitual al pasar de la consola a Python.",
  }),

  t(`# Leer por posición

El comando \`ZRANGE\` devuelve los miembros comprendidos entre dos posiciones, de menor a mayor puntuación. Con el parámetro \`desc\` puesto a verdadero, el recorrido va de mayor a menor.`, {
    docs: [R.zrange],
  }),

  c(`print(r.zrange("ranking", 0, -1))`, `['luis', 'ana', 'sara']`, {
    docs: [R.zrange],
  }),

  t(`## De mayor a menor

Para un ranking interesa el orden descendente, que es el que pone primero al de más puntuación.`, {
    docs: [R.zrange],
  }),

  c(`print(r.zrange("ranking", 0, 1, desc=True))`, `['sara', 'ana']`, {
    docs: [R.zrange],
  }),

  t(`## Con la puntuación incluida

El parámetro \`withscores\` añade la puntuación a cada miembro. El resultado llega como una lista de pares.`, {
    docs: [R.zrange],
  }),

  c(`print(r.zrange("ranking", 0, 0, desc=True, withscores=True))`, `[('sara', 140.0)]`, {
    docs: [R.zrange],
    nota: "Las puntuaciones vuelven como float aunque se hayan escrito como enteros, porque Redis las guarda siempre en coma flotante de doble precisión. Los enteros por encima de 2^53 pierden exactitud, así que no sirven como identificadores.",
  }),

  t(`# Consultar la puntuación de un miembro

El comando \`ZSCORE\` devuelve la puntuación de un miembro concreto, o el valor nulo si ese miembro no está.`, {
    docs: [R.zscore],
  }),

  c(`print(r.zscore("ranking", "ana"))`, `120.0`, { docs: [R.zscore] }),

  t(`# Consultar la posición de un miembro

El comando \`ZRANK\` devuelve la posición del miembro en el orden ascendente, empezando por cero. Para la posición en el orden descendente existe \`ZREVRANK\`.`, {
    docs: [R.zrank],
  }),

  c(`print(r.zrank("ranking", "sara"))
print(r.zrevrank("ranking", "sara"))`, `2
0`, {
    docs: [R.zrank],
    nota: "Sara es la de más puntuación: la última en orden ascendente, con posición 2, y la primera en descendente, con posición 0. Confundir los dos comandos es el error más común al mostrar un puesto en un ranking.",
  }),

  t(`# Sumar a la puntuación

El comando \`ZINCRBY\` suma una cantidad a la puntuación de un miembro y devuelve la puntuación resultante. Si el miembro no estaba, lo añade partiendo de cero.

Es la operación que mantiene vivo un ranking sin tener que leer la puntuación anterior, sumarla en el cliente y volver a escribirla.`, {
    docs: [R.zincrby],
  }),

  c(`print(r.zincrby("ranking", 30, "luis"))`, `125.0`, {
    docs: [R.zincrby],
    nota: "El orden de los argumentos en redis-py es el nombre de la clave, la cantidad y el miembro. En la línea de órdenes de Redis la cantidad también va antes que el miembro, así que aquí sí coinciden.",
  }),

  t(`# Cierre

Con conjuntos y conjuntos ordenados ya están cubiertas las cuatro estructuras de uso diario: cadena, lista, hash y las dos de esta sesión.

La última sesión trata de cómo trabajar con muchas claves sin bloquear el servidor y de cómo agrupar operaciones.`, {
    docs: [R.tipos],
  }),
];

const ej3: Record<string, Ejercicio> = {
  "anadir-miembros": e(
    "Completa el método que añade miembros a un conjunto.",
    'print(r.___("etiquetas", "python", "redis"))',
    "2",
    "Cuatro letras: la inicial de los conjuntos seguida del verbo añadir en inglés.",
  ),
  "comprobar-pertenencia": e(
    "Completa el método que indica si un elemento pertenece al conjunto.",
    'r.sadd("etiquetas", "redis")\nprint(r.___("etiquetas", "redis"))',
    "1",
    "La inicial de los conjuntos seguida de la pregunta «es miembro», sin espacios.",
  ),
  "ver-todos-los-miembros": e(
    "Completa el método que devuelve el conjunto completo.",
    'r.sadd("colores", "rojo")\nprint(r.___("colores"))',
    "{'rojo'}",
    "La inicial de los conjuntos seguida de la palabra miembros en inglés.",
  ),
  "cuantos-miembros-tiene": e(
    "Completa el método que devuelve el número de miembros del conjunto.",
    'r.sadd("etiquetas", "a", "b", "c")\nprint(r.___("etiquetas"))',
    "3",
    "Cinco letras: la inicial de los conjuntos y la abreviatura de cardinal.",
  ),
  "interseccion": e(
    "Completa el método que devuelve los miembros presentes en los dos conjuntos.",
    'r.sadd("ana", "python", "sql")\nr.sadd("luis", "python", "go")\nprint(sorted(r.___("ana", "luis")))',
    "['python']",
    "La inicial de los conjuntos seguida de las cinco primeras letras de intersección en inglés.",
  ),
  "union": e(
    "Completa el método que reúne los miembros de los dos conjuntos sin repetir.",
    'r.sadd("ana", "python")\nr.sadd("luis", "go")\nprint(sorted(r.___("ana", "luis")))',
    "['go', 'python']",
    "La inicial de los conjuntos seguida de la palabra unión en inglés.",
  ),
  "diferencia": e(
    "Completa el método que devuelve lo que está en el primer conjunto y no en el segundo.",
    'r.sadd("ana", "python", "sql")\nr.sadd("luis", "python")\nprint(sorted(r.___("ana", "luis")))',
    "['sql']",
    "La inicial de los conjuntos seguida de las cuatro primeras letras de diferencia en inglés.",
  ),
  "anadir-con-puntuacion": e(
    "Completa el método que inserta miembros con su puntuación en un conjunto ordenado.",
    'print(r.___("ranking", {"ana": 120, "luis": 95}))',
    "2",
    "Cuatro letras: la inicial de los conjuntos ordenados y el verbo añadir en inglés.",
  ),
  "leer-por-posicion": e(
    "Completa el método que devuelve los miembros ordenados de menor a mayor puntuación.",
    'r.zadd("ranking", {"ana": 120, "luis": 95})\nprint(r.___("ranking", 0, -1))',
    "['luis', 'ana']",
    "Seis letras: la inicial de los conjuntos ordenados y la palabra rango en inglés.",
  ),
  "de-mayor-a-menor": e(
    "Completa el valor del parámetro que invierte el orden del recorrido.",
    'r.zadd("ranking", {"ana": 120, "luis": 95})\nprint(r.zrange("ranking", 0, 0, desc=___))',
    "['ana']",
    "Es el literal booleano de Python que significa verdadero, con la primera letra en mayúscula.",
  ),
  "con-la-puntuacion-incluida": e(
    "Completa el parámetro que añade la puntuación a cada miembro devuelto.",
    'r.zadd("ranking", {"ana": 120})\nprint(r.zrange("ranking", 0, -1, ___=True))',
    "[('ana', 120.0)]",
    "Una sola palabra en inglés, sin guion bajo: la preposición «con» pegada al plural de puntuación.",
  ),
  "consultar-la-puntuacion-de-un-miembro": e(
    "Completa el método que devuelve la puntuación de un miembro concreto.",
    'r.zadd("ranking", {"ana": 120})\nprint(r.___("ranking", "ana"))',
    "120.0",
    "Seis letras: la inicial de los conjuntos ordenados y la palabra puntuación en inglés.",
  ),
  "consultar-la-posicion-de-un-miembro": e(
    "Completa el método que devuelve la posición en orden ascendente, empezando por cero.",
    'r.zadd("ranking", {"ana": 120, "luis": 95})\nprint(r.___("ranking", "ana"))',
    "1",
    "Cinco letras: la inicial de los conjuntos ordenados y la palabra puesto en inglés.",
  ),
  "sumar-a-la-puntuacion": e(
    "Completa el método que suma una cantidad a la puntuación de un miembro.",
    'r.zadd("ranking", {"luis": 95})\nprint(r.___("ranking", 30, "luis"))',
    "125.0",
    "La inicial de los conjuntos ordenados seguida del mismo nombre que el comando que suma a una clave suelta.",
  ),
};

// ---------------------------------------------------------------------------
// Sesión 4
// ---------------------------------------------------------------------------

const s4: Bloque[] = [
  t(`# Redis atiende un comando cada vez

El núcleo de Redis ejecuta los comandos uno detrás de otro en un solo hilo. Esa decisión es la que hace que cada comando sea atómico sin necesidad de bloqueos.

También es la que hace peligroso cualquier comando lento: mientras uno tarda, todos los demás clientes esperan. La mayor parte de las buenas prácticas de esta sesión salen de ahí.`, {
    docs: [R.intro],
    nota: "Desde la versión 6.0 Redis usa varios hilos para leer y escribir en los sockets de red, y desde la 7.0 también para liberar memoria en segundo plano. La ejecución de los comandos sigue siendo de un solo hilo, que es lo que importa para el razonamiento sobre atomicidad.",
  }),

  t(`# Por qué no se usa KEYS

El comando \`KEYS\` devuelve todas las claves que encajan con un patrón. Recorre el espacio de claves entero antes de responder, y durante ese recorrido no atiende a nadie más.

Sobre una base con millones de claves, una sola llamada deja el servidor parado el tiempo suficiente para que se acumulen los tiempos de espera de todos los clientes. La propia documentación de Redis desaconseja su uso en producción.`, {
    docs: [R.keys],
  }),

  t(`# Recorrer claves sin bloquear

El comando \`SCAN\` recorre el espacio de claves por tramos. Cada llamada devuelve un cursor y un puñado de claves; se repite hasta que el cursor vuelve a valer cero.

En \`redis-py\` el método \`scan_iter()\` envuelve ese bucle y entrega un iterador, que es la forma que se usa en la práctica.`, {
    docs: [R.scan],
  }),

  c(`r.mset({"sesion:1": "a", "sesion:2": "b", "otro": "c"})
print(sorted(r.scan_iter(match="sesion:*")))`, `['sesion:1', 'sesion:2']`, {
    docs: [R.scan],
    nota: "SCAN garantiza que aparecerá toda clave presente desde el principio hasta el final del recorrido, pero puede devolver una misma clave más de una vez, y las creadas o borradas mientras recorre pueden aparecer o no. A cambio, ninguna llamada bloquea el servidor.",
  }),

  t(`# Escribir solo si la clave no existe

El comando \`SETNX\` guarda un valor únicamente cuando la clave no existe todavía, y devuelve si lo consiguió. En \`redis-py\` es \`set()\` con el parámetro \`nx\` puesto a verdadero.

Comprobar con \`EXISTS\` y escribir después no es equivalente: entre las dos llamadas cabe otro cliente. \`SETNX\` resuelve la comprobación y la escritura en una sola operación indivisible, y por eso sirve para repartir un recurso entre procesos que compiten.`, {
    docs: [R.setnx, R.set],
  }),

  c(`r.delete("bloqueo")
print(r.set("bloqueo", "proceso-1", nx=True))
print(r.set("bloqueo", "proceso-2", nx=True))`, `True
None`, {
    docs: [R.set],
    nota: "El segundo intento devuelve None, no False: redis-py traduce así la respuesta nula del servidor. Un bloqueo de verdad además necesita caducidad, para que el fin inesperado del proceso que lo tomó no lo deje retenido para siempre.",
  }),

  t(`# Canalización

Cada comando suelto cuesta un viaje de ida y vuelta por la red. Con latencias de un milisegundo, cien comandos son una décima de segundo de espera pura, sin que el servidor haya hecho nada.

La canalización envía los comandos en bloque y recoge todas las respuestas juntas. El servidor sigue ejecutándolos uno a uno; lo que se ahorra es la espera de la red.`, {
    docs: [R.canalizacion, PY.pipeline],
  }),

  c(`p = r.pipeline(transaction=False)
p.set("a", "1")
p.incr("contador")
p.get("a")
print(p.execute())`, `[True, 1, '1']`, {
    docs: [PY.pipeline],
    nota: "El método execute() devuelve una lista con el resultado de cada comando, en el mismo orden en que se encolaron. Los comandos encolados no se han ejecutado todavía: hasta esa llamada, el pipeline solo acumula.",
  }),

  t(`# Transacciones

Una transacción de Redis agrupa varios comandos para que se ejecuten seguidos, sin que ningún otro cliente se cuele en medio. Se delimita con \`MULTI\` y \`EXEC\`.

Conviene entender qué no es. No hay reversión: si el tercer comando falla, los dos anteriores quedan aplicados. Redis garantiza el aislamiento, no la atomicidad de todo o nada que ofrece una base de datos relacional.`, {
    docs: [R.transacciones],
    nota: "Solo se aborta la transacción entera cuando el error se detecta al encolar, por ejemplo si el comando no existe. Los errores que solo aparecen al ejecutar, como aplicar INCR a una clave que contiene texto, dejan pasar el resto de comandos.",
  }),

  c(`r.delete("saldo", "movimientos")
p = r.pipeline()
p.set("saldo", 100)
p.rpush("movimientos", "apertura")
print(p.execute())`, `[True, 1]`, {
    docs: [R.transacciones],
  }),

  t(`# Consultar el tipo de una clave

El comando \`TYPE\` devuelve el nombre del tipo de valor guardado bajo una clave: \`string\`, \`list\`, \`hash\`, \`set\`, \`zset\` o \`none\` si la clave no existe.

Es la forma de averiguar por qué un comando devuelve un error de tipo, que es el error más frecuente cuando una clave se reutiliza para dos cosas distintas.`, {
    docs: [R.type],
  }),

  c(`r.delete("k")
r.rpush("k", "a")
print(r.type("k"))`, `list`, {
    docs: [R.type],
    nota: "El nombre interno de los conjuntos ordenados es zset, no sortedset. Los comandos que operan sobre ellos comparten esa inicial: ZADD, ZRANGE, ZSCORE.",
  }),

  t(`# El patrón de caché

El uso más extendido de Redis es la caché de lectura. El patrón se llama cache-aside y tiene tres pasos.

Primero se consulta la caché. Si el dato está, se devuelve. Si no está, se consulta la fuente original, se guarda el resultado en la caché con una caducidad y se devuelve.

La caducidad no es un detalle de limpieza: es lo que acota cuánto tiempo puede el sistema servir un dato desfasado.`, {
    docs: [R.caducidad],
  }),

  c(`def buscar_en_la_base(pedido):
    return f"pedido {pedido} confirmado"

def leer(pedido):
    clave = f"pedido:{pedido}"
    guardado = r.get(clave)
    if guardado is not None:
        return guardado
    valor = buscar_en_la_base(pedido)
    r.set(clave, valor, ex=60)
    return valor

print(leer(7))
print(r.ttl("pedido:7"))`, `pedido 7 confirmado
60`, {
    docs: [R.set],
    nota: "La comparación se hace contra None y no con un if a secas, porque una cadena vacía guardada en la caché es un valor legítimo y un if la trataría como ausencia, provocando una consulta a la base en cada lectura.",
  }),

  t(`# Persistencia

Redis mantiene los datos en memoria, pero puede escribirlos en disco para reconstruir el estado tras un reinicio. Hay dos mecanismos, y se pueden combinar.

El primero es RDB, que vuelca una instantánea completa cada cierto tiempo. Es compacto y rápido de restaurar, y a cambio pierde todo lo ocurrido desde el último volcado.

El segundo es AOF, que registra cada operación de escritura en un fichero. Pierde mucho menos, y a cambio el fichero crece y la restauración tarda más.

La elección depende de cuántos segundos de datos se puede permitir perder el sistema.`, {
    docs: [R.persistencia],
    nota: "Con AOF configurado para sincronizar cada segundo, que es el valor recomendado por defecto, la ventana de pérdida es de un segundo. Sincronizar en cada escritura la elimina, a costa de un impacto notable en el rendimiento.",
  }),

  t(`# Cierre

Con esto ya se puede usar Redis para lo que se usa de verdad: cachés con caducidad, contadores, colas, rankings y control de concurrencia entre procesos.

El paso siguiente natural son los flujos, que es la estructura para procesar eventos con varios consumidores, y Redis Cluster, que reparte el espacio de claves entre varios servidores.

Los documentos sobre persistencia y sobre transacciones merecen una lectura completa antes de llevar nada a producción.`, {
    docs: [R.persistencia, R.transacciones, PY.comandos],
  }),
];

const ej4: Record<string, Ejercicio> = {
  "recorrer-claves-sin-bloquear": e(
    "Completa el método que recorre las claves por tramos y devuelve un iterador.",
    'r.mset({"sesion:1": "a", "sesion:2": "b", "otro": "c"})\nprint(sorted(r.___(match="sesion:*")))',
    "['sesion:1', 'sesion:2']",
    "El nombre del comando que recorre por tramos, un guion bajo y la abreviatura de iterador.",
  ),
  "escribir-solo-si-la-clave-no-existe": e(
    "Completa el parámetro que hace que la escritura solo ocurra si la clave no existe.",
    'r.delete("bloqueo")\nprint(r.set("bloqueo", "proceso-1", ___=True))',
    "True",
    "Dos letras, las mismas que cierran el nombre del comando SETNX.",
  ),
  "canalizacion": e(
    "Completa el método que envía los comandos acumulados y devuelve sus resultados.",
    'p = r.pipeline(transaction=False)\np.set("a", "1")\np.get("a")\nprint(p.___())',
    "[True, '1']",
    "Siete letras: el verbo ejecutar en inglés.",
  ),
  "transacciones": e(
    "Completa el parámetro que decide si el pipeline se envuelve en una transacción. Ponlo en verdadero.",
    'p = r.pipeline(___=True)\np.set("saldo", 100)\nprint(p.execute())',
    "[True]",
    "Es la palabra transacción en inglés, en singular y minúsculas.",
  ),
  "consultar-el-tipo-de-una-clave": e(
    "Completa el método que devuelve el nombre del tipo guardado bajo una clave.",
    'r.rpush("k", "a")\nprint(r.___("k"))',
    "list",
    "Cuatro letras, el mismo nombre que el comando de Redis, en minúsculas.",
  ),
  "el-patron-de-cache": e(
    "Completa el parámetro que fija la caducidad en segundos al guardar en la caché.",
    'r.set("pedido:7", "confirmado", ___=60)\nprint(r.ttl("pedido:7"))',
    "60",
    "Dos letras, la abreviatura de la palabra expirar en inglés.",
  ),
};

function armar(
  numero: number,
  titulo: string,
  bloques: Bloque[],
  ejercicios: Record<string, Ejercicio>,
): Leccion {
  // Los ejercicios se indexan por el identificador de la sección, que sale del
  // título. Si un título cambia sin cambiar la clave, el ejercicio deja de
  // aparecer en silencio: esta comprobación lo convierte en un fallo visible
  // durante el desarrollo.
  const ids = new Set(idsDeSecciones(bloques).values());
  for (const clave of Object.keys(ejercicios)) {
    if (!ids.has(clave)) {
      throw new Error(
        `El curso de Redis tiene un ejercicio para la sección "${clave}" de la sesión ${numero}, pero ninguna sección se llama así.`,
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
  };
}

export const leccionesRedis: Leccion[] = [
  armar(1, "El almacén de claves y valores", s1, ej1),
  armar(2, "Listas y hashes", s2, ej2),
  armar(3, "Conjuntos y conjuntos ordenados", s3, ej3),
  armar(4, "Concurrencia, canalización y caché", s4, ej4),
];
