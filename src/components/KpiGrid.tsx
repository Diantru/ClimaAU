import { Box, Card, Stack, Typography } from '@mui/material';
import type { KpiItem } from '../types';

const numberFormat = new Intl.NumberFormat('es-EC', { maximumFractionDigits: 1 });

const tones = [
  { color: '#b4412f', backgroundColor: '#fff0ea' },
  { color: '#1d6fb8', backgroundColor: '#e9f4ff' },
  { color: '#5145cd', backgroundColor: '#eeebff' },
  { color: '#087e90', backgroundColor: '#e4f7fa' },
];

interface KpiCardProps {
  item: KpiItem;
  index: number;
}

export function KpiCard({ item, index }: KpiCardProps) {
  const { label, value, unit, detail, icon } = item;
  const tone = tones[index % tones.length];

  return (
    <Card
      component="article"
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 1.4 },
        minWidth: 0,
        p: { xs: 1.5, sm: 1.75, lg: 2 },
        borderRadius: '14px',
        boxShadow: '0 3px 12px #121d3608',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          display: 'grid',
          flexShrink: 0,
          placeItems: 'center',
          width: { xs: 33, sm: 38 },
          height: { xs: 33, sm: 38 },
          borderRadius: '9px',
          ...tone,
          '& svg': { maxWidth: 21, maxHeight: 21 },
        }}
      >
        {icon}
      </Box>
      <Stack spacing={0.45} sx={{ minWidth: 0 }}>
        <Typography component="h2" sx={{ color: 'text.secondary', fontSize: '0.84rem', fontWeight: 700, lineHeight: 1.28 }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: value === null ? '1rem' : 'clamp(1.35rem, 2.25vw, 1.85rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.12,
          }}
        >
          {value === null ? 'Sin datos' : numberFormat.format(value)}
          {value !== null && unit && (
            <Box component="span" sx={{ ml: 0.4, fontSize: '0.85rem', fontWeight: 650, color: 'text.secondary', letterSpacing: 0 }}>
              {unit}
            </Box>
          )}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.76rem', lineHeight: 1.35 }}>{detail}</Typography>
      </Stack>
    </Card>
  );
}

interface KpiGridProps {
  items: KpiItem[];
}

export function KpiGrid({ items }: KpiGridProps) {
  return (
    <Box
      component="section"
      aria-label="Indicadores principales"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
        gap: { xs: 1.25, sm: 2 },
        minWidth: 0,
      }}
    >
      {items.map((item, index) => <KpiCard key={item.id} item={item} index={index} />)}
    </Box>
  );
}
