import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type DashboardSectionProps = {
  id: string
  title: string
  description?: string
  children: ReactNode
}

export function DashboardSection({ id, title, description, children }: DashboardSectionProps) {
  return (
    <Box component="section" id={id} aria-labelledby={`${id}-heading`} sx={{ scrollMarginTop: { xs: 88, md: 28 } }}>
      <Box sx={{ mb: 1.75 }}>
        <Typography id={`${id}-heading`} component="h2" variant="h6">
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.25 }}>
            {description}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  )
}
