---
numero: 3
titulo: "Decisiones y bucles"
---

# Objetivos y referencias

La sesión combina explicación, programas completos y una práctica resuelta. Cada ejemplo se compila en su propio archivo; no depende de haber ejecutado otra sesión. Las referencias enlazan documentación pública del lenguaje y del compilador.

Al terminar la sesión podrás construir condiciones completas, ordenar ramas que se excluyen, seleccionar casos discretos y recorrer procesos mediante bucles cuyo criterio de terminación sea visible y verificable.

# Valores y expresiones lógicas

El tipo `logical` almacena `.true.` o `.false.`. Una expresión relacional compara dos valores y produce uno de esos resultados. Los seis operadores relacionales simbólicos son igualdad (`==`), desigualdad (`/=`), menor que (`<`), menor o igual que (`<=`), mayor que (`>`) y mayor o igual que (`>=`).

Fortran también admite las grafías históricas `.eq.`, `.ne.`, `.lt.`, `.le.`, `.gt.` y `.ge.`. En código nuevo, las formas simbólicas suelen mostrar mejor la relación matemática. Los dos operandos deben ser comparables; una cadena no se compara numéricamente con un entero.

```fortran
program relaciones_presion
  implicit none
  real :: presion_pa
  real :: referencia_pa
  logical :: igual
  logical :: distinta
  logical :: menor
  logical :: no_mayor
  logical :: mayor
  logical :: no_menor

  presion_pa = 101420.0
  referencia_pa = 101325.0
  igual = presion_pa == referencia_pa
  distinta = presion_pa /= referencia_pa
  menor = presion_pa < referencia_pa
  no_mayor = presion_pa <= referencia_pa
  mayor = presion_pa > referencia_pa
  no_menor = presion_pa >= referencia_pa

  print *, igual, distinta, menor
  print *, no_mayor, mayor, no_menor
end program relaciones_presion
```

```salida
 F T F
 F T T
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

Cada asignación muestra uno de los seis operadores. En datos reales calculados, `==` y `/=` comparan representaciones exactas; para equivalencia aproximada se formula una tolerancia como en la sesión anterior.

# Operadores lógicos combinatorios

La negación (`.not.`) invierte un valor lógico. La conjunción (`.and.`) es verdadera cuando ambos operandos son verdaderos. La disyunción (`.or.`) es verdadera cuando al menos uno es verdadero. La equivalencia (`.eqv.`) es verdadera cuando ambos operandos tienen el mismo valor lógico y la no equivalencia (`.neqv.`), cuando difieren.

Fortran no garantiza evaluación con cortocircuito. Si una segunda condición divide por una variable o accede a un elemento cuya validez depende de la primera condición, utiliza bloques `if` anidados.

La precedencia lógica coloca primero las relaciones, luego `.not.`, después `.and.`, a continuación `.or.` y finalmente `.eqv.` o `.neqv.`. Los paréntesis deben conservarse cuando hagan visible la condición científica o de seguridad.

```fortran
program ventana_operativa
  implicit none
  real :: temperatura_c
  real :: presion_kpa
  logical :: mantenimiento
  logical :: dentro_de_rango
  logical :: operacion_permitida

  temperatura_c = 42.0
  presion_kpa = 180.0
  mantenimiento = .false.
  dentro_de_rango = (temperatura_c >= 15.0) .and. &
                    (temperatura_c <= 55.0) .and. &
                    (presion_kpa >= 120.0) .and. &
                    (presion_kpa <= 220.0)
  operacion_permitida = dentro_de_rango .and. (.not. mantenimiento)

  print *, operacion_permitida
end program ventana_operativa
```

```salida
 T
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

Los límites inferior y superior se escriben por separado: Fortran no interpreta una cadena matemática como `15.0 <= temperatura_c <= 55.0`. Cada relación produce un lógico y `.and.` combina los resultados.

# IF de una sola rama

El bloque `if` ejecuta su cuerpo solo cuando la expresión entre paréntesis es verdadera. La palabra clave `then` introduce el bloque y `end if` lo cierra. La sangría no modifica el significado, pero permite reconocer los límites de la rama.

