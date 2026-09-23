---
numero: 7
titulo: "Acoplamiento, cohesión y ownership"
---

# Acoplamiento describe cuánto depende un elemento de otro

El acoplamiento aumenta cuando un consumidor necesita conocer detalles específicos del proveedor para funcionar. Una dependencia de interfaz es inevitable en una integración; una dependencia de tablas internas, orden de despliegue o implementación privada suele ser más costosa de evolucionar.

Reducir acoplamiento no significa eliminar toda relación: significa limitar las dependencias a las que son necesarias y explícitas.

> Doc: [OASIS SOA-RAF 1.0 — §2 Architectural Goals and Principles](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/cs01/soa-ra-v1.0-cs01.html)

```opcion-multiple
# Enunciado
¿Qué consumidor está más acoplado a la implementación interna del proveedor?

# Opciones
- El que usa una interfaz documentada
- El que consulta directamente tablas privadas del proveedor
- El que valida un contrato público
- El que usa un identificador publicado

# Correcta
2

# Explicación
Acceder a estructuras privadas obliga al consumidor a seguir cambios internos que deberían poder evolucionar de forma independiente.

# Pista
Busca la dependencia sobre un detalle que no debería ser público.
```

# Cohesión agrupa responsabilidades relacionadas

Una unidad es más cohesiva cuando sus operaciones responden a una responsabilidad común y cambian por razones relacionadas. Agrupar funciones sin relación produce una frontera difícil de describir, gobernar y evolucionar.

La cohesión se evalúa sobre significado y responsabilidad, no contando métodos.

> Doc: [OASIS SOA-RAF 1.0 — §3.2.2 Services Reflecting Business](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html#_Toc367360770)

```relacionar
# Enunciado
Relaciona cada capacidad con la responsabilidad más cohesionada.

# Pares
- Autorizar pago => pagos — autorización
- Consultar saldo => cuentas — consulta de saldo
- Reservar inventario => inventario — reserva
- Consultar disponibilidad => inventario — consulta de disponibilidad

# Explicación
Las capacidades se agrupan por responsabilidad y razones de cambio relacionadas.

# Pista
Evita mezclar pagos, cuentas e inventario en una única responsabilidad genérica.
```

# Ownership indica quién controla una capacidad

OASIS destaca que las capacidades distribuidas pueden pertenecer a dominios de ownership distintos. La separación importa porque cada dominio puede tener políticas, prioridades y ciclos de cambio propios.

Una frontera técnica que atraviesa varios dominios de ownership requiere coordinación explícita.

> Doc: [OASIS SOA-RM 1.0 — §2.1 Ownership domains](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=8)

```verdadero-falso
# Enunciado
Dos capacidades controladas por áreas independientes siempre deben evolucionar al mismo ritmo porque pertenecen a la misma empresa.

# Respuesta
falso

# Explicación
El ownership puede producir políticas y ciclos de evolución distintos incluso dentro de una misma organización.

# Pista
Empresa y dominio de control no son necesariamente equivalentes.
```

# Compartir base de datos crea una dependencia fuerte de estructura

Cuando varios sistemas escriben directamente las mismas tablas, cada cambio de esquema puede afectar a consumidores ajenos al ownership del dato. La base compartida puede ser una decisión válida, pero debe reconocerse como un acoplamiento explícito.

Una interfaz publicada puede reducir esa dependencia al encapsular la representación interna.

> Doc: [OASIS SOA-RM 1.0 — §3.1 Service opacity](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=12)

```opcion-multiple
# Enunciado
¿Qué riesgo introduce una base compartida por varios dominios independientes?

# Opciones
- Ninguno; el esquema nunca cambia
- Cambios internos de persistencia pueden romper consumidores externos
- Elimina toda necesidad de coordinación
- Convierte cualquier sistema en SOA

# Correcta
2

# Explicación
El esquema pasa a funcionar como contrato implícito entre varios participantes y limita evolución independiente.

# Pista
Pregunta quién debe coordinarse cuando una columna cambia.
```

# Un contrato público debe minimizar conocimiento privado

El consumidor necesita conocer suficiente información para interactuar correctamente, pero no cada decisión de implementación. La opacidad permite cambiar procesos internos sin alterar el contrato mientras se mantenga el comportamiento acordado.

Ese margen de cambio es una propiedad arquitectónica valiosa.

> Doc: [OASIS SOA-RM 1.0 — §3.1 Service](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=12)

```verdadero-falso
# Enunciado
Ocultar detalles internos permite cambiar la implementación siempre que se conserve el comportamiento público comprometido.

# Respuesta
verdadero

# Explicación
La opacidad separa contrato e implementación y permite evolución interna sin exigir cambios a consumidores.

# Pista
El consumidor depende de lo observable, no de cómo se implementa.
```

# Una frontera útil combina cohesión y control de dependencias

No existe una fórmula universal para dibujar límites. Una buena frontera mantiene responsabilidad reconocible, ownership manejable y dependencias externas explícitas.

El diseño debe justificar por qué ciertas capacidades cambian juntas y por qué otras permanecen separadas.

> Doc: [OASIS SOA-RAF 1.0 — §3.2.2 Services Reflecting Business](https://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html#_Toc367360770)

```opcion-multiple
# Enunciado
¿Qué argumento justifica mejor una frontera?

# Opciones
- Todas las funciones caben en el mismo repositorio
- Las capacidades comparten responsabilidad, ownership y razones de cambio relacionadas
- El equipo prefiere una única carpeta
- La base de datos tiene espacio

# Correcta
2

# Explicación
La frontera se justifica por responsabilidad y dependencias, no por conveniencia accidental del repositorio.

# Pista
Busca razones arquitectónicas de evolución.
```

# Cierre

Acoplamiento, cohesión y ownership ya pueden usarse para discutir fronteras con precisión. La última sesión de nivelación conecta estos fundamentos con API, servicio y SOA.
