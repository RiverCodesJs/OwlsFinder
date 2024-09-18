import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import colorUtil from 'color'
import '@fontsource/inter'

const states = {
  strong: 0.85,
  muted: 0.64,
  inactive: 0.5,
  disable: 0.32,
  active: 0.16,
  enabled: 0.08,
  modal: 0.25,
}

const getThemeColor = color => {
  const main = colorUtil(color)
  const variants = Object.entries(states).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: main.alpha(value).toString(),
    }
  }, {})
  return {
    main: main.toString(),
    ...variants,
  }
}

const contrast = getThemeColor('#FFFFFF')
const guinda = getThemeColor('#4F0010')
const text = getThemeColor('#000000')
const background = getThemeColor('#FCFCFC')
const grey = getThemeColor('#D0D0D0')

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
    contrast,
    guinda,
    text,
    background,
    grey,
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
