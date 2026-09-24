---
numero: 69
titulo: "Entorno manual, lint y tests sin Hatch"
---

# Instalar solo dependencias dev

La alternativa manual usa:

```bash !sin-consola
python -m devscripts.install_deps --include-group dev
```

> Doc: [Developer Instructions](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#developer-instructions)

```ejercicio
# Enunciado
Completa el grupo de dependencias.

# Plantilla
print("--include-group " + "___")

# Esperado
--include-group dev

# Pista
Abrevia development.
```

# Editable install

La guía ofrece una instalación editable con extras default y dev.

```bash !sin-consola
python -m pip install -e ".[default,dev]"
```

# pre-commit install

Instala manualmente el hook cuando no se usa `hatch run setup`.

# run_tests

`python -m devscripts.run_tests` reemplaza `hatch test`.

# ruff y autopep8

`ruff check --fix .` y `autopep8 --in-place .` reemplazan `hatch fmt`.

# Solo comprobar

`ruff check .` y `autopep8 --diff .` comprueban sin aplicar cambios.

```ejercicio
# Enunciado
Completa la opción de Ruff que aplica fixes.

# Plantilla
print("ruff check " + "___" + " .")

# Esperado
ruff check --fix .

# Pista
Empieza con dos guiones.
```

# Cierre

La sesión siguiente explica por qué una feature amplia debe discutirse antes de escribir código.
