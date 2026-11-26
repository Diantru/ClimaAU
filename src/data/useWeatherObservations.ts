import { useEffect, useState } from 'react'
import type { Observation } from '../types'
import { fetchWeatherObservations } from './weatherRepository'

type WeatherResult =
  | { status: 'success'; observations: Observation[] }
  | { status: 'error'; message: string }

interface WeatherQuery {
  year: string
  attempt: number
  result: WeatherResult
}

export function useWeatherObservations(year: string) {
  const [query, setQuery] = useState<WeatherQuery | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true

    async function loadObservations() {
      try {
        const observations = await fetchWeatherObservations(year)
        if (active) setQuery({ year, attempt, result: { status: 'success', observations } })
      } catch (error) {
        if (!active) return
        console.error('No se pudieron consultar las observaciones en Firebase.', error)
        setQuery({
          year,
          attempt,
          result: { status: 'error', message: 'No se pudieron cargar las observaciones desde Firebase.' },
        })
      }
    }

    void loadObservations()
    return () => { active = false }
  }, [year, attempt])

  const result = query?.year === year && query.attempt === attempt ? query.result : null
  return { result, retry: () => setAttempt((previous) => previous + 1) }
}
