import type { ArticuloBlog } from "@/lib/blog-types";

const contenido = `
<p class="lead"><strong>¿Y si la mejor IA para automatizar una decisión no pudiera escribir una sola frase?</strong> Esa es la apuesta detrás de Jev, el primer modelo “System One” de TypeSafe AI. En vez de pedirle que redacte una respuesta y después obligar a nuestro software a interpretarla, Jev recibe un estado, evalúa preguntas tipadas y devuelve decisiones que el código puede usar directamente.</p>

<aside>
  <p><strong>En 30 segundos:</strong> Jev no compite con un chatbot en conversación, redacción o razonamiento abierto. Su terreno es otro: clasificación, routing, scoring y decisiones binarias dentro de software. La arquitectura que propone es híbrida: un LLM genera cuando hace falta lenguaje; Jev decide cuando hace falta juicio; el código ejecuta reglas exactas.</p>
</aside>

<nav aria-label="Índice del artículo">
  <p><strong>Ruta de lectura</strong></p>
  <ol>
    <li><a href="#problema">El problema que intenta resolver</a></li>
    <li><a href="#modelo-mental">El modelo mental correcto</a></li>
    <li><a href="#primitivas">Choice, Score y Noul</a></li>
    <li><a href="#ejemplo">Un ejemplo completo</a></li>
    <li><a href="#confianza">Probabilidad, confianza y errores</a></li>
    <li><a href="#velocidad-coste">Velocidad y coste, con contexto</a></li>
    <li><a href="#cuando-usarlo">Cuándo usarlo y cuándo no</a></li>
    <li><a href="#arquitectura">Cómo encaja en una arquitectura real</a></li>
  </ol>
</nav>

<h2 id="problema">1. El problema no es que los LLM escriban mal. Es que escriben demasiado</h2>

<p>Los grandes modelos de lenguaje fueron optimizados para producir secuencias de texto. Eso es exactamente lo que queremos cuando pedimos una explicación, un correo, código o una conversación. Pero el mismo mecanismo resulta menos natural cuando una aplicación solo necesita responder algo como: “¿a qué equipo envío este ticket?”, “¿qué documento es más relevante?” o “¿este mensaje contiene información personal?”.</p>

<p>Una implementación habitual obliga al LLM a devolver JSON. Después valida el esquema, corrige respuestas inválidas, decide qué hacer cuando faltan campos y, finalmente, convierte ese texto en una rama de programa. Es posible hacerlo bien, pero seguimos usando un generador de strings para obtener algo que nuestro software quería desde el inicio: una decisión estructurada.</p>

<p>TypeSafe AI presentó Jev el 15 de septiembre de 2026 con una tesis distinta: para muchas decisiones dentro de software no hace falta generar lenguaje. Hace falta evaluar un estado y devolver una respuesta dentro de un conjunto definido. La documentación oficial describe a Jev como su primer <em>System One model</em>, orientado a juicios rápidos y acotados que el código pueda consumir sin una fase de parsing.</p>

<p>Ese matiz cambia bastante el diseño. El modelo deja de ser “el programa que responde” y pasa a ser una función probabilística dentro del programa.</p>

<h2 id="modelo-mental">2. El modelo mental: LLM escribe, Jev decide, código actúa</h2>

<p>La forma más útil de pensar en Jev no es “otro modelo más”. Es una división de responsabilidades:</p>

<ul>
  <li><strong>LLM:</strong> genera lenguaje, sintetiza información, propone planes y realiza tareas abiertas.</li>
  <li><strong>Jev:</strong> clasifica, selecciona, puntúa o estima la probabilidad de una condición.</li>
  <li><strong>Código:</strong> aplica reglas deterministas, permisos, cálculos y efectos sobre el sistema.</li>
</ul>

<p>Supongamos que una plataforma recibe un mensaje de soporte. Un LLM podría redactar una respuesta amable. Jev podría decidir el área responsable, estimar la urgencia y puntuar la frustración. El código podría comprobar si el usuario tiene un plan empresarial, abrir el ticket en la cola correcta y exigir revisión humana si el riesgo supera un umbral.</p>

<p>La separación es importante porque cada componente hace el trabajo para el que tiene una interfaz más adecuada. No necesitas pedirle a un modelo generativo que “por favor devuelva exactamente uno de estos tres valores” si puedes utilizar una primitiva cuyo resultado ya está restringido a esos tres valores.</p>

<h2 id="primitivas">3. Tres primitivas: Choice, Score y Noul</h2>

<p>Jev expone tres tipos de pregunta. La documentación de TypeSafe insiste en que cada pregunta debe representar un juicio atómico: una sola cosa, bien delimitada, que una persona con contexto podría evaluar rápidamente.</p>

<h3>Choice: elegir entre opciones conocidas</h3>

<p><code>Choice</code> sirve cuando el resultado pertenece a un conjunto cerrado y sin orden natural. Por ejemplo: soporte, ventas o facturación. Devuelve la opción elegida, la distribución de probabilidad entre las opciones y una medida de confianza.</p>

<p>No es equivalente a pedir “clasifica esto y responde solo con una palabra”. En Jev, las opciones forman parte del contrato de la pregunta.</p>

<h3>Score: ubicar algo en una escala</h3>

<p><code>Score</code> representa una dimensión ordenada. Puede describir niveles como “sin impacto”, “impacto menor”, “impacto alto” y “bloqueante”. El resultado es una posición sobre esa escala junto con probabilidades y confianza.</p>

<p>Esto evita un error conceptual frecuente: usar una pregunta binaria para algo que en realidad tiene grados. “¿El candidato sabe Python?” puede ser un sí/no si la condición está definida con precisión. “¿Qué nivel de Python tiene?” es un problema de escala y encaja mejor en <code>Score</code>.</p>

<h3>Noul: probabilidad de un sí o un no</h3>

<p><code>Noul</code> responde una condición binaria con un valor entre 0 y 1. Cerca de 1 significa que el modelo considera muy probable el “sí”; cerca de 0, el “no”; cerca de 0.5, incertidumbre. A diferencia de Choice y Score, Noul no necesita un campo separado de confianza: la propia probabilidad es la señal.</p>

<p>Un Noul de 0.5 no significa “nivel medio”. Significa que el modelo está aproximadamente dividido entre sí y no. Esa distinción parece pequeña hasta que empiezas a conectar la salida con decisiones automáticas.</p>

<h2 id="ejemplo">4. Un ticket, tres preguntas y cero texto generado</h2>

<p>Imagina que entra este estado:</p>

<pre><code>{
  "cliente": "plan_empresa",
  "mensaje": "Llevamos 40 minutos sin poder cobrar. El checkout falla para todos los clientes."
}</code></pre>

<p>En lugar de pedir una respuesta abierta, podríamos formular tres preguntas independientes:</p>

<pre><code>{
  "state": {
    "cliente": "plan_empresa",
    "mensaje": "Llevamos 40 minutos sin poder cobrar. El checkout falla para todos los clientes."
  },
  "questions": {
    "area": {
      "type": "choice",
      "instructions": "¿Qué equipo debe atender primero este incidente?",
      "criteria": {
        "soporte": "Problemas generales de uso",
        "pagos": "Errores relacionados con cobros o checkout",
        "cuentas": "Acceso, identidad o suscripción"
      }
    },
    "severidad": {
      "type": "score",
      "instructions": "Puntúa el impacto operativo del incidente.",
      "criteria": [
        "Sin impacto operativo",
        "Impacto menor con alternativa disponible",
        "Impacto alto en una función principal",
        "Función crítica bloqueada sin alternativa"
      ]
    },
    "afecta_ingresos": {
      "type": "noul",
      "instructions": "¿El incidente impide completar transacciones de clientes?"
    }
  }
}</code></pre>

<p>La aplicación no necesita que Jev explique por qué escogió pagos. Necesita valores que pueda usar:</p>

<pre><code>if area == "pagos" and severidad &gt;= 2.5 and afecta_ingresos &gt; 0.85:
    crear_incidente_prioridad_alta()
else:
    enrutar_a_cola_normal()</code></pre>

<p>La parte importante no es la sintaxis exacta del ejemplo, sino la arquitectura: las preguntas producen señales independientes y el código define cómo combinarlas. Si mañana cambia la política de prioridad, modificas el umbral o la regla. No hace falta reescribir una instrucción enorme esperando que el modelo interprete la nueva política como esperabas.</p>

<h2 id="confianza">5. Probabilidad y confianza no eliminan los errores</h2>

<p>Aquí aparece una de las ideas más interesantes de Jev y también una de las que más fácilmente se puede malinterpretar.</p>

<p>TypeSafe afirma que Jev no produce errores de tipo porque sus salidas están restringidas al esquema definido. Eso significa que un Choice no debería inventar una cuarta categoría y un Noul no debería devolver un párrafo. Pero <strong>una salida válida puede seguir siendo una decisión incorrecta</strong>.</p>

<p>Si el modelo asigna 0.91 a “pagos”, ese 0.91 no convierte automáticamente la clasificación en verdad. La utilidad práctica está en que el sistema recibe una señal de incertidumbre que puede incorporar a su política:</p>

<ul>
  <li>alta confianza: automatizar;</li>
  <li>zona intermedia: solicitar revisión;</li>
  <li>baja confianza: usar otro modelo, pedir más contexto o abstenerse.</li>
</ul>

<p>La documentación oficial recomienda diseñar alrededor de esa incertidumbre. En otras palabras, la pregunta deja de ser “¿el modelo acierta siempre?” y pasa a ser “¿qué hace mi sistema cuando el modelo no está suficientemente seguro?”. Esa es una pregunta de ingeniería mucho más útil.</p>

<details>
  <summary><strong>Entonces, ¿Jev “no alucina”?</strong></summary>
  <p>TypeSafe utiliza esa expresión en su lanzamiento para destacar que Jev no genera strings arbitrarios y que el esquema de salida está restringido. Conviene separar dos conceptos: <strong>validez estructural</strong> y <strong>corrección semántica</strong>. Jev puede estar obligado a devolver una opción válida y aun así elegir la opción equivocada. En producción, debes medir precisión, calibración y coste de los errores sobre tu propio dominio.</p>
</details>

<h2 id="velocidad-coste">6. 70–500 ms y US$0.042 por millón de tokens: números atractivos, pero son claims del proveedor</h2>

<p>En su lanzamiento, TypeSafe publicó un rango de latencia de 70 a 500 milisegundos para Jev y un precio de US$0.042 por millón de tokens de entrada, con salida sin coste medido por token. La empresa también muestra comparaciones donde Jev resulta decenas o cientos de veces más rápido o económico que modelos generativos en tareas diseñadas como flujos de decisión.</p>

<p>Esos números explican por qué Jev llama la atención: si un agente realiza cientos de decisiones internas, el coste y la latencia acumulada importan más que en una conversación ocasional.</p>

<p>Pero el propio anuncio de TypeSafe incluye matices que vale la pena conservar. Sus latencias publicadas se midieron principalmente desde la costa oeste de Estados Unidos; sus evaluaciones de workflows fueron construidas por su propio equipo; y la compañía reconoce que todavía no puede demostrar la sostenibilidad de su precio a largo plazo.</p>

<p>Por tanto, el dato útil no es “Jev es 200 veces mejor”. El dato útil es: <strong>existe una arquitectura que intenta hacer mucho más baratas las decisiones estructuradas, y ahora se puede medir si esa arquitectura mejora tu workload concreto</strong>.</p>

<h2 id="cuando-usarlo">7. Dónde encaja bien y dónde no</h2>

<p>Jev tiene sentido cuando puedes describir el resultado como una decisión acotada. Algunos patrones naturales son:</p>

<ul>
  <li>routing de tickets, herramientas, modelos o agentes;</li>
  <li>clasificación de documentos, mensajes o eventos;</li>
  <li>scoring de relevancia, riesgo, severidad o calidad;</li>
  <li>guardrails y comprobaciones binarias;</li>
  <li>ranking de alternativas conocidas;</li>
  <li>gates antes de ejecutar una acción costosa.</li>
</ul>

<p>En cambio, no es la herramienta adecuada para redactar un correo, explicar una teoría, escribir una función compleja, mantener una conversación o realizar un plan abierto de varios pasos. Para esas tareas necesitas generación de lenguaje y, con frecuencia, razonamiento deliberado.</p>

<p>Esta frontera es saludable. Durante años hemos tratado de construir aplicaciones enteras alrededor de un único modelo generalista. Jev propone volver a una arquitectura más parecida al software tradicional: varias piezas especializadas conectadas por contratos explícitos.</p>

<h2 id="arquitectura">8. Un agente híbrido puede ser más interesante que un “agente que hace todo”</h2>

<p>Considera un agente que procesa solicitudes de clientes:</p>

<ol>
  <li>El código valida autenticación, permisos y límites.</li>
  <li>Jev clasifica intención, urgencia y riesgo.</li>
  <li>El código decide qué herramienta está permitida para esa combinación.</li>
  <li>Un LLM redacta la respuesta o genera el contenido necesario.</li>
  <li>Jev puede evaluar una condición final, como si el texto incluye información sensible.</li>
  <li>El código ejecuta la acción, registra el resultado y escala los casos dudosos.</li>
</ol>

<p>La ganancia conceptual es que el LLM deja de controlar implícitamente todo el flujo. El modelo generativo se utiliza donde la generación aporta valor; las decisiones se representan como señales; y los efectos reales siguen gobernados por código.</p>

<p>Eso también hace que la observabilidad sea más clara. Puedes medir la precisión de cada pregunta, inspeccionar distribuciones de probabilidad, ajustar umbrales y comparar variantes sin convertir cada cambio en una nueva versión de un prompt monolítico.</p>

<h2 id="que-cambia">9. Lo que cambia para un ingeniero de software o ML</h2>

<p>Si esta categoría de modelos funciona bien en producción, el trabajo no desaparece: se desplaza.</p>

<p>El reto ya no es únicamente escribir prompts. Hay que diseñar estados informativos, formular preguntas atómicas, elegir la primitiva correcta, calibrar umbrales, medir errores por clase y decidir qué ocurre cuando la probabilidad cae en una zona ambigua. En términos de ingeniería, eso se parece menos a “hablar con un chatbot” y más a diseñar una API probabilística.</p>

<p>También cambia la evaluación. Un demo convincente no basta. Para un caso real necesitas un conjunto de ejemplos propios, una métrica que refleje el coste de falsos positivos y falsos negativos, pruebas de latencia desde tu región, estimaciones de coste con tu volumen y una ruta segura para los casos inciertos.</p>

<p>La promesa más interesante de Jev no es que reemplace a GPT, Claude o Gemini. Es que quizá muchas llamadas que hoy hacemos a esos modelos nunca necesitaron generación abierta.</p>

<h2 id="conclusion">10. La pregunta correcta no es “¿Jev reemplaza a los LLM?”</h2>

<p>La pregunta útil es otra: <strong>¿cuántas decisiones dentro de tu sistema están usando un generador de texto solo porque hasta ahora era la interfaz de inteligencia disponible?</strong></p>

<p>Jev convierte esa pregunta en una arquitectura concreta. Estado entra. Preguntas tipadas entran. Decisiones probabilísticas salen. El código decide qué hacer con ellas.</p>

<p>Es demasiado pronto para saber cuánto de esta propuesta se convertirá en estándar. Jev está en una etapa inicial y gran parte de sus benchmarks disponibles procede del propio proveedor. Pero la separación entre generación y decisión merece atención incluso si nunca utilizas este modelo: obliga a pensar con más precisión qué parte de un sistema necesita lenguaje, qué parte necesita juicio y qué parte debería seguir siendo código determinista.</p>

<aside>
  <p><strong>Idea para llevarte:</strong> si una tarea termina en “elige, puntúa o responde sí/no”, quizá no necesitas que un modelo escriba primero una explicación para llegar hasta allí.</p>
</aside>

<h2 id="fuentes">Fuentes y lectura adicional</h2>

<ul>
  <li><a href="https://docs.typesafe.ai/introduction" target="_blank" rel="noopener noreferrer">TypeSafe AI Docs — Introduction</a></li>
  <li><a href="https://docs.typesafe.ai/primitives" target="_blank" rel="noopener noreferrer">TypeSafe AI Docs — Primitives: Choice, Score y Noul</a></li>
  <li><a href="https://docs.typesafe.ai/confidence" target="_blank" rel="noopener noreferrer">TypeSafe AI Docs — Confidence</a></li>
  <li><a href="https://typesafe.ai/blog/introducing-system-one-models-and-jev" target="_blank" rel="noopener noreferrer">TypeSafe AI — Introducing System One Models &amp; Jev, 15 de septiembre de 2026</a></li>
</ul>

<p><em>Artículo revisado el 24 de septiembre de 2026. Las cifras de precio, latencia y rendimiento pueden cambiar; verifica la documentación oficial antes de diseñar un presupuesto o una arquitectura de producción.</em></p>
`;

const palabras = contenido
  .replace(/<[^>]+>/g, " ")
  .replace(/&[a-z]+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim()
  .split(/\s+/).length;

export const articuloJev: ArticuloBlog = {
  guid: "eduqa-local-jev-typesafe-ai-2026-09-24",
  slug: "jev-typesafe-ai",
  titulo: "Jev no quiere ser otro chatbot: la IA que devuelve decisiones en lugar de texto",
  resumen:
    "Jev, de TypeSafe AI, propone separar generación y decisión: Choice, Score y Noul producen salidas tipadas para que el código actúe sobre probabilidades, no sobre texto libre.",
  contenido,
  caratula: null,
  portada: null,
  fecha: "24 de septiembre de 2026",
  fechaIso: "2026-09-24T19:00:00.000Z",
  autor: "EDUQA.PE",
  enlaceMedium: null,
  categorias: ["Inteligencia artificial", "Ingeniería de software", "Agentes"],
  minutosLectura: Math.max(1, Math.round(palabras / 180)),
};
