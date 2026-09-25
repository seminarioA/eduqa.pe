---
numero: 3
titulo: "Verificar releases, hashes y firmas con Python"
---

# Calcular un hash con hashlib

Python puede verificar el hash de un artefacto descargado antes de ejecutarlo. `hashlib.sha256()` calcula SHA-256 sobre bytes; el valor obtenido se compara con el hash publicado para el release correspondiente.

```python
import hashlib

contenido = b"yt-dlp"
digest = hashlib.sha256(contenido).hexdigest()
print(len(digest))
```

```salida
64
```

> Doc: [Release Files](https://github.com/yt-dlp/yt-dlp#release-files)
> Doc: [hashlib](https://docs.python.org/3/library/hashlib.html)

```ejercicio
# Enunciado
Completa el constructor de SHA-256.

# Plantilla
import hashlib
digest = hashlib.___(b"yt-dlp").hexdigest()
print(len(digest))

# Esperado
64

# Pista
El nombre del constructor coincide con el algoritmo.
```


# Un artefacto para cada entorno

Además de los tres archivos recomendados, una release publica variantes para
arquitecturas y bibliotecas de sistema concretas. El nombre del archivo forma
parte de la decisión de instalación: x86, x86_64, ARM64 y ARMv7 no describen el
mismo destino.

El README también diferencia artefactos empaquetados y variantes `.zip` sin
empaquetar. Algunas variantes sin empaquetar no permiten autoactualización.

> Doc: [Release Files — Alternatives](https://github.com/yt-dlp/yt-dlp#release-files)

```python
archivos = {
    "windows-x64": "yt-dlp.exe",
    "windows-arm64": "yt-dlp_arm64.exe",
    "linux-x86_64": "yt-dlp_linux",
    "linux-aarch64": "yt-dlp_linux_aarch64",
}
print(archivos["linux-aarch64"])
```

```salida
yt-dlp_linux_aarch64
```

```ejercicio
# Enunciado
Completa el nombre del artefacto Linux para arquitectura AArch64.

# Plantilla
archivo = "yt-dlp_linux___"
print(archivo)

# Esperado
yt-dlp_linux_aarch64

# Pista
El sufijo comienza con un guion bajo.
```

# glibc y musl no son la misma variante

El proyecto publica binarios Linux enlazados para entornos con `glibc` y
otros para entornos con `musl`. El nombre `yt-dlp_musllinux` identifica la
familia destinada a musl.

Elegir una arquitectura correcta no basta si el entorno de bibliotecas del
sistema no coincide con el artefacto.

> Doc: [Release Files — Alternatives](https://github.com/yt-dlp/yt-dlp#release-files)

```ejercicio
# Enunciado
Completa el nombre base de la variante Linux preparada para musl.

# Plantilla
archivo = "yt-dlp_"
archivo += "___"
print(archivo)

# Esperado
yt-dlp_musllinux

# Pista
El README une `musl` y `linux` en el nombre.
```

# El tarball de código fuente

`yt-dlp.tar.gz` es el *source tarball*: un archivo comprimido que contiene el
código fuente distribuido para la release. El README señala además que los
manuales y archivos de autocompletado del shell se incluyen dentro de este
tarball.

> Doc: [Release Files — Misc](https://github.com/yt-dlp/yt-dlp#release-files)

```ejercicio
# Enunciado
Completa la extensión compuesta del tarball publicado por yt-dlp.

# Plantilla
archivo = "yt-dlp.___"
print(archivo)

# Esperado
yt-dlp.tar.gz

# Pista
Primero se agrupan archivos con tar y después se comprimen con gzip.
```

# SHA-256 y SHA-512

La release publica `SHA2-256SUMS` y `SHA2-512SUMS`. Un hash permite
comparar los bytes descargados con el resumen publicado.

Calcular el hash no autentica por sí solo quién publicó la lista. Solo permite
comprobar que dos contenidos producen el mismo resumen criptográfico.

```python
import hashlib

contenido = b"yt-dlp"
print(hashlib.sha256(contenido).hexdigest())
```

```salida
b3a6e9239802595f443de6362000936083760999f46d624bb8fc68cb0849a478
```

> Doc: [Release Files — Misc](https://github.com/yt-dlp/yt-dlp#release-files)

```ejercicio
# Enunciado
Completa la función de hashlib que calcula un resumen SHA-256.

# Plantilla
import hashlib

resumen = hashlib.___(b"yt-dlp").hexdigest()
print(len(resumen))

# Esperado
64

# Pista
El nombre de la función coincide con el algoritmo, en minúsculas.
```

# Las firmas GPG

La release también publica firmas para las listas de hashes y el repositorio
proporciona la clave pública correspondiente. El ejemplo oficial importa la
clave y utiliza `gpg --verify` para comprobar las firmas.

```bash !sin-consola
curl -L https://github.com/yt-dlp/yt-dlp/raw/master/public.key | gpg --import
gpg --verify SHA2-256SUMS.sig SHA2-256SUMS
```

La primera orden importa la clave pública. La segunda comprueba que la firma
`SHA2-256SUMS.sig` corresponde al archivo `SHA2-256SUMS` según esa clave.

> Doc: [Release Files — signature verification](https://github.com/yt-dlp/yt-dlp#release-files)

```ejercicio
# Enunciado
Completa el subcomando de GPG que verifica una firma contra el archivo firmado.

# Plantilla
comando = ["gpg", "___", "SHA2-256SUMS.sig", "SHA2-256SUMS"]
print(" ".join(comando))

# Esperado
gpg --verify SHA2-256SUMS.sig SHA2-256SUMS

# Pista
La operación se llama «verificar» en inglés.
```

# Las licencias dependen del artefacto

El repositorio y las distribuciones de código de PyPI se publican bajo
Unlicense, pero algunos ejecutables incluyen código de terceros con otras
licencias. El README destaca que los ejecutables empaquetados con PyInstaller
incluyen componentes GPLv3+ y que otros artefactos incorporan componentes ISC
y MIT.

Por eso «licencia de yt-dlp» y «licencia de un artefacto redistribuido con sus
dependencias» no siempre describen el mismo conjunto de código.

> Doc: [Release Files — Licensing](https://github.com/yt-dlp/yt-dlp#licensing)

# Cierre con Python

La verificación de releases ahora incluye una operación reproducible desde Python para calcular hashes antes de confiar en un artefacto.


Una release contiene artefactos para arquitecturas y entornos diferentes,
tarballs, listas de hashes y firmas. El nombre del archivo determina el destino,
el hash comprueba integridad y la firma permite verificar la lista publicada.

La sesión siguiente estudia cómo se actualiza cada forma de instalación y qué
significan los canales `stable`, `nightly` y `master`.
