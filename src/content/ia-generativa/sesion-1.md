---
numero: 1
titulo: "El cliente y la primera respuesta"
---


# Qué es un modelo generativo

Un modelo generativo recibe texto y devuelve texto. No busca una respuesta en una base de datos: la produce, palabra a palabra, a partir de lo que aprendió durante su entrenamiento.

Eso tiene dos consecuencias que condicionan todo lo demás. La primera es que la misma pregunta puede dar respuestas distintas. La segunda es que el modelo puede afirmar con seguridad algo que no es cierto, porque su objetivo es producir texto plausible, no verificado.

Programar contra un modelo generativo consiste, en buena medida, en acotar esas dos cosas.

> Doc: [Gemini API](https://ai.google.dev/gemini-api/docs)

# El SDK oficial

Google publica `google-genai`, un paquete de Python que envía peticiones a la API de Gemini. Es el sustituto de `google-generativeai`, que quedó descontinuado.

Se instala con `pip install google-genai`. Este curso usa la versión 2.17.0.

> Nota: El propio repositorio recomienda fijar la versión por debajo de la 3.0.0, porque en la siguiente versión mayor cambia el comportamiento de la llamada automática a funciones y desaparecen varios métodos. En un proyecto real esa restricción va escrita en el archivo de dependencias, no en la memoria de quien instala.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

> Doc: [Documentación del SDK](https://googleapis.github.io/python-genai/)

```python
import google.genai

print(google.genai.__version__)
```

```salida
2.17.0
```

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

# Los dos imports

El paquete se importa de dos formas y ambas son necesarias. La primera trae `genai`, que contiene el cliente. La segunda trae `types`, que contiene las clases de configuración.

Conviene fijarse en que el paquete se llama `google-genai` al instalarlo y `google.genai` al importarlo.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```python
from google import genai
from google.genai import types

print(genai.__name__)
print(types.__name__)
```

```salida
google.genai
google.genai.types
```

> Doc: [Documentación del SDK](https://googleapis.github.io/python-genai/)

```ejercicio
# Enunciado
Completa el módulo que trae las clases de configuración del SDK.

# Plantilla
from google.genai import ___
print(types.__name__)

# Esperado
google.genai.types

# Pista
Cinco letras: la palabra inglesa para tipos.
```

# Crear el cliente

El cliente es el objeto que envía las peticiones. Se construye con `genai.Client()` y recibe la clave de API.

Construir el cliente no llama a nadie: solo guarda la configuración. La primera petición de red ocurre cuando se le pide algo al modelo.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

> Doc: [Obtener una clave de API](https://ai.google.dev/gemini-api/docs/api-key)

```python
from google import genai

client = genai.Client(api_key="clave-de-practica")
print(type(client).__name__)
```

```salida
Client
```

> Nota: Por eso una clave inválida no falla al construir el cliente, sino más tarde, en la primera llamada, con un error 400 y el motivo API_KEY_INVALID. Conviene tenerlo presente al depurar: el punto donde salta el error no es el punto donde está el fallo.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```ejercicio
# Enunciado
Completa la clase que construye el cliente del SDK.

# Plantilla
from google import genai
c = genai.___(api_key="clave-de-practica")
print(type(c).__name__)

# Esperado
Client

# Pista
Seis letras, con mayúscula inicial: la palabra inglesa para cliente.
```

# La clave nunca se escribe en el código

Una clave de API es una credencial: quien la tiene puede gastar en tu cuenta. Escribirla en el código la deja en el repositorio, en el historial de cambios y en cualquier copia que alguien haga.

La forma correcta es una variable de entorno, que se lee con `os.environ`. El SDK además la busca solo: si existe la variable `GEMINI_API_KEY`, `genai.Client()` la toma sin que haya que pasarla.

> Nota: Esto vale también para el navegador: una clave incrustada en una página web es pública, por mucho que esté ofuscada. Cuando una aplicación web necesita llamar al modelo, la llamada la hace el servidor y el navegador solo se comunica con ese servidor, nunca con Google directamente.

> Doc: [os.environ](https://docs.python.org/3/library/os.html#os.environ)

> Doc: [Obtener una clave de API](https://ai.google.dev/gemini-api/docs/api-key)

```python
import os

os.environ["GEMINI_API_KEY"] = "clave-de-practica"
print(os.environ["GEMINI_API_KEY"][:5])
```

```salida
clave
```

> Doc: [os.environ](https://docs.python.org/3/library/os.html#os.environ)

```ejercicio
# Enunciado
Completa el nombre de la variable de entorno que el SDK busca por su cuenta.

# Plantilla
import os
os.environ["___"] = "clave-de-practica"
print(os.environ["GEMINI_API_KEY"][:6])

# Esperado
clave-

# Pista
Va en mayúsculas, con guion bajo: el nombre del modelo seguido de las dos palabras inglesas de clave de API.
```

# Cuando la variable puede no existir

Acceder a `os.environ` con una clave ausente lanza `KeyError`. La función `os.getenv()` devuelve `None` en su lugar, o el valor por defecto que se le indique.

Comprobarlo al arrancar y avisar con un mensaje claro ahorra depurar más tarde un error de red que en realidad era una variable sin definir.

> Doc: [os.getenv()](https://docs.python.org/3/library/os.html#os.getenv)

```python
import os

clave = os.getenv("CLAVE_QUE_NO_EXISTE")
print(clave)
print(os.getenv("CLAVE_QUE_NO_EXISTE", "sin definir"))
```

```salida
None
sin definir
```

> Doc: [os.getenv()](https://docs.python.org/3/library/os.html#os.getenv)

```ejercicio
# Enunciado
Completa la función que devuelve un valor por defecto cuando la variable no está definida.

# Plantilla
import os
print(os.___("NO_EXISTE", "sin definir"))

# Esperado
sin definir

# Pista
Seis letras: get seguido de la abreviatura de entorno.
```

# La primera llamada

El método `generate_content()` envía la petición al modelo y devuelve su respuesta. Recibe el nombre del modelo y el contenido de la petición.

Este bloque no se ejecuta aquí: requiere una clave válida, y la respuesta no sería la misma dos veces.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

```python !sin-consola
response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="Explica en una frase qué es un electrocardiograma",
)
print(response.text)
```

```salida
Un electrocardiograma es el registro de la actividad eléctrica del corazón medida desde la piel.
```

> Nota: El nombre del parámetro es contents, en plural, aunque se le pase una sola cadena. El SDK convierte lo que reciba a una lista de objetos Content, que es lo que la API espera de verdad; la cadena suelta es un atajo.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

# Qué devuelve

La respuesta no es una cadena, es un objeto. El atributo `text` es el atajo al texto generado, y es lo que se usa el noventa por ciento de las veces.

El objeto trae además los candidatos, el motivo por el que el modelo dejó de escribir y el recuento de tokens consumidos, que es lo que se factura.

> Nota: El atributo text vale None cuando el modelo no produjo texto: porque un filtro de seguridad bloqueó la respuesta, porque se agotó el límite de tokens antes del primer carácter, o porque la respuesta era una llamada a función. Comprobarlo antes de usarlo evita un fallo intermitente que solo aparece en producción.

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

> Doc: [Precios](https://ai.google.dev/pricing)

```python !sin-consola
print(response.usage_metadata.total_token_count)
print(response.candidates[0].finish_reason)
```

```salida
38
FinishReason.STOP
```

> Doc: [Generación de texto](https://ai.google.dev/gemini-api/docs/text-generation)

# Elegir el modelo

El nombre del modelo va como texto en cada llamada. La familia Gemini tiene variantes que se diferencian en capacidad, velocidad y precio.

La regla práctica es empezar por la variante rápida y barata, y subir solo si la tarea lo pide. La lista completa y sus límites están en la documentación, que cambia con frecuencia.

> Nota: El nombre del modelo forma parte del contrato de la aplicación: al cambiarlo cambian las respuestas, la latencia y el coste. Fijarlo en la configuración, y no escribirlo suelto en cada llamada, permite cambiarlo en un sitio y comparar resultados.

> Doc: [Modelos disponibles](https://ai.google.dev/gemini-api/docs/models)

```python
MODELO = "gemini-3.5-flash"
print(MODELO)
```

```salida
gemini-3.5-flash
```

> Doc: [Modelos disponibles](https://ai.google.dev/gemini-api/docs/models)

```ejercicio
# Enunciado
Completa el nombre del modelo rápido de la familia Gemini que usa el curso.

# Plantilla
MODELO = "gemini-3.5-___"
print(MODELO)

# Esperado
gemini-3.5-flash

# Pista
Cinco letras: la variante rápida se llama como un destello.
```

# Las dos plataformas

El mismo SDK sirve para dos servicios. El primero es la API para desarrolladores, que se autentica con una clave y es la de este curso.

El segundo es la plataforma empresarial de Google Cloud, que se autentica con las credenciales del proyecto y se activa con el parámetro `enterprise`.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```python !sin-consola
client = genai.Client(
    enterprise=True,
    project="mi-proyecto",
    location="global",
)
```

> Nota: Este parámetro se llamaba vertexai en versiones anteriores del SDK, porque el servicio se llamaba Vertex AI. El código escrito contra aquella versión sigue apareciendo en tutoriales y en respuestas de modelos: al copiarlo, falla.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

# Fijar la versión de la API

El SDK apunta por defecto a los extremos beta, que traen las funciones en vista previa. El parámetro `http_options` permite pedir la versión estable.

En algo que va a producción interesa lo estable: una función en vista previa puede cambiar de forma sin aviso.

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```python
from google.genai import types

opciones = types.HttpOptions(api_version="v1")
print(opciones.api_version)
```

```salida
v1
```

> Doc: [googleapis/python-genai](https://github.com/googleapis/python-genai)

```ejercicio
# Enunciado
Completa la clase que transporta las opciones de conexión del cliente.

# Plantilla
from google.genai import types
o = types.___(api_version="v1")
print(o.api_version)

# Esperado
v1

# Pista
Once letras: dos palabras juntas, el protocolo web y la palabra opciones.
```

# Cierre

Ya está el cliente construido, la clave fuera del código y la primera llamada hecha.

La sesión siguiente trata de lo que separa una respuesta cualquiera de una respuesta útil: la configuración.
