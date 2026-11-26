import type { MonthlyPoint, Observation, Option, WindSegment } from '../types'

export const stationOptions: Option[] = [
  { value: 'sydney', label: 'Sydney' },
  { value: 'melbourne', label: 'Melbourne' },
  { value: 'brisbane', label: 'Brisbane' },
  { value: 'perth', label: 'Perth' },
  { value: 'adelaide', label: 'Adelaide' },
]

export const periodOptions: Option[] = [
  { value: '2016', label: 'Año 2016' },
  { value: '2015', label: 'Año 2015' },
]

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

type Measurement = 'maxTemp' | 'rainfall' | 'humidity3pm'

function measuredValues(rows: readonly Observation[], field: Measurement) {
  return rows.map((row) => row[field]).filter((value) => value !== null)
}

function sum(values: readonly number[]) {
  return values.reduce((total, value) => total + value, 0)
}

export function average(rows: readonly Observation[], field: Measurement) {
  const values = measuredValues(rows, field)
  return values.length ? sum(values) / values.length : null
}

export function totalRainfall(rows: readonly Observation[]) {
  const values = measuredValues(rows, 'rainfall')
  return values.length ? sum(values) : null
}

export function countRainyDays(rows: readonly Observation[]) {
  const measured = rows.filter((row) => row.rainToday !== null)
  return measured.length ? measured.filter((row) => row.rainToday).length : null
}

export function monthlyClimate(rows: readonly Observation[]): MonthlyPoint[] {
  return months.map((month, index) => {
    const monthNumber = String(index + 1).padStart(2, '0')
    const monthRows = rows.filter((row) => row.date.slice(5, 7) === monthNumber)
    return {
      month,
      avgMaxTemp: average(monthRows, 'maxTemp'),
      totalRainfall: totalRainfall(monthRows),
    }
  })
}

export function windDistribution(rows: readonly Observation[]) {
  const counts = new Map<string, number>()
  for (const { windGustDir } of rows) {
    if (windGustDir !== null) {
      counts.set(windGustDir, (counts.get(windGustDir) ?? 0) + 1)
    }
  }

  const directions = Array.from(counts).sort(([a, countA], [b, countB]) =>
    countB - countA || a.localeCompare(b),
  )
  const segments: WindSegment[] = directions.slice(0, 3).map(([label, count]) => ({ label, count }))
  const other = sum(directions.slice(3).map(([, count]) => count))
  if (other > 0) segments.push({ label: 'Otras', count: other })
  return { segments, total: sum(segments.map(({ count }) => count)) }
}

export function downloadObservations(
  rows: readonly Observation[],
  stationLabel: string,
  periodId: string,
) {
  const header = 'Date,Location,MinTemp,MaxTemp,Rainfall,Humidity3pm,RainToday,WindGustDir'
  const records = rows.map((row) => [
    row.date,
    stationLabel,
    row.minTemp,
    row.maxTemp,
    row.rainfall,
    row.humidity3pm,
    row.rainToday === null ? null : row.rainToday ? 'Yes' : 'No',
    row.windGustDir,
  ].join(','))
  const csv = new Blob([[header, ...records].join('\r\n') + '\r\n'], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(csv)
  const link = document.createElement('a')
  link.href = url
  link.download = `climaau-${stationLabel.toLowerCase()}-${periodId}.csv`
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
