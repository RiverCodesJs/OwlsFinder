import themeConfig from '~/src/app/theme/createTheme'

import { 
  ThemeProvider, 
  CssBaseline, 
  StyledEngineProvider,
} from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

const ThemeRegistry = children => (
  <ThemeProvider theme={themeConfig}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

export default ThemeRegistry