---
numero: 24
titulo: "URLs file:// y su límite de seguridad"
---

# El esquema file

Una URL con esquema `file://` referencia un recurso del sistema de archivos
local en lugar de un recurso HTTP remoto.

El esquema y la ruta forman una URL. Los caracteres `://` separan el nombre
del esquema del resto de la dirección.

```python
url = "file:///tmp/media.html"
print(url.split(":", 1)[0])
```

```salida
file
```

```ejercicio
# Enunciado
Completa el esquema de una URL que referencia un archivo local.

# Plantilla
url = "___:///tmp/media.html"
print(url)

# Esperado
file:///tmp/media.html

# Pista
El esquema se llama igual que «archivo» en inglés.
```

# --enable-file-urls

`--enable-file-urls` habilita el procesamiento de URLs `file://`.

El README señala expresamente que esta capacidad está desactivada por defecto
por razones de seguridad.

> Doc: [Network Options — --enable-file-urls](https://github.com/yt-dlp/yt-dlp#network-options)

```ejercicio
# Enunciado
Completa la opción que habilita URLs file://.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --enable-file-urls

# Pista
El nombre contiene `enable`, `file` y `urls`.
```

# Por qué el origen local cambia el riesgo

Una entrada HTTP apunta a un recurso accesible por red. Una entrada `file://`
puede hacer referencia a archivos de la máquina donde se ejecuta yt-dlp.

Habilitar el esquema amplía las fuentes que una entrada puede alcanzar. Por eso
no debe activarse de manera global en una aplicación que acepte URLs de usuarios
sin controlar qué entradas llegan al proceso.

> Nota: La documentación del proyecto marca la función como desactivada por
> seguridad. El curso conserva esa política como valor predeterminado y no
> recomienda habilitarla cuando la entrada proviene de una fuente no confiable.

```opcion-multiple
# Enunciado
¿Por qué --enable-file-urls requiere una decisión explícita?

# Opciones
- Porque cambia la resolución máxima
- Porque permite que una entrada referencie archivos locales
- Porque desactiva HTTPS
- Porque instala FFmpeg

# Correcta
2

# Explicación
El esquema file:// apunta al sistema de archivos local y amplía qué recursos puede referenciar una entrada.

# Pista
Compara el origen de un recurso file:// con uno https://.
```

# Cierre

`file://` referencia recursos locales y yt-dlp lo desactiva por defecto por
seguridad. `--enable-file-urls` debe aparecer de forma explícita para ampliar
ese conjunto de entradas.

La sesión siguiente trata opciones específicas para comprobaciones de
georrestricción.
