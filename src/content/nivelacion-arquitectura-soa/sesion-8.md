---
numero: 8
titulo: "API, servicio y preparación para SOA"
---

# Una API es una interfaz programática

Una API define una superficie mediante la que un programa puede utilizar funcionalidad ofrecida por otro componente o sistema. Puede ser local o remota y no implica por sí sola un modelo arquitectónico concreto.

Una arquitectura puede tener APIs sin estar organizada alrededor de servicios.

> Doc: [W3C Web Services Architecture — §1.4 What is a Web service?](https://www.w3.org/TR/ws-arch/)

```verdadero-falso
# Enunciado
La existencia de una API demuestra por sí sola que el sistema implementa SOA.

# Respuesta
falso

# Explicación
Una API describe una superficie programática. SOA añade conceptos sobre capacidades, servicios, visibilidad, interacción, efectos, policies y contratos.

# Pista
Interfaz y paradigma arquitectónico no son lo mismo.
```

# Un Web Service es una realización tecnológica específica

W3C define Web Service dentro de su arquitectura de interoperabilidad entre aplicaciones y describe agentes, mensajes, descripciones e interfaces. Esa definición pertenece al marco de Web Services.

SOA es más general: OASIS la define como paradigma para organizar y utilizar capacidades distribuidas y no la limita a una tecnología concreta.

> Doc: [W3C Web Services Architecture — §1.4 What is a Web service?](https://www.w3.org/TR/ws-arch/)
> Doc: [OASIS SOA-RM 1.0 — §2.1 What is Service Oriented Architecture?](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```relacionar
# Enunciado
Relaciona cada término con su alcance.

# Pares
- API => interfaz programática
- Web Service => realización de interacción máquina a máquina según la arquitectura W3C de Web Services
- SOA => paradigma arquitectónico para organizar y utilizar capacidades distribuidas
- HTTP => protocolo de aplicación

# Explicación
Los términos pertenecen a niveles diferentes y no deben tratarse como sinónimos.

# Pista
Separa paradigma, interfaz, tecnología de servicio y protocolo.
```

# Un servicio no es simplemente un endpoint

Un endpoint indica dónde interactuar. Un servicio añade funcionalidad, descripción, condiciones de uso y efectos que resultan relevantes para consumidores.

Reducir servicio a URL pierde la dimensión semántica y contractual.

> Doc: [OASIS SOA-RM 1.0 — §3.1 Service](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=12)

```opcion-multiple
# Enunciado
¿Qué elemento distingue mejor un servicio de una dirección de red aislada?

# Opciones
- La existencia de funcionalidad y condiciones de interacción descritas
- La longitud de la URL
- El puerto 443
- El nombre del servidor

# Correcta
1

# Explicación
El servicio representa acceso a capacidad con una interacción y semántica definidas; la dirección solo ayuda a localizar un punto de acceso.

# Pista
Una URL no explica qué resultado ofrece.
```

# Visibilidad precede a una interacción utilizable

Para que dos participantes interactúen deben darse condiciones de awareness, willingness y reachability. Conocer un servicio, estar dispuesto a utilizarlo y poder alcanzarlo son condiciones diferentes.

Esta tríada será central en el curso introductorio.

> Doc: [OASIS SOA-RM 1.0 — §3.2.1 Visibility](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=13)

```relacionar
# Enunciado
Relaciona cada condición de visibilidad.

# Pares
- Awareness => conocer la existencia y suficiente descripción
- Willingness => disposición de las partes a interactuar
- Reachability => posibilidad de establecer el camino de interacción

# Explicación
Las tres condiciones contribuyen a que una interacción pueda ocurrir.

# Pista
Conocimiento, disposición y conectividad son dimensiones distintas.
```

# Una capacidad responde a qué puede hacerse

Antes de decidir endpoints, protocolos o formatos conviene identificar la capacidad que un participante puede ofrecer y la necesidad que otro intenta satisfacer.

Esa separación evita comenzar el diseño desde tablas o tecnologías.

> Doc: [OASIS SOA-RM 1.0 — §2.1 Needs and capabilities](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```opcion-multiple
# Enunciado
¿Qué pregunta debe responderse antes de elegir el protocolo?

# Opciones
- ¿Qué capacidad necesita ponerse a disposición y qué necesidad satisface?
- ¿Qué color tendrá el dashboard?
- ¿Qué editor usa el proveedor?
- ¿Qué fabricante vende más servidores?

# Correcta
1

# Explicación
La arquitectura comienza por necesidades y capacidades; la tecnología realiza después esa decisión.

# Pista
Primero define qué se ofrece.
```

# Estás preparado para el curso introductorio si separas los niveles

La nivelación queda completa cuando puedes distinguir responsabilidad, interfaz, mensaje, transporte, estado, efecto, dependencia, ownership y tecnología sin tratarlos como sinónimos.

El curso **Introducción a la Arquitectura SOA** parte de esa base y formaliza service, visibility, interaction, Real World Effect, description, policy, contract y execution context según OASIS.

> Doc: [OASIS SOA-RM 1.0 — §3 The Reference Model](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=11)

```opcion-multiple
# Enunciado
¿Cuál de estas afirmaciones muestra que la nivelación está completa?

# Opciones
- HTTP, API, servicio y SOA significan exactamente lo mismo
- Puedo distinguir interfaz, transporte, responsabilidad y efecto antes de elegir tecnología
- Un servicio siempre corresponde a una tabla
- Un endpoint define toda la arquitectura

# Correcta
2

# Explicación
La preparación consiste en separar niveles conceptuales para poder analizar SOA sin confundir paradigma, interfaz y tecnología.

# Pista
Busca la opción que distingue conceptos en lugar de fusionarlos.
```

# Cierre

La nivelación termina aquí. La ruta continúa con **Introducción a la Arquitectura SOA**, donde estos fundamentos se convierten en el vocabulario formal del modelo de referencia de OASIS.
