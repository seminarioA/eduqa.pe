---
numero: 56
titulo: "Sintaxis y encoding de archivos de configuración"
---

# Opciones sin espacios internos

Las opciones conservan la misma sintaxis que en la CLI. No puede existir un espacio entre los guiones y el nombre: `--proxy` es válido; `-- proxy` no.

> Doc: [Configuration](https://github.com/yt-dlp/yt-dlp#configuration)

```ejercicio
# Enunciado
Completa la forma válida de la opción proxy.

# Plantilla
print("___")

# Esperado
--proxy

# Pista
No hay espacio después de los guiones.
```

# Comillas cuando son necesarias

Los argumentos deben entrecomillarse cuando sea necesario conservar espacios o caracteres especiales.

# Comentarios

Las líneas que empiezan con almohadilla (`#`) son comentarios en el ejemplo oficial.

```ejercicio
# Enunciado
Completa el prefijo de comentario.

# Plantilla
print("___ comentario")

# Esperado
# comentario

# Pista
Usa almohadilla.
```

# BOM y locale

Los archivos se decodifican según el BOM de Unicode si existe; en caso contrario, se usa la codificación del locale del sistema.

BOM significa *byte order mark*.

# # coding: ENCODING

Para forzar una codificación puede escribirse `# coding: ENCODING` al principio del archivo.

No puede existir ningún carácter anterior, ni espacios ni BOM.

```ejercicio
# Enunciado
Completa la declaración de encoding shift-jis.

# Plantilla
print("# coding: " + "___")

# Esperado
# coding: shift-jis

# Pista
Usa el nombre documentado en el README.
```

# Cierre

La sesión siguiente resuelve variables de entorno y home en distintas plataformas.
