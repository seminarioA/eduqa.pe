---
numero: 3
titulo: "Contenidos y salida estructurada"
---


# Qué es realmente contents

El parámetro `contents` admite una cadena, y por eso las primeras llamadas parecen sencillas. Por dentro el SDK la convierte siempre a una lista de objetos `Content`.

Conocer esa forma canónica es lo que permite después mandar una imagen, o varios turnos de conversación, o una mezcla de ambos.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

# Part: la unidad mínima

Un `Part` es un trozo de contenido. El método `from_text()` construye uno de texto.

Existen otros constructores para los demás tipos: `from_bytes()` para datos en memoria y `from_uri()` para un archivo ya subido.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```python
from google.genai import types

parte = types.Part.from_text(text="Explica qué es un token")
print(parte.text)
```

```salida
Explica qué es un token
```

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```ejercicio
# Enunciado
Completa el constructor que crea una parte a partir de una cadena.

# Plantilla
p = types.Part.___(text="Hola")
print(p.text)

# Esperado
Hola

# Pista
Dos palabras separadas por guion bajo: desde y texto, en inglés.
```

# Content: quién dice qué

Un `Content` agrupa varias partes y les pone un autor, que es el campo `role`. Los dos valores que se usan son `user`, para lo que escribe la persona, y `model`, para lo que respondió el modelo.

El historial de una conversación es exactamente una lista de estos objetos, alternando los dos papeles.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```python
mensaje = types.Content(
    role="user",
    parts=[types.Part.from_text(text="Explica qué es un token")],
)
print(mensaje.role, len(mensaje.parts))
```

```salida
user 1
```

> Nota: El papel del modelo se llama model en la API de Gemini, no assistant, que es el nombre que usan otros proveedores. Es una de las diferencias que rompen el código al portarlo de un SDK a otro.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```ejercicio
# Enunciado
Completa el papel que corresponde a lo que escribe la persona.

# Plantilla
m = types.Content(role="___", parts=[types.Part.from_text(text="Hola")])
print(m.role)

# Esperado
user

# Pista
Cuatro letras: la palabra inglesa para usuario.
```

# Varias partes en un mismo mensaje

Un mensaje puede llevar más de una parte. Así es como se manda una imagen con su pregunta: una parte con el texto y otra con la imagen.

Las partes van en orden, y el orden importa: el modelo las lee como si fueran un solo bloque.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```python
mensaje = types.Content(
    role="user",
    parts=[
        types.Part.from_text(text="¿Qué se ve aquí?"),
        types.Part.from_text(text="[aquí iría la imagen]"),
    ],
)
print(len(mensaje.parts))
print([p.text for p in mensaje.parts])
```

```salida
2
['¿Qué se ve aquí?', '[aquí iría la imagen]']
```

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```ejercicio
# Enunciado
Completa el campo que contiene la lista de partes de un mensaje.

# Plantilla
m = types.Content(role="user", ___=[types.Part.from_text(text="a"), types.Part.from_text(text="b")])
print(len(m.parts))

# Esperado
2

# Pista
Cinco letras: el plural inglés de parte.
```

# Construir un historial a mano

Pasar una lista de `Content` es la forma de dar contexto sin usar el objeto de chat. Sirve cuando la conversación se guarda en una base de datos y se reconstruye en cada petición, que es lo normal en una aplicación web.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```python
historial = [
    types.Content(role="user", parts=[types.Part.from_text(text="Hola")]),
    types.Content(role="model", parts=[types.Part.from_text(text="Hola, ¿en qué ayudo?")]),
    types.Content(role="user", parts=[types.Part.from_text(text="Repite lo que dije")]),
]
print(len(historial))
print([m.role for m in historial])
```

```salida
3
['user', 'model', 'user']
```

> Nota: Todo el historial viaja en cada petición y se factura entero cada vez, porque la API no guarda estado entre llamadas. En una conversación larga eso crece rápido: recortar los turnos antiguos, o resumirlos, es una decisión de coste además de una de calidad.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```ejercicio
# Enunciado
Completa el papel con el que se marca lo que respondió el modelo.

# Plantilla
h = [types.Content(role="user", parts=[types.Part.from_text(text="Hola")]),
     types.Content(role="___", parts=[types.Part.from_text(text="Hola")])]
print([m.role for m in h])

# Esperado
['user', 'model']

# Pista
Cinco letras. No es assistant: la API de Gemini usa otra palabra.
```

# Pedir la respuesta en JSON

Un programa no puede fiarse de un texto libre. Los campos `response_mime_type` y `response_json_schema` obligan al modelo a devolver un JSON con la forma indicada.

Esto es lo que convierte un modelo generativo en algo integrable: la respuesta deja de ser prosa y pasa a ser un dato.

> Doc: [Salida estructurada](https://ai.google.dev/gemini-api/docs/structured-output)

```python
esquema = {
    "type": "object",
    "properties": {
        "nombre": {"type": "string"},
        "minutos": {"type": "integer"},
    },
    "required": ["nombre", "minutos"],
}
config = types.GenerateContentConfig(
    response_mime_type="application/json",
    response_json_schema=esquema,
)
print(config.response_mime_type)
print(sorted(config.response_json_schema["properties"]))
```

```salida
application/json
['minutos', 'nombre']
```

> Nota: La documentación advierte de que no hay que repetir el esquema dentro del texto de la petición, ni dar ejemplos del JSON esperado: al hacerlo, la calidad de la respuesta empeora. El esquema va en la configuración y nada más.

> Doc: [Salida estructurada](https://ai.google.dev/gemini-api/docs/structured-output)

```ejercicio
# Enunciado
Completa el tipo de medio que se pide para recibir un JSON.

# Plantilla
cfg = types.GenerateContentConfig(response_mime_type="___")
print(cfg.response_mime_type)

# Esperado
application/json

# Pista
Dos partes separadas por una barra: aplicación y el nombre del formato.
```

# El esquema desde una clase

Escribir el esquema a mano es tedioso y se desincroniza del código que luego lee la respuesta. Con Pydantic se declara una clase y el esquema se genera de ella.

Así hay una sola definición: la que valida la respuesta y la que se le pide al modelo.

> Doc: [Pydantic](https://docs.pydantic.dev/latest/)

> Doc: [Salida estructurada](https://ai.google.dev/gemini-api/docs/structured-output)

```python
from pydantic import BaseModel

class Receta(BaseModel):
    nombre: str
    minutos: int

print(sorted(Receta.model_json_schema()["properties"]))
print(Receta.model_json_schema()["required"])
```

```salida
['minutos', 'nombre']
['nombre', 'minutos']
```

> Doc: [Pydantic](https://docs.pydantic.dev/latest/)

```ejercicio
# Enunciado
Completa el método de Pydantic que genera el esquema JSON de una clase.

# Plantilla
from pydantic import BaseModel
class Receta(BaseModel):
    nombre: str
print(sorted(Receta.___()["properties"]))

# Esperado
['nombre']

# Pista
Tres palabras separadas por guion bajo: modelo, json y esquema, en inglés.
```

# Validar lo que llegó

El modelo devuelve el JSON como texto. Convertirlo a la clase de Pydantic hace dos cosas a la vez: comprueba que los campos están y con el tipo correcto, y entrega un objeto con atributos en lugar de un diccionario.

Si el modelo se saltó el formato, el fallo aparece aquí y no tres capas más abajo.

> Doc: [Pydantic](https://docs.pydantic.dev/latest/)

```python
texto_recibido = '{"nombre": "Ceviche", "minutos": 25}'
receta = Receta.model_validate_json(texto_recibido)
print(receta.nombre, receta.minutos)
print(type(receta.minutos).__name__)
```

```salida
Ceviche 25
int
```

> Nota: model_validate_json() lanza ValidationError cuando el texto no encaja con la clase. Capturar esa excepción y reintentar, o registrar la respuesta cruda, es lo que evita que una salida malformada se propague como un dato válido.

> Doc: [Pydantic](https://docs.pydantic.dev/latest/)

```ejercicio
# Enunciado
Completa el método que convierte el texto JSON recibido en un objeto validado.

# Plantilla
from pydantic import BaseModel
class Receta(BaseModel):
    nombre: str
r = Receta.___('{"nombre": "Ceviche"}')
print(r.nombre)

# Esperado
Ceviche

# Pista
Tres palabras separadas por guion bajo: modelo, validar y json, en inglés.
```

# Contar tokens antes de llamar

El coste de una petición depende de los tokens que entran y de los que se generan. El método `count_tokens()` calcula los de entrada sin generar respuesta.

Sirve para decidir si un texto cabe en la ventana del modelo y para estimar el gasto antes de asumirlo. Este bloque necesita clave, así que no se ejecuta aquí.

> Doc: [Contar tokens](https://ai.google.dev/gemini-api/docs/tokens)

```python !sin-consola
response = client.models.count_tokens(
    model="gemini-3.5-flash",
    contents="¿Por qué el cielo es azul?",
)
print(response.total_tokens)
```

```salida
8
```

> Nota: Un token no es una palabra ni un carácter: es un trozo de texto de longitud variable. En español rinde peor que en inglés, así que el mismo contenido traducido consume más tokens y resulta más caro.

> Doc: [Contar tokens](https://ai.google.dev/gemini-api/docs/tokens)

# Cierre

Ya se puede armar la petición pieza a pieza y exigir que la respuesta llegue como un dato validado en lugar de como prosa.

La última sesión trata la conversación, la respuesta que llega poco a poco y lo que hay que cuidar antes de poner esto delante de usuarios.
