/**
 * Interpolación de Newton por diferencias divididas
 * 
 * Permite evaluar el polinomio interpolador de Newton en un punto x
 * dados los puntos (xs[i], ys[i]).
 * 
 * @param {number[]} xs - Array de coordenadas x (deben ser distintos)
 * @param {number[]} ys - Array de coordenadas y correspondientes
 * @param {number} x - Punto donde evaluar el polinomio
 * @returns {number} Valor interpolado en x
 * @throws {NumericalError} Si los datos no son válidos
 * 
 * @example
 * // Puntos de una parábola: y = x²
 * newtonDiferenciasDivididas([1, 2, 3], [1, 4, 9], 2.5) // 6.25
 */
export class NumericalError extends Error {
  constructor(message) {
    super(message);
    this.name = "NumericalError";
  }
}

export function newtonDiferenciasDivididas(xs, ys, x) {
  // Validación 1: mismos tamaños
  if (xs.length !== ys.length) {
    throw new NumericalError(`Los arrays xs y ys deben tener la misma longitud. xs.length=${xs.length}, ys.length=${ys.length}`);
  }
  
  // Validación 2: al menos 2 puntos
  if (xs.length < 2) {
    throw new NumericalError(`Se necesitan al menos 2 puntos para la interpolación. xs.length=${xs.length}`);
  }
  
  // Validación 3: puntos x distintos (evita división por cero)
  for (let i = 0; i < xs.length; i++) {
    for (let j = i + 1; j < xs.length; j++) {
      if (xs[i] === xs[j]) {
        throw new NumericalError(`Los valores de xs deben ser distintos. xs[${i}]=${xs[i]}, xs[${j}]=${xs[j]}`);
      }
    }
  }

  const n = xs.length;
  
  // Crear tabla de diferencias divididas
  const tabla = [];
  for (let i = 0; i < n; i++) {
    tabla.push(new Array(n).fill(0));
    tabla[i][0] = ys[i];
  }

  // Calcular diferencias divididas
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      tabla[i][j] = (tabla[i + 1][j - 1] - tabla[i][j - 1]) / (xs[i + j] - xs[i]);
    }
  }

  // Evaluar polinomio usando método anidado
  let resultado = tabla[0][0];
  let termino = 1;

  for (let i = 1; i < n; i++) {
    termino *= (x - xs[i - 1]);
    resultado += tabla[0][i] * termino;
  }

  return resultado;
}
