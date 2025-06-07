'use client'
import themeConfig from '~/app/UI/theme/createTheme'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

const ThemeRegistry = ({ children }) => (
  <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="es-MX">
    <ThemeProvider theme={themeConfig}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </LocalizationProvider>
)

export default ThemeRegistry
