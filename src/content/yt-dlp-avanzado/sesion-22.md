---
numero: 22
titulo: "Vimeo, ADN y ZAN"
---

# vimeo:client

Selecciona `android` o `web`; solo puede usarse un cliente.

`web` es el default y necesita cookies de cuenta o credenciales. `android` funciona únicamente con tokens OAuth previamente cacheados.

```ejercicio
# Enunciado
Completa el cliente predeterminado.

# Plantilla
print("vimeo:client=___")

# Esperado
vimeo:client=web

# Pista
Es el cliente web.
```

# vimeo:original_format_policy

Controla cuándo intentar formatos originales: `always`, `never` o `auto`.

`auto` es el default y procura evitar exceder rate limits haciendo una petición extra solo cuando Vimeo publicita descargabilidad.

```ejercicio
# Enunciado
Completa la política predeterminada.

# Plantilla
print("vimeo:original_format_policy=___")

# Esperado
vimeo:original_format_policy=auto

# Pista
Delega la decisión.
```

# adn:profile_id

Selecciona el ID numérico del perfil premium. El default es `1`.

# zan:split_angles

Separa streams multiángulo en formatos distintos. Fuerza recodificación durante la descarga y requiere FFmpeg.

Acepta `true` o `false`; `false` es el default.

```ejercicio
# Enunciado
Completa el valor predeterminado de split_angles.

# Plantilla
print("zan:split_angles=___")

# Esperado
zan:split_angles=false

# Pista
Por defecto no separa ángulos.
```

# Compatibilidad de extractor args

El README advierte que los argumentos específicos de extractores pueden cambiar o eliminarse sin consideración por compatibilidad hacia atrás.

# Cierre

Todos los extractor arguments enumerados por el README actual han quedado cubiertos. La sesión siguiente empieza el sistema de plugins.
