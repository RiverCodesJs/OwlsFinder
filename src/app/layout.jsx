import ThemeRegistry from '~/app/theme'
import { getMetadata } from './metadata/metadata'

const metadata = getMetadata()

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <ThemeRegistry>
        <body>
          {children}
        </body>
      </ThemeRegistry>
    </html>
  )
}

export default RootLayout
