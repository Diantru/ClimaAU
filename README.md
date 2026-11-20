# Transformación de datos CSV a JSON

El script `convertir_csv.py` convierte el archivo de [Rain in Australia en Kaggle](https://www.kaggle.com/datasets/jsphyg/weather-dataset-rattle-package) en un arreglo JSON con un objeto por observación. Conserva los nombres y el orden de las columnas del CSV.

## Cómo ejecutar la conversión

Coloca `convertir_csv.py` y `weatherAUS.csv` en la misma carpeta. Abre PowerShell en esa carpeta y ejecuta el comando con Python 3. El script usa únicamente la biblioteca estándar.

```powershell
py -3 convertir_csv.py weatherAUS.csv weatherAUS.json
```

Si tu instalación usa el comando `python`, reemplaza `py -3` por `python`.

## Limpieza y validación

- El script recorta los espacios al inicio y al final de cada campo. Las celdas vacías o con los marcadores `NA`, `N/A` o `NULL` se guardan como `null`.
- `Date` se guarda en formato `AAAA-MM-DD`, los campos de estación, dirección del viento y lluvia `Yes`/`No` se guardan como texto, y las mediciones se guardan como números.
- Si una fila tiene un número incorrecto de columnas o un valor inválido, el script detiene la conversión e indica la línea. Si el valor es inválido, también indica la columna.
- El script vuelve a abrir el JSON y verifica su estructura, los tipos y el conteo antes de guardar el resultado definitivo.

En la ejecución sobre el CSV de Kaggle se obtuvieron **145 460 registros en ambos archivos**, con **343 248 celdas representadas como `null`** y **0 líneas vacías omitidas**.

