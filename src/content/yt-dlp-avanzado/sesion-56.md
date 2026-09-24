---
numero: 56
titulo: "Opciones que funcionan pero ya no se recomiendan"
---

# --force-generic-extractor

La alternativa moderna es `--ies generic,default`.

> Doc: [Deprecated options — Not recommended](https://github.com/yt-dlp/yt-dlp#not-recommended)

# --exec-before-download

Se reemplaza por una etapa explícita:

```text
--exec "before_dl:CMD"
```

# --no-exec-before-download

Se sustituye por `--no-exec`.

# --all-formats

Se expresa como `-f all`.

# --all-subs

Se expresa mediante `--sub-langs all --write-subs`.

# --print-json

El equivalente documentado es `-j --no-simulate`.

# --autonumber-size

Se reemplaza por formato de string, por ejemplo `%(autonumber)03d`.

```ejercicio
# Enunciado
Completa el ancho de tres dígitos.

# Plantilla
print("%(autonumber)0___d")

# Esperado
%(autonumber)03d

# Pista
El ancho solicitado es tres.
```

# --autonumber-start

Se expresa mediante aritmética del campo, por ejemplo `%(autonumber+NUMBER)s`.

# --id

Se reemplaza por `-o "%(id)s.%(ext)s"`.

# --metadata-from-title

Se expresa mediante `--parse-metadata "%(title)s:FORMAT"`.

# --hls-prefer-native

Se reemplaza por `--downloader "m3u8:native"`.

# --hls-prefer-ffmpeg

Se reemplaza por `--downloader "m3u8:ffmpeg"`.

# --list-formats-old

Se reemplaza por `--compat-options list-formats`.

# --list-formats-as-table

Corresponde al default actual, expresable también negando la compat option.

# Geo bypass

`--geo-bypass`, `--no-geo-bypass`, `--geo-bypass-country` y `--geo-bypass-ip-block` se reemplazan por valores de `--xff`.

```ejercicio
# Enunciado
Completa el equivalente moderno de --geo-bypass-country PE.

# Plantilla
print("--xff " + "___")

# Esperado
--xff PE

# Pista
--xff acepta un código de país.
```

# Cierre

La sesión siguiente documenta opciones destinadas a desarrollo y testing, no a usuarios finales.
