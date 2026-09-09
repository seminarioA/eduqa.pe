#include <math.h>
#include <stdio.h>

void media_c(int cantidad, const double *valores, double *promedio, int *estado);

int main(void) {
    double valores[] = {10.0, 14.0, 18.0};
    double promedio;
    int estado;
    media_c(3, valores, &promedio, &estado);
    if (estado != 0 || !isfinite(promedio) || fabs(promedio - 14.0) > 1e-12) return 1;
    printf("Media desde C: %.6f\n", promedio);
    media_c(0, valores, &promedio, &estado);
    if (estado != 1) return 1;
    valores[0] = NAN;
    media_c(3, valores, &promedio, &estado);
    if (estado != 2) return 1;
    return 0;
}
