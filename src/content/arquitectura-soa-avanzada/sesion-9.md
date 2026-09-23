---
numero: 9
titulo: "Observabilidad y management del ecosistema"
---

# Observabilidad permite inferir estado interno desde señales externas

OpenTelemetry define observability como la capacidad de comprender un sistema mediante señales como traces, metrics y logs. En un sistema distribuido, ninguna señal aislada explica todo el comportamiento.

La instrumentación debe conservar contexto a través de límites de servicio.

> Doc: [OpenTelemetry — Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
> Doc: [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/)

```relacionar
# Enunciado
Relaciona cada señal con la pregunta que ayuda a responder.

# Pares
- Trace => ¿por qué camino pasó una interacción?
- Metric => ¿cómo evoluciona cuantitativamente el sistema?
- Log => ¿qué evento registró un componente?
- Baggage => ¿qué contexto se propaga entre señales y servicios?

# Explicación
Las señales aportan perspectivas complementarias sobre la misma interacción distribuida.

# Pista
Ruta, medida, evento y contexto son categorías distintas.
```

# Trace context conecta spans de una interacción distribuida

Una traza distribuida se compone de spans relacionados. Para conservar la relación al cruzar servicios, el contexto debe propagarse junto a la interacción.

Perder el contexto convierte una única operación empresarial en fragmentos imposibles de correlacionar.

> Doc: [OpenTelemetry — Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

```opcion-multiple
# Enunciado
¿Por qué se propaga trace context entre servicios?

# Opciones
- Para relacionar spans que pertenecen a la misma interacción distribuida
- Para sustituir autenticación
- Para comprimir JSON
- Para asignar ownership

# Correcta
1

# Explicación
El contexto conserva continuidad observacional entre componentes de una misma operación.

# Pista
Sin contexto, cada span parece una operación aislada.
```

# Correlation ID y trace ID no tienen exactamente el mismo propósito

Un correlation ID puede representar una conversación o entidad de negocio durante más tiempo que una traza técnica. Un trace ID identifica una ejecución observada por el sistema de tracing.

Pueden coincidir en escenarios simples, pero conviene no forzar una sola identidad para todos los niveles.

> Doc: [W3C Web Services Architecture — §2.3.1.5 Message Correlation](https://www.w3.org/TR/ws-arch/)
> Doc: [OpenTelemetry — Traces](https://opentelemetry.io/docs/concepts/signals/traces/)

```verdadero-falso
# Enunciado
Un identificador de negocio que vive semanas debe reutilizarse obligatoriamente como trace ID de todas las ejecuciones relacionadas.

# Respuesta
falso

# Explicación
Correlación empresarial y trazado técnico pueden tener alcances y ciclos de vida distintos.

# Pista
Una conversación larga puede contener muchas ejecuciones.
```

# Service Level Indicators miden comportamiento relevante

Una métrica técnica solo es útil para governance si se relaciona con una expectativa observable: disponibilidad, latencia, tasa de error o capacidad. El indicador debe tener definición, unidad y población medible.

Una media global puede ocultar colas largas o consumidores afectados.

> Doc: [OpenTelemetry — Metrics](https://opentelemetry.io/docs/concepts/signals/metrics/)

```opcion-multiple
# Enunciado
¿Qué definición produce un indicador más verificable?

# Opciones
- “El servicio debe ir rápido”
- “99% de solicitudes válidas completan en menos de 500 ms durante 30 días”
- “El equipo intentará evitar lentitud”
- “El servidor debe sentirse estable”

# Correcta
2

# Explicación
El indicador especifica población, umbral, proporción y ventana temporal.

# Pista
Busca algo que pueda medirse sin interpretación subjetiva.
```

# Usage management observa acceso, demanda y coste

OASIS incluye usage management dentro del management del ecosistema: quién usa recursos, cómo se comporta la demanda y cómo se asignan costes.

La telemetría no sirve solo para depuración; también alimenta capacity planning y decisiones de gobierno.

> Doc: [OASIS SOA-RAF 1.0 — §5.3.2.4 Usage Management](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```relacionar
# Enunciado
Relaciona cada métrica con la preocupación de management.

# Pares
- Solicitudes por consumidor => acceso y uso
- Tasa de crecimiento => demanda
- Coste por operación => financiero
- Saturación de workers => capacidad

# Explicación
Usage management conecta telemetría técnica con decisiones de operación y gobierno.

# Pista
Clasifica por acceso, demanda, coste y capacidad.
```

# Observabilidad debe evitar exponer datos sensibles

Logs, traces y baggage pueden transportar identificadores, payloads o atributos que no deberían persistirse en sistemas de telemetría. La instrumentación necesita políticas de minimización, clasificación y redacción.

Añadir observabilidad sin límites puede crear una nueva superficie de exposición de datos.

> Doc: [OpenTelemetry — Security](https://opentelemetry.io/docs/security/)

```verdadero-falso
# Enunciado
Todo dato disponible en una solicitud debería copiarse a logs y traces para maximizar observabilidad.

# Respuesta
falso

# Explicación
La telemetría debe minimizar y proteger datos; más información no siempre significa mejor observabilidad.

# Pista
Observabilidad también tiene políticas de seguridad y privacidad.
```

# Cierre

La observabilidad se convierte en evidencia para reliability, governance y usage management. La última sesión integra el curso en una evaluación de arquitectura SOA avanzada.
