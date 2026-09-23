---
numero: 3
titulo: "Confianza, identidad y seguridad federada"
---

# Trust es una evaluación de confianza, no una propiedad binaria del protocolo

OASIS describe trust como una evaluación privada que un participante realiza sobre la integridad y fiabilidad de otros participantes o del ecosistema. Cifrar un canal contribuye a seguridad, pero no demuestra por sí solo que el otro participante deba ser considerado confiable para cualquier acción.

La confianza combina evidencia técnica, políticas, acuerdos y experiencia previa.

> Doc: [OASIS SOA-RAF 1.0 — §2.1.2.2 Trust](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```verdadero-falso
# Enunciado
Usar TLS convierte automáticamente a cualquier participante autenticado en confiable para cualquier operación.

# Respuesta
falso

# Explicación
La autenticación y protección del canal aportan evidencia, pero la autorización y la confianza dependen del contexto y de políticas adicionales.

# Pista
Saber quién es alguien no decide todo lo que puede hacer.
```

# Identity establece a qué sujeto se atribuye una interacción

Una identidad permite relacionar una acción con un principal o entidad reconocible dentro del contexto de seguridad. La arquitectura debe definir quién emite la identidad, cómo se valida y en qué dominios se acepta.

Federar identidad implica aceptar afirmaciones emitidas fuera del dominio local bajo reglas de confianza explícitas.

> Doc: [SAML 2.0 — Core specification](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)

```relacionar
# Enunciado
Relaciona cada elemento de identidad federada.

# Pares
- Principal => sujeto al que se atribuye una identidad
- Identity Provider => emite afirmaciones sobre el principal
- Service Provider => consume afirmaciones para tomar decisiones
- Assertion => declaración firmada o protegida sobre identidad o atributos

# Explicación
La federación separa quién conoce al principal de quién consume esa información.

# Pista
Una parte emite evidencia y otra la utiliza.
```

# Authentication y authorization resuelven preguntas distintas

Authentication determina qué identidad se presenta y puede verificarse. Authorization determina si esa identidad puede realizar una acción concreta sobre un recurso concreto bajo las políticas aplicables.

Confundir ambas operaciones produce sistemas donde estar autenticado equivale indebidamente a tener acceso.

> Doc: [OASIS SOA-RAF 1.0 — §5.2 Security Model](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
Un usuario presenta una identidad válida pero intenta ejecutar una operación reservada a administradores. ¿Qué control decide el resultado?

# Opciones
- Authorization
- DNS
- Serialización JSON
- Compresión

# Correcta
1

# Explicación
La identidad ya fue autenticada; ahora corresponde evaluar permisos sobre la acción.

# Pista
La pregunta ya no es quién es, sino qué puede hacer.
```

# WS-Trust separa emisión y validación de security tokens

WS-Trust define extensiones para solicitar, emitir, renovar y validar security tokens. Su modelo permite que un Security Token Service participe como autoridad de confianza entre dominios.

El patrón ilustra una idea general de federación: el servicio objetivo no tiene que autenticar desde cero todos los mecanismos de identidad posibles.

> Doc: [OASIS WS-Trust 1.4](https://docs.oasis-open.org/ws-sx/ws-trust/v1.4/ws-trust.html)

```opcion-multiple
# Enunciado
¿Qué papel cumple un Security Token Service en un modelo federado?

# Opciones
- Compila el código del consumidor
- Emite o valida tokens aceptados bajo relaciones de confianza
- Sustituye todas las policies
- Ejecuta las operaciones de negocio

# Correcta
2

# Explicación
El STS participa en establecimiento de confianza mediante tokens; no posee automáticamente la capacidad de negocio.

# Pista
Su responsabilidad está en credenciales, no en el dominio empresarial.
```

# WS-SecurityPolicy expresa requisitos de seguridad interoperables

WS-SecurityPolicy proporciona assertions para describir requisitos de seguridad asociados a mensajes y endpoints, como tipos de tokens, protección de mensajes y bindings.

La especificación no sustituye el análisis de riesgos; ofrece un vocabulario para expresar parte de las condiciones técnicas.

> Doc: [OASIS WS-SecurityPolicy 1.3](https://docs.oasis-open.org/ws-sx/ws-securitypolicy/v1.3/ws-securitypolicy-1.3-spec-ed-01.html)

```verdadero-falso
# Enunciado
Una política de seguridad bien formada elimina la necesidad de modelar amenazas y ownership.

# Respuesta
falso

# Explicación
La política expresa requisitos; el análisis de amenazas determina qué requisitos hacen falta y quién es responsable de ellos.

# Pista
Formato y estrategia de seguridad no son lo mismo.
```

# Zero trust se aplica como verificación explícita, no como ausencia de confianza organizativa

En un ecosistema distribuido conviene evaluar identidad, contexto y autorización en cada frontera relevante en lugar de asumir que la ubicación de red concede confianza.

La implementación concreta puede variar, pero el principio arquitectónico es no convertir la red interna en una autorización implícita.

> Doc: [NIST SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

```opcion-multiple
# Enunciado
¿Qué decisión es coherente con una arquitectura zero trust?

# Opciones
- Todo proceso dentro de la LAN puede ejecutar cualquier operación
- Cada acceso relevante se evalúa con identidad, contexto y policy
- Eliminar autenticación para reducir latencia
- Confiar únicamente en la dirección IP

# Correcta
2

# Explicación
Zero trust evita usar ubicación de red como autorización suficiente.

# Pista
La confianza no se hereda por estar dentro de un perímetro.
```

# Cierre

Trust, identity, authentication, authorization, tokens y policies quedan separados. La siguiente sesión aborda mensajería fiable, duplicados, orden y acknowledgements.
