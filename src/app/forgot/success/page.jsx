'use client'
import { Button, Snackbar, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { useState } from 'react '
import { Form, Formik, Field } from 'formik'

import getClassPrefixer from '~/app/UI/classPrefixer'
import { images } from '~/app/images'
import TextField from '~/app/UI/shared/FormikTextField'
import { useApiMutation } from '~/app/Lib/apiFetch'

import { getForgotValidationSchema, getForgotInitialValues } from './utils'

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
    flexDirecion: 'column',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    width: '350px',
    height: '500px',
    backgroundColor: theme.palette.contrast.main,  
    borderRadius: 4,
    padding: '1rem',
    textAlign: 'center'
  },
}))

const Success = ({ snackbarMessage, setSnackbarMessage }) => {
  return(
    <Container>
      <div className={classes.contentBox} spacing={3}>
        <Image src={images.buhosLogo} width={270} height={200} alt='Owls Logo'/>
        <Typography variant="h5">Reestablece tu contraseña</Typography>
        <Stack spacing={2} width="90%">
          <Field component={TextField} fullWidth name="password" type="password" placeholder="Nueva contraseña"/>
          <Field component={TextField} fullWidth name="repeatPass" type="password" placeholder="Repetir contraseña"/>
        </Stack>
        <Form>
          <Button type="submit" variant="contained">Ingresar</Button>
        </Form>
      </div>
      <Snackbar 
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={snackbarMessage}/>
    </Container>
  )
}

const Wrapper = () => {
  const resetPass = useApiMutation({ path: 'me', opts: { method: 'PATCH' } })
  const [snackbarMessage, setSnackbarMessage] = useState(null)

  const handleSubmit = async values => {

    if (values.password != values.repeatPass) {
      setSnackbarMessage('Las contraseñas no coinciden.')
    } else {
      const payload = { password: values.password }
      await resetPass.mutate(payload, {
        onSuccess: () => {
          setSnackbarMessage('Información cambiada correctamente')
        },
        onError: () => {
          setSnackbarMessage('Hubo un problema en el servidor.')
        }
      })
    }
  }
  return (
    <Formik
      initialValues={getForgotInitialValues}
      validationSchema={getForgotValidationSchema}
      onSubmit={handleSubmit}>
      <Success 
        snackbarMessage={snackbarMessage} 
        setSnackbarMessage={setSnackbarMessage}
        handleSubmit={handleSubmit}/>
    </Formik>
  )
}

export default Wrapper