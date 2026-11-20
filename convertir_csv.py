"""Convierte el CSV Rain in Australia a un arreglo JSON validado."""

import argparse
import csv
from datetime import date
import json
import math
import os
from pathlib import Path
from tempfile import NamedTemporaryFile


NUMERICAS = set("""
MinTemp MaxTemp Rainfall Evaporation Sunshine WindGustSpeed WindSpeed9am
WindSpeed3pm Humidity9am Humidity3pm Pressure9am Pressure3pm Cloud9am Cloud3pm
Temp9am Temp3pm
""".split())
DIRECCIONES = set("N NNE NE ENE E ESE SE SSE S SSW SW WSW W WNW NW NNW".split())
CATEGORIAS = {
    "Location": None,
    "WindGustDir": DIRECCIONES,
    "WindDir9am": DIRECCIONES,
    "WindDir3pm": DIRECCIONES,
    "RainToday": {"Yes", "No"},
    "RainTomorrow": {"Yes", "No"},
}
COLUMNAS = NUMERICAS | CATEGORIAS.keys() | {"Date"}
MARCADORES_FALTANTES = {"", "NA", "N/A", "NULL"}


def convertir_valor(columna, valor):
    valor = valor.strip()
    if valor.upper() in MARCADORES_FALTANTES:
        return None

    if columna == "Date":
        return date.fromisoformat(valor).isoformat()

    if columna in NUMERICAS:
        try:
            return int(valor)
        except ValueError:
            numero = float(valor)
        if not math.isfinite(numero):
            raise ValueError("se esperaba un número finito")
        return numero

    opciones = CATEGORIAS[columna]
    if opciones is not None and valor not in opciones:
        raise ValueError("categoría desconocida")
    return valor


def escribir_json(origen, temporal):
    with origen.open(encoding="utf-8-sig", newline="") as entrada:
        filas = csv.reader(entrada, strict=True)
        encabezados = [campo.strip() for campo in next(filas, [])]
        if len(encabezados) != len(set(encabezados)):
            raise ValueError("hay encabezados repetidos")
        if set(encabezados) != COLUMNAS:
            faltan = sorted(COLUMNAS - set(encabezados))
            sobran = sorted(set(encabezados) - COLUMNAS)
            raise ValueError(f"columnas incompatibles. Faltan {faltan}. Sobran {sobran}.")

        cantidad = 0
        lineas_vacias = 0
        temporal.write("[\n")
        for fila in filas:
            if not fila or (len(fila) == 1 and not fila[0].strip()):
                lineas_vacias += 1
                continue
            if len(fila) != len(encabezados):
                raise ValueError(f"línea {filas.line_num} con {len(fila)} columnas. "
                                 f"Se esperaban {len(encabezados)}.")

            registro = {}
            for columna, valor in zip(encabezados, fila):
                try:
                    registro[columna] = convertir_valor(columna, valor)
                except ValueError as error:
                    raise ValueError(f"línea {filas.line_num}, columna {columna}, "
                                     f"valor {valor!r}. {error}") from error

            if cantidad:
                temporal.write(",\n")
            temporal.write("  " + json.dumps(registro, ensure_ascii=False, allow_nan=False,
                                              separators=(",", ":")))
            cantidad += 1
        temporal.write("\n]\n")
    return cantidad, lineas_vacias


def validar_json(ruta, cantidad):
    with ruta.open(encoding="utf-8") as archivo:
        registros = json.load(archivo)
    if not isinstance(registros, list) or len(registros) != cantidad:
        raise ValueError("la estructura o el conteo del JSON no coincide con el CSV")

    faltantes = 0
    for indice, registro in enumerate(registros, start=1):
        if not isinstance(registro, dict) or registro.keys() != COLUMNAS:
            raise ValueError(f"estructura incorrecta en el registro JSON {indice}")
        for columna, valor in registro.items():
            if valor is None:
                faltantes += 1
            elif columna in NUMERICAS:
                numero_valido = type(valor) is int or (type(valor) is float and math.isfinite(valor))
                if not numero_valido:
                    raise ValueError(f"número inválido en registro JSON {indice}, {columna}")
            elif not isinstance(valor, str) or convertir_valor(columna, valor) != valor:
                raise ValueError(f"texto o fecha inválida en registro JSON {indice}, {columna}")
    return len(registros), faltantes


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv", type=Path, help="ruta del CSV original")
    parser.add_argument("json", type=Path, help="ruta del JSON que se va a generar")
    args = parser.parse_args()
    if args.csv.resolve() == args.json.resolve():
        parser.error("indica rutas diferentes para el CSV y el JSON")

    ruta_temporal = None
    try:
        with NamedTemporaryFile(mode="w", encoding="utf-8", newline="\n", delete=False,
                                dir=args.json.parent, suffix=".tmp") as archivo:
            ruta_temporal = Path(archivo.name)
            cantidad_csv, lineas_vacias = escribir_json(args.csv, archivo)
        cantidad_json, faltantes = validar_json(ruta_temporal, cantidad_csv)
        os.replace(ruta_temporal, args.json)
    except (OSError, csv.Error, ValueError, OverflowError) as error:
        parser.exit(1, f"Error de conversión. {error}\n")
    finally:
        if ruta_temporal is not None:
            ruta_temporal.unlink(missing_ok=True)

    print(f"Registros del CSV (sin encabezado): {cantidad_csv}")
    print(f"Registros del JSON validado: {cantidad_json}")
    print(f"Celdas representadas como null: {faltantes}")
    print(f"Líneas vacías omitidas: {lineas_vacias}")
    print(f"Archivo generado: {args.json}")


if __name__ == "__main__":
    main()
