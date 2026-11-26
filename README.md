# ClimaAU

Dashboard para explorar observaciones meteorológicas de estaciones de Australia.

## Dashboard con Firebase Realtime Database

La interfaz usa React, TypeScript, Vite y Material UI. Requiere Node.js 22.13 o superior y pnpm 11.

```sh
pnpm install --frozen-lockfile
```

El archivo `.env` apunta a la instancia de ClimaAU. Para usar otra instancia, copia `.env.example` como `.env.local` y define `VITE_FIREBASE_DATABASE_URL` con la URL que aparece en Firebase Realtime Database.

En una instancia nueva, importa `weatherAUS.json` en el nodo `/weather` y publica el contenido de `database.rules.json` en la pestaña **Reglas**. Si importas desde la raíz, el archivo debe contener el arreglo original dentro de una propiedad `weather`. Las reglas permiten consultar el conjunto meteorológico, bloquean las escrituras desde el cliente e indexan `Date`.

```sh
pnpm dev
```

Abre la dirección que imprime Vite. Ejecuta `pnpm check` para verificar los tipos y `pnpm build` para generar la compilación de producción.

- `src/pages/DashboardPage.tsx` mantiene el estado de la navegación y de los filtros. También prepara los datos que reciben los componentes visuales.
- `src/components/` contiene el encabezado, la navegación, los filtros, las tarjetas, los gráficos y la tabla.
- `src/data/firebase.ts` inicializa el SDK de Firebase y `src/data/weatherRepository.ts` consulta las observaciones por año. `src/data/useWeatherObservations.ts` coordina la carga, el resultado y los errores en React.

Firebase almacena las 145 460 observaciones de WeatherAUS. Cuando Realtime Database omite campos con valor `null`, la aplicación interpreta esas mediciones ausentes como valores nulos. Los filtros del dashboard ofrecen 2015 y 2016 para Sydney, Melbourne, Brisbane, Perth y Adelaide. Los indicadores y el CSV usan todos los registros disponibles de la estación y el año seleccionados. La tabla muestra los ocho registros más recientes de esa selección.

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

