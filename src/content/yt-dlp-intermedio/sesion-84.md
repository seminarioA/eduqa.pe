---
numero: 84
titulo: "Dirección, valores objetivo y precedencia de -S"
---

# Orden descendente por defecto

Los campos se ordenan de forma descendente salvo indicación contraria.

# + invierte el orden

Anteponer `+` prefiere valores menores. `+res` prefiere la resolución más pequeña.

> Doc: [Sorting Formats](https://github.com/yt-dlp/yt-dlp#sorting-formats)

```ejercicio
# Enunciado
Completa el prefijo que invierte res.

# Plantilla
print("-S ___res")

# Esperado
-S +res

# Pista
Usa el signo más.
```

# :VALUE establece un límite preferido

`res:720` prefiere resoluciones grandes sin superar 720 cuando existen y usa una alternativa menor/mayor según la regla documentada.

```ejercicio
# Enunciado
Completa el separador del valor preferido.

# Plantilla
print("res___720")

# Esperado
res:720

# Pista
Se usa dos puntos.
```

# codec/ext con dos valores

`codec` y `ext` aceptan una preferencia para vídeo y otra para audio.

# ~VALUE busca el más cercano

`filesize~1G` prefiere el tamaño más próximo a 1 GiB.

```ejercicio
# Enunciado
Completa el operador de cercanía.

# Plantilla
print("filesize___1G")

# Esperado
filesize~1G

# Pista
Usa tilde.
```

# Prioridades fijas

`hasvid` e `ie_pref` reciben prioridad máxima aunque el usuario indique otro orden. `--format-sort-force` permite cambiar este comportamiento.

# Orden predeterminado

El README documenta:
`lang,quality,res,fps,hdr:12,vcodec,channels,acodec,size,br,asr,proto,ext,hasaud,source,id`.

# hdr:12

El default usa `hdr:12`; por compatibilidad de dispositivos no prioriza Dolby Vision de forma absoluta.

# Repetir -S

Cada `-S` posterior se antepone al anterior. `-S proto -S res` equivale a `-S res,proto`.

Los campos duplicados conservan solo la aparición de mayor prioridad.

```ejercicio
# Enunciado
Completa el orden equivalente a -S proto -S res.

# Plantilla
print("-S " + "___")

# Esperado
-S res,proto

# Pista
El segundo -S se antepone.
```

# Cierre

La sesión siguiente aplica merges, fallbacks y selección separada en ejemplos completos.
