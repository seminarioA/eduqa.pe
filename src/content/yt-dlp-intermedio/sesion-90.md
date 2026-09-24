---
numero: 90
titulo: "Prefijos meta_ y campos embebidos"
---

# meta_

Un campo con prefijo `meta_` cambia el metadata que se añadirá al archivo multimedia.

`meta_description` cambia description embebida.

> Doc: [Modifying Metadata](https://github.com/yt-dlp/yt-dlp#modifying-metadata)

```ejercicio
# Enunciado
Completa el campo que sustituye la descripción embebida.

# Plantilla
print("___")

# Esperado
meta_description

# Pista
Antepon meta_ a description.
```

# meta<n>_

Para streams individuales se usa `meta<n>_`, por ejemplo `meta1_language`.

```ejercicio
# Enunciado
Completa el campo de idioma del primer stream.

# Plantilla
print("___")

# Esperado
meta1_language

# Pista
El índice aparece entre meta y el guion bajo.
```

# meta_ vacío

Asignar el campo `meta_` puede sobrescribir todos los valores predeterminados del metadata embebido.

# Campos predeterminados añadidos al archivo

El README mapea, entre otros: title desde track/title; date desde upload_date; description y synopsis desde description; purl/comment desde webpage_url; track desde track_number; artist desde artist/artists/creator/creators/uploader/uploader_id; composer; genre; album; album_artist; disc; show; season_number; episode_id; episode_sort; y language por stream.

# Soporte del contenedor

El formato final puede no soportar todos esos campos.

```opcion-multiple
# Enunciado
¿Está garantizado que todo contenedor soporte todos los campos de metadata?

# Opciones
- No
- Sí, siempre
- Solo MP3
- Solo cuando se usa proxy

# Correcta
1

# Explicación
La documentación advierte que el formato de archivo puede no soportar algunos campos.

# Pista
El metadata depende también del contenedor.
```

# Cierre

La sesión siguiente aplica los ejemplos completos documentados y cierra el nivel intermedio.
