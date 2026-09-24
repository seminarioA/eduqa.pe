---
numero: 6
titulo: "yt-dlp-ejs y los runtimes de JavaScript"
---

# Para qué existe yt-dlp-ejs

El README clasifica `yt-dlp-ejs` como una dependencia fuertemente recomendada
y la declara necesaria para el soporte completo de YouTube.

EJS significa aquí el componente del proyecto `yt-dlp/ejs`; no se debe
confundir con otras bibliotecas que usan las mismas letras.

> Doc: [Dependencies — yt-dlp-ejs](https://github.com/yt-dlp/yt-dlp#strongly-recommended)

```ejercicio
# Enunciado
Completa el nombre de la dependencia que el README declara necesaria para el soporte completo de YouTube.

# Plantilla
paquete = "___"
print(paquete)

# Esperado
yt-dlp-ejs

# Pista
Empieza con el nombre del proyecto y termina en `ejs`.
```

# EJS necesita un motor JavaScript

`yt-dlp-ejs` no ejecuta JavaScript por sí solo. El README requiere además un
runtime o motor compatible y enumera Deno, Node.js, Bun y QuickJS.

La relación es de dos niveles: yt-dlp utiliza el componente EJS y EJS necesita
un motor capaz de ejecutar JavaScript.

> Doc: [Dependencies — yt-dlp-ejs](https://github.com/yt-dlp/yt-dlp#strongly-recommended)

```python
runtimes = ["deno", "node", "bun", "quickjs"]
print(len(runtimes))
```

```salida
4
```

```ejercicio
# Enunciado
Completa el runtime que el README coloca primero y recomienda.

# Plantilla
runtime = "___"
print(runtime)

# Esperado
deno

# Pista
Tiene cuatro letras.
```

# Deno

El README marca Deno como runtime recomendado para EJS. La elección del runtime
es independiente de la URL que luego se procese: primero debe existir un motor
disponible y después yt-dlp decide cuándo necesita ejecutar componentes
JavaScript.

```bash !sin-consola
deno --version
```

> Doc: [EJS wiki](https://github.com/yt-dlp/yt-dlp/wiki/EJS)

```ejercicio
# Enunciado
Completa el nombre del ejecutable usado para comprobar la instalación de Deno.

# Plantilla
comando = ["___", "--version"]
print(" ".join(comando))

# Esperado
deno --version

# Pista
Coincide con el nombre del runtime recomendado.
```

# Node.js y Bun

Node.js y Bun aparecen también como runtimes admitidos. Que un runtime esté
soportado no significa que sea la primera opción recomendada por el README
actual; esa distinción corresponde a Deno.

```python
alternativas = {"node", "bun"}
print(sorted(alternativas))
```

```salida
['bun', 'node']
```

> Doc: [EJS wiki](https://github.com/yt-dlp/yt-dlp/wiki/EJS)

# QuickJS

QuickJS completa la lista de motores enumerados en la sección de dependencias
para ejecutar EJS. El curso estudiará más adelante `--js-runtimes`, que permite
controlar desde la CLI qué runtimes usa yt-dlp y, cuando procede, dónde se
encuentran.

> Doc: [Dependencies — yt-dlp-ejs](https://github.com/yt-dlp/yt-dlp#strongly-recommended)

# Dos comprobaciones distintas

Comprobar yt-dlp y comprobar el runtime son operaciones separadas:

```bash !sin-consola
yt-dlp --version
deno --version
```

La primera orden verifica el ejecutable de yt-dlp; la segunda verifica el motor
JavaScript. Que una responda no implica que la otra esté instalada.

```ejercicio
# Enunciado
Completa la estructura que conserva por separado los dos ejecutables que deben comprobarse.

# Plantilla
programas = {"yt_dlp": "yt-dlp", "javascript": "___"}
print(programas["javascript"])

# Esperado
deno

# Pista
Usa el runtime recomendado por el README.
```

# Cierre

`yt-dlp-ejs` habilita parte del soporte de YouTube y necesita un runtime de
JavaScript. Deno es el runtime recomendado actualmente; Node.js, Bun y QuickJS
también aparecen como alternativas soportadas.

La sesión siguiente cubre las dependencias de red y la impersonación de
navegadores.
