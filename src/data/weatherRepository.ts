import { endAt, get, orderByChild, query, ref, startAt } from 'firebase/database'
import type { Observation } from '../types'
import { getWeatherDatabase } from './firebase'

interface WeatherRecord {
  Date: string
  Location: string
  MinTemp?: number
  MaxTemp?: number
  Rainfall?: number
  Humidity3pm?: number
  RainToday?: 'Yes' | 'No' | null
  WindGustDir?: string
}

export async function fetchWeatherObservations(year: string): Promise<Observation[]> {
  const records = ref(getWeatherDatabase(), 'weather')
  const yearQuery = query(
    records,
    orderByChild('Date'),
    startAt(`${year}-01-01`),
    endAt(`${year}-12-31`),
  )
  const snapshot = await get(yearQuery)
  const observations: Observation[] = []

  snapshot.forEach((child) => {
    const record = child.val() as WeatherRecord
    observations.push({
      date: record.Date,
      stationId: record.Location.toLowerCase(),
      minTemp: record.MinTemp ?? null,
      maxTemp: record.MaxTemp ?? null,
      rainfall: record.Rainfall ?? null,
      humidity3pm: record.Humidity3pm ?? null,
      rainToday: record.RainToday == null ? null : record.RainToday === 'Yes',
      windGustDir: record.WindGustDir ?? null,
    })
  })

  return observations
}
