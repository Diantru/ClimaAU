import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { BarChart3, CloudRain, Droplets, LayoutDashboard, List, Thermometer } from 'lucide-react'
import { DashboardHeader } from '../components/DashboardHeader'
import { DashboardLayout } from '../components/DashboardLayout'
import { DashboardNav } from '../components/DashboardNav'
import { DashboardSection } from '../components/DashboardSection'
import { FilterPanel } from '../components/FilterPanel'
import { KpiGrid } from '../components/KpiGrid'
import { MonthlyClimateChart } from '../components/MonthlyClimateChart'
import { ObservationsTable } from '../components/ObservationsTable'
import { RainDaysChart } from '../components/RainDaysChart'
import { WindDirectionChart } from '../components/WindDirectionChart'
import {
  average,
  countRainyDays,
  downloadObservations,
  monthlyClimate,
  periodOptions,
  stationOptions,
  totalRainfall,
  windDistribution,
} from '../data/weather'
import type { Filters, KpiItem, Observation } from '../types'

const defaultFilters: Filters = { stationId: 'sydney', periodId: '2016' }

const navigationItems = [
  { id: 'resumen', label: 'Resumen', icon: <LayoutDashboard size={20} /> },
  { id: 'analisis', label: 'Análisis', icon: <BarChart3 size={20} /> },
  { id: 'registros', label: 'Registros', icon: <List size={20} /> },
]

function getActiveSection() {
  const section = window.location.hash.slice(1)
  return navigationItems.some(({ id }) => id === section) ? section : 'resumen'
}

interface DashboardPageProps {
  observations: readonly Observation[]
  initialFilters?: Filters
}

export function DashboardPage({ observations, initialFilters = defaultFilters }: DashboardPageProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [activeId, setActiveId] = useState(getActiveSection)

  useEffect(() => {
    const syncNavigation = () => setActiveId(getActiveSection())
    window.addEventListener('hashchange', syncNavigation)
    return () => window.removeEventListener('hashchange', syncNavigation)
  }, [])

  const stationLabel = stationOptions.find(({ value }) => value === filters.stationId)?.label ?? filters.stationId
  const periodLabel = periodOptions.find(({ value }) => value === filters.periodId)?.label ?? filters.periodId

  const periodRows = observations.filter((row) => row.date.startsWith(`${filters.periodId}-`))
  const stationRows = periodRows.filter((row) => row.stationId === filters.stationId)
  const recentRows = [...stationRows].sort((left, right) => right.date.localeCompare(left.date)).slice(0, 8)

  const kpis: KpiItem[] = [
    {
      id: 'max-temp',
      label: 'Temperatura máxima media',
      value: average(stationRows, 'maxTemp'),
      unit: '°C',
      detail: 'Promedio de la muestra',
      icon: <Thermometer size={20} />,
    },
    {
      id: 'rainfall',
      label: 'Precipitación acumulada',
      value: totalRainfall(stationRows),
      unit: 'mm',
      detail: 'Total en la muestra',
      icon: <Droplets size={20} />,
    },
    {
      id: 'rain-days',
      label: 'Días con lluvia',
      value: countRainyDays(stationRows),
      unit: 'días',
      detail: 'Días registrados con lluvia',
      icon: <CloudRain size={20} />,
    },
    {
      id: 'humidity',
      label: 'Humedad media a las 3 pm',
      value: average(stationRows, 'humidity3pm'),
      unit: '%',
      detail: 'Promedio de la muestra',
      icon: <Droplets size={20} />,
    },
  ]
  const rainDays = stationOptions.map(({ value, label }) => ({
    stationId: value,
    stationLabel: label,
    rainyDays: countRainyDays(periodRows.filter((row) => row.stationId === value)),
  }))
  const wind = windDistribution(stationRows)

  return (
    <DashboardLayout
      navigation={<DashboardNav items={navigationItems} activeId={activeId} onNavigate={setActiveId} />}
    >
      <Stack spacing={{ xs: 3.5, md: 4 }}>
        <Stack id="resumen" spacing={{ xs: 2.25, md: 3 }} sx={{ scrollMarginTop: { xs: 84, md: 24 } }}>
          <DashboardHeader
            title="Panorama climático"
            description="Explora una muestra de observaciones meteorológicas en estaciones de Australia."
            onExport={() => downloadObservations(stationRows, stationLabel, filters.periodId)}
          />
          <FilterPanel
            value={filters}
            stationOptions={stationOptions}
            periodOptions={periodOptions}
            onChange={setFilters}
            onReset={() => setFilters(initialFilters)}
          />
          <KpiGrid items={kpis} />
        </Stack>

        <DashboardSection id="analisis" title="Análisis">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.6fr) minmax(0, 1fr)' },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            <MonthlyClimateChart points={monthlyClimate(stationRows)} stationLabel={stationLabel} />
            <Stack spacing={{ xs: 2, md: 2.5 }} sx={{ minWidth: 0 }}>
              <RainDaysChart
                items={rainDays}
                selectedStationId={filters.stationId}
                periodLabel={periodLabel}
              />
              <WindDirectionChart segments={wind.segments} total={wind.total} />
            </Stack>
          </Box>
        </DashboardSection>

        <DashboardSection id="registros" title="Registros">
          <ObservationsTable rows={recentRows} stationLabel={stationLabel} periodLabel={periodLabel} />
        </DashboardSection>
      </Stack>
    </DashboardLayout>
  )
}
