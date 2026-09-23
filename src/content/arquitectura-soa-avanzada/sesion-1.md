---
numero: 1
titulo: "El ecosistema SOA y su gobierno"
---

# Un ecosistema SOA cruza dominios de ownership

A escala empresarial, los servicios no pertenecen a un único equipo ni evolucionan bajo una sola autoridad. OASIS describe el ecosistema SOA como un entorno donde participantes con necesidades y capacidades interactúan a través de límites de ownership.

La arquitectura avanzada debe asumir que políticas, presupuestos, prioridades y ritmos de cambio pueden diferir entre dominios.

> Doc: [OASIS SOA-RAF 1.0 — §2 Architectural Goals and Principles](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
¿Qué cambia al pasar de unos pocos servicios de un equipo a un ecosistema SOA empresarial?

# Opciones
- Desaparecen las diferencias de ownership
- Aumenta la necesidad de coordinar políticas, responsabilidades y expectativas entre dominios
- Todos los servicios deben compartir base de datos
- La arquitectura deja de necesitar contratos

# Correcta
2

# Explicación
La distribución de ownership introduce decisiones y restricciones independientes que deben coordinarse sin borrar la autonomía de cada dominio.

# Pista
Piensa en quién puede decidir sobre cada capacidad.
```

# Governance define condiciones, decisiones y mecanismos de respuesta

OASIS define governance como la prescripción de condiciones y restricciones coherentes con objetivos comunes, junto con las estructuras y procesos necesarios para definirlas y responder a las acciones realizadas.

Gobernar no significa centralizar cada decisión técnica. Significa establecer quién decide, sobre qué, con qué evidencia y qué ocurre cuando una regla se incumple.

> Doc: [OASIS SOA-RAF 1.0 — §5.1 Governance Model](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```relacionar
# Enunciado
Relaciona cada elemento de governance con la pregunta que responde.

# Pares
- Decision right => ¿quién puede decidir?
- Policy => ¿qué condición o restricción debe cumplirse?
- Evidence => ¿cómo se demuestra cumplimiento?
- Response process => ¿qué se hace ante incumplimiento o cambio?

# Explicación
Governance necesita autoridad, reglas, evidencia y mecanismos de respuesta.

# Pista
No reduzcas governance a documentación.
```

# SOA governance no sustituye IT governance

OASIS separa SOA governance de IT governance. Se relacionan, pero SOA governance se concentra en la organización de servicios, su visibilidad, interacción y resultados dentro del ecosistema.

Un comité SOA no corrige por sí solo problemas generales de presupuesto, portfolio, infraestructura o estrategia tecnológica.

> Doc: [OASIS SOA-RAF 1.0 — §5.1.3.1 Where SOA Governance is Different](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```verdadero-falso
# Enunciado
Implantar SOA governance resuelve automáticamente cualquier deficiencia de IT governance.

# Respuesta
falso

# Explicación
OASIS trata ambos ámbitos como relacionados pero distintos. SOA governance tiene un foco específico en servicios e interacción.

# Pista
Gobierno de servicios y gobierno general de TI no son equivalentes.
```

# El service inventory establece qué servicios pueden participar

El inventario de servicios no es solo una lista de URLs. Debe contener suficiente información para identificar servicios, owners, descripciones, políticas, estado de ciclo de vida y condiciones de uso.

El inventario se convierte en un punto de control para visibilidad y governance.

> Doc: [OASIS SOA-RAF 1.0 — §5.1.3.2 What Must be Governed](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
¿Qué información convierte un inventario en una herramienta de gobierno y no en una lista de endpoints?

# Opciones
- Solo hostname y puerto
- Owner, descripción, políticas, ciclo de vida y condiciones de uso
- Solo lenguaje de programación
- Solo tamaño del repositorio

# Correcta
2

# Explicación
El inventario debe permitir evaluar responsabilidad, elegibilidad y condiciones de interacción.

# Pista
Gobernar requiere saber más que dónde está desplegado algo.
```

# Governance necesita medir cumplimiento

Una regla no es operable si no existe forma de observar su cumplimiento. OASIS incluye medición, auditoría y respuesta como parte del modelo de governance.

La arquitectura debe definir qué evidencia se recolecta y quién la interpreta.

> Doc: [OASIS SOA-RAF 1.0 — §5.1.2 A Generic Model for Governance](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```verdadero-falso
# Enunciado
Una política que nadie puede verificar sigue siendo suficiente como mecanismo operativo de governance.

# Respuesta
falso

# Explicación
Las condiciones de governance necesitan mecanismos de observación, medición o enforcement para ser operables.

# Pista
Una regla sin evidencia solo expresa intención.
```

# La autonomía se conserva dentro de límites compartidos

Un ecosistema SOA escalable no exige que una autoridad central apruebe cada cambio interno. La gobernanza puede concentrarse en identificadores, contratos, seguridad, observabilidad y compatibilidad, dejando libertad dentro de cada dominio.

La meta es combinar confianza y flexibilidad.

> Doc: [OASIS SOA-RAF 1.0 — §5.1.3 Governance Applied to SOA](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
¿Qué enfoque escala mejor en un ecosistema con muchos equipos?

# Opciones
- Aprobar centralmente cada línea de código
- Definir guardrails compartidos y permitir autonomía dentro de ellos
- Eliminar contratos
- Permitir cualquier cambio sin responsabilidad

# Correcta
2

# Explicación
Los guardrails concentran control en aspectos que protegen interoperabilidad y confianza sin absorber cada decisión interna.

# Pista
Busca equilibrio entre autonomía y reglas comunes.
```

# Cierre

La sesión estableció governance, ownership, inventario, evidencia y autonomía. La siguiente profundiza en políticas, assertions, conflictos y enforcement.
