---
numero: 2
titulo: "Arquitectura de políticas y enforcement"
---

# Una policy expresa condiciones desde una perspectiva

OASIS trata las policies como expresiones de condiciones que un participante establece respecto del uso o comportamiento de recursos y servicios. La política tiene owner y debe interpretarse dentro de un contexto.

En un ecosistema grande pueden coexistir políticas de seguridad, privacidad, disponibilidad, coste y negocio.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2 Policies and Contracts](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```relacionar
# Enunciado
Relaciona cada política con su preocupación.

# Pares
- Cifrado obligatorio => seguridad
- Retención máxima de datos => privacidad
- Ventana de mantenimiento => disponibilidad
- Límite mensual de consumo => coste o uso

# Explicación
Una misma interacción puede estar condicionada por políticas de naturalezas distintas.

# Pista
Clasifica por la restricción que impone cada regla.
```

# Una policy assertion hace comprobable una condición

WS-Policy modela políticas como alternativas compuestas por assertions. Una assertion representa una preferencia, capacidad o requisito que puede formar parte de una política.

La arquitectura debe definir qué significa la assertion y cómo se evalúa; el formato no crea por sí solo el mecanismo de enforcement.

> Doc: [W3C Web Services Policy 1.5 — Framework](https://www.w3.org/TR/ws-policy/)

```verdadero-falso
# Enunciado
Expresar una condición en un documento de policy garantiza por sí solo que será aplicada en runtime.

# Respuesta
falso

# Explicación
La expresión describe la condición; enforcement exige un componente o proceso que la evalúe y actúe.

# Pista
Declarar y hacer cumplir son operaciones distintas.
```

# Policy Decision Point y Policy Enforcement Point cumplen papeles distintos

Un **Policy Decision Point** evalúa información y determina si una acción cumple una política. Un **Policy Enforcement Point** intercepta o controla la acción y aplica la decisión.

Separar decisión y enforcement permite reutilizar reglas sin duplicarlas en cada servicio.

> Doc: [OASIS SOA-RAF 1.0 — §5.1 Governance Model](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```relacionar
# Enunciado
Relaciona cada papel.

# Pares
- Policy Decision Point => evalúa la regla y produce una decisión
- Policy Enforcement Point => impide o permite la acción según la decisión
- Policy Administration => gestiona definición y ciclo de vida de reglas
- Audit => conserva evidencia sobre decisiones y acciones

# Explicación
La separación evita confundir definición, decisión, enforcement y evidencia.

# Pista
Una cosa decide y otra aplica.
```

# Las políticas pueden entrar en conflicto

Dos domains pueden imponer condiciones incompatibles: un consumidor exige conservar trazas durante un año y un proveedor exige eliminarlas en treinta días. El conflicto debe detectarse antes o durante la negociación del contexto de ejecución.

OASIS exige mecanismos de resolución cuando existen políticas incompatibles.

> Doc: [OASIS SOA-RAF 1.0 — §3.4.3 Policies and Contracts](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
Dos policies aplicables exigen condiciones mutuamente incompatibles. ¿Qué debe hacer la arquitectura?

# Opciones
- Ignorar una de ellas al azar
- Detectar y resolver el conflicto mediante reglas o negociación definidas
- Ejecutar ambas aunque sea imposible
- Ocultar el conflicto al consumidor

# Correcta
2

# Explicación
Un ecosistema gobernable necesita una estrategia explícita para conflictos de políticas.

# Pista
La incompatibilidad debe convertirse en una decisión visible.
```

# Un contract representa constraints aceptados por varias partes

A diferencia de una policy unilateral, un contract refleja condiciones que varias partes han aceptado. Puede incorporar políticas, niveles de servicio, responsabilidades, procesos de disputa y consecuencias por incumplimiento.

La distinción importa porque el owner y el proceso de cambio son diferentes.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2 Policies and Contracts](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```opcion-multiple
# Enunciado
¿Qué diferencia principal existe entre policy y contract en OASIS?

# Opciones
- La policy siempre es XML y el contract siempre PDF
- La policy expresa condiciones desde una perspectiva; el contract refleja condiciones aceptadas entre partes
- El contract no puede contener restricciones
- La policy nunca tiene owner

# Correcta
2

# Explicación
El origen y la aceptación de las condiciones distinguen policy de contract, no el formato documental.

# Pista
Pregunta cuántas partes han aceptado la condición.
```

# Policy as code no elimina la necesidad de semántica

Automatizar validaciones mediante reglas ejecutables mejora consistencia y velocidad, pero la regla codificada sigue necesitando una definición clara del requisito que representa.

Un check automático incorrecto solo aplica una policy incorrecta con mayor velocidad.

> Doc: [OASIS SOA-RAF 1.0 — §5.1.2 A Generic Model for Governance](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```verdadero-falso
# Enunciado
Convertir una policy en una validación automática elimina la necesidad de documentar su significado y owner.

# Respuesta
falso

# Explicación
La automatización implementa enforcement, pero la semántica, responsabilidad y proceso de cambio siguen siendo necesarios.

# Pista
Código y significado no son equivalentes.
```

# Cierre

Las policies ya pueden analizarse como reglas con owner, assertions, decisión, enforcement y resolución de conflictos. La siguiente sesión aplica estos conceptos a confianza y seguridad entre dominios.
