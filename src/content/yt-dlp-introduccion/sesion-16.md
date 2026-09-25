---
numero: 16
titulo: "Controlar componentes remotos desde Python"
---

# Construir los componentes remotos permitidos desde Python

En Python, cada opción y cada valor se mantienen como elementos independientes de una lista. `comando_yt_dlp()` añade el intérprete y el módulo de yt-dlp; de este modo no es necesario concatenar una orden para que después la interprete un shell.

```python
argumentos = ["--remote-components", "ejs:github"]
comando = comando_yt_dlp(*argumentos)
print(" ".join(comando[3:]))
```

```salida
--remote-components ejs:github
```

> Doc: [yt-dlp — opción documentada](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la primera opción de esta invocación.

# Plantilla
argumentos = ["___", "ejs:github"]
print(" ".join(comando_yt_dlp(*argumentos)[3:]))

# Esperado
--remote-components ejs:github

# Pista
La opción aparece en el título del punto principal de esta sesión.
```


# --remote-components

`--remote-components COMPONENT` autoriza a yt-dlp a obtener determinados
componentes remotos cuando los necesita. La opción puede repetirse para
autorizar más de uno.

El README actual indica que esta opción no es necesaria cuando se usa un
ejecutable oficial o cuando está instalada la versión requerida de
`yt-dlp-ejs`.

> Doc: [General Options — --remote-components](https://github.com/yt-dlp/yt-dlp#general-options)

```ejercicio
# Enunciado
Completa la opción que autoriza un componente remoto.

# Plantilla
print("yt-dlp " + "___" + " ejs:npm")

# Esperado
yt-dlp --remote-components ejs:npm

# Pista
El nombre combina «remoto» y «componentes».
```

# ejs:npm

`ejs:npm` permite componentes JavaScript externos obtenidos desde npm. Los dos
puntos separan la familia `ejs` del origen `npm`.

```python
familia = "ejs"
origen = "npm"
print(f"{familia}:{origen}")
```

```salida
ejs:npm
```

```ejercicio
# Enunciado
Completa el origen que permite obtener componentes EJS desde npm.

# Plantilla
componente = "ejs:___"
print(componente)

# Esperado
ejs:npm

# Pista
Es el registro de paquetes de Node.js.
```

# ejs:github

`ejs:github` permite componentes externos procedentes del repositorio GitHub
de `yt-dlp-ejs`.

```ejercicio
# Enunciado
Completa el valor que autoriza el origen GitHub para EJS.

# Plantilla
print("ejs:" + "___")

# Esperado
ejs:github

# Pista
El origen coincide con el nombre de la plataforma donde vive el repositorio.
```

# Ningún componente remoto está permitido por defecto

El README actual establece que no se permiten componentes remotos por defecto.
La autorización debe aparecer de manera explícita cuando esa instalación la
necesite.

Esta política es independiente de los runtimes JavaScript: habilitar Deno no
autoriza por sí mismo la descarga de componentes remotos.

# --no-remote-components

`--no-remote-components` revoca todos los componentes remotos permitidos,
incluidos los autorizados anteriormente mediante `--remote-components` o por
defaults que pudieran existir.

```ejercicio
# Enunciado
Completa la opción que desautoriza todos los componentes remotos.

# Plantilla
opcion = "___"
print(opcion)

# Esperado
--no-remote-components

# Pista
Usa el prefijo negativo `--no-`.
```

# Cierre con Python

Python dejó los componentes remotos permitidos representada como una lista explícita de argumentos que puede reutilizarse, validarse o ejecutarse con `ejecutar_yt_dlp()`.


Los runtimes ejecutan JavaScript; los componentes remotos controlan de dónde
puede obtener yt-dlp código adicional relacionado. Son dos permisos distintos.
`ejs:npm` y `ejs:github` son los valores documentados actualmente y ninguno
está autorizado por defecto.

La sesión siguiente estudia la extracción plana de playlists.
