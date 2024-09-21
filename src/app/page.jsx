'use client'

import { Button, Box, Typography } from '@mui/material'

const Home = () => {
  return (
    <Box>
      <Typography variant='h1' color="primary.main">
        Owls Finder
      </Typography>
      <Button variant='contained' sx={({ palette }) => ({ background: palette?.colors?.primary?.main })}>
        holiwis
      </Button>
    </Box>
  )
}

export default Home