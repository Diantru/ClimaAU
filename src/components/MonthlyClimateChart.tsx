import { Box, Stack, Typography, useTheme } from '@mui/material'
import { useId } from 'react'
import type { MonthlyPoint } from '../types'
import { ChartCard } from './ChartCard'

type MonthlyClimateChartProps = {
  points: readonly MonthlyPoint[]
  stationLabel: string
}

const chartSize = { width: 680, height: 344 }
const plot = { top: 25, right: 632, bottom: 311, left: 41 }
const axisFractions = [0, 0.25, 0.5, 0.75, 1]
const rainColor = '#A9DDE7'
const numberFormat = new Intl.NumberFormat('es-EC', { maximumFractionDigits: 1 })

function temperaturePaths(points: readonly MonthlyPoint[], x: (index: number) => number, y: (value: number) => number) {
  let connected = false
  return points.flatMap(({ avgMaxTemp }, index) => {
    if (avgMaxTemp === null) {
      connected = false
      return []
    }

    const command = connected ? 'L' : 'M'
    connected = true
    return `${command}${x(index)} ${y(avgMaxTemp)}`
  }).join(' ')
}

export function MonthlyClimateChart({ points, stationLabel }: MonthlyClimateChartProps) {
  const theme = useTheme()
  const descriptionId = useId()
  const temperatures = points.flatMap(({ avgMaxTemp }) => avgMaxTemp === null ? [] : [avgMaxTemp])
  const lowTemperature = Math.min(0, Math.floor(Math.min(...temperatures, 0) / 10) * 10)
  const highTemperature = Math.max(40, Math.ceil(Math.max(...temperatures, 0) / 10) * 10)
  const maximumRain = Math.max(100, Math.ceil(Math.max(0, ...points.map(({ totalRainfall }) => totalRainfall ?? 0)) / 100) * 100)
  const plotHeight = plot.bottom - plot.top
  const columnWidth = (plot.right - plot.left) / Math.max(points.length, 1)
  const x = (index: number) => plot.left + (index + 0.5) * columnWidth
  const y = (temperature: number) => plot.bottom - ((temperature - lowTemperature) / (highTemperature - lowTemperature)) * plotHeight
  const barWidth = Math.min(32, columnWidth * 0.48)
  const hasMeasurements = points.some(({ avgMaxTemp, totalRainfall }) => avgMaxTemp !== null || totalRainfall !== null)

  return (
    <ChartCard title="Temperatura y precipitación mensual" description={`Evolución climática en ${stationLabel}`}>
      {hasMeasurements ? (
        <>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mt: 1.5, mb: 0.5 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box aria-hidden sx={{ width: 16, height: 3, bgcolor: 'primary.main', borderRadius: 2 }} />
              <Typography variant="caption" color="text.secondary">Temp. máxima media (°C)</Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box aria-hidden sx={{ width: 12, height: 10, bgcolor: rainColor, borderRadius: 0.35 }} />
              <Typography variant="caption" color="text.secondary">Precipitación (mm)</Typography>
            </Stack>
          </Stack>
          <Box
            role="region"
            aria-label="Gráfico mensual con desplazamiento horizontal"
            tabIndex={0}
            sx={{ overflowX: 'auto', borderRadius: 1, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}
          >
            <Box
              component="svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
              role="img"
              aria-label={`Temperatura máxima media y precipitación mensual en ${stationLabel}`}
              aria-describedby={descriptionId}
              sx={{ display: 'block', width: '100%', minWidth: 540, color: 'text.secondary', fontFamily: 'inherit', fontSize: 11.5 }}
            >
              <desc id={descriptionId}>
                {points.map(({ month, avgMaxTemp, totalRainfall }) => {
                  const temperature = avgMaxTemp === null ? 'sin datos de temperatura' : `${numberFormat.format(avgMaxTemp)} °C`
                  const rainfall = totalRainfall === null ? 'sin datos de precipitación' : `${numberFormat.format(totalRainfall)} mm`
                  return `${month}, ${temperature}, ${rainfall}.`
                }).join(' ')}
              </desc>
              <text x={plot.left - 10} y={13} textAnchor="end" fill="currentColor">°C</text>
              <text x={plot.right + 9} y={13} fill="currentColor">mm</text>
              {axisFractions.map((fraction) => {
                const position = plot.bottom - fraction * plotHeight
                return (
                  <g key={fraction}>
                    <line x1={plot.left} x2={plot.right} y1={position} y2={position} stroke={theme.palette.divider} />
                    <text x={plot.left - 10} y={position + 4} textAnchor="end" fill="currentColor">
                      {numberFormat.format(lowTemperature + fraction * (highTemperature - lowTemperature))}
                    </text>
                    <text x={plot.right + 9} y={position + 4} fill="currentColor">
                      {numberFormat.format(fraction * maximumRain)}
                    </text>
                  </g>
                )
              })}
              {points.map(({ month, totalRainfall }, index) => {
                const barHeight = totalRainfall === null ? 0 : (totalRainfall / maximumRain) * plotHeight
                return (
                  <g key={month}>
                    {totalRainfall !== null && (
                      <rect x={x(index) - barWidth / 2} y={plot.bottom - barHeight} width={barWidth} height={barHeight} fill={rainColor} rx={2}>
                        <title>{`${month} · ${numberFormat.format(totalRainfall)} mm`}</title>
                      </rect>
                    )}
                    <text x={x(index)} y={plot.bottom + 22} textAnchor="middle" fill="currentColor">{month}</text>
                  </g>
                )
              })}
              <path d={temperaturePaths(points, x, y)} fill="none" stroke={theme.palette.primary.main} strokeWidth={2.75} strokeLinejoin="round" />
              {points.map(({ month, avgMaxTemp }, index) => avgMaxTemp !== null && (
                <circle key={month} cx={x(index)} cy={y(avgMaxTemp)} r={4} fill={theme.palette.background.paper} stroke={theme.palette.primary.main} strokeWidth={2}>
                  <title>{`${month} · ${numberFormat.format(avgMaxTemp)} °C`}</title>
                </circle>
              ))}
            </Box>
          </Box>
        </>
      ) : (
        <Typography color="text.secondary" variant="body2" sx={{ mt: 2 }}>Sin datos para el periodo seleccionado.</Typography>
      )}
    </ChartCard>
  )
}