```fortran
program advertencia_esfuerzo
  implicit none
  real :: esfuerzo_mpa
  real, parameter :: limite_mpa = 250.0

  esfuerzo_mpa = 267.0

  if (esfuerzo_mpa > limite_mpa) then
    print *, 'El esfuerzo supera el limite definido.'
  end if
end program advertencia_esfuerzo
```

```salida
 El esfuerzo supera el limite definido.
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

Cuando la condición es falsa, la ejecución continúa después de `end if`. El bloque no necesita una rama alternativa si no existe una operación válida para ese caso.

# IF, ELSE IF y ELSE

Una cadena `if` evalúa condiciones de arriba hacia abajo. Se ejecuta el bloque de la primera condición verdadera y se omiten los restantes. `else` recibe todos los casos no capturados antes. Por tanto, el orden forma parte del algoritmo cuando los intervalos se solapan.

```fortran
program clasificacion_residuo
  implicit none
  real :: residuo
  real :: magnitud

  residuo = -0.034
  magnitud = abs(residuo)

  if (magnitud <= 0.001) then
    print *, 'Convergencia estricta.'
  else if (magnitud <= 0.010) then
    print *, 'Convergencia moderada.'
  else if (magnitud <= 0.050) then
    print *, 'Aproximacion inicial.'
  else
    print *, 'El residuo requiere revision.'
  end if
end program clasificacion_residuo
```

```salida
 Aproximacion inicial.
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

Las condiciones avanzan del intervalo más restrictivo al más amplio. Si la segunda prueba se evaluara primero, también capturaría los valores que pertenecen a la categoría estricta.

# SELECT CASE para categorías discretas

`select case (expresion)` compara una expresión entera, de caracteres o lógica con selectores mutuamente excluyentes. `case (valor)` selecciona un valor; `case (inferior:superior)`, un intervalo cerrado; `case (:superior)`, un intervalo sin límite inferior; y `case (inferior:)`, uno sin límite superior. Una lista separada por comas reúne varios selectores.

`case default` procesa valores no contemplados. Aunque es opcional en la sintaxis, incluirlo hace visible la política para entradas inválidas o estados nuevos.

```fortran
program regimen_bomba
  implicit none
  integer :: codigo_modo

  codigo_modo = 2

  select case (codigo_modo)
  case (0)
    print *, 'Bomba detenida.'
  case (1)
    print *, 'Caudal reducido.'
  case (2, 3)
    print *, 'Regimen de operacion.'
  case (4:6)
    print *, 'Regimen de prueba.'
  case default
    print *, 'Codigo de modo no valido.'
  end select
end program regimen_bomba
```

```salida
 Regimen de operacion.
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

Ningún valor puede pertenecer a dos selectores del mismo constructo. Cuando la decisión depende de varias variables o de relaciones diferentes, una cadena `if` expresa mejor la lógica que `select case`.

# El bucle DO contado

El bucle contado adopta la forma `do indice = inicio, fin, paso`. Inicio, fin y paso se evalúan al entrar al bucle. El paso es opcional y su valor predeterminado es uno. Un paso positivo requiere un inicio no mayor que el final para ejecutar alguna iteración; un paso negativo requiere el orden contrario.

El índice debe ser entero en código moderno y no se modifica dentro del cuerpo. Después de `end do`, no se debe depender de su valor. El cuerpo puede ejecutarse cero veces si los parámetros no describen un recorrido válido.

```fortran
program suma_trabajo
  implicit none
  integer :: intervalo
  integer, parameter :: cantidad_intervalos = 6
  real :: fuerza_n(cantidad_intervalos)
  real :: desplazamiento_m
  real :: trabajo_j

  fuerza_n = [12.0, 13.5, 15.0, 14.0, 11.5, 10.0]
  desplazamiento_m = 0.25
  trabajo_j = 0.0

  do intervalo = 1, cantidad_intervalos
    trabajo_j = trabajo_j + fuerza_n(intervalo) * desplazamiento_m
  end do

  print *, trabajo_j
