'use client'
import themeConfig from '~/app/theme/createTheme'

import { ThemeProvider, CssBaseline } from '@mui/material'

// import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

const ThemeRegistry = ({ children }) => (
  <ThemeProvider theme={themeConfig}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

export default ThemeRegistry
