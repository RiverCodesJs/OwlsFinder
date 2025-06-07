'use client'
import { Button, Typography } from '@mui/material'
import Image from 'next/image'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '../UI/classPrefixer'
import { images } from '../images'
import useToken from '../store/useToken'
import Link from 'next/link'
import { useStore } from 'zustand'

const displayName = 'VerifyEmail'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  backgroundColor: theme.palette.primary.main,
  
  [`& .${classes.contentBox}`]: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    width: '450px',
    height: '500px',
    backgroundColor: theme.palette.contrast.main,  
    borderRadius: 4,
    padding: '1rem',
    textAlign: 'center'
  },
}))

const Verify = () => {
  const token = useStore(useToken, state => state.token)

  if(token) {
    return (
      <Container>
        <div className={classes.contentBox}>
          <Image src={images.buhosLogo} width={330} height={250} alt="Buho's Logo"/>
          <Typography variant="h4">Verifica tu cuenta</Typography>
          <Typography variant="body1">Para comenzar a utilizar todas las herramientas y recursos disponibles, por favor, confirma tu cuenta haciendo clic en el botón de abajo.</Typography>
          <Link href="/students"><Button variant="contained">Ingresar</Button></Link>
        </div>
      </Container>
    )
  }

  return(
    <Container>
      <div className={classes.contentBox}>
        <Image src={images.buhosLogo} width={330} height={250} alt="Buho's Logo"/>
        <Typography variant="h4">Verifica tu correo</Typography>
        <Typography variant="body1">Un correo ha sido enviado a tu cuenta. Revísalo para acceder al proceso de selección</Typography>
      </div>
    </Container>
  )
}

export default Verify