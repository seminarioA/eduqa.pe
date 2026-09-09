FC = gfortran
CC = cc
FFLAGS = -std=f2018 -Wall -Wextra -fcheck=all -g
CFLAGS = -std=c11 -Wall -Wextra

.PHONY: all test run clean
all: analizador consumidor

estadistica.o: estadistica.f90
	$(FC) $(FFLAGS) -c $<
analizador: analizador.f90 estadistica.o
	$(FC) $(FFLAGS) $^ -o $@
pruebas: pruebas.f90 estadistica.o
	$(FC) $(FFLAGS) $^ -o $@
interfaz_c.o: interfaz_c.f90 estadistica.o
	$(FC) $(FFLAGS) -c $<
consumidor.o: consumidor.c
	$(CC) $(CFLAGS) -c $<
consumidor: consumidor.o interfaz_c.o estadistica.o
	$(FC) $^ -lm -o $@
test: pruebas consumidor analizador
	./pruebas
	./consumidor
run: analizador
	./analizador 10 14 18
clean:
	rm -f *.o *.mod analizador pruebas consumidor
