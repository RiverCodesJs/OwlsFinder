'use client'
import { Snackbar, Stack, Typography as T } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import Image from 'next/image'
import classNames from 'clsx'

import getClassPrefixer from '~/app/UI/classPrefixer'

import { ProfessorForm } from './components/ProfessorForm'
import { StudentsForm } from './components/StudentsForm'
import { buho, buhosLogo } from '../images'

const displayName = 'Login'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  height: '100vh',
  [`& .${classes.activeContainer}`]: {
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
  [`& .${classes.inactiveContainer}`]: {
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
}))

const Login = ({ 
  snackbarMessage, 
  setSnackbarMessage, 
}) => {

  const [activeScreen, setActiveScreen] = useState(true)

  return (
    <Container>
      <Stack direction="row">
        <div 
          className={classNames({
            [classes.activeContainer]: activeScreen,
            [classes.inactiveContainer]: !activeScreen
          })}
          onFocus={() => setActiveScreen(true)}
        >
          {activeScreen 
            ? <Image src={buhosLogo} width={250} height={180} alt="Owls Logo"/> 
            : null}
          <T variant="h3">Inicio de sesión</T>
          <T variant="body1">Si ya tienes una cuenta</T>
          <ProfessorForm setSnackbarMessage={setSnackbarMessage} isActive={activeScreen}/>
        </div>
        <div 
          className={classNames({
            [classes.activeContainer]: !activeScreen,
            [classes.inactiveContainer]: activeScreen
          })}
          onFocus={() => setActiveScreen(false)}
        >
          {!activeScreen 
            ? <Image src={buho} width={200} height={100} alt="Owls Logo"/> 
            : null}
          <T variant="h3">Alumnos</T>
          <T variant="body1">Verifica tu informacion</T>
          <StudentsForm setSnackbarMessage={setSnackbarMessage} isActive={activeScreen}/>
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