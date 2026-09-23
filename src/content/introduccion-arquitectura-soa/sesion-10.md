---
numero: 10
titulo: "Conformidad y lectura arquitectónica de SOA"
---

# Conformidad con un Reference Model no es una prueba automática

OASIS advierte que declarar conformidad con un **Reference Model** no es tan mecánico como comprobar la sintaxis de un lenguaje o de un protocolo. El modelo define conceptos arquitectónicos importantes, no una receta ejecutable de implementación.

Por eso la pregunta de conformidad no es «¿pasa este validador?», sino «¿puedo identificar en la arquitectura concreta los conceptos y relaciones que el modelo considera esenciales?».

> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)

```opcion-multiple
# Enunciado
¿Por qué la conformidad con el SOA Reference Model no se reduce a una validación automática sencilla?

# Opciones
- Porque el documento no define conceptos
- Porque el modelo define conceptos arquitectónicos, no una sintaxis única de implementación
- Porque SOA prohíbe herramientas automáticas
- Porque todos los servicios deben revisarse manualmente por OASIS

# Correcta
2

# Explicación
Un Reference Model establece conceptos y relaciones. Una arquitectura concreta puede realizarlos mediante tecnologías diferentes, por lo que no existe una única forma sintáctica que validar.

# Pista
Distingue modelo conceptual de especificación de protocolo.
```

# Deben poder identificarse entidades que sean servicios

El primer criterio de OASIS es poder identificar **entidades que sean servicios según la definición del modelo**: mecanismos que proporcionan acceso a capacidades mediante interfaces prescritas y bajo las condiciones descritas.

No basta con que un componente tenga la palabra «service» en su nombre. La clasificación depende de su papel arquitectónico.

> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)
> Doc: [OASIS SOA-RM 1.0 — §3.1 Service](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=12)

```verdadero-falso
# Enunciado
Un componente llamado CustomerService cumple automáticamente la definición de service del SOA-RM por llevar la palabra «Service» en su nombre.

# Respuesta
falso

# Explicación
La conformidad depende de su función arquitectónica: acceso a capacidades mediante una interfaz prescrita y bajo condiciones descritas, no de una convención de nombres.

# Pista
Los nombres no sustituyen las relaciones del modelo.
```

# La arquitectura debe explicar cómo se establece visibility

Un diseño SOA debe permitir identificar **cómo se establece visibility** entre providers y consumers. Eso implica poder razonar sobre awareness, willingness y reachability.

Si el diseño muestra servicios pero no permite explicar cómo los posibles consumidores llegan a conocerlos, bajo qué condiciones las partes están dispuestas a interactuar y cómo se establece un camino de interacción, falta una parte del modelo.

> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)
> Doc: [OASIS SOA-RM 1.0 — §3.2.1 Visibility](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=13)

```relacionar
# Enunciado
Relaciona cada pregunta de revisión con el aspecto de visibility que evalúa.

# Pares
- ¿Cómo conoce el consumidor que existe el servicio? => Awareness
- ¿Bajo qué condiciones aceptan interactuar las partes? => Willingness
- ¿Qué camino permite que las partes se comuniquen? => Reachability

# Explicación
Una revisión de visibility debe poder responder por separado las preguntas de conocimiento, predisposición y alcance.

# Pista
Recuerda la regla mental: saber, querer y poder.
```

# Debe poder identificarse cómo se media la interaction

OASIS exige que el diseño permita identificar **cómo se media la interacción**. Eso incluye la información intercambiada, su interpretación y el comportamiento observable necesario para utilizar el servicio.

El criterio no exige una tecnología particular de mensajería. Exige que la interacción pueda explicarse utilizando los conceptos del information model y behavior model.

> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)
> Doc: [OASIS SOA-RM 1.0 — §3.2.2 Interacting with services](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=15)

```opcion-multiple
# Enunciado
¿Qué evidencia conceptual es más relevante para explicar cómo se media una interacción?

# Opciones
- El color del dashboard del proveedor
- El information model y el behavior model asociados al uso del servicio
- El número de desarrolladores del equipo
- El lenguaje de programación elegido internamente

# Correcta
2

# Explicación
La mediación de la interacción requiere entender información, semántica, acciones y dependencias temporales.

# Pista
Busca aquello que describe qué se intercambia y cómo se comporta el servicio.
```

# Debe poder explicarse el effect de utilizar servicios

La arquitectura debe permitir identificar **cómo se entiende el efecto** de utilizar un servicio. Esto significa poder describir qué Real World Effect se espera y qué hechos o compromisos del shared state resultan relevantes.

Una respuesta HTTP exitosa o un mensaje técnicamente válido no demuestra por sí mismo que se haya obtenido el efecto arquitectónico esperado.

> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)
> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=18)

```verdadero-falso
# Enunciado
Si una solicitud obtuvo una respuesta técnicamente válida, entonces necesariamente produjo el Real World Effect que el consumidor buscaba.

# Respuesta
falso

# Explicación
La corrección del intercambio no garantiza que el resultado de negocio o el cambio de shared state esperado se haya producido.

# Pista
Distingue éxito técnico del resultado efectivo.
```

# Los servicios deben tener descriptions asociadas

Otro criterio de conformidad es que existan **descripciones asociadas a los servicios**. La descripción debe aportar suficiente información para considerar o utilizar el servicio: existencia, función, condiciones y forma de interacción.

La descripción puede distribuirse mediante referencias y no necesita revelar implementación privada.

> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)
> Doc: [OASIS SOA-RM 1.0 — §3.3.1 Service description](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=20)

```opcion-multiple
# Enunciado
¿Cuál es la evidencia más apropiada para el criterio «descriptions associated with services»?

# Opciones
- Información suficiente para conocer función, condiciones y forma de interacción
- Acceso al repositorio privado del proveedor
- Una captura de pantalla del servidor
- La lista de empleados del equipo

# Correcta
1

# Explicación
La service description debe proporcionar información útil para considerar y usar el servicio, no exponer detalles privados irrelevantes.

# Pista
Piensa en lo que necesita un consumidor potencial.
```

# Debe identificarse el execution context de la interacción

Una arquitectura SOA debe permitir identificar el **execution context** necesario para sostener la interacción.

Eso significa poder explicar qué infraestructura, procesos, policies y agreements forman el camino efectivo entre consumidor y proveedor para una instancia concreta.

> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)
> Doc: [OASIS SOA-RM 1.0 — §3.3.3 Execution context](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=24)

```relacionar
# Enunciado
Relaciona cada elemento con su papel dentro de una revisión del execution context.

# Pares
- Infraestructura => proporciona elementos técnicos del camino de interacción
- Policy assertions => expresan condiciones aplicables
- Agreements => expresan condiciones aceptadas por las partes
- Process entities => participan en la ejecución de la interacción

# Explicación
El execution context combina elementos técnicos y de negocio identificados para una interacción concreta.

# Pista
Todos forman parte del camino efectivo de ejecución.
```

# Debe identificarse cómo se manejan policies y contracts

El último criterio explícito de OASIS exige que sea posible identificar **cómo se manejan las policies** y **cómo los contracts pueden modelarse y hacerse cumplir**.

Esto incluye distinguir condiciones unilaterales de acuerdos, saber quién es responsable de cada policy y reconocer qué mecanismos existen para enforcement o resolución de disputas.

> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)
> Doc: [OASIS SOA-RM 1.0 — §3.3.2 Policies and Contracts](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```opcion-multiple
# Enunciado
¿Qué debe poder distinguir una revisión arquitectónica sobre condiciones de uso?

# Opciones
- Policy como punto de vista de una parte y contract como acuerdo entre varias partes
- Policy y contract como dos nombres del mismo concepto
- Contract como condición unilateral y policy como acuerdo legal
- Únicamente si las condiciones están escritas en XML

# Correcta
1

# Explicación
La separación entre perspectiva individual y acuerdo multilateral es central en el modelo.

# Pista
Recuerda quién necesita aceptar cada tipo de condición.
```

# OASIS no convierte estas guías en una lista de best practices

La sección de conformidad no pretende definir **best practices para construir sistemas SOA**. OASIS limita el Reference Model a los conceptos que deben poder identificarse.

La especificación sí observa que la facilidad con la que estos elementos pueden reconocerse puede influir en escalabilidad, mantenibilidad y facilidad de uso, pero no prescribe una única arquitectura óptima.

> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)

```verdadero-falso
# Enunciado
La sección de conformidad de OASIS prescribe una única arquitectura SOA considerada best practice.

# Respuesta
falso

# Explicación
El Reference Model define conceptos que deberían poder identificarse, pero no prescribe una única forma óptima de construir sistemas SOA.

# Pista
Modelo de referencia no significa plantilla obligatoria.
```

# Loose coupling no forma parte de la definición normativa del Reference Model

Aunque «loose coupling» aparece con frecuencia en literatura sobre SOA, OASIS explica que evitó utilizarlo como concepto central del Reference Model porque es un **trade-off subjetivo** y carece de una métrica universal útil.

Por tanto, puede ser una propiedad deseable en una arquitectura concreta, pero no debe enseñarse como si fuera la definición formal de SOA en este modelo.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```verdadero-falso
# Enunciado
OASIS utiliza «loose coupling» como uno de los conceptos normativos fundamentales con los que define SOA en el Reference Model.

# Respuesta
falso

# Explicación
OASIS evita deliberadamente ese término en la definición central porque lo considera un trade-off subjetivo sin métricas universales útiles.

# Pista
Distingue literatura habitual de terminología normativa del documento estudiado.
```

# Coarse-grained tampoco define por sí solo un servicio SOA

OASIS también evita tratar **coarse-grained** como criterio definitorio. La granularidad depende del nivel del problema que se intenta resolver y no puede establecerse contando interfaces, operaciones o intercambios.

Un servicio no se vuelve «más SOA» simplemente por tener menos operaciones o por agrupar más funcionalidad.

> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```opcion-multiple
# Enunciado
¿Cuál de estas métricas permite determinar universalmente si un servicio tiene la granularidad «correcta» según OASIS?

# Opciones
- Número de operaciones de la interfaz
- Número de mensajes intercambiados
- Cantidad de tablas internas
- Ninguna de las anteriores

# Correcta
4

# Explicación
OASIS indica que la granularidad es relativa al nivel del problema y no dispone de una métrica universal basada en contar interfaces o intercambios.

# Pista
El estándar evita precisamente convertir «coarse-grained» en una medida normativa.
```

# Una revisión SOA debe buscar conceptos, no marcas tecnológicas

Después de las diez sesiones, una revisión inicial puede formularse como una serie de preguntas:

| Pregunta | Concepto |
|---|---|
| ¿Qué necesidad intenta satisfacerse? | Need |
| ¿Qué efecto puede proporcionar el proveedor? | Capability |
| ¿Mediante qué mecanismo se accede? | Service |
| ¿Cómo se conocen y alcanzan las partes? | Visibility |
| ¿Qué información y acciones intervienen? | Interaction |
| ¿Qué resultado efectivo se obtiene? | Real World Effect |
| ¿Qué información permite considerar y usar el servicio? | Service description |
| ¿Qué condiciones impone cada participante? | Policies |
| ¿Qué condiciones se acuerdan? | Contracts |
| ¿Qué camino concreto sostiene la interacción? | Execution context |

Ninguna pregunta contiene «¿usa SOAP?», «¿usa REST?» o «¿usa un ESB?». Esas decisiones pueden existir en arquitecturas concretas, pero no sustituyen las relaciones conceptuales.

> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)

```relacionar
# Enunciado
Relaciona cada evidencia arquitectónica con el concepto que permite identificar.

# Pares
- Catálogo o mecanismo por el que un consumidor conoce servicios => Awareness
- Especificación de información, acciones y secuencias => Interaction
- Hecho compartido producido por una operación => Real World Effect
- Condición unilateral del consumidor => Policy
- Acuerdo entre consumidor y proveedor => Contract
- Combinación concreta de infraestructura y acuerdos => Execution context

# Explicación
Reconocer SOA consiste en mapear evidencia de una arquitectura concreta a los conceptos del modelo, no en buscar una tecnología determinada.

# Pista
Clasifica cada evidencia por la pregunta conceptual que responde.
```

# La secuencia completa del curso

El curso puede resumirse como una cadena de razonamiento:

1. una entidad tiene una **need**;
2. otra dispone de una **capability**;
3. un **service** proporciona acceso a esa capacidad;
4. **visibility** hace posible que las partes lleguen a interactuar;
5. la **interaction** utiliza información y comportamiento acordados;
6. esa interacción ocurre dentro de un **execution context**;
7. **policies** y **contracts** condicionan el uso;
8. se obtiene un **Real World Effect**;
9. la **service description** permite conocer y comprender suficientemente estos elementos;
10. una arquitectura SOA debe permitir identificar esas relaciones de forma coherente.

Esta cadena no representa una secuencia de red obligatoria. Es un modelo mental para revisar los conceptos estudiados.

> Doc: [OASIS SOA-RM 1.0 — §3 The Reference Model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=12)
> Doc: [OASIS SOA-RM 1.0 — §4 Conformance Guidelines](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=26)

```ordenar
# Enunciado
Ordena la cadena conceptual desde la necesidad inicial hasta el resultado efectivo.

# Elementos
- Interactuar mediante el servicio
- Identificar una necesidad
- Obtener un Real World Effect
- Acceder a una capacidad mediante un servicio
- Establecer visibilidad entre participantes

# Orden
2, 4, 5, 1, 3

# Explicación
La necesidad conduce a buscar una capacidad accesible mediante un servicio; la visibilidad permite la interacción y la interacción busca producir un efecto.

# Pista
Empieza por el problema y termina por el resultado.
```

# Cierre del curso

**Introducción a la Arquitectura SOA** termina donde debe terminar un curso introductorio: el estudiante puede leer una arquitectura y reconocer los conceptos fundamentales del paradigma sin depender de una tecnología concreta.

El siguiente nivel ya no necesita volver a preguntar qué es un service, visibility o execution context. **Arquitectura SOA Intermedia** puede partir de esta base para entrar en diseño de contratos concretos, comunicación síncrona y asíncrona, mensajería, mediación, integración, versionamiento, resiliencia, composición y tecnologías que realizan esos conceptos.
