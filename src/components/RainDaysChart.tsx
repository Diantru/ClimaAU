import { Box, Stack, Typography } from '@mui/material'
import type { RainDaysItem } from '../types'
import { ChartCard } from './ChartCard'

type RainDaysChartProps = {
  items: readonly RainDaysItem[]
  selectedStationId: string
  periodLabel: string
}

export function RainDaysChart({ items, selectedStationId, periodLabel }: RainDaysChartProps) {
  const maximumDays = Math.max(1, ...items.map(({ rainyDays }) => rainyDays ?? 0))

  return (
    <ChartCard title="Días con lluvia" description={`Comparación entre estaciones · ${periodLabel}`}>
      {items.length ? (
        <Stack component="ul" spacing={1.05} sx={{ listStyle: 'none', m: 0, mt: 2.1, p: 0 }}>
          {items.map(({ stationId, stationLabel, rainyDays }) => {
            const selected = stationId === selectedStationId
            const daysLabel = rainyDays === null ? 'Sin datos' : `${rainyDays} ${rainyDays === 1 ? 'día' : 'días'}`

            return (
              <Box component="li" key={stationId} aria-current={selected ? 'true' : undefined}>
                <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 0.5 }}>
                  <Typography variant="body2" color={selected ? 'primary.main' : 'text.secondary'} sx={{ fontWeight: selected ? 700 : 500 }}>
                    {stationLabel}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{daysLabel}</Typography>
                </Stack>
                <Box aria-hidden sx={{ height: 6, borderRadius: 4, bgcolor: '#EEF0F7' }}>
                  <Box sx={{ width: `${((rainyDays ?? 0) / maximumDays) * 100}%`, height: '100%', borderRadius: 'inherit', bgcolor: selected ? 'primary.main' : '#ACAAE8' }} />
                </Box>
              </Box>
            )
          })}
        </Stack>
      ) : (
        <Typography color="text.secondary" variant="body2" sx={{ mt: 2 }}>Sin datos para el periodo seleccionado.</Typography>
      )}
    </ChartCard>
  )
}
