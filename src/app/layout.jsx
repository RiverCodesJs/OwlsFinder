import theme from './themes/theme'
import { ThemeProvider } from '@mui/material'
import { getMetadata } from './metadata/metadata'

const metadata = getMetadata()

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
