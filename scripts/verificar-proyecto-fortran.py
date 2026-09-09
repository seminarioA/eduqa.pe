"""Construye copias aisladas del proyecto y comprueba su contrato externo."""
from pathlib import Path
import shutil
import subprocess
import tempfile

ORIGEN = Path(__file__).resolve().parents[1] / 'examples/fortran/analizador'
with tempfile.TemporaryDirectory(prefix='eduqa-proyecto-fortran-') as temporal:
    proyecto = Path(temporal) / 'analizador'
    shutil.copytree(ORIGEN, proyecto, ignore=shutil.ignore_patterns('*.o', '*.mod', 'analizador', 'pruebas', 'consumidor'))
    construir = subprocess.run(['make', 'test'], cwd=proyecto, capture_output=True, text=True, timeout=60)
    assert construir.returncode == 0, construir.stdout + construir.stderr
    correcto = subprocess.run(['./analizador', '10', '14', '18'], cwd=proyecto, capture_output=True, text=True)
    assert correcto.returncode == 0 and '14.000000' in correcto.stdout, correcto
    for argumentos in [[], ['error'], ['NaN'], ['Inf'], ['2000000'], ['1', '2 3'], ['/'], ['1,2'], ['1'*129], ['']]:
        incorrecto = subprocess.run(['./analizador', *argumentos], cwd=proyecto, capture_output=True, text=True)
        assert incorrecto.returncode != 0 and incorrecto.stderr, argumentos
    fuente = proyecto / 'estadistica.f90'
    fuente.write_text(fuente.read_text().replace('real(size(valores), real64)', 'real(size(valores)+1, real64)'))
    mutacion = subprocess.run(['make', 'test'], cwd=proyecto, capture_output=True, text=True, timeout=60)
    assert mutacion.returncode != 0 and 'Media incorrecta' in mutacion.stdout, mutacion.stdout
    print(construir.stdout.split('./pruebas\n')[-1].strip())
    print('Proyecto verificado: cinco casos de biblioteca, consumidor C, diez entradas rechazadas y mutación detectada.')
