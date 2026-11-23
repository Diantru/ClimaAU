import { Box, Stack, Typography, useTheme } from '@mui/material'
import type { WindSegment } from '../types'
import { ChartCard } from './ChartCard'

type WindDirectionChartProps = {
  segments: readonly WindSegment[]
  total: number
}

const countFormat = new Intl.NumberFormat('es-EC')
const percentFormat = new Intl.NumberFormat('es-EC', { style: 'percent', maximumFractionDigits: 1 })

export function WindDirectionChart({ segments, total }: WindDirectionChartProps) {
  const theme = useTheme()
  const colors = [theme.palette.primary.main, '#52B8C9', '#F0AD54', '#BBC8DA']
  let angle = 0
  const slices = segments.map(({ label, count }, index) => {
    const share = total > 0 ? count / total : 0
    const start = angle
    const color = colors[index % colors.length]
    angle += share * 360

    return { label, count, share, color, stop: `${color} ${start}deg ${angle}deg` }
  })
  const background = slices.length === 1 ? slices[0].color : `conic-gradient(${slices.map(({ stop }) => stop).join(', ')})`

  return (
    <ChartCard title="Dirección de ráfagas" description="Tres direcciones principales y el resto agrupado">
      {total > 0 && slices.length > 0 ? (
        <Stack direction="row" spacing={{ xs: 2, sm: 3 }} alignItems="center" sx={{ mt: 2.25 }}>
          <Box
            aria-hidden
            sx={{
              flexShrink: 0,
              width: { xs: 104, sm: 122 },
              aspectRatio: '1',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              background,
            }}
          >
            <Stack alignItems="center" justifyContent="center" sx={{ width: '72%', height: '72%', borderRadius: '50%', bgcolor: 'background.paper' }}>
              <Typography sx={{ fontSize: '1.375rem', fontWeight: 760, lineHeight: 1.12 }}>{countFormat.format(total)}</Typography>
              <Typography color="text.secondary" variant="caption">ráfagas</Typography>
            </Stack>
          </Box>
          <Stack component="ul" aria-label={`${countFormat.format(total)} ráfagas por dirección`} spacing={0.85} sx={{ flex: 1, minWidth: 0, listStyle: 'none', m: 0, p: 0 }}>
            {slices.map(({ count, label, share, color }) => (
              <Stack key={label} component="li" direction="row" spacing={0.75} alignItems="center" aria-label={`${label}, ${countFormat.format(count)}, ${percentFormat.format(share)}`}>
                <Box aria-hidden sx={{ width: 9, height: 9, flexShrink: 0, borderRadius: '50%', bgcolor: color }} />
                <Typography variant="body2" color="text.secondary" sx={{ flex: 1, minWidth: 0 }}>{label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{percentFormat.format(share)}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Sin datos para el periodo seleccionado.</Typography>
      )}
    </ChartCard>
  )
}
