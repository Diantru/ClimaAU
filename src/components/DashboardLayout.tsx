import { Box, Stack } from '@mui/material';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  navigation: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({ navigation, children }: DashboardLayoutProps) {
  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'grid' },
        gridTemplateColumns: { md: '13.5rem minmax(0, 1fr)', lg: '15rem minmax(0, 1fr)' },
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ display: { xs: 'contents', md: 'block' }, bgcolor: '#151e34' }}>
        {navigation}
      </Box>
      <Stack
        component="main"
        spacing={{ xs: 2, md: 2.5 }}
        sx={{
          width: '100%',
          maxWidth: '96rem',
          minWidth: 0,
          mx: 'auto',
          px: { xs: 2, sm: 3.5, md: 3, lg: 5 },
          pt: { xs: 2.75, md: 4, lg: 4.5 },
          pb: { xs: 3, md: 4 },
          '& [id]': { scrollMarginTop: { xs: '5rem', md: '1rem' } },
        }}
      >
        {children}
      </Stack>
    </Box>
  );
}