end program suma_trabajo
```

```salida
   19.0000000
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

El acumulador `trabajo_j` se inicializa antes del bucle. Cada iteración añade la contribución de un intervalo; omitir la inicialización haría que el primer cálculo utilizara un valor indefinido.

# Pasos descendentes y no unitarios

El tercer parámetro del `do` es el incremento. Un valor de dos recorre posiciones alternas y un valor negativo recorre en sentido descendente. El incremento no puede ser cero.

```fortran !sin-consola
program barrido_descendente
  implicit none
  integer :: nivel

  do nivel = 10, 2, -2
    print *, nivel
  end do
end program barrido_descendente
```

```salida
          10
           8
           6
           4
           2
```

> Nota: Esta construcción no reproduce todavía la salida correcta con el compilador web fijado. Ejecuta este ejemplo con GNU Fortran en tu equipo; el ejercicio de la sesión sí se puede resolver en el navegador.

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

El límite final se incluye cuando el índice lo alcanza exactamente. Este bucle visita una secuencia descendente porque el incremento es `-2`; con un incremento positivo no ejecutaría ninguna iteración.

# DO WHILE y condición previa

`do while (condicion)` comprueba la condición antes de cada iteración. Si comienza falsa, el cuerpo se ejecuta cero veces. Alguna operación del cuerpo debe modificar los datos de los que depende la condición; de otro modo, el bucle puede no terminar.

```fortran
program enfriamiento_iterativo
  implicit none
  integer :: iteracion
  integer, parameter :: max_iteraciones = 100
  real :: temperatura_c
  real, parameter :: objetivo_c = 30.0

  iteracion = 0
  temperatura_c = 85.0

  do while ((temperatura_c > objetivo_c) .and. &
            (iteracion < max_iteraciones))
    temperatura_c = temperatura_c - 0.08 * (temperatura_c - 20.0)
    iteracion = iteracion + 1
  end do

  print *, iteracion, temperatura_c
end program enfriamiento_iterativo
```

```salida
          23   29.5506611
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

El límite de iteraciones evita una espera ilimitada si el modelo deja de acercarse al objetivo. Al salir, el programa debe distinguir si alcanzó el criterio térmico o agotó el límite cuando esa diferencia afecte decisiones posteriores.

# Terminación anticipada con EXIT

Un `do` sin parámetros repite su cuerpo hasta que una sentencia transfiere el control. `exit` termina el bucle más interno y continúa después de `end do`. Esta forma resulta clara cuando la condición de terminación se calcula en medio del cuerpo. El ejemplo siguiente conserva un bucle contado para imponer además un máximo; `exit` funciona tanto en bucles contados como indefinidos.

```fortran
program aproximacion_raiz
  implicit none
  integer :: iteracion
  integer, parameter :: max_iteraciones = 40
  real :: estimacion
  real :: nueva_estimacion
  real, parameter :: tolerancia = 1.0e-6

  estimacion = 1.0

  do iteracion = 1, max_iteraciones
    nueva_estimacion = 0.5 * (estimacion + 2.0 / estimacion)
    if (abs(nueva_estimacion - estimacion) <= tolerancia) exit
    estimacion = nueva_estimacion
  end do

  print *, nueva_estimacion
end program aproximacion_raiz
```

```salida
   1.41421354
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

La sentencia `if` lógica de una línea ejecuta aquí únicamente `exit`. No sustituye un bloque cuando una condición controla varias sentencias. El máximo de iteraciones hace que la terminación sea demostrable incluso si la tolerancia no se alcanza.

# CYCLE y la iteración actual

`cycle` abandona el resto de la iteración actual y vuelve al control del bucle para iniciar la siguiente. No termina el bucle completo. Conviene usarlo para descartar un dato antes de ejecutar cálculos que presuponen su validez.

