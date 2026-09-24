---
numero: 86
titulo: "Ejemplos de selección: tamaño, resolución, protocolo y codec"
---

# El vídeo más pequeño

El README recomienda `-S "+size,+br"` para obtener un archivo pequeño en lugar de usar `worst`.

```ejercicio
# Enunciado
Completa el segundo criterio.

# Plantilla
print("+size,___")

# Esperado
+size,+br

# Pista
También se minimiza bitrate.
```

# MP4 con fallback

La expresión documentada combina filtros de extensión con un fallback general:
`bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4] / bv*+ba/b`.

# Máximo 480p

El método con selector usa filtros de height; el método preferido con sorting puede usar `height:480` o `res:480`.

```ejercicio
# Enunciado
Completa el sort de resolución no mayor de 480p.

# Plantilla
print("-S " + "___")

# Esperado
-S res:480

# Pista
Usa res y un valor preferido.
```

# Tamaño cercano a 50 MB

`-f b -S "filesize~50M"` busca el formato combinado cuyo tamaño esté más cerca de 50M.

# Protocolos HTTP/HTTPS

La expresión del README combina `protocol^=http` con `protocol!*=dash` para preferir enlaces HTTP/HTTPS directos y excluir DASH.

# Orden por protocolo

`-S proto` utiliza la preferencia documentada de protocolos.

# Codec H.264/H.265 por regex

El ejemplo de selector usa una regex sobre `vcodec`. Los ejemplos de sorting usan `codec:h264` y `+codec:h264` para expresar direcciones opuestas alrededor de H.264.

# Cierre

La sesión siguiente combina resolución, fps, codec y bitrate en ejemplos complejos.
