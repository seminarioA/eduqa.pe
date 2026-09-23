---
numero: 2
titulo: "Identificadores, direcciones y endpoints"
---

# Un URI identifica un recurso

Un **Uniform Resource Identifier (URI)** es una secuencia de caracteres que identifica un recurso. La identificación no exige que el recurso sea un archivo ni que el URI pueda abrirse en un navegador.

La sintaxis genérica separa componentes como esquema, autoridad, ruta, consulta y fragmento. Cada componente cumple una función distinta.

> Doc: [RFC 3986 — §1.1.3 Syntax Notation](https://www.rfc-editor.org/rfc/rfc3986.html#section-1.1.3)
> Doc: [RFC 3986 — §3 Syntax Components](https://www.rfc-editor.org/rfc/rfc3986.html#section-3)

```opcion-multiple
# Enunciado
¿Qué afirma correctamente un URI?

# Opciones
- Identifica un recurso
- Siempre representa un archivo físico
- Siempre abre una página HTML
- Obliga a utilizar HTTP

# Correcta
1

# Explicación
URI es un concepto de identificación. El esquema y el mecanismo de acceso dependen del identificador concreto.

# Pista
Identificar no significa necesariamente descargar.
```

# Una dirección aporta información para alcanzar un destino

Para entregar un mensaje, el mecanismo de transporte necesita suficiente información de dirección. W3C separa el mensaje del transporte que lo entrega y exige que el transporte conozca cómo localizar al destinatario.

Una dirección pertenece al problema de reachability. Conocer el nombre de una capacidad no garantiza que exista una ruta de comunicación hacia el agente que la realiza.

> Doc: [W3C Web Services Architecture — §2.3.1.13 Message Transport](https://www.w3.org/TR/ws-arch/)
> Doc: [OASIS SOA-RM 1.0 — §3.2.1.3 Reachability](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=15)

```verdadero-falso
# Enunciado
Conocer que un servicio existe garantiza que el consumidor pueda alcanzarlo por red.

# Respuesta
falso

# Explicación
Awareness y reachability son condiciones distintas. Un consumidor puede conocer un servicio y no tener conectividad hacia él.

# Pista
Saber que algo existe no crea una ruta de red.
```

# Un endpoint combina una interfaz con una ubicación utilizable

En la práctica, un endpoint representa un punto concreto al que un consumidor puede dirigir una interacción. La ubicación no define por sí sola el significado del servicio: dos endpoints pueden realizar la misma interfaz en ubicaciones diferentes.

Esta separación permite reemplazar instancias, balancear tráfico o publicar varios destinos sin redefinir la capacidad que se ofrece.

> Doc: [W3C Web Services Architecture — §1.4.3 Service Description](https://www.w3.org/TR/ws-arch/)

```opcion-multiple
# Enunciado
Dos URLs distintas implementan la misma interfaz y comportamiento esperado. ¿Qué puede variar sin cambiar necesariamente el servicio abstracto?

# Opciones
- La ubicación concreta del endpoint
- La semántica acordada
- El efecto prometido
- La responsabilidad empresarial

# Correcta
1

# Explicación
La ubicación puede variar mientras la interfaz y la semántica del servicio permanezcan compatibles.

# Pista
Distingue dónde se accede de qué se ofrece.
```

# DNS resuelve nombres, no contratos

El Domain Name System permite resolver nombres dentro de su espacio de nombres. Que un nombre pueda resolverse no describe las operaciones de una API ni las condiciones de un servicio.

La resolución de nombres contribuye a reachability, pero no sustituye la descripción funcional.

> Doc: [RFC 1034 — §1 Introduction](https://www.rfc-editor.org/rfc/rfc1034.html#section-1)

```verdadero-falso
# Enunciado
Si DNS resuelve correctamente el nombre de un servidor, el consumidor ya conoce el contrato funcional del servicio.

# Respuesta
falso

# Explicación
DNS resuelve nombres a información de direccionamiento; no describe mensajes, operaciones ni semántica de negocio.

# Pista
Resolución de nombres y descripción de interfaz cumplen funciones distintas.
```

# La autoridad de un URI no equivale al ownership empresarial

En un URI, la autoridad es un componente sintáctico que puede contener host, puerto e información de usuario. El ownership de una capacidad describe quién controla o es responsable de esa capacidad.

Los dos conceptos pueden coincidir operacionalmente y aun así pertenecen a niveles distintos de análisis.

> Doc: [RFC 3986 — §3.2 Authority](https://www.rfc-editor.org/rfc/rfc3986.html#section-3.2)
> Doc: [OASIS SOA-RM 1.0 — §2.1 Ownership domains](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```relacionar
# Enunciado
Relaciona cada término con la pregunta que responde.

# Pares
- Autoridad de URI => ¿qué host o autoridad participa en la dirección?
- Ownership => ¿quién controla la capacidad o responsabilidad?
- Endpoint => ¿a qué ubicación concreta se envía la interacción?
- Interfaz => ¿qué intercambio observable está permitido?

# Explicación
Los cuatro términos describen dimensiones distintas: sintaxis, responsabilidad, ubicación e interacción.

# Pista
No mezcles dirección con gobierno.
```

# Un identificador estable reduce acoplamiento accidental

Si consumidores almacenan un identificador, cambiarlo puede obligarlos a modificar configuración, enlaces o contratos. La estabilidad de identificadores reduce cambios innecesarios fuera del proveedor.

Esto no significa que una dirección nunca pueda cambiar; significa que identidad y ubicación deben distinguirse cuando la evolución del sistema lo requiera.

> Doc: [RFC 3986 — §1.1 Overview of URIs](https://www.rfc-editor.org/rfc/rfc3986.html#section-1.1)

```opcion-multiple
# Enunciado
¿Por qué conviene distinguir identidad de ubicación?

# Opciones
- Para que toda URL sea más corta
- Para poder cambiar una ubicación sin redefinir necesariamente la identidad lógica
- Para evitar documentar interfaces
- Para impedir el uso de DNS

# Correcta
2

# Explicación
Separar identidad y ubicación permite evolucionar despliegues sin obligar a redefinir el concepto identificado.

# Pista
Piensa en mover una instancia manteniendo el mismo servicio lógico.
```

# Cierre

Ya puedes distinguir URI, dirección, endpoint, autoridad y ownership. La siguiente sesión introduce HTTP como protocolo de aplicación y separa método, representación, estado y semántica de la operación.
