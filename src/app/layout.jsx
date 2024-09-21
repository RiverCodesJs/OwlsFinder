import ThemeRegistry from '~/app/theme'

const metadata = {
  title: 'OwlsHub',
  description: 'COBACH 8',
}

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
