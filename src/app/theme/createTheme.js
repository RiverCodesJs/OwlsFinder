import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import '@fontsource/inter'
import colors from './colors'

const theme = createTheme({
  typography: {
    fontFamily: 'inter',
    h1: {
      fontSize: '4rem',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '3rem',
    },
    h3: {
      fontSize: '2rem',
    },
    body1: {
      fontSize: '1rem',
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
          paddingBlock: '2rem',
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
