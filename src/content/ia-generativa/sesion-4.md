---
numero: 4
titulo: "Conversación, streaming y herramientas"
---


# La conversación

El objeto de chat guarda el historial por su cuenta. Se crea con `client.chats.create()` y a partir de ahí cada mensaje se manda con `send_message()`.

Es la comodidad de no llevar la lista a mano, a cambio de que el historial viva en memoria del proceso: si el proceso muere, la conversación se pierde.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```python !sin-consola
chat = client.chats.create(model="gemini-3.5-flash")

respuesta = chat.send_message("Explica qué es una arritmia")
print(respuesta.text)

respuesta = chat.send_message("Resúmelo en una frase")
print(respuesta.text)
```

```salida
Una arritmia es una alteración del ritmo normal del corazón, que puede latir demasiado rápido, demasiado lento o de forma irregular.
Una arritmia es un ritmo cardiaco anormal.
```

> Nota: El segundo mensaje funciona porque el objeto de chat reenvía todo el historial. Sin él, la petición «Resúmelo» llegaría sin antecedente y el modelo no tendría qué resumir: la memoria la pone el cliente, no el servidor.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

# Consultar el historial

El método `get_history()` devuelve la lista de `Content` que el chat ha acumulado. Es la misma estructura que se construye a mano, lo que confirma que el chat es un envoltorio y no otra cosa.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```python !sin-consola
for mensaje in chat.get_history():
    print(mensaje.role, mensaje.parts[0].text[:30])
```

```salida
user Explica qué es una arritmia
model Una arritmia es una alteració
user Resúmelo en una frase
model Una arritmia es un ritmo cardi
```

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

# La respuesta que llega poco a poco

El método `generate_content_stream()` entrega la respuesta por trozos según el modelo la produce, en lugar de esperar a que termine.

No acelera nada: el total tarda lo mismo. Lo que cambia es que el usuario empieza a leer antes, y eso decide si una interfaz se siente viva o rota.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

```python !sin-consola
for trozo in client.models.generate_content_stream(
    model="gemini-3.5-flash",
    contents="Enumera tres tipos de arritmia",
):
    print(trozo.text, end="")
```

```salida
Fibrilación auricular, taquicardia ventricular y bradicardia sinusal.
```

> Nota: Cada trozo trae su propio atributo text, que puede ser None cuando el fragmento no contiene texto. Concatenar sin comprobarlo produce el error de sumar None a una cadena, que aparece de forma intermitente y por eso resulta difícil de reproducir.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

# Streaming dentro de un chat

El chat tiene su equivalente: `send_message_stream()`. Devuelve los trozos y, al terminar, deja el turno completo en el historial.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```python !sin-consola
chat = client.chats.create(model="gemini-3.5-flash")
for trozo in chat.send_message_stream("Cuenta hasta tres"):
    print(trozo.text, end="")
```

```salida
Uno, dos, tres.
```

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

# Dejar que el modelo llame a una función

El SDK admite pasar funciones de Python como herramientas. El modelo decide si procede llamarlas, el SDK las ejecuta y devuelve el resultado al modelo, que redacta la respuesta final.

La descripción de la función y los tipos de sus parámetros no son adorno: es lo único que el modelo tiene para decidir cuándo usarla.

> Doc: [Llamada a funciones](https://ai.google.dev/gemini-api/docs/function-calling)

```python
def temperatura_actual(ciudad: str) -> str:
    """Devuelve la temperatura actual de una ciudad.

    Args:
        ciudad: Nombre de la ciudad, por ejemplo Lima.
    """
    return "18 grados"

print(temperatura_actual.__doc__.splitlines()[0])
print(temperatura_actual.__annotations__["ciudad"].__name__)
```

```salida
Devuelve la temperatura actual de una ciudad.
str
```

> Nota: El SDK construye la declaración que ve el modelo a partir de la firma y del docstring, así que una descripción vaga se traduce en una herramienta que el modelo emplea cuando no corresponde. El aviso del repositorio anuncia además que en la versión 3 estas llamadas automáticas solo funcionarán desde el módulo de chats.

> Doc: [Llamada a funciones](https://ai.google.dev/gemini-api/docs/function-calling)

```python !sin-consola
response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="¿Qué temperatura hace en Lima?",
    config=types.GenerateContentConfig(tools=[temperatura_actual]),
)
print(response.text)
```

```salida
En Lima hay 18 grados.
```

> Doc: [Llamada a funciones](https://ai.google.dev/gemini-api/docs/function-calling)

```ejercicio
# Enunciado
Completa el atributo que guarda la documentación de una función y que el SDK usa para describirla al modelo.

# Plantilla
def f(x: str) -> str:
    """Hace algo."""
    return x
print(f.___.strip())

# Esperado
Hace algo.

# Pista
Va entre dobles guiones bajos a cada lado: la abreviatura inglesa de documento.
```

# Los errores que hay que esperar

El SDK lanza excepciones propias. `ClientError` cubre los errores del lado de quien llama, con código 4xx: clave inválida, petición mal formada, cuota agotada. `ServerError` cubre los 5xx del lado de Google.

La diferencia importa para decidir qué hacer: un 4xx casi nunca mejora al reintentar, un 5xx suele hacerlo.

> Doc: [Documentación del SDK](https://googleapis.github.io/python-genai/)

```python
from google.genai import errors

print(issubclass(errors.ClientError, errors.APIError))
print(issubclass(errors.ServerError, errors.APIError))
```

```salida
True
True
```

> Nota: El caso 429, que es cuota agotada, es un 4xx que sí conviene reintentar, pero esperando: reintentar de inmediato lo empeora. La pauta habitual es esperar cada vez más entre intentos y rendirse tras unos pocos.

> Doc: [Documentación del SDK](https://googleapis.github.io/python-genai/)

```ejercicio
# Enunciado
Completa la excepción del SDK que corresponde a los errores 4xx de quien llama.

# Plantilla
from google.genai import errors
print(issubclass(errors.___, errors.APIError))

# Esperado
True

# Pista
Dos palabras juntas en mayúsculas iniciales: cliente y error, en inglés.
```

# Antes de ponerlo delante de usuarios

Tres cosas que no son opcionales.

La clave vive en el servidor. Una aplicación web llama a su propio servidor y este llama a Google; la clave nunca llega al navegador.

La respuesta se comprueba antes de usarse. El atributo `text` puede ser `None`, y un JSON puede no cumplir el esquema aunque se haya pedido.

Lo que el modelo afirma no es un hecho. En cualquier asunto con consecuencias —salud, dinero, derechos— la respuesta se contrasta o se acompaña de la fuente.

> Doc: [Gemini API](https://ai.google.dev/gemini-api/docs)

> Doc: [Obtener una clave de API](https://ai.google.dev/gemini-api/docs/api-key)

# Cierre

El recorrido está hecho: cliente, configuración, contenidos, salida estructurada, conversación, streaming y herramientas.

El paso siguiente natural es la entrada multimodal, subiendo archivos con `client.files`, y el almacenamiento en caché de contextos largos con `client.caches`, que abarata repetir el mismo material en muchas peticiones.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

> Doc: [Documentación del SDK](https://googleapis.github.io/python-genai/)
