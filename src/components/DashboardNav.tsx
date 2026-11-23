import { Box, ButtonBase, Stack, Tooltip, Typography } from '@mui/material';
import { CloudRain, Info } from 'lucide-react';
import type { ReactNode } from 'react';

interface DashboardNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface DashboardNavProps {
  items: DashboardNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function DashboardNav({ items, activeId, onNavigate }: DashboardNavProps) {
  return (
    <Stack
      component="aside"
      direction={{ xs: 'row', md: 'column' }}
      sx={{
        position: 'sticky',
        top: 0,
        alignSelf: 'start',
        alignItems: { xs: 'center', md: 'stretch' },
        justifyContent: { xs: 'space-between', md: 'flex-start' },
        minHeight: { xs: '4.25rem', md: '100dvh' },
        px: { xs: 2, md: 2.25 },
        py: { xs: 1, md: 3 },
        gap: { xs: 1, md: 3.5 },
        bgcolor: '#151e34',
        color: '#e5eafa',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center', px: { md: 0.75 } }}>
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            width: { xs: 36, md: 42 },
            height: { xs: 36, md: 42 },
            borderRadius: '11px',
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <CloudRain size={22} strokeWidth={1.7} aria-hidden="true" />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.1, color: 'white' }}>
            Clima<Box component="span" sx={{ color: '#8ce4ef' }}>AU</Box>
          </Typography>
          <Typography sx={{ display: { xs: 'none', md: 'block' }, mt: 0.45, color: '#aab6ce', fontSize: '0.72rem' }}>
            Observatorio meteorológico
          </Typography>
        </Box>
      </Stack>

      <Stack
        component="nav"
        aria-label="Navegación principal"
        direction={{ xs: 'row', md: 'column' }}
        spacing={{ xs: 0.25, md: 0.75 }}
      >
        {items.map(({ id, label, icon }) => {
          const active = id === activeId;
          return (
            <Tooltip key={id} title={label} enterTouchDelay={500}>
              <ButtonBase
                component="a"
                href={`#${id}`}
                aria-label={label}
                aria-current={active ? 'location' : undefined}
                onClick={() => onNavigate(id)}
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  gap: 1.4,
                  width: { xs: 41, md: '100%' },
                  minHeight: 45,
                  px: { md: 1.5 },
                  borderRadius: '10px',
                  color: active ? 'white' : '#b4c0d5',
                  bgcolor: active ? '#2a3655' : 'transparent',
                  boxShadow: active ? { xs: 'inset 0 -2px #8ce4ef', md: 'inset 3px 0 #8ce4ef' } : 'none',
                  '&:hover': { bgcolor: '#263351', color: 'white' },
                  '&.Mui-focusVisible': { outline: '2px solid #bceef6', outlineOffset: -3 },
                }}
              >
                <Box component="span" aria-hidden="true" sx={{ display: 'inline-flex' }}>{icon}</Box>
                <Typography component="span" sx={{ display: { xs: 'none', md: 'inline' }, fontSize: '0.9rem', fontWeight: 650 }}>
                  {label}
                </Typography>
              </ButtonBase>
            </Tooltip>
          );
        })}
      </Stack>

      <Stack
        direction="row"
        spacing={1.1}
        sx={{
          display: { xs: 'none', md: 'flex' },
          mt: 'auto',
          pt: 2,
          px: 0.75,
          borderTop: '1px solid #34415d',
          color: '#aab6ce',
          '& svg': { mt: 0.2, flexShrink: 0 },
        }}
      >
        <Info size={16} aria-hidden="true" />
        <Box>
          <Typography sx={{ color: '#e5eafa', fontSize: '0.8rem', fontWeight: 700 }}>
            Fuente de datos
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: '0.75rem' }}>
            WeatherAUS · Bureau of Meteorology
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