```fortran
program promedio_lecturas_validas
  implicit none
  integer :: posicion
  integer :: cantidad_validas
  real :: lecturas_c(6)
  real :: suma_c

  lecturas_c = [19.8, -999.0, 20.1, 20.0, -999.0, 19.9]
  cantidad_validas = 0
  suma_c = 0.0

  do posicion = 1, size(lecturas_c)
    if (lecturas_c(posicion) == -999.0) cycle
    suma_c = suma_c + lecturas_c(posicion)
    cantidad_validas = cantidad_validas + 1
  end do

  if (cantidad_validas > 0) then
    print *, suma_c / real(cantidad_validas)
  else
    print *, 'No hay lecturas validas.'
  end if
end program promedio_lecturas_validas
```

```salida
   19.9500008
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

La constante centinela se compara de forma exacta porque proviene de un código de ausencia asignado de forma directa, no de un cálculo real. En un sistema real, la política de datos ausentes debe estar definida por el formato de adquisición.

# Bucles anidados y nombres

Un nombre seguido de dos puntos (`:`) puede identificar un constructo. `exit nombre` termina el bucle nombrado y `cycle nombre` inicia la siguiente iteración de ese bucle. Los nombres eliminan ambigüedad cuando existen bucles anidados.

```fortran
program localizar_umbral
  implicit none
  integer :: fila
  integer :: columna
  integer :: fila_encontrada
  integer :: columna_encontrada
  real :: campo(3, 4)
  real, parameter :: umbral = 8.0

  campo = reshape([1.0, 2.0, 3.0, 4.0, 9.0, 6.0, &
                   7.0, 8.0, 5.0, 2.0, 1.0, 0.0], shape(campo))
  fila_encontrada = 0
  columna_encontrada = 0

  buscar: do columna = 1, size(campo, 2)
    do fila = 1, size(campo, 1)
      if (campo(fila, columna) > umbral) then
        fila_encontrada = fila
        columna_encontrada = columna
        exit buscar
      end if
    end do
  end do buscar

  print *, fila_encontrada, columna_encontrada
end program localizar_umbral
```

```salida
           2           2
```

> Doc: [Operadores y control](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

`exit buscar` abandona ambos niveles porque el nombre pertenece al bucle exterior. El orden de los índices recorre primero las filas de cada columna, coherente con el almacenamiento por columnas de los arreglos Fortran.

# Práctica: contar observaciones sobre un umbral

Recorre cuatro mediciones y cuenta solo las que superan estrictamente 20. El caso de frontera, una medición igual a 20, permite distinguir `>` de `>=`. Mantén la comprobación después del bucle para verificar ambas variantes.

```fortran
program practica_umbral
  implicit none
  integer :: mediciones(4), indice, superiores
  mediciones = [18, 20, 22, 25]
  superiores = 0
  do indice = 1, size(mediciones)
    ! verificar-error: mediciones(indice) > 20 => mediciones(indice) >= 20
    if (mediciones(indice) > 20) superiores = superiores + 1
  end do
  if (superiores /= 2) error stop 'El limite se conto incorrectamente'
  write(*,'(I0)') superiores
end program practica_umbral
```

```salida
2
```

> Doc: [Fortran-lang: control de flujo](https://fortran-lang.org/learn/quickstart/operators_control_flow/)

La solución inicializa el contador una vez y lo incrementa solo dentro de la condición. Si se inicializara dentro del bucle, se perdería el conteo anterior. La sesión siguiente desarrolla los arreglos empleados para reunir las mediciones.

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program practica_umbral
  implicit none
  integer :: mediciones(4), indice, superiores
  mediciones = [18, 20, 22, 25]
  superiores = 0
  do indice = 1, size(mediciones)
    if (___) superiores = superiores + 1
  end do
  if (superiores /= 2) error stop 'El limite se conto incorrectamente'
  write(*,'(I0)') superiores
end program practica_umbral
# Esperado
2
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Esta sesión cubrió los seis operadores relacionales, cinco operadores lógicos, bloques `if`, cadenas `else if`, selección por casos y bucles contados, condicionales, indefinidos, anidados y controlados por `cycle` o `exit`.

La sesión siguiente organiza colecciones de datos mediante arreglos y separa responsabilidades mediante subrutinas, funciones y módulos. Las estructuras de control aprendidas aquí se utilizarán dentro de esos procedimientos sin depender de estado oculto.
