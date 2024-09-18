import theme from './themes/theme'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { getMetadata } from './metadata/metadata'
//import { Inter } from 'next/font/google'

const metadata = getMetadata()

//const inter = Inter({ subsets: ['latin'], display: 'auto' })

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
