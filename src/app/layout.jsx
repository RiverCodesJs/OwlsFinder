'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ThemeRegistry from '~/app/UI/theme'

const metadata = {
  title: 'OwlsHub',
  description: 'COBACH 8',
}

const RootLayout = ({ children }) => {
  const queryClient = new QueryClient()

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <ThemeRegistry>
        <QueryClientProvider client={queryClient}>
          <body>
            {children}
          </body>
        </QueryClientProvider>
      </ThemeRegistry>
    </html>
  )
}

export default RootLayout
