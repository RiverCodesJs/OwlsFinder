'use client'
import { IconButton, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { images } from '~/app/images'
import getClassPrefixer from '../classPrefixer'
import { Home, School, Work, Groups } from '@mui/icons-material'

const displayName = 'NavBar'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({theme}) => ({
  height: '100vh',
  width: '5vw',
  backgroundColor: theme.palette.grey.main,

  [`& .${classes.iconStack}`]: {
    marginTop: "1rem",
  },
  [`& .${classes.navIcon}`]: {
    fill: theme.palette.primary.main
  }
}))

const NavBar = () => {

  return(
    <Container>
      <Stack alignItems="center" className={classes.iconStack} spacing={1}>
        <IconButton>
          <Image src={images.buho} width={60} height={30} alt='Owl Logo'/>
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

const Wrapper = () => {

  return (
    <NavBar/>
  )
}

export default Wrapper