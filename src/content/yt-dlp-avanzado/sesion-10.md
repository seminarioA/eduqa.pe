---
numero: 10
titulo: "YouTube: PO Tokens y contextos"
---

# po_token

`po_token` recibe Proof of Origin Tokens.

PO significa *Proof of Origin*.

> Doc: [Extractor Arguments — youtube po_token](https://github.com/yt-dlp/yt-dlp#extractor-arguments)

# CLIENT.CONTEXT+TOKEN

Cada entrada tiene forma `CLIENT.CONTEXT+PO_TOKEN`.

El punto separa cliente y contexto; el signo más separa la identidad del contexto del token.

```ejercicio
# Enunciado
Completa el separador entre cliente y contexto.

# Plantilla
print("web___gvs+TOKEN")

# Esperado
web.gvs+TOKEN

# Pista
Usa un punto.
```

# gvs

Contexto para URLs de Google Video Server.

# player

Contexto para la petición Innertube player.

# subs

Contexto para subtítulos.

# Varios tokens

Se separan con comas y pueden pertenecer a clientes o contextos distintos.

```python
tokens = ["web.gvs+TOKEN_A", "web.player+TOKEN_B"]
print(",".join(tokens))
```

```salida
web.gvs+TOKEN_A,web.player+TOKEN_B
```

```ejercicio
# Enunciado
Completa el contexto de subtítulos.

# Plantilla
print("web.___+TOKEN")

# Esperado
web.subs+TOKEN

# Pista
Usa la abreviatura documentada para subtitles.
```

# Cierre

La sesión siguiente controla tracing y política de obtención de PO Tokens.
