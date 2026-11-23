import { Card, CardContent, Typography } from '@mui/material'
import { useId, type ReactNode } from 'react'

type ChartCardProps = {
  title: string
  description?: string
  children: ReactNode
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  const titleId = useId()

  return (
    <Card component="article" aria-labelledby={titleId} variant="outlined" sx={{ minWidth: 0 }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <Typography id={titleId} component="h3" variant="subtitle1" sx={{ fontWeight: 740, lineHeight: 1.3 }}>
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  )
}
