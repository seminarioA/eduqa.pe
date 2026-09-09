---
numero: 1
titulo: "Memoria, punteros y propiedad de los datos"
---

# Objetivos y preparación

Esta sesión presupone arreglos y módulos del curso intermedio. Aprenderás a distinguir quién reserva memoria de quién referencia datos, transferir una reserva y evitar punteros inválidos. Guarda cada programa en un archivo independiente y compílalo con `gfortran -std=f2018 -Wall -Wextra -fcheck=all archivo.f90 -o programa`. Ejecuta `./programa` desde la misma carpeta. `-std` selecciona el estándar; `-Wall` y `-Wextra` activan advertencias; `-fcheck=all` añade comprobaciones durante la ejecución; `-o` establece el nombre de salida.

# Transferir una reserva

Un arreglo `allocatable` administra una reserva de memoria. `allocated` consulta si existe esa reserva; no debe consultarse `size` antes de comprobarla. `move_alloc(origen, destino)` transfiere la reserva al destino y deja el origen sin asignar. Si el destino ya estaba asignado, su reserva anterior se libera. El origen y el destino deben tener el mismo tipo, clase y rango.

El patrón siguiente amplía una serie: reserva espacio nuevo, copia los elementos conservados y transfiere la reserva. Los corchetes (`[]`) construyen un arreglo y el triplete `1:2` selecciona una sección. El programa comprueba tanto el contenido como el estado posterior del origen.

```fortran
program ampliar_serie
  implicit none
  integer, allocatable :: muestras(:), ampliadas(:)
  integer :: estado
  allocate(muestras(2), stat=estado)
  if (estado /= 0) error stop 'No se pudo reservar la serie'
  muestras = [12, 18]
  allocate(ampliadas(3), stat=estado)
  if (estado /= 0) error stop 'No se pudo ampliar la serie'
  ampliadas(1:2) = muestras
  ampliadas(3) = 24
  call move_alloc(ampliadas, muestras)
  if (allocated(ampliadas)) error stop 'El origen sigue asignado'
  if (any(muestras /= [12, 18, 24])) error stop 'Serie incorrecta'
  write(*,'(3(I0,1X))') muestras
end program ampliar_serie
```

```salida
12 18 24
```

> Doc: [GNU Fortran: MOVE_ALLOC](https://gcc.gnu.org/onlinedocs/gfortran/MOVE_005fALLOC.html)

> Nota: ampliar de un elemento en un elemento copia repetidamente los datos. En colecciones extensas se separa longitud utilizada de capacidad y se reserva capacidad adicional por bloques. La transferencia final evita una copia adicional, pero no elimina la copia inicial de los valores conservados.

# Referenciar un destino existente

Un `pointer` representa una asociación. El atributo `target` permite que una variable sea destino de un puntero; `=>` es la asignación de asociación y `=` modifica el valor del destino asociado. `null()` inicializa un puntero sin asociación y `nullify` elimina la asociación sin liberar el destino.

Un puntero no prolonga la vida de su destino. No se utiliza después de que el destino se libere o deje de existir. Tampoco se supone que `associated` pueda reparar o consultar con seguridad una asociación que ya quedó indefinida.

# Práctica: modificar una sección sin perder la serie

Asocia un puntero al segundo y tercer elemento de `[10, 20, 30, 40]`, incrementa solo esa sección y elimina después la asociación. Antes de consultar la solución, decide qué diferencia produciría usar `=` en lugar de `=>` en la asociación.

```fortran
program editar_ventana
  implicit none
  integer, target :: serie(4) = [10, 20, 30, 40]
  integer, pointer :: ventana(:) => null()
  ventana => serie(2:3)
  ! verificar-error: ventana = ventana + 1 => ventana = ventana + 2
  ventana = ventana + 1
  nullify(ventana)
  if (associated(ventana)) error stop 'Asociacion conservada'
  if (any(serie /= [10, 21, 31, 40])) error stop 'Seccion incorrecta'
  write(*,'(4(I0,1X))') serie
end program editar_ventana
```

```salida
10 21 31 40
```

> Doc: [Fortran-lang: punteros](https://fortran-lang.org/learn/f95_features/pointers/)

La solución modifica los elementos seleccionados en la serie original. Para comprobar tu variante, conserva las dos sentencias `if`: una asociación residual o una sección incorrecta deben terminar con error. No se llama a `deallocate(ventana)`, porque su destino es una sección de un arreglo que no se reservó mediante el puntero.

# Ejercicio en el navegador

Completa el programa y pulsa «Comprobar». El código se compila y ejecuta en tu navegador; cada intento comienza desde cero.

```ejercicio fortran
# Enunciado
Completa la operación que falta para que el programa cumpla las comprobaciones de esta sesión.
# Plantilla
program editar_ventana
  implicit none
  integer, target :: serie(4) = [10, 20, 30, 40]
  integer, pointer :: ventana(:) => null()
  ventana => serie(2:3)
  ___
  nullify(ventana)
  if (associated(ventana)) error stop 'Asociacion conservada'
  if (any(serie /= [10, 21, 31, 40])) error stop 'Seccion incorrecta'
  write(*,'(4(I0,1X))') serie
end program editar_ventana
# Esperado
10 21 31 40
# Pista
Revisa la práctica resuelta de esta sesión y las condiciones que comprueba antes de imprimir la salida.
```

# Cierre

Quedaron diferenciadas reserva, transferencia y asociación. Puedes ampliar una colección sin perder sus valores y limitar la vida de una referencia. En la siguiente sesión definirás interfaces que permiten utilizar estas estructuras sin exponer su representación interna.
