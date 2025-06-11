'use client'
import { Snackbar, Stack, Typography as T } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import Image from 'next/image'

import getClassPrefixer from '~/app/UI/classPrefixer'

import { ProfessorForm } from './components/ProfessorForm'
import { StudentsForm } from './components/StudentsForm'
import { buho, buhosLogo } from '../images'

const displayName = 'login'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  height: '100vh',
  [`& .${classes.focusedContainer}`]: {
    width: '50vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    gap: '1ch',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.contrast.main
  },
  [`& .${classes.unfocusedContainer}`]: {
    width: '50vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    gap: '1ch',
    backgroundColor: theme.palette.contrast.main,
    color: theme.palette.primary.main
  },
}))

const Login = ({ 
  snackbarMessage, 
  setSnackbarMessage, 
}) => {

  const [focused, setFocused] = useState(true)

  return (
    <Container>
      <Stack direction="row">
        <div 
          className={focused ? classes.unfocusedContainer : classes.focusedContainer}
          onFocus={() => setFocused(true)}
        >
          {focused 
            ? <Image src={buhosLogo} width={250} height={180} alt="Owls Logo"/> 
            : null}
          <T variant="h3">Inicio de sesión</T>
          <T variant="body1">Si ya tienes una cuenta</T>
          <ProfessorForm setSnackbarMessage={setSnackbarMessage} focused={focused}/>
        </div>
        <div 
          className={focused ? classes.focusedContainer : classes.unfocusedContainer}
          onFocus={() => setFocused(false)}
        >
          {!focused 
            ? <Image src={buho} width={200} height={100} alt="Owls Logo"/> 
            : null}
          <T variant="h3">Alumnos</T>
          <T variant="body1">Verifica tu informacion</T>
          <StudentsForm setSnackbarMessage={setSnackbarMessage} focused={focused}/>
        </div>
        <Snackbar
          open={Boolean(snackbarMessage)}
          onClose={() => setSnackbarMessage(null)}
          autoHideDuration={5000}
          message={snackbarMessage}
        />
      </Stack>
    </Container>
  )
}

const Wrapper = () => {
  const [snackbarMessage, setSnackbarMessage] = useState(null)

  return (
    <Login 
      snackbarMessage={snackbarMessage} 
      setSnackbarMessage={setSnackbarMessage}
    />
  )
}

export default Wrapper