---
numero: 34
titulo: "Concurrencia y límites de velocidad"
---

# -N y --concurrent-fragments

`-N` es la forma corta de `--concurrent-fragments`. Define cuántos fragmentos
de un vídeo DASH o HLS nativo se descargan concurrentemente.

El valor predeterminado documentado es `1`, es decir, un fragmento a la vez.

> Doc: [Download Options — --concurrent-fragments](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la forma corta que configura cuatro fragmentos concurrentes.

# Plantilla
print("yt-dlp " + "___" + " 4")

# Esperado
yt-dlp -N 4

# Pista
La opción corta usa una N mayúscula.
```

# Concurrencia no significa varios vídeos

Esta opción se refiere a fragmentos del mismo flujo fragmentado. No define
cuántos vídeos distintos se procesan en paralelo.

```opcion-multiple
# Enunciado
¿Qué cuenta --concurrent-fragments?

# Opciones
- Vídeos completos
- Fragmentos concurrentes de DASH/HLS nativo
- Subtítulos
- Extractores cargados

# Correcta
2

# Explicación
La opción opera sobre fragmentos de un vídeo fragmentado.

# Pista
El sustantivo está en el propio nombre de la opción.
```

# -r y --limit-rate

`-r` es la forma corta de `--limit-rate`. Establece una velocidad máxima de
descarga en bytes por segundo.

El README acepta unidades en valores como `50K` o `4.2M`.

```bash !sin-consola
yt-dlp -r 4.2M "URL"
```

> Doc: [Download Options — --limit-rate](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la forma larga que limita la velocidad a 4.2M.

# Plantilla
print("yt-dlp " + "___" + " 4.2M")

# Esperado
yt-dlp --limit-rate 4.2M

# Pista
El nombre combina `limit` y `rate`.
```

# --throttled-rate

`--throttled-rate RATE` define una velocidad mínima. Si la tasa cae por debajo
de ella, yt-dlp asume throttling y vuelve a extraer los datos del vídeo.

**Throttling** es una limitación de velocidad aplicada por el servicio o la ruta
de entrega.

> Doc: [Download Options — --throttled-rate](https://github.com/yt-dlp/yt-dlp#download-options)

```ejercicio
# Enunciado
Completa la opción que define el umbral bajo el cual se asume throttling.

# Plantilla
opcion = "--___-rate"
print(opcion)

# Esperado
--throttled-rate

# Pista
La palabra que falta es `throttled`.
```

# Máximo y umbral mínimo cumplen funciones opuestas

`--limit-rate` impone un techo elegido por el usuario.
`--throttled-rate` detecta una tasa demasiado baja para decidir que debe
reextraerse información.

No deben interpretarse como dos límites de una misma ventana de velocidad.

# Cierre

`--concurrent-fragments` controla paralelismo dentro de streams fragmentados,
`--limit-rate` impone un máximo y `--throttled-rate` detecta una tasa
mínima sospechosa.

La sesión siguiente configura los distintos tipos de reintento.