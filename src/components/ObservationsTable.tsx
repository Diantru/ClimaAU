import { Box, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useId } from 'react';
import type { Observation } from '../types';

const dateFormat = new Intl.DateTimeFormat('es-EC', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
const numberFormat = new Intl.NumberFormat('es-EC', { maximumFractionDigits: 1 });

function formatValue(value: number | null, unit: string): string {
  return value === null ? 'Sin datos' : `${numberFormat.format(value)} ${unit}`;
}

interface ObservationsTableProps {
  rows: Observation[];
  stationLabel: string;
  periodLabel: string;
}

export function ObservationsTable({ rows, stationLabel, periodLabel }: ObservationsTableProps) {
  const headingId = useId();
  const recordLabel = rows.length === 1 ? 'registro' : 'registros';

  return (
    <Paper component="section" variant="outlined" aria-labelledby={headingId} sx={{ minWidth: 0, overflow: 'hidden', borderRadius: '14px' }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', p: { xs: 1.75, sm: 2.5 } }}
      >
        <Box>
          <Typography id={headingId} component="h2" sx={{ fontSize: '1.04rem', fontWeight: 800 }}>
            Observaciones recientes
          </Typography>
          <Typography sx={{ mt: 0.4, color: 'text.secondary', fontSize: '0.875rem' }}>
            Detalle diario de {stationLabel} · {periodLabel}
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`${rows.length} ${recordLabel}`}
          sx={{ borderRadius: '6px', fontWeight: 700, color: 'primary.main', bgcolor: '#eeebff' }}
        />
      </Stack>
      <TableContainer
        tabIndex={0}
        role="region"
        aria-label="Tabla de observaciones con desplazamiento horizontal"
        sx={{ '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 } }}
      >
        <Table
          size="small"
          aria-labelledby={headingId}
          sx={{
            minWidth: 600,
            '& th, & td': { px: { xs: 1.75, sm: 2.5 }, py: 1.15, whiteSpace: 'nowrap' },
            '& thead th': { bgcolor: '#f6f8fb', color: 'text.secondary', fontSize: '0.84rem', fontWeight: 700 },
            '& tbody tr:last-child > *': { borderBottom: 0 },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell scope="col">Fecha</TableCell>
              <TableCell scope="col" align="right">Temp. mín.</TableCell>
              <TableCell scope="col" align="right">Temp. máx.</TableCell>
              <TableCell scope="col" align="right">Precipitación</TableCell>
              <TableCell scope="col" align="right">Humedad 3 p. m.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${row.stationId}-${row.date}`} hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 650 }}>
                  <time dateTime={row.date}>{dateFormat.format(new Date(row.date))}</time>
                </TableCell>
                <TableCell align="right">{formatValue(row.minTemp, '°C')}</TableCell>
                <TableCell align="right">{formatValue(row.maxTemp, '°C')}</TableCell>
                <TableCell align="right">{formatValue(row.rainfall, 'mm')}</TableCell>
                <TableCell align="right">{formatValue(row.humidity3pm, '%')}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ color: 'text.secondary' }}>
                  No hay observaciones para esta selección.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
