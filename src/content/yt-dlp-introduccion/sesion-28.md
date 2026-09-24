---
numero: 28
titulo: "Seleccionar vídeos por fecha"
---

# --date

`--date DATE` descarga únicamente vídeos publicados en la fecha indicada.

El formato absoluto documentado es `YYYYMMDD`: año de cuatro dígitos, mes de
dos y día de dos.

> Doc: [Video Selection — --date](https://github.com/yt-dlp/yt-dlp#video-selection)

```ejercicio
# Enunciado
Completa la fecha 24 de septiembre de 2026 en el formato YYYYMMDD.

# Plantilla
fecha = "202609___"
print(fecha)

# Esperado
20260924

# Pista
Los dos últimos dígitos representan el día.
```

# Fechas relativas

La documentación también admite
`[now|today|yesterday][-N[day|week|month|year]]`.

El ejemplo `today-2weeks` selecciona el mismo día relativo a dos semanas antes
de hoy. Estas expresiones se evalúan respecto al momento en que se ejecuta
yt-dlp.

```python
base = "today"
desplazamiento = "2weeks"
print(f"{base}-{desplazamiento}")
```

```salida
today-2weeks
```

```ejercicio
# Enunciado
Completa la unidad del ejemplo oficial today-2weeks.

# Plantilla
print("today-2___")

# Esperado
today-2weeks

# Pista
La unidad está en plural porque el valor es dos.
```

# --datebefore

`--datebefore DATE` acepta vídeos publicados en la fecha indicada o antes.
Utiliza los mismos formatos de fecha que `--date`.

```ejercicio
# Enunciado
Completa la opción que limita la selección a una fecha o cualquier fecha anterior.

# Plantilla
print("yt-dlp " + "___" + " 20260101")

# Esperado
yt-dlp --datebefore 20260101

# Pista
El nombre termina en `before`.
```

# --dateafter

`--dateafter DATE` acepta vídeos publicados en la fecha indicada o después.

```ejercicio
# Enunciado
Completa la opción que limita la selección a una fecha o cualquier fecha posterior.

# Plantilla
opcion = "--date___"
print(opcion)

# Esperado
--dateafter

# Pista
La palabra que falta significa «después».
```

# Un intervalo usa dos condiciones

Una ventana temporal puede expresarse combinando `--dateafter` y
`--datebefore`.

```python
inicio = "20260101"
fin = "20261231"
opciones = ["--dateafter", inicio, "--datebefore", fin]
print(" ".join(opciones))
```

```salida
--dateafter 20260101 --datebefore 20261231
```

# Cierre

`--date` exige una fecha concreta; `--datebefore` y `--dateafter` definen
límites inclusivos. Las fechas pueden ser absolutas o relativas según la sintaxis
documentada.

La sesión siguiente introduce el lenguaje de filtros genéricos.
