/*
 * Ejercicios de completado de la sesión 1.
 *
 * Reglas de este archivo:
 *  - Sin emojis.
 *  - Cada ejercicio ejercita un solo concepto de la sesión, en el orden en
 *    que aparecen en el temario.
 *  - `plantilla` lleva un hueco marcado con ___ y nada más: dos huecos en un
 *    ejercicio convierten la corrección en adivinanza.
 *  - `esperado` es la salida exacta que produce la solución correcta. Se
 *    compara con lo que imprime Python, no con el texto que escribió el
 *    alumno: así vale cualquier expresión que dé el resultado, y no una sola
 *    forma de escribirlo.
 */

export type Ejercicio = {
  id: string;
  enunciado: string;
  plantilla: string;
  esperado: string;
  /** Se muestra a petición, nunca de entrada. */
  pista: string;
};

export const HUECO = "___";

export const ejerciciosPython1: Ejercicio[] = [
  {
    id: "asignacion",
    enunciado:
      "Asigna el número 2500 a la variable precio, para que la línea siguiente lo imprima.",
    plantilla: "precio = ___\nprint(precio)",
    esperado: "2500",
    pista: "Una asignación no necesita comillas cuando el valor es un número.",
  },
  {
    id: "tipo",
    enunciado:
      "Completa la llamada que devuelve el tipo de un valor, para que imprima la clase de 3.14.",
    plantilla: "print(___(3.14))",
    esperado: "<class 'float'>",
    pista:
      "Es la función incorporada que recibe un objeto y devuelve su clase.",
  },
  {
    id: "concatenar",
    enunciado:
      "Une las dos cadenas con el operador de concatenación, de modo que salga «Hola Ana».",
    plantilla: 'saludo = "Hola "\nnombre = "Ana"\nprint(saludo ___ nombre)',
    esperado: "Hola Ana",
    pista:
      "El mismo símbolo que suma números también une cadenas, pero solo entre cadenas.",
  },
  {
    id: "repetir",
    enunciado:
      "Repite el guion diez veces con el operador de repetición de cadenas.",
    plantilla: 'print("-" ___ 10)',
    esperado: "----------",
    pista:
      "Es el operador de multiplicación, aplicado a una cadena y un entero.",
  },
  {
    id: "division-entera",
    enunciado:
      "Usa el operador que descarta la parte decimal para repartir 17 entre 5.",
    plantilla: "print(17 ___ 5)",
    esperado: "3",
    pista:
      "Lleva dos caracteres iguales. Con uno solo el resultado sería 3.4, un float.",
  },
  {
    id: "modulo",
    enunciado: "Obtén el resto de dividir 17 entre 5.",
    plantilla: "print(17 ___ 5)",
    esperado: "2",
    pista: "El mismo símbolo que en un porcentaje.",
  },
  {
    id: "fstring",
    enunciado:
      "Marca la cadena como literal formateado para que la llave se sustituya por el valor.",
    plantilla: 'stock = 12\nprint(___"Quedan {stock} unidades")',
    esperado: "Quedan 12 unidades",
    pista:
      "Es una sola letra delante de la comilla de apertura, sin espacio de por medio.",
  },
  {
    id: "formato-decimales",
    enunciado:
      "Fija dos decimales en el f-string, para que 2950.0 se imprima como 2950.00.",
    plantilla: 'total = 2950.0\nprint(f"Total: {total:___}")',
    esperado: "Total: 2950.00",
    pista:
      "Un punto, la cantidad de decimales y la letra del formato de coma fija.",
  },
  {
    id: "conversion",
    enunciado:
      "Convierte el texto a entero para poder sumarle 1. Sin la conversión, el operador uniría dos cosas de distinto tipo y fallaría.",
    plantilla: 'edad = "29"\nprint(___(edad) + 1)',
    esperado: "30",
    pista: "La función lleva el mismo nombre que el tipo de los enteros.",
  },
  {
    id: "booleano",
    enunciado:
      "Completa la comparación para que el resultado sea True: 2500 tiene que ser mayor que 1000.",
    plantilla: "print(2500 ___ 1000)",
    esperado: "True",
    pista: "Un solo carácter, el que se abre hacia el número más grande.",
  },
];
