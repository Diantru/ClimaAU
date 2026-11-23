import type { ReactNode } from 'react'

export interface Filters {
  stationId: string
  periodId: string
}

export interface Option {
  value: string
  label: string
}

export interface Observation {
  date: string
  stationId: string
  minTemp: number | null
  maxTemp: number | null
  rainfall: number | null
  humidity3pm: number | null
  rainToday: boolean | null
  windGustDir: string | null
}

export interface KpiItem {
  id: string
  label: string
  value: number | null
  unit: string
  detail: string
  icon: ReactNode
}

export interface MonthlyPoint {
  month: string
  avgMaxTemp: number | null
  totalRainfall: number | null
}

export interface RainDaysItem {
  stationId: string
  stationLabel: string
  rainyDays: number | null
}

export interface WindSegment {
  label: string
  count: number
}
