---
numero: 5
titulo: "Transacciones distribuidas y compensación"
---

# Una atomic transaction busca un resultado all-or-nothing

WS-AtomicTransaction define coordinación para actividades distribuidas de corta duración que requieren acuerdo consistente sobre un resultado atómico. Sus protocolos incluyen variantes de two-phase commit.

El coste es coordinación fuerte entre participantes y disponibilidad condicionada al protocolo.

> Doc: [OASIS WS-AtomicTransaction 1.2](https://docs.oasis-open.org/ws-tx/wstx-wsat-1.2-spec.html)

```opcion-multiple
# Enunciado
¿Qué propiedad caracteriza una atomic transaction distribuida?

# Opciones
- Cada participante puede terminar con un resultado arbitrario
- Los participantes coordinan un resultado all-or-nothing
- Nunca existe bloqueo o coordinación
- Solo funciona con un único recurso

# Correcta
2

# Explicación
La atomicidad busca que los participantes acuerden un único resultado global de commit o rollback.

# Pista
Piensa en todo o nada.
```

# Two-phase commit coordina preparación y decisión

En un protocolo de two-phase commit, los participantes primero indican si pueden confirmar; después el coordinador comunica la decisión global.

La fase de preparación introduce estados intermedios que deben recuperarse correctamente ante fallos.

> Doc: [OASIS WS-AtomicTransaction 1.2 — Two Phase Commit](https://docs.oasis-open.org/ws-tx/wstx-wsat-1.2-spec.html)

```ordenar
# Enunciado
Ordena el esquema conceptual de two-phase commit.

# Elementos
- Comunicar commit o rollback
- Pedir a participantes que se preparen
- Recoger votos de preparación

# Orden
2, 3, 1

# Explicación
Primero se solicita preparación, después se conocen los votos y finalmente se comunica la decisión global.

# Pista
No hay decisión global antes de conocer si los participantes pueden confirmar.
```

# Las business activities admiten duración y compensación

WS-BusinessActivity aborda actividades distribuidas que pueden durar más y en las que un rollback técnico global no es apropiado. Los participantes pueden definir acciones de compensación para deshacer o contrarrestar efectos completados.

Compensar no equivale a borrar el pasado: crea un nuevo efecto que corrige o neutraliza el anterior según reglas del negocio.

> Doc: [OASIS WS-BusinessActivity 1.1](https://docs.oasis-open.org/ws-tx/wstx-wsba-1.1-spec-os/wstx-wsba-1.1-spec-os.html)

```verdadero-falso
# Enunciado
Una compensación empresarial garantiza que el sistema vuelve bit a bit al estado exacto anterior.

# Respuesta
falso

# Explicación
La compensación ejecuta una acción semántica de corrección; puede dejar evidencia, movimientos inversos o estados nuevos.

# Pista
Reembolsar una compra no elimina que la compra existió.
```

# Saga coordina una secuencia de transacciones locales

El patrón saga modela una operación larga como pasos con commits locales y acciones compensatorias. Puede coordinarse centralmente o mediante eventos entre participantes.

La ventaja es evitar una transacción distribuida de larga duración; el coste es gestionar estados intermedios y compensaciones.

> Doc: [OASIS WS-BusinessActivity 1.1 — Business Activity coordination](https://docs.oasis-open.org/ws-tx/wstx-wsba-1.1-spec-os/wstx-wsba-1.1-spec-os.html)

```relacionar
# Enunciado
Relaciona cada paso con una compensación posible.

# Pares
- Reservar inventario => liberar reserva
- Capturar pago => emitir devolución
- Crear envío => cancelar envío si aún es posible
- Emitir cupón => invalidar cupón

# Explicación
Cada efecto local necesita una respuesta de compensación compatible con sus reglas reales.

# Pista
La compensación actúa sobre el mismo compromiso empresarial.
```

# No todo efecto es compensable

Enviar un correo, revelar un dato o ejecutar una acción física puede no poder revertirse. La arquitectura debe clasificar efectos antes de diseñar una saga.

Cuando la compensación es imposible, pueden hacer falta confirmaciones previas, pasos de autorización o procesos manuales de remediación.

> Doc: [OASIS SOA-RM 1.0 — §3.2.3 Real World Effect](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=17)

```opcion-multiple
# Enunciado
¿Qué ejemplo no puede compensarse simplemente restaurando el estado anterior?

# Opciones
- Liberar una reserva no utilizada
- Descontar un registro temporal
- Un secreto ya fue revelado a un tercero
- Eliminar una caché regenerable

# Correcta
3

# Explicación
Una vez revelada información, no existe una operación técnica que haga que el receptor deje de haberla conocido.

# Pista
Busca un efecto irreversible en el mundo real.
```

# La estrategia transaccional depende de duración, ownership y tolerancia a estados intermedios

No existe una regla universal para elegir 2PC, saga o coordinación manual. El diseño debe evaluar duración, número de dominios, disponibilidad requerida, reversibilidad de efectos y necesidad de consistencia inmediata.

La semántica empresarial decide qué incoherencias temporales son aceptables.

> Doc: [OASIS SOA-RAF 1.0 — §2 Architectural Goals and Principles](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
Una operación cruza empresas, puede durar días y cada paso produce efectos confirmados localmente. ¿Qué estrategia merece evaluarse antes que una transacción atómica larga?

# Opciones
- Business activity con compensaciones
- Mantener locks distribuidos durante días
- Eliminar estados intermedios del modelo
- Suponer que ningún participante fallará

# Correcta
1

# Explicación
Las actividades largas entre dominios suelen requerir coordinación semántica y compensación en lugar de bloqueo atómico prolongado.

# Pista
La duración y el ownership hacen costosa la atomicidad fuerte.
```

# Cierre

La sesión separó atomicidad, two-phase commit, business activities, sagas y compensación. La siguiente estudia composición, orquestación y coreografía.
