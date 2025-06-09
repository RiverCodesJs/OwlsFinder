'use client'
import { Button, Typography as T } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useStore } from 'zustand'
import Image from 'next/image'
import Link from 'next/link'

import getClassPrefixer from '../UI/classPrefixer'
import { buhosLogo } from '../images'
import useToken from '../store/useToken'

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
          <Image src={buhosLogo} width={330} height={250} alt="Buho's Logo"/>
          <T variant="h4">Verifica tu cuenta</T>
          <T variant="body1">Para comenzar a utilizar todas las herramientas y recursos disponibles, por favor, confirma tu cuenta haciendo clic en el botón de abajo.</T>
          <Link href="/students"><Button variant="contained">Ingresar</Button></Link>
        </div>
      </Container>
    )
  }

  return(
    <Container>
      <div className={classes.contentBox}>
        <Image src={buhosLogo} width={330} height={250} alt="Buho's Logo"/>
        <T variant="h4">Verifica tu correo</T>
        <T variant="body1">Un correo ha sido enviado a tu cuenta. Revísalo para acceder al proceso de selección</T>
      </div>
    </Container>
  )
}

export default Verify