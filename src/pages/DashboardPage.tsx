import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
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
import { useWeatherObservations } from '../data/useWeatherObservations'
import type { Filters, KpiItem } from '../types'

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

export function DashboardPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [activeId, setActiveId] = useState(getActiveSection)
  const { result, retry } = useWeatherObservations(filters.periodId)
  const isLoading = result === null
  const periodRows = result?.status === 'success' ? result.observations : []
  const hasObservations = periodRows.length > 0

  useEffect(() => {
    const syncNavigation = () => setActiveId(getActiveSection())
    window.addEventListener('hashchange', syncNavigation)
    return () => window.removeEventListener('hashchange', syncNavigation)
  }, [])

  useEffect(() => {
    if (hasObservations && window.location.hash) {
      document.getElementById(getActiveSection())?.scrollIntoView()
    }
  }, [hasObservations])

  const stationLabel = stationOptions.find(({ value }) => value === filters.stationId)?.label ?? filters.stationId
  const periodLabel = periodOptions.find(({ value }) => value === filters.periodId)?.label ?? filters.periodId

  const stationRows = periodRows.filter((row) => row.stationId === filters.stationId)
  const recentRows = [...stationRows].sort((left, right) => right.date.localeCompare(left.date)).slice(0, 8)

  const kpis: KpiItem[] = [
    {
      id: 'max-temp',
      label: 'Temperatura máxima media',
      value: average(stationRows, 'maxTemp'),
      unit: '°C',
      detail: 'Promedio del periodo',
      icon: <Thermometer size={20} />,
    },
    {
      id: 'rainfall',
      label: 'Precipitación acumulada',
      value: totalRainfall(stationRows),
      unit: 'mm',
      detail: 'Total del periodo',
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
      detail: 'Promedio del periodo',
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
            description="Explora observaciones meteorológicas históricas en estaciones de Australia."
            onExport={() => downloadObservations(stationRows, stationLabel, filters.periodId)}
            exportDisabled={stationRows.length === 0}
          />
          <FilterPanel
            value={filters}
            stationOptions={stationOptions}
            periodOptions={periodOptions}
            onChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
          />
          {isLoading && (
            <Alert severity="info" icon={<CircularProgress size={20} />} role="status">
              Consultando observaciones en Firebase…
            </Alert>
          )}
          {result?.status === 'error' && (
            <Alert
              severity="error"
              action={<Button color="inherit" size="small" onClick={retry}>Reintentar</Button>}
            >
              {result.message}
            </Alert>
          )}
          {result?.status === 'success' && (
            stationRows.length > 0 ? (
              <>
                <Typography variant="body2" color="text.secondary" role="status">
                  {stationRows.length} {stationRows.length === 1 ? 'observación' : 'observaciones'} de {stationLabel} en Firebase Realtime Database
                </Typography>
                <KpiGrid items={kpis} />
              </>
            ) : (
              <Alert severity="info" role="status">No hay observaciones para esta selección.</Alert>
            )
          )}
        </Stack>

        {hasObservations && (
          <>
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
          </>
        )}
      </Stack>
    </DashboardLayout>
  )
}
