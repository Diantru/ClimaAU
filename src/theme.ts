import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#5145cd', dark: '#3f35a4', light: '#eae7ff' },
    background: { default: '#f5f7fc', paper: '#ffffff' },
    text: { primary: '#182339', secondary: '#53627b' },
    divider: '#e0e6f0',
  },
  typography: {
    fontFamily: '"Segoe UI", Inter, system-ui, sans-serif',
    h1: { fontWeight: 750, letterSpacing: '-0.045em' },
    h2: { fontWeight: 720, letterSpacing: '-0.025em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 650 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollbarColor: '#b9c3d6 #f5f7fc' },
        '::selection': { color: '#282166', backgroundColor: '#e0dcff' },
        ':focus-visible': { outline: '2px solid #5145cd', outlineOffset: 3 },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
  },
})
