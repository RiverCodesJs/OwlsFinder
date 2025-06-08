'use client'
import { Button, Snackbar, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'

import { 
  getForgotPasswordInitialValues, 
  getForgotPasswordValidationSchema 
} from './utils'
import TextField from '../UI/shared/FormikTextField'
import getClassPrefixer from '../UI/classPrefixer'
import { useApiMutation } from '../Lib/apiFetch'
import { buhosLogo } from '../images'

const displayName = 'ForgotPassword'
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
    height: 450,
    width: 450,
    backgroundColor: theme.palette.contrast.main,  
    borderRadius: 4,
    padding: '1rem',
    textAlign: 'center'
  },
}))

const ForgotPassword = ({ snackbarMessage, setSnackbarMessage }) => {
  return(
    <Container>
      <div className={classes.contentBox}>
        <Image src={buhosLogo} width={270} height={200} alt="Buhos Logo"/>
        <Stack spacing={2} alignItems="center">
          <Stack>
            <Typography variant="h5">Reestablece tu contraseña</Typography>
            <Typography>Ingresa tu correo para reestablecer tu contraseña</Typography>
          </Stack>
          <Field 
            component={TextField} 
            fullWidth 
            name="email" 
            type="email" 
            placeholder="Correo electrónico"/>
          <Button variant="contained" type="submit">Enviar</Button>
        </Stack>
        <Snackbar
          open={Boolean(snackbarMessage)}
          autoHideDuration={3000}
          onClose={() => setSnackbarMessage(null)}
          message={snackbarMessage}/>
      </div>
    </Container>
  )
}

const Wrapper = () => {
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const forgotControl = useApiMutation({ path: 'forgot', opts: { method: 'POST' } })
  const initialValues = getForgotPasswordInitialValues
  const validationSchema = getForgotPasswordValidationSchema
  const handleSubmit = async payload => {
    await forgotControl.mutate(payload, {
      onSuccess: () => {
        setSnackbarMessage('Un correo ha sido enviado a su cuenta')
      },
      onError: () => {
        setSnackbarMessage('Lo sentimos, ha ocurrido un error.')
      }
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      <Form>
        <ForgotPassword 
          snackbarMessage={snackbarMessage} 
          setSnackbarMessage={setSnackbarMessage}/>
      </Form>
    </Formik>
  )
}

export default Wrapper