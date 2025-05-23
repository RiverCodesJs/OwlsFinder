import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import '@fontsource/inter'
import colors from './colors'

const theme = createTheme({
  typography: {
    fontFamily: 'inter',
    h1: {
      fontSize: '4rem / 120%',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '3rem / 120%',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '2rem / 120%',
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1rem / 160%',
    },
    body2: {
      fontSize: '0.825rem',
    },
  },
  palette: {
    ...colors
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingBlock: '0.5rem',
          paddingInline: '1rem',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: '16px',
        },
      },
    },
  },
})

export default responsiveFontSizes(theme)
