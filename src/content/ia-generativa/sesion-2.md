---
numero: 2
titulo: "Controlar lo que responde"
---


# La configuración

El parámetro `config` de `generate_content()` recibe un objeto `GenerateContentConfig`, que reúne todo lo que modifica el comportamiento del modelo.

Cada campo tiene un valor por defecto que depende del modelo. Lo que no se indica, se queda como venga.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

```python
from google.genai import types

config = types.GenerateContentConfig(temperature=0.2)
print(config.temperature)
```

```salida
0.2
```

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

```ejercicio
# Enunciado
Completa la clase que reúne las opciones de una llamada de generación.

# Plantilla
from google.genai import types
cfg = types.___(temperature=0.2)
print(cfg.temperature)

# Esperado
0.2

# Pista
Tres palabras juntas en mayúsculas iniciales: generar, contenido y configuración.
```

# La instrucción de sistema

El campo `system_instruction` fija el papel del modelo para toda la conversación. No es un mensaje más: va aparte y pesa más que lo que escriba el usuario después.

Es donde se dice en qué idioma responder, con qué tono y qué no hacer.

> Doc: [Instrucciones de sistema](https://ai.google.dev/gemini-api/docs/text-generation#system-instructions)

```python
config = types.GenerateContentConfig(
    system_instruction="Responde en español, en una sola frase, sin adornos.",
)
print(config.system_instruction)
```

```salida
Responde en español, en una sola frase, sin adornos.
```

> Nota: La instrucción de sistema no es una barrera de seguridad. Reduce mucho la probabilidad de que el modelo se salga del papel, pero un usuario decidido puede empujarlo a ignorarla. Lo que no debe ocurrir se controla en el código que recibe la respuesta, no solo en la instrucción.

> Doc: [Instrucciones de sistema](https://ai.google.dev/gemini-api/docs/text-generation#system-instructions)

```ejercicio
# Enunciado
Completa el campo que fija el papel del modelo para toda la conversación.

# Plantilla
cfg = types.GenerateContentConfig(___="Responde en español")
print(cfg.system_instruction)

# Esperado
Responde en español

# Pista
Dos palabras separadas por guion bajo: sistema e instrucción, en inglés.
```

# La temperatura

El campo `temperature` regula cuánto varía la respuesta. Con valores cercanos a cero el modelo elige casi siempre la continuación más probable; con valores altos se permite alternativas.

Para extraer datos de un texto interesa cero. Para escribir variantes de un titular, no.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

```python
config = types.GenerateContentConfig(temperature=0.0)
print(config.temperature)
```

```salida
0.0
```

> Nota: Temperatura cero reduce la variación, pero no la elimina del todo: el reparto entre servidores y los cambios de versión del modelo pueden dar respuestas distintas a la misma petición. Cuando un proceso exige repetibilidad exacta, hay que guardar la respuesta, no volver a pedirla.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

```ejercicio
# Enunciado
Completa el valor que hace la respuesta lo más determinista posible.

# Plantilla
cfg = types.GenerateContentConfig(temperature=___)
print(cfg.temperature)

# Esperado
0.0

# Pista
Es el extremo inferior del rango, escrito como decimal.
```

# El límite de la respuesta

El campo `max_output_tokens` corta la respuesta al llegar a esa cantidad de tokens. Sirve para acotar el coste y el tiempo.

Cortar no es resumir: la respuesta se interrumpe donde toque, aunque sea a mitad de una frase. Si se quiere corta y completa, hay que pedirlo en la instrucción.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

```python
config = types.GenerateContentConfig(max_output_tokens=120)
print(config.max_output_tokens)
```

```salida
120
```

> Nota: Cuando la respuesta se corta por este límite, el candidato llega con finish_reason igual a MAX_TOKENS en lugar de STOP. Comprobar ese campo es la forma de distinguir una respuesta completa de una truncada, que a simple vista pueden parecer iguales.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

```ejercicio
# Enunciado
Completa el campo que corta la respuesta al llegar a una cantidad de tokens.

# Plantilla
cfg = types.GenerateContentConfig(___=120)
print(cfg.max_output_tokens)

# Esperado
120

# Pista
Tres palabras separadas por guion bajo: máximo, salida y tokens, en inglés.
```

# Acotar entre qué palabras elige

Los campos `top_p` y `top_k` limitan el conjunto de continuaciones posibles antes de que la temperatura elija entre ellas.

El primero se queda con las opciones más probables hasta acumular esa proporción. El segundo se queda con esa cantidad de opciones, sin mirar la probabilidad acumulada.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

```python
config = types.GenerateContentConfig(top_p=0.95, top_k=20)
print(config.top_p, config.top_k)
```

```salida
0.95 20.0
```

> Nota: El valor de top_k aparece como 20.0 y no como 20 porque el SDK declara ese campo en coma flotante, aunque conceptualmente sea un recuento. Los tres parámetros actúan sobre lo mismo, así que tocarlos a la vez hace difícil saber cuál cambió el resultado: la recomendación práctica es mover solo la temperatura.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

```ejercicio
# Enunciado
Completa el campo que se queda con una cantidad fija de continuaciones posibles.

# Plantilla
cfg = types.GenerateContentConfig(top_p=0.95, ___=20)
print(cfg.top_k)

# Esperado
20.0

# Pista
Cinco caracteres: la palabra top, un guion bajo y la letra que sigue a la p en el abecedario menos una.
```

# Los ajustes de seguridad

El campo `safety_settings` fija a partir de qué punto la API bloquea una respuesta por su contenido. Cada ajuste combina una categoría con un umbral.

Bajar el umbral no desactiva nada: los límites del propio modelo siguen ahí. Lo que cambia es el filtro que la API aplica encima.

> Doc: [Ajustes de seguridad](https://ai.google.dev/gemini-api/docs/safety-settings)

```python
ajuste = types.SafetySetting(
    category="HARM_CATEGORY_HATE_SPEECH",
    threshold="BLOCK_ONLY_HIGH",
)
print(ajuste.category)
print(ajuste.threshold)
```

```salida
HarmCategory.HARM_CATEGORY_HATE_SPEECH
HarmBlockThreshold.BLOCK_ONLY_HIGH
```

> Nota: Las cadenas se convierten a enumeraciones al construir el objeto, que es la razón de que al imprimirlas aparezca el nombre de la clase delante. Un valor mal escrito falla aquí, al construir, y no más tarde en la llamada.

> Doc: [Ajustes de seguridad](https://ai.google.dev/gemini-api/docs/safety-settings)

```ejercicio
# Enunciado
Completa la clase que combina una categoría de daño con su umbral de bloqueo.

# Plantilla
a = types.___(category="HARM_CATEGORY_HATE_SPEECH", threshold="BLOCK_ONLY_HIGH")
print(a.threshold)

# Esperado
HarmBlockThreshold.BLOCK_ONLY_HIGH

# Pista
Dos palabras juntas en mayúsculas iniciales: seguridad y ajuste, en inglés y en singular.
```

# La configuración como diccionario

Todos los métodos aceptan un diccionario en lugar del objeto. Es cómodo cuando la configuración viene de un archivo, porque no hay que convertirla.

A cambio se pierde la comprobación: una clave mal escrita en un diccionario puede pasar sin que nadie avise.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```python
config = types.GenerateContentConfig(**{"temperature": 0.4, "top_p": 0.9})
print(config.model_dump(exclude_none=True))
```

```salida
{'temperature': 0.4, 'top_p': 0.9}
```

> Nota: Las clases de types son modelos de Pydantic, así que traen model_dump() para convertirlas a diccionario y model_validate() para el camino inverso. El parámetro exclude_none deja fuera los campos sin valor, que de otro modo llenarían la salida de None.

> Doc: [Pydantic](https://docs.pydantic.dev/latest/)

```ejercicio
# Enunciado
Completa el método de Pydantic que convierte la configuración en un diccionario.

# Plantilla
cfg = types.GenerateContentConfig(temperature=0.4)
print(cfg.___(exclude_none=True))

# Esperado
{'temperature': 0.4}

# Pista
Dos palabras separadas por guion bajo: modelo y volcar, en inglés.
```

# El presupuesto de razonamiento

Los modelos recientes pueden dedicar tokens a razonar antes de responder. Ese gasto se factura y se controla con `ThinkingConfig`.

Poner el presupuesto a cero desactiva el razonamiento, que es lo apropiado en tareas mecánicas donde solo añade coste y demora.

> Doc: [Razonamiento](https://ai.google.dev/gemini-api/docs/thinking)

```python
pensamiento = types.ThinkingConfig(thinking_budget=0)
print(pensamiento.thinking_budget)
```

```salida
0
```

> Nota: No todos los modelos admiten desactivarlo, y en los que lo admiten el efecto sobre la calidad depende de la tarea. Conviene medirlo con casos propios antes de fijarlo: en un problema que requiere varios pasos, quitar el razonamiento puede salir más caro en reintentos de lo que ahorra en tokens.

> Doc: [Razonamiento](https://ai.google.dev/gemini-api/docs/thinking)

```ejercicio
# Enunciado
Completa la clase que controla cuántos tokens dedica el modelo a razonar.

# Plantilla
p = types.___(thinking_budget=0)
print(p.thinking_budget)

# Esperado
0

# Pista
Dos palabras juntas en mayúsculas iniciales: pensar y configuración, en inglés.
```

# Todo junto

Así queda una llamada con la configuración completa. Este bloque no se ejecuta aquí porque llama al modelo.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

```python !sin-consola
response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="Resume qué hace un desfibrilador",
    config=types.GenerateContentConfig(
        system_instruction="Responde en español, en una sola frase.",
        temperature=0.0,
        max_output_tokens=120,
    ),
)
print(response.text)
```

```salida
Un desfibrilador aplica una descarga eléctrica controlada al corazón para restablecer un ritmo normal.
```

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

# Cierre

Con la configuración ya se puede fijar el papel del modelo, acotar cuánto varía y limitar su coste.

La sesión siguiente entra en el otro extremo de la llamada: cómo se construye lo que se le manda y cómo se pide que la respuesta venga en un formato aprovechable por un programa.
