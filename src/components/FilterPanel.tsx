import { Box, Button, FormControl, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { CalendarDays, MapPin, RotateCcw } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import type { Filters, Option } from '../types';

interface FilterSelectProps {
  label: string;
  icon: ReactNode;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

export function FilterSelect({ label, icon, value, options, onChange }: FilterSelectProps) {
  const id = useId();

  return (
    <FormControl fullWidth size="small">
      <Stack
        component="label"
        id={`${id}-label`}
        htmlFor={id}
        direction="row"
        spacing={0.75}
        sx={{ alignItems: 'center', mb: 0.7, color: 'text.secondary', fontSize: '0.875rem', fontWeight: 700 }}
      >
        {icon}
        <span>{label}</span>
      </Stack>
      <Select
        id={id}
        labelId={`${id}-label`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={{
          minHeight: 42,
          borderRadius: '8px',
          bgcolor: '#f8f9fc',
          fontSize: '0.92rem',
          fontWeight: 600,
          '& fieldset': { borderColor: '#dbe1ec' },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

interface FilterPanelProps {
  value: Filters;
  stationOptions: Option[];
  periodOptions: Option[];
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export function FilterPanel({ value, stationOptions, periodOptions, onChange, onReset }: FilterPanelProps) {
  const headingId = useId();

  return (
    <Paper
      variant="outlined"
      component="section"
      aria-labelledby={headingId}
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'minmax(140px, 1.1fr) repeat(2, minmax(150px, 1fr)) auto',
        },
        alignItems: 'end',
        gap: { xs: 1.45, md: 2 },
        p: { xs: 1.75, md: 2 },
        borderRadius: '14px',
      }}
    >
      <Box sx={{ gridColumn: { sm: '1 / -1', lg: 'auto' }, alignSelf: 'center' }}>
        <Typography id={headingId} component="h2" sx={{ fontSize: '1rem', fontWeight: 800 }}>
          Explorar datos
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mt: 0.25 }}>
          Los indicadores se actualizan con tu selección.
        </Typography>
      </Box>
      <FilterSelect
        label="Estación"
        icon={<MapPin size={16} aria-hidden="true" />}
        value={value.stationId}
        options={stationOptions}
        onChange={(stationId) => onChange({ ...value, stationId })}
      />
      <FilterSelect
        label="Periodo"
        icon={<CalendarDays size={16} aria-hidden="true" />}
        value={value.periodId}
        options={periodOptions}
        onChange={(periodId) => onChange({ ...value, periodId })}
      />
      <Button
        color="inherit"
        onClick={onReset}
        aria-label="Restablecer filtros"
        startIcon={<RotateCcw size={16} aria-hidden="true" />}
        sx={{
          gridColumn: { sm: '1 / -1', lg: 'auto' },
          justifySelf: { xs: 'stretch', sm: 'end' },
          minHeight: 42,
          px: 1.4,
          color: 'text.secondary',
          fontWeight: 700,
          textTransform: 'none',
          '&:hover': { color: 'primary.main', bgcolor: '#eeedfc' },
        }}
      >
        Restablecer
      </Button>
    </Paper>
  );
}
