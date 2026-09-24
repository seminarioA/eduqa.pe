---
numero: 76
titulo: "Parámetros locales para tests autenticados"
---

# test/local_parameters.json

Los extractores que necesitan autenticación pueden recibir parámetros locales mediante este archivo.

> Doc: [Adding support for a new site — local parameters](https://github.com/yt-dlp/yt-dlp/blob/master/CONTRIBUTING.md#adding-support-for-a-new-site)

# usenetrc

La propiedad `usenetrc` permite reutilizar autenticación netrc.

```python
config = {"usenetrc": True}
print(config["usenetrc"])
```

```salida
True
```

```ejercicio
# Enunciado
Completa la clave que activa netrc.

# Plantilla
config = {"___": True}
print(config["usenetrc"])

# Esperado
True

# Pista
Une use y netrc sin separador.
```

# username y password

La guía permite parámetros de usuario y contraseña para testing local.

> Nota: Los valores reales son secretos. No deben versionarse ni copiarse al material del curso. Los ejemplos académicos usan únicamente nombres de campos.

# cookiefile

Puede indicarse un archivo local de cookies.

# cookiesfrombrowser

También puede configurarse carga desde navegador.

# Archivo local, no fixture público

La finalidad es permitir tests en el entorno del desarrollador sin incrustar credenciales en el extractor o en sus casos públicos.

```opcion-multiple
# Enunciado
¿Dónde deben mantenerse credenciales necesarias solo para tests locales?

# Opciones
- En parámetros locales no versionados
- Dentro del extractor público
- En el mensaje de commit
- En la descripción del PR

# Correcta
1

# Explicación
Las credenciales no forman parte del código o fixtures públicos.

# Pista
La guía proporciona local_parameters.json.
```

# Cierre

La sesión siguiente define qué campos del info dict son obligatorios y cuáles deben ser tolerantes a ausencia.
