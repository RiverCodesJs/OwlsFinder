'use client'
import { Button, Snackbar, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Formik, Form, Field } from 'formik'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import getClassPrefixer from '~/app/UI/classPrefixer'

import CustomField from '../UI/shared/FormikTextField'
import { images } from '../images'
import { useApiMutation } from '../Lib/apiFetch'
import useToken from '../store/useToken'
import { getAlumniValidationSchema, getAlumniInitialValues, getEmailValidationSchema, getEmailInitialValues } from './utils'

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
  [`& .${classes.focusedButton}`]: {
    marginTop: '1ch',
    backgroundColor: theme.palette.contrast.main,
    color: theme.palette.primary.main
  },
  [`& .${classes.unfocusedButton}`]: {
    marginTop: '1ch',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.contrast.main
  },
  [`& .${classes.forgotLink}`]: {
    textDecoration: 'none',
    color: theme.palette.grey.main,
    fontWeight: 'bold',
    width: '60%',
    textAlign: 'left',
  },
  
}))

const Login = ({ snackbarMessage, setSnackbarMessage, studentsFormik, teachersFormik }) => {

  const [focused, setFocused] = useState(true)

  return (
    <Container>
      <Stack direction="row">
        <Formik
          initialValues={teachersFormik?.initialValues}
          validationSchema={teachersFormik?.validationSchema}
          onSubmit={teachersFormik?.handleSubmit}>
          <div className={focused ? classes.unfocusedContainer : classes.focusedContainer} onFocus={() => setFocused(true)}>
            {focused ? <Image src={images.buhosLogo} width={250} height={180} alt="Owls Logo"/> : null}
            <Typography variant="h3">Inicio de sesión</Typography>
            <Typography variant="body1">Si ya tienes una cuenta</Typography>
            <Stack width="60%" spacing={1}>
              <Field component={CustomField} fullWidth type="email" name='email' placeholder="Correo"/>
              <Field component={CustomField} fullWidth type="password" name='password' placeholder="Contraseña"/>
            </Stack>
            {focused ? <Link href="/forgot" className={classes.forgot_link}>¿Olvidó su contraseña?</Link> : null}
            <Form>
              <Button type='submit' className={focused ? classes.unfocusedButton : classes.focusedButton}>Ingresar</Button>
            </Form>
          </div>
        </Formik>
        <Formik
          initialValues={studentsFormik?.initialValues}
          validationSchema={studentsFormik?.validationSchema}
          onSubmit={studentsFormik?.handleSubmit}>
          <div className={focused ? classes.focusedContainer : classes.unfocusedContainer} onFocus={() => {
            setFocused(false)
          }}>
            {!focused ? <Image src={images.buho} width={200} height={100} alt="Owls Logo"/> : null}
            <Typography variant="h3">Alumnos</Typography>
            <Typography variant="body1">Verifica tu informacion</Typography>
            <Stack width="60%" spacing={1}>
              <Field component={CustomField} fullWidth name='names' placeholder="Nombre"/>
              <Stack direction="row" spacing={1}>
                <Field component={CustomField} name='paternalSurname' placeholder="Apellido Paterno"/>
                <Field component={CustomField} name='maternalSurname' placeholder="Apellido Materno"/>
              </Stack>
              <Field component={CustomField} fullWidth name='enrollmentId' placeholder="Matricula"/>
              <Stack direction="row" spacing={1}>
                <Field component={CustomField} fullWidth name='shift' placeholder="Turno"/>
                <Field component={CustomField} fullWidth name='currentGroup' placeholder="Grupo"/>
              </Stack>
            </Stack>
            <Form>
              <Button type='submit' className={focused ? classes.focusedButton : classes.unfocusedButton}>Ingresar</Button>
            </Form>
          </div>
        </Formik>
        <Snackbar 
          open={Boolean(snackbarMessage)}
          autoHideDuration={4000}
          onClose={() => setSnackbarMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          message={snackbarMessage}/>
      </Stack>
    </Container>
  )
}

const Wrapper = () => {
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const { setToken } = useToken() 
  const userLogin = useApiMutation({ path: 'login', opts: { method: 'POST' } })
  const studentsLogin = useApiMutation({ path: 'students/login', opts: { method: 'POST' } })
  const router = useRouter()

  const teachersSubmit = async payload => {
    await userLogin.mutate(payload, {
      onSuccess: response => {
        setToken(response)
        router.replace('/counselor')
      },
      onError: e => {
        if(e.error === 'Invalid Fields') {
          setSnackbarMessage('Datos incorrectos. Intenta ingresarlos de nuevo')
        } else {
          setSnackbarMessage('Ocurrió un error')
        }
      }
    })
  }

  const studentsSubmit = async payload => {
    payload.email = `${payload.enrollmentId}@cobachih.edu.mx`
    payload.grade = payload.currentGroup[0]
    studentsLogin.mutate(payload, {
      onSuccess: () => {
        setSnackbarMessage('Inicio de sesión exitoso')
        router.replace('/verify')
      },
      onError: () => {
        setSnackbarMessage('Datos incorrectos. Intenta ingresarlos de nuevo.')
      }
    })
  }


  const teachersFormik = {
    initialValues: getEmailInitialValues(),
    validationSchema: getEmailValidationSchema(),
    handleSubmit: teachersSubmit
  }

  const studentsFormik = {
    initialValues: getAlumniInitialValues(),
    validationSchema: getAlumniValidationSchema(),
    handleSubmit: studentsSubmit
  }

  return (
    <Login 
      teachersFormik={teachersFormik} 
      studentsFormik={studentsFormik} 
      snackbarMessage={snackbarMessage} 
      setSnackbarMessage={setSnackbarMessage}/>
  )
}

export default Wrapper