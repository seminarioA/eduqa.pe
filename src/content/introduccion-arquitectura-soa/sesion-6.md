---
numero: 6
titulo: "Políticas y contratos"
---

# Política y contrato no significan lo mismo

OASIS distingue dos conceptos que suelen mezclarse. Una **policy** representa una restricción o condición definida desde el punto de vista de un participante sobre el uso, despliegue o descripción de una entidad que controla. Un **contract**, en cambio, representa un acuerdo entre dos o más participantes.

Ambos pueden imponer condiciones sobre el uso de un servicio e incluso limitar los Real World Effects esperados, pero su origen es diferente: la política pertenece a una perspectiva individual; el contrato existe porque varias partes han llegado a un acuerdo.

![Policies and Contracts](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm_files/image020.jpg)

*Figura 10 de OASIS SOA-RM 1.0: relación conceptual entre políticas y contratos.*

> Doc: [OASIS SOA-RM 1.0 — §3.3.2 Policies and Contracts](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```relacionar
# Enunciado
Relaciona cada concepto con su origen.

# Pares
- Policy => punto de vista de un participante
- Contract => acuerdo entre dos o más participantes

# Explicación
Una política puede existir unilateralmente; un contrato presupone acuerdo entre varias partes.

# Pista
Pregunta si la condición necesita acuerdo mutuo para existir.
```

# El Reference Model no prescribe un lenguaje de políticas

El SOA Reference Model se concentra en el **concepto** de políticas y contratos, no en el lenguaje utilizado para expresarlos. Por tanto, no exige una sintaxis particular, un producto concreto ni una tecnología específica para representarlos.

Lo importante es que la arquitectura pueda identificar condiciones, acuerdos y mecanismos de cumplimiento de manera coherente con los conceptos del modelo.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2 Policies and Contracts](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```verdadero-falso
# Enunciado
Para ser conforme con el SOA Reference Model, una política debe escribirse utilizando un lenguaje específico prescrito por OASIS.

# Respuesta
falso

# Explicación
El Reference Model no se ocupa de la forma ni de la expresividad del lenguaje utilizado para expresar políticas y contratos.

# Pista
El documento define conceptos, no una sintaxis tecnológica concreta.
```

# Una política tiene assertion, owner y enforcement

OASIS identifica tres aspectos conceptuales de una policy:

1. **policy assertion**, la afirmación que expresa la condición;
2. **policy owner**, el participante que adopta esa afirmación como política propia;
3. **policy enforcement**, el mecanismo mediante el que se procura que la condición se cumpla.

Separar estas piezas permite distinguir qué se exige, quién lo exige y cómo se hace efectiva la condición.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.1 Service Policy](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```relacionar
# Enunciado
Relaciona cada componente de una policy con su función.

# Pares
- Policy assertion => expresa una condición medible
- Policy owner => adopta la afirmación como política propia
- Policy enforcement => procura que la condición sea consistente con la realidad

# Explicación
OASIS separa la afirmación, su propietario y su cumplimiento porque son responsabilidades conceptualmente distintas.

# Pista
Distingue qué se declara, quién lo declara y cómo se hace cumplir.
```

# Una policy assertion debe ser medible

Una **policy assertion** expresa una condición que puede evaluarse. OASIS utiliza como ejemplo «todos los mensajes están cifrados»: la afirmación puede resultar verdadera o falsa según las condiciones reales de la interacción.

La posibilidad de evaluar la afirmación es fundamental. Una frase vaga que no permite determinar si se cumple no ofrece una base adecuada para policy enforcement.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.1 Service Policy](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```opcion-multiple
# Enunciado
¿Cuál funciona mejor como policy assertion en el sentido del SOA-RM?

# Opciones
- El servicio debería ser bastante seguro
- Todos los mensajes deben estar cifrados
- Sería deseable una buena experiencia
- La aplicación debe sentirse moderna

# Correcta
2

# Explicación
«Todos los mensajes deben estar cifrados» puede verificarse como verdadero o falso. Las demás expresiones son demasiado vagas para evaluarlas directamente.

# Pista
Busca una condición cuya observancia pueda comprobarse.
```

# Una afirmación se convierte en política cuando un participante la adopta

Una misma afirmación no pertenece necesariamente a todos los participantes. Se convierte en la policy de un participante cuando ese participante la adopta como propia.

Por ejemplo, «todos los mensajes deben estar cifrados» puede ser una política del consumidor incluso antes de que el proveedor haya aceptado esa condición. Esto muestra por qué una policy no debe confundirse con un contrato.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.1 Service Policy](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```verdadero-falso
# Enunciado
Si un consumidor adopta la política «todos los mensajes deben estar cifrados», esa condición ya constituye automáticamente un contrato con el proveedor.

# Respuesta
falso

# Explicación
La política expresa el punto de vista del consumidor. Para convertirse en contrato debe existir un acuerdo entre dos o más participantes.

# Pista
Una decisión unilateral no equivale a un acuerdo.
```

# Enforcement conecta la afirmación con el mundo real

**Policy enforcement** consiste conceptualmente en procurar que la policy assertion sea coherente con la realidad. El mecanismo exacto depende de la naturaleza de la política.

Puede impedir acciones no autorizadas, evitar ciertos estados o iniciar acciones compensatorias cuando se detecta una violación. OASIS subraya que una restricción que no puede hacerse cumplir no es propiamente una policy; se parece más a un deseo.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.1 Service Policy](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```opcion-multiple
# Enunciado
¿Qué diferencia principal establece OASIS entre una policy y un simple deseo?

# Opciones
- Toda policy debe escribirse en XML
- Una policy debe poder estar sujeta a enforcement
- Una policy solo puede ser jurídica
- Un deseo siempre pertenece al proveedor

# Correcta
2

# Explicación
OASIS indica que una restricción imposible de hacer cumplir sería mejor descrita como un deseo que como una política.

# Pista
Piensa en la relación entre la afirmación y el comportamiento real.
```

# Las políticas pueden ser técnicas o de negocio

Las políticas no están limitadas a seguridad. OASIS menciona ámbitos como **security**, **privacy**, **manageability** y **Quality of Service**, pero también políticas de negocio como horarios de atención o condiciones de devolución.

Esto permite utilizar el mismo concepto para restricciones de infraestructura y reglas organizacionales, siempre que se expresen como condiciones aplicables a una entidad controlada por un participante.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.1 Service Policy](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```relacionar
# Enunciado
Relaciona cada ejemplo con el tipo de política que representa principalmente.

# Pares
- Todos los mensajes deben estar cifrados => Política técnica
- El servicio atiende de lunes a viernes => Política de negocio
- Las solicitudes deben respetar un límite de latencia acordado => Política de Quality of Service
- Los datos personales no deben exponerse a terceros => Política de privacidad

# Explicación
El concepto de policy puede cubrir condiciones técnicas, operativas y de negocio.

# Pista
Clasifica por el aspecto principal que restringe cada condición.
```

# Las políticas deben ser comprensibles para sus destinatarios

OASIS recomienda que las policy assertions se expresen de una forma comprensible y procesable para las partes a las que están dirigidas. Dependiendo del propósito, una política puede llegar a interpretarse automáticamente.

Esto no significa que toda policy deba ser machine-readable. Significa que la representación elegida debe ser adecuada para quienes necesitan comprenderla, evaluarla o aplicarla.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.1 Service Policy](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)

```verdadero-falso
# Enunciado
Toda policy en SOA debe ser obligatoriamente interpretada de forma automática por software.

# Respuesta
falso

# Explicación
OASIS permite interpretación automática cuando resulte apropiada, pero no la establece como requisito universal.

# Pista
El formato depende del propósito y de los participantes.
```

# La service description es un punto natural para referenciar policies

Como la service description comunica condiciones relevantes del servicio, OASIS identifica esa descripción como un lugar natural para **referenciar las policies** asociadas.

Esto permite que un consumidor potencial conozca restricciones antes de iniciar una interacción y pueda decidir si sus propias condiciones son compatibles con las del proveedor.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.1 Service Policy](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=22)
> Doc: [OASIS SOA-RM 1.0 — §3.3.1.3 Policies Related to a Service](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=21)

```opcion-multiple
# Enunciado
¿Dónde identifica OASIS un punto natural para publicar o referenciar las políticas asociadas a un servicio?

# Opciones
- En la service description
- En el código fuente privado
- En la memoria del servidor
- En una tabla obligatoria llamada policies

# Correcta
1

# Explicación
La service description es el lugar natural para referenciar condiciones que un posible consumidor necesita conocer.

# Pista
La respuesta debe estar disponible antes de que el consumidor decida utilizar el servicio.
```

# Un contract es un acuerdo entre participantes

Mientras una policy expresa la perspectiva de un participante, un **service contract** representa un acuerdo entre dos o más participantes.

El contrato puede abarcar Quality of Service, interfaces, choreography, acuerdos comerciales y otros aspectos. OASIS aclara que no se refiere necesariamente a un contrato jurídico: el concepto incluye acuerdos técnicos u operativos.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.2 Service Contract](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=23)

```opcion-multiple
# Enunciado
¿Cuál de estos elementos distingue esencialmente a un service contract de una policy?

# Opciones
- El contrato siempre debe ser jurídico
- El contrato representa un acuerdo entre dos o más participantes
- El contrato nunca puede tratar Quality of Service
- El contrato solo puede existir fuera de una interacción

# Correcta
2

# Explicación
La diferencia central es el acuerdo entre múltiples participantes. El contrato no tiene que ser legal y puede abarcar distintos tipos de condiciones.

# Pista
Pregunta cuántas partes deben aceptar la condición.
```

# Un contrato gobierna requisitos y expectativas compartidas

OASIS caracteriza un service contract como una **measurable assertion** que gobierna requisitos y expectativas de dos o más partes.

Esa propiedad medible permite determinar si el acuerdo se está cumpliendo. La idea conecta contratos con observabilidad de condiciones concretas, sin exigir que todo acuerdo se automatice.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.2 Service Contract](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=23)

```verdadero-falso
# Enunciado
Un service contract puede gobernar requisitos y expectativas compartidas mediante condiciones que puedan evaluarse.

# Respuesta
verdadero

# Explicación
OASIS describe el service contract como una measurable assertion que gobierna requisitos y expectativas de múltiples partes.

# Pista
El contrato debe permitir razonar sobre cumplimiento, no solo expresar intención vaga.
```

# Enforcement de contratos puede implicar resolución de disputas

El enforcement de una policy suele recaer en su propietario. En un contrato, sin embargo, pueden aparecer **disputas entre las partes** porque el acuerdo pertenece a más de un participante.

OASIS contempla que la resolución pueda requerir autoridades superiores u otros mecanismos externos a los participantes inmediatos.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.2 Service Contract](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=23)

```relacionar
# Enunciado
Relaciona cada mecanismo con el concepto al que se asocia principalmente.

# Pares
- Enforcement responsabilidad del propietario => Policy
- Resolución de disputas entre varias partes => Contract

# Explicación
La policy tiene un propietario individual; el contract gobierna un acuerdo compartido y puede requerir resolver desacuerdos entre participantes.

# Pista
Distingue cumplimiento unilateral de acuerdo multilateral.
```

# Un contrato puede ser machine-processable o human-readable

La representación adecuada de un contrato depende de su función. Si codifica resultados de una interacción y debe facilitar composición automática, puede ser útil una forma **machine-processable**.

Si documenta acuerdos amplios entre proveedor y consumidor, la prioridad puede ser que resulte **legible para personas**. OASIS no impone una sola representación para todos los contratos.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.2 Service Contract](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=23)

```opcion-multiple
# Enunciado
¿Qué representación recomienda OASIS como única forma válida para todo service contract?

# Opciones
- XML procesable automáticamente
- Texto jurídico firmado
- JSON
- Ninguna; depende del propósito del contrato

# Correcta
4

# Explicación
La forma adecuada depende del uso. Algunos contratos se benefician de procesamiento automático y otros priorizan lectura humana.

# Pista
El Reference Model evita imponer una única tecnología de representación.
```

# Todo contrato presupone una acción de acuerdo

Un contract existe como resultado de algún **agreement action**. Incluso cuando el acuerdo es implícito, lógicamente hay una acción mediante la que las partes aceptan el contrato.

El mecanismo de acuerdo puede ocurrir fuera de SOA, mediante un proceso **out-of-band**, o durante una interacción de servicio, mediante un proceso **in-band**.

> Doc: [OASIS SOA-RM 1.0 — §3.3.2.2 Service Contract](https://docs.oasis-open.org/soa-rm/v1.0/soa-rm.pdf#page=23)

```relacionar
# Enunciado
Relaciona cada forma de llegar a un contrato con su descripción.

# Pares
- Out-of-band => el acuerdo se alcanza mediante un proceso externo a la interacción SOA
- In-band => el acuerdo se alcanza durante la propia interacción de servicio

# Explicación
OASIS reconoce ambas posibilidades. Lo esencial es que exista una acción lógica de acuerdo entre las partes.

# Pista
Pregunta si el acuerdo ocurre fuera o dentro del intercambio de servicio.
```

# Cierre

Una **policy** expresa condiciones desde la perspectiva de un participante y se entiende mediante assertion, owner y enforcement. Un **contract** representa un acuerdo medible entre varias partes y puede requerir mecanismos de resolución de disputas.

Ambos conceptos pueden aparecer referenciados en la service description y ambos influyen en la forma en que una interacción se realiza. La siguiente sesión reúne infraestructura, procesos, policies y agreements en un concepto operacional: el **execution context**.
