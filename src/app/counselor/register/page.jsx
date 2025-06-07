'use client'
import { Button, Snackbar, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '~/app/UI/classPrefixer'
import { images } from '~/app/images'
import { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { getRegisterSchema, getRegisterValues } from '~/app/counselor/register/utils'
import TextField from '~/app/UI/shared/FormikTextField'
import { useApiMutation } from '~/app/Lib/apiFetch'
import { useRouter } from 'next/navigation'

const displayName = 'CounselorRegister'
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
    width: '420px',
    height: '550px',
    backgroundColor: theme.palette.contrast.main,  
    borderRadius: 4,
    padding: '1rem',
    textAlign: 'center'
  },
}))

const CounselorRegister = ({ snackbarMessage, setSnackbarMessage }) => {
  return(
    <Container>
      <div className={classes.contentBox}>
        <Image src={images.buhosLogo} width={270} height={200} alt='Owls Logo'/>
        <Typography variant="h5">Bienvenido a OwlsHub</Typography>
        <Stack spacing={1} width="90%">
          <Field component={TextField} fullWidth name="names" placeholder="Nombre"/>
          <Field component={TextField} fullWidth name="password" type="password" placeholder="Contraseña"/>
          <Field component={TextField} fullWidth name="repeatPass" type="password" placeholder="Repetir contraseña"/>
        </Stack>
        <Button variant="contained" type="submit">Enviar</Button>
        <Snackbar 
          open={Boolean(snackbarMessage)}
          autoHideDuration={4000}
          onClose={() => setSnackbarMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          message={snackbarMessage}/>
      </div>
    </Container>
  )
}

const Wrapper = () => {
  const [snackBarMessage, setSnackbarMessage] = useState(null)
  const register = useApiMutation({ path: 'me', opts: { method: 'PATCH' } })
  const router = useRouter()

  const handleSubmit = async values => {
    if(values.password === values.repeatPass) {
      const payload = { ...values }
      delete payload.repeatPass
      await register.mutate(payload, {
        onSuccess: () => {
          setSnackbarMessage('Registro exitoso')
          setTimeout(() => {
            router.replace('/counselor')
          },2000)
        },
        onError: () => {
          setSnackbarMessage('Hubo un error')
        }
      })
    } else {
      setSnackbarMessage('Las contraseñas no coinciden')
    }
  }
  return (
    <Formik
      initialValues={getRegisterValues}
      validationSchema={getRegisterSchema}
      onSubmit={handleSubmit}> 
      <Form>
        <CounselorRegister 
          snackbarMessage={snackBarMessage}
          setSnackbarMessage={setSnackbarMessage}/>
      </Form>
    </Formik>
  )
}

export default Wrapper