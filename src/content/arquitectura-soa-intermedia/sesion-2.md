---
numero: 2
titulo: "Contract-first para servicios HTTP"
---

# Contract-first define la interfaz antes de la implementación

En **contract-first design**, el equipo define primero el contrato observable del servicio y después implementa proveedor y consumidores contra ese contrato. Para servicios HTTP, OpenAPI proporciona una descripción estándar e independiente del lenguaje de programación.

El objetivo no es escribir YAML por adelantado por disciplina documental. El objetivo es convertir la interfaz pública en un artefacto explícito que pueda revisarse, validarse, compartirse y utilizarse para detectar incompatibilidades antes de depender del código del proveedor.

> Doc: [OpenAPI Specification 3.2.0 — What is the OpenAPI Specification?](https://spec.openapis.org/oas/v3.2.0.html#what-is-the-openapi-specification)

```verdadero-falso
# Enunciado
Contract-first significa que la implementación interna del proveedor debe quedar completamente especificada antes de escribir código.

# Respuesta
falso

# Explicación
Contract-first fija primero la interfaz observable entre participantes. La implementación interna continúa siendo una decisión privada del proveedor.

# Pista
Contrato público e implementación privada son niveles distintos.
```

# El OpenAPI Document describe una API HTTP

Un **OpenAPI Document** describe una API HTTP mediante un objeto raíz con metadatos, servidores, paths, operaciones, esquemas reutilizables y otras definiciones.

La especificación permite que humanos y herramientas comprendan las capacidades de la API sin inspeccionar el código fuente ni capturar tráfico de red.

```yaml
openapi: 3.2.0
info:
  title: Payments Service
  version: 1.0.0
paths: {}
```

> Doc: [OpenAPI Specification 3.2.0 — OpenAPI Object](https://spec.openapis.org/oas/v3.2.0.html#openapi-object)

```opcion-multiple
# Enunciado
¿Qué ventaja principal ofrece un OpenAPI Document en un diseño contract-first?

# Opciones
- Expone automáticamente el código fuente del proveedor
- Describe la interfaz HTTP de forma procesable sin depender del lenguaje de implementación
- Sustituye todas las pruebas
- Obliga a utilizar JSON como formato de payload

# Correcta
2

# Explicación
OpenAPI es una descripción de interfaz independiente del lenguaje y no impone una implementación interna ni un único formato de payload.

# Pista
La especificación describe la interfaz, no el código.
```

# Paths identifica recursos direccionables

El objeto **Paths** agrupa las rutas disponibles en la API. Cada path representa una ubicación relativa que puede contener operaciones HTTP.

La ruta debe describir una responsabilidad observable y no la estructura interna de módulos o tablas. El path es parte del contrato que los consumidores incorporan en su integración.

```yaml
paths:
  /payments/{paymentId}:
    get:
      summary: Consultar un pago
```

> Doc: [OpenAPI Specification 3.2.0 — Paths Object](https://spec.openapis.org/oas/v3.2.0.html#paths-object)
> Doc: [OpenAPI Specification 3.2.0 — Path Item Object](https://spec.openapis.org/oas/v3.2.0.html#path-item-object)

```opcion-multiple
# Enunciado
¿Qué representa principalmente `/payments/{paymentId}` dentro de OpenAPI?

# Opciones
- Una tabla obligatoria de la base de datos
- Una ruta direccionable de la interfaz HTTP
- Una clase interna de dominio
- Un proceso BPMN

# Correcta
2

# Explicación
El path forma parte de la interfaz HTTP pública. Su existencia no determina cómo se persiste o implementa internamente la capacidad.

# Pista
OpenAPI describe la superficie HTTP.
```

# Operation define una interacción HTTP concreta

Una **Operation Object** describe una operación asociada a un método HTTP dentro de un path. Puede declarar parámetros, request body, respuestas, seguridad y otros elementos de la interacción.

El nombre del método no basta para expresar el contrato. La operación necesita especificar qué recibe, qué produce y qué condiciones observables aplican.

```yaml
paths:
  /payments/{paymentId}:
    get:
      operationId: getPayment
      responses:
        "200":
          description: Pago encontrado
```

> Doc: [OpenAPI Specification 3.2.0 — Operation Object](https://spec.openapis.org/oas/v3.2.0.html#operation-object)

```relacionar
# Enunciado
Relaciona cada elemento con lo que describe.

# Pares
- Path => ubicación relativa de la interfaz
- Método HTTP => semántica de la operación sobre esa ubicación
- Operation Object => contrato concreto de esa interacción

# Explicación
OpenAPI combina dirección, método y detalles de operación para describir una interacción HTTP.

# Pista
Separa dónde, cómo y con qué contrato.
```

# Parameters describe valores fuera del cuerpo

Los **Parameter Objects** describen parámetros enviados en path, query, header o cookie. Cada parámetro define nombre, ubicación, obligatoriedad y esquema.

Un parámetro de path es obligatorio porque forma parte de la dirección concreta del recurso. En cambio, un parámetro de query puede ser opcional o requerido según el contrato.

```yaml
parameters:
  - name: paymentId
    in: path
    required: true
    schema:
      type: string
```

> Doc: [OpenAPI Specification 3.2.0 — Parameter Object](https://spec.openapis.org/oas/v3.2.0.html#parameter-object)

```relacionar
# Enunciado
Relaciona cada ubicación con un uso típico.

# Pares
- path => identificar el recurso concreto
- query => modificar filtros o selección
- header => transportar metadatos de la interacción
- cookie => transportar un valor asociado al contexto HTTP del cliente

# Explicación
OpenAPI distingue explícitamente las ubicaciones de parámetros porque forman partes diferentes de la solicitud HTTP.

# Pista
Piensa dónde viaja físicamente cada valor.
```

# Request Body describe el contenido enviado por el consumidor

El **Request Body Object** especifica el cuerpo de una solicitud y los media types aceptados. El schema asociado describe la estructura y restricciones del payload.

Contract-first obliga a decidir qué información necesita realmente la operación. Copiar un modelo de base de datos completo al request body aumenta el acoplamiento y expone campos que pueden no formar parte de la responsabilidad pública.

```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [amount, currency]
        properties:
          amount:
            type: number
          currency:
            type: string
```

> Doc: [OpenAPI Specification 3.2.0 — Request Body Object](https://spec.openapis.org/oas/v3.2.0.html#request-body-object)
> Doc: [OpenAPI Specification 3.2.0 — Schema Object](https://spec.openapis.org/oas/v3.2.0.html#schema-object)

```verdadero-falso
# Enunciado
El request body debe reproducir siempre todas las columnas de la entidad persistida por el proveedor.

# Respuesta
falso

# Explicación
El contrato debe exponer la información necesaria para la interacción, no la estructura privada de persistencia.

# Pista
Contrato de servicio y modelo de base de datos no son equivalentes.
```

# Responses forma parte del contrato normal y de error

La **Responses Object** describe las respuestas posibles de una operación. Cada respuesta se asocia a un status code o rango y puede declarar headers, contenido y schemas.

Diseñar únicamente la respuesta exitosa deja incompleto el contrato. Los consumidores también necesitan distinguir condiciones como recurso inexistente, conflicto, validación inválida o indisponibilidad.

```yaml
responses:
  "200":
    description: Pago encontrado
  "404":
    description: Pago inexistente
  "409":
    description: Estado incompatible con la operación
```

> Doc: [OpenAPI Specification 3.2.0 — Responses Object](https://spec.openapis.org/oas/v3.2.0.html#responses-object)
> Doc: [RFC 9110 — §15 Status Codes](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes)

```opcion-multiple
# Enunciado
¿Por qué deben declararse también respuestas no exitosas en el contrato?

# Opciones
- Para que el consumidor pueda distinguir y manejar resultados observables diferentes
- Porque OpenAPI prohíbe respuestas 2xx
- Para revelar excepciones internas del proveedor
- Porque todos los errores deben usar 500

# Correcta
1

# Explicación
Los errores forman parte del comportamiento observable y los consumidores necesitan semántica suficiente para reaccionar correctamente.

# Pista
Un contrato incluye lo que puede observarse, no solo el happy path.
```

# Components evita duplicar definiciones reutilizables

El objeto **Components** contiene elementos reutilizables como schemas, responses, parameters y security schemes. Los demás elementos pueden referenciarlos mediante `$ref`.

La reutilización reduce inconsistencias dentro de un mismo contrato. No significa que todas las operaciones deban compartir el mismo schema: se reutiliza cuando la semántica también es la misma.

```yaml
components:
  schemas:
    Payment:
      type: object
      required: [id, status]
      properties:
        id:
          type: string
        status:
          type: string
```

> Doc: [OpenAPI Specification 3.2.0 — Components Object](https://spec.openapis.org/oas/v3.2.0.html#components-object)
> Doc: [OpenAPI Specification 3.2.0 — Reference Object](https://spec.openapis.org/oas/v3.2.0.html#reference-object)

```verdadero-falso
# Enunciado
Dos campos con el mismo tipo estructural deben reutilizar necesariamente el mismo schema de Components.

# Respuesta
falso

# Explicación
La reutilización es correcta cuando también coincide el significado. Compartir estructura no garantiza compartir semántica.

# Pista
La sesión introductoria ya separó structure de semantics.
```

# operationId ofrece una identidad estable dentro de la descripción

`operationId` identifica de manera única una operación dentro del OpenAPI Document. Herramientas de generación de clientes y documentación pueden utilizarlo como identificador estable.

No sustituye al método y al path, pero permite referenciar la operación sin depender de cómo una herramienta derive nombres automáticamente.

> Doc: [OpenAPI Specification 3.2.0 — Operation Object](https://spec.openapis.org/oas/v3.2.0.html#operation-object)

```opcion-multiple
# Enunciado
¿Qué propiedad debe cumplir `operationId` dentro de un OpenAPI Document?

# Opciones
- Debe coincidir con el nombre de una tabla
- Debe ser único entre las operaciones descritas
- Debe ser siempre una URL
- Debe contener el verbo HTTP en mayúsculas

# Correcta
2

# Explicación
OpenAPI exige que operationId sea único dentro del documento para identificar inequívocamente una operación.

# Pista
Su función es identificar una operación.
```

# El contrato puede revisarse antes de implementar

Una ventaja práctica de contract-first es que consumidores y proveedores pueden revisar paths, operaciones, schemas, errores y nombres **antes** de que exista la implementación.

En esta etapa se detectan ambigüedades de semántica y dependencias innecesarias con menor costo que después de integrar aplicaciones desplegadas.

> Doc: [OpenAPI Specification 3.2.0 — Introduction](https://spec.openapis.org/oas/v3.2.0.html#introduction)

```ordenar
# Enunciado
Ordena un flujo contract-first básico.

# Elementos
- Implementar proveedor y consumidor contra el contrato
- Definir y revisar la interfaz observable
- Validar que las implementaciones respetan el contrato

# Orden
2, 1, 3

# Explicación
El contrato se diseña primero; las implementaciones lo realizan; después se comprueba que continúan siendo compatibles con él.

# Pista
El nombre contract-first indica qué artefacto aparece antes.
```

# Cierre

OpenAPI permite convertir la interfaz HTTP en un **contrato explícito y procesable**: paths, operaciones, parámetros, request bodies, responses, schemas reutilizables e identificadores.

La siguiente sesión deja de tratar OpenAPI como estructura documental y entra en la **semántica HTTP**: métodos, códigos de estado, problem details e idempotencia.
