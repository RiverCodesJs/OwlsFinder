'use client'
import { Button, Snackbar, Stack, Typography as T } from '@mui/material'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { omit } from 'ramda'

import { 
  getRegisterValidationSchema, 
  getRegisterInitialValues 
} from '~/app/counselor/register/utils'
import TextField from '~/app/UI/shared/FormikTextField'
import getClassPrefixer from '~/app/UI/classPrefixer'
import { useApiMutation } from '~/app/Lib/apiFetch'
import { buhosLogo } from '~/app/images'
import { Permitted } from '~/app/Permissions/Permitted'
import { NotAvailable } from '~/app/UI/shared/NotAvailable'

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
        <Image src={buhosLogo} width={270} height={200} alt='Owls Logo'/>
        <T variant="h5">Bienvenido a OwlsHub</T>
        <Stack spacing={1} width="90%">
          <Field 
            component={TextField} 
            fullWidth name="names" 
            placeholder="Nombre"
          />
          <Field 
            component={TextField} 
            fullWidth name="password" 
            type="password" 
            placeholder="Contraseña"
          />
          <Field 
            component={TextField} 
            fullWidth 
            name="repeatPass" 
            type="password" 
            placeholder="Repetir contraseña"
          />
        </Stack>
        <Form>
          <Button type="submit" variant="contained" >Enviar</Button>
        </Form>
        <Snackbar 
          open={Boolean(snackbarMessage)}
          autoHideDuration={4000}
          onClose={() => setSnackbarMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          message={snackbarMessage}
        />
      </div>
    </Container>
  )
}

const Wrapper = () => {
  const [snackBarMessage, setSnackbarMessage] = useState(null)
  const register = useApiMutation({ path: 'me', opts: { method: 'PATCH' } })
  const router = useRouter()
  const initialValues = getRegisterInitialValues()
  const validationSchema = getRegisterValidationSchema()

  const handleSubmit = async values => {
    const payload = omit(['repeatPass'], values)
    await register.mutate(payload, {
      onSuccess: () => {
        setSnackbarMessage('Registro exitoso')
        setTimeout(() => {
          router.replace('/counselor')
        },2000)
      },
      onError: () => {
        setSnackbarMessage('Lo sentimos, ha ocurrido un error')
      }
    })
  }
  return (
    <Permitted 
      requiredType='Counselor'
      Fallback={NotAvailable}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      > 
        <CounselorRegister 
          snackbarMessage={snackBarMessage}
          setSnackbarMessage={setSnackbarMessage}
        />
      </Formik>
    </Permitted>
  )
}

export default Wrapper