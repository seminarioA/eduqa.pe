---
numero: 4
titulo: "Actualizar yt-dlp"
---

# Actualizar un binario con -U

`-U` es la forma corta de `--update`. El README documenta esta operación
para los release binaries. Una actualización mediante `-U` permanece en el
canal actual del binario.

```bash !sin-consola
yt-dlp -U
```

> Doc: [Update](https://github.com/yt-dlp/yt-dlp#update)

```ejercicio
# Enunciado
Completa la opción corta que actualiza un release binary.

# Plantilla
comando = ["yt-dlp", "___"]
print(" ".join(comando))

# Esperado
yt-dlp -U

# Pista
Es una U mayúscula precedida por un guion.
```

# Actualizar una instalación de pip

Cuando yt-dlp se instaló con `pip`, el README indica que se vuelva a ejecutar
el mismo comando empleado para instalar el paquete. En una instalación normal,
la actualización puede expresarse con `-U` de `pip`.

```bash !sin-consola
python -m pip install -U "yt-dlp[default]"
```

Este `-U` pertenece a `pip`, no a yt-dlp. El programa que interpreta la
opción es el módulo que aparece antes de ella.

> Doc: [Update](https://github.com/yt-dlp/yt-dlp#update)

```ejercicio
# Enunciado
Completa el comando de actualización para una instalación gestionada con pip.

# Plantilla
partes = ["python", "-m", "pip", "install", "___", "yt-dlp"]
print(" ".join(partes))

# Esperado
python -m pip install -U yt-dlp

# Pista
La opción de upgrade de pip tiene una letra mayúscula.
```

# El canal stable

`stable` es el canal predeterminado de los binarios. El README indica que se
publica aproximadamente con frecuencia mensual y advierte que un sitio remoto
puede cambiar entre releases, por lo que una versión estable puede quedar
desactualizada frente a un cambio externo.

«Stable» describe el canal de publicación; no garantiza que cada extractor siga
funcionando frente a cambios realizados por los sitios soportados.

> Doc: [Update channels](https://github.com/yt-dlp/yt-dlp#update-channels)

```ejercicio
# Enunciado
Completa el nombre del canal predeterminado de los binarios.

# Plantilla
canal = "___"
print(canal)

# Esperado
stable

# Pista
Es la palabra inglesa que el proyecto usa para su canal estable.
```

# El canal nightly

`nightly` publica una snapshot en los días en que hubo cambios de código. El
README actual lo señala como el canal recomendado para usuarios habituales de
yt-dlp.

Para cambiar un release binary desde `stable` a `nightly` se usa
`--update-to`.

```bash !sin-consola
yt-dlp --update-to nightly
```

> Doc: [Update channels](https://github.com/yt-dlp/yt-dlp#update-channels)

```ejercicio
# Enunciado
Completa el canal recomendado actualmente por el README para usuarios habituales.

# Plantilla
comando = ["yt-dlp", "--update-to", "___"]
print(" ".join(comando))

# Esperado
yt-dlp --update-to nightly

# Pista
Su nombre significa «nocturno».
```

# El canal master

`master` publica builds después de cada *push* al branch `master`. El README
lo caracteriza como un canal canary: contiene los cambios más recientes, pero
puede incluir bugs o regresiones que todavía no hayan pasado por un ciclo de
uso más amplio.

```bash !sin-consola
yt-dlp --update-to master
```

> Doc: [Update channels](https://github.com/yt-dlp/yt-dlp#update-channels)

```ejercicio
# Enunciado
Completa la opción que cambia el binario al canal master.

# Plantilla
opcion = "--___"
print(f"yt-dlp {opcion} master")

# Esperado
yt-dlp --update-to master

# Pista
La opción expresa «actualizar hacia».
```

# Canal y etiqueta

`--update-to [CHANNEL@]TAG` permite seleccionar una etiqueta concreta. El
signo arroba (`@`) separa el canal de la etiqueta cuando ambos se especifican.

El README también permite indicar únicamente una etiqueta, en cuyo caso se busca
dentro del canal actual.

```python
canal = "stable"
etiqueta = "2023.07.06"
objetivo = f"{canal}@{etiqueta}"
print(objetivo)
```

```salida
stable@2023.07.06
```

> Doc: [Update](https://github.com/yt-dlp/yt-dlp#update)

```ejercicio
# Enunciado
Completa el carácter que separa el canal de la etiqueta.

# Plantilla
canal = "stable"
etiqueta = "2023.07.06"
print(canal + "___" + etiqueta)

# Esperado
stable@2023.07.06

# Pista
Es el signo arroba.
```

# --no-update

`--no-update` desactiva la comprobación de actualización asociada a la
invocación o configuración. El README señala que también suprime la advertencia
que aparece cuando se ejecuta una versión con más de 90 días.

> Doc: [Update](https://github.com/yt-dlp/yt-dlp#update)

```ejercicio
# Enunciado
Completa la opción que desactiva la comprobación de actualización.

# Plantilla
print("yt-dlp " + "___")

# Esperado
yt-dlp --no-update

# Pista
Empieza con el prefijo negativo `--no-`.
```

# Cierre

Los binarios usan `-U` y `--update-to`; las instalaciones con `pip`
se actualizan mediante `pip`. `stable`, `nightly` y `master` son
canales distintos y una etiqueta permite seleccionar una release concreta.

La sesión siguiente separa las dependencias imprescindibles para una operación
de las dependencias que habilitan funciones concretas.
