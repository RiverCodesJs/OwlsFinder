'use client'
import { Home, School, Work, Groups } from '@mui/icons-material'
import { IconButton, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'

import { buho } from '~/app/images'

import getClassPrefixer from '../classPrefixer'

const displayName = 'NavBar'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  height: '100vh',
  width: '70px',
  backgroundColor: theme.palette.grey.main,
  [`& .${classes.navIcon}`]: {
    color: theme.palette.primary.main
  }
}))

const NavBar = () => {
  return(
    <Container>
      <Stack alignItems="center" marginTop={2} spacing={1}>
        <IconButton>
          <Image src={buho} width={60} height={30} alt='Owl Logo'/>
        </IconButton>
        <IconButton >
          <Home fontSize='large' className={classes.navIcon}/>
        </IconButton>
        <IconButton >
          <Groups fontSize='large' className={classes.navIcon}/>
        </IconButton>
        <IconButton >
          <Work fontSize='large' className={classes.navIcon}/>
        </IconButton>
        <IconButton >
          <School fontSize='large' className={classes.navIcon}/>
        </IconButton>
      </Stack>
    </Container>
  )
}

export default NavBar