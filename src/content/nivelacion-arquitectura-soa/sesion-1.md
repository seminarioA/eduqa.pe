---
numero: 1
titulo: "Sistemas, participantes y límites"
---

# Un sistema tiene un límite observable

Para razonar sobre arquitectura hay que decidir qué pertenece al sistema que se estudia y qué queda fuera. El límite no describe necesariamente una máquina física: separa las responsabilidades que se consideran internas de las interacciones que el sistema mantiene con otros participantes.

Cuando cambia el límite también cambia el análisis. Una base de datos puede ser interna para una aplicación y externa para otro sistema que solo consume una interfaz publicada.

> Doc: [W3C Web Services Architecture — §1.4 Agents and Services](https://www.w3.org/TR/ws-arch/)
> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```opcion-multiple
# Enunciado
¿Qué decisión define primero un límite de sistema?

# Opciones
- Qué editor de código utilizará el equipo
- Qué responsabilidades se consideran internas y qué interacciones cruzan hacia otros participantes
- Qué color tendrá la interfaz
- Qué lenguaje de programación tiene más bibliotecas

# Correcta
2

# Explicación
El límite separa responsabilidades internas de interacciones externas. Las herramientas de implementación no determinan por sí solas ese límite.

# Pista
Piensa en qué queda dentro y fuera del sistema observado.
```

# Un participante no es necesariamente un proceso

En una arquitectura distribuida conviene distinguir a la entidad que actúa de la pieza de software que ejecuta una interacción. W3C separa, por ejemplo, la **provider entity** de su **provider agent**: una organización puede ser responsable de un servicio aunque la interacción concreta la ejecute un programa.

Esta separación evita atribuir decisiones empresariales a un proceso técnico y permite razonar sobre responsabilidad, ownership y delegación.

> Doc: [W3C Web Services Architecture — §1.4.2 Requesters and Providers](https://www.w3.org/TR/ws-arch/)

```relacionar
# Enunciado
Relaciona cada elemento con su papel.

# Pares
- Entidad proveedora => persona u organización responsable de ofrecer el servicio
- Agente proveedor => software que realiza la interacción técnica
- Entidad solicitante => persona u organización que necesita utilizar el servicio
- Agente solicitante => software que envía o recibe los mensajes correspondientes

# Explicación
Las entidades expresan responsabilidad organizativa; los agentes realizan la interacción computacional.

# Pista
Separa quién es responsable de quién ejecuta mensajes.
```

# Una interfaz es un límite de interacción

Una interfaz define lo que otro participante puede utilizar del sistema sin exigir conocimiento de la implementación interna. En la arquitectura de Web Services, la **service interface** es el límite abstracto que especifica los tipos de mensajes y patrones de intercambio implicados en la interacción.

La interfaz no equivale a una clase, una tabla o un archivo. Es una superficie de interacción observable por otro participante.

> Doc: [W3C Web Services Architecture — §2.3.2.12 Service Interface](https://www.w3.org/TR/ws-arch/)

```verdadero-falso
# Enunciado
Una interfaz arquitectónica debe exponer todos los detalles internos que necesita el proveedor para implementar su comportamiento.

# Respuesta
falso

# Explicación
La interfaz define la interacción observable. Los detalles internos pueden permanecer ocultos mientras el comportamiento publicado se conserve.

# Pista
Distingue superficie pública de implementación privada.
```

# Una dependencia existe cuando un elemento necesita otro

Existe una dependencia cuando el funcionamiento, construcción o evolución de un elemento requiere algo proporcionado por otro. En sistemas distribuidos, una llamada remota crea una dependencia aunque los dos participantes estén desplegados por separado.

La separación física no elimina dependencia. Solo cambia su forma: una función local depende de código; un consumidor remoto depende de una interfaz, un destino alcanzable y un comportamiento compatible.

> Doc: [OASIS SOA-RM 1.0 — §3.2.1 Visibility](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=13)

```opcion-multiple
# Enunciado
Un consumidor está desplegado en otro servidor pero necesita que un servicio responda para completar su operación. ¿Qué existe entre ambos?

# Opciones
- Ninguna dependencia porque están en servidores distintos
- Una dependencia de interacción
- Solo una dependencia visual
- Una relación de compilación obligatoria

# Correcta
2

# Explicación
El consumidor depende del servicio para completar la operación aunque ambos procesos sean independientes físicamente.

# Pista
La dependencia se determina por necesidad funcional, no por ubicación.
```

# Distribuido significa que la interacción cruza procesos o ubicaciones

Dos componentes pueden formar parte de una misma solución y ejecutarse en procesos, máquinas o dominios de administración distintos. La comunicación entre ellos deja de ser una llamada local: necesita un mecanismo de transporte y queda expuesta a latencia, pérdida de conectividad y fallos parciales.

La arquitectura debe tratar esas propiedades como parte del diseño y no como anomalías excepcionales.

> Doc: [W3C Web Services Architecture — §2.3.1.13 Message Transport](https://www.w3.org/TR/ws-arch/)

```opcion-multiple
# Enunciado
¿Qué cambia al sustituir una llamada local por una interacción de red?

# Opciones
- Desaparece la necesidad de manejar errores
- Aparecen latencia, transporte y fallos parciales entre participantes
- La operación pasa a ser automáticamente asíncrona
- El consumidor deja de depender del proveedor

# Correcta
2

# Explicación
Una interacción remota introduce condiciones propias de la red y de procesos independientes.

# Pista
Una red puede fallar aunque ambos programas sigan ejecutándose.
```

# La arquitectura distingue responsabilidad de tecnología

El mismo límite arquitectónico puede realizarse con tecnologías diferentes. Una interfaz puede cambiar su implementación interna sin cambiar la responsabilidad que ofrece; también puede mantenerse la responsabilidad y reemplazarse el mecanismo de transporte.

Esta separación será esencial en SOA: primero se razona sobre capacidades, servicios e interacciones; después se seleccionan protocolos y productos.

> Doc: [OASIS SOA-RM 1.0 — §1.1 Audience](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=6)

```verdadero-falso
# Enunciado
Elegir HTTP, SOAP o un broker define por sí solo la arquitectura completa del sistema.

# Respuesta
falso

# Explicación
El transporte forma parte de la realización técnica, pero no sustituye decisiones sobre responsabilidades, límites y relaciones entre participantes.

# Pista
Tecnología y arquitectura no son sinónimos.
```

# Cierre

La sesión separó sistema, participante, agente, interfaz y dependencia. La siguiente introduce identificadores, direcciones y endpoints para describir dónde se realiza una interacción distribuida.
