'use client'

import { Button, Grid2, Typography } from '@mui/material'

const Home = () => {
  return (
    <Grid2>
      <Typography variant='h1'>
        Owls Finder
      </Typography>
      <Button variant='contained' sx={({palette})=>({ background: palette.colors.guinda.main })}>
        holiwis
      </Button>
    </Grid2>
  )
}

export default Home