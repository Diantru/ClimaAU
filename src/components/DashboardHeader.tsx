import { Box, Button, Stack, Typography } from '@mui/material';
import { Download } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  description: string;
  onExport: () => void;
  exportDisabled: boolean;
}

export function DashboardHeader({ title, description, onExport, exportDisabled }: DashboardHeaderProps) {
  return (
    <Stack component="header" direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="h1"
          sx={{ fontSize: 'clamp(1.7rem, 3vw, 2.45rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.13 }}
        >
          {title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.85, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {description}
        </Typography>
      </Box>
      <Button
        variant="contained"
        aria-label="Exportar datos"
        onClick={onExport}
        disabled={exportDisabled}
        sx={{
          flexShrink: 0,
          gap: 1,
          minWidth: { xs: 43, sm: 0 },
          minHeight: 43,
          px: { xs: 0, sm: 2 },
          borderRadius: '9px',
          fontSize: '0.9rem',
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: '0 4px 13px #5145cd32',
        }}
      >
        <Download size={18} aria-hidden="true" />
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Exportar datos</Box>
      </Button>
    </Stack>
  );
}
