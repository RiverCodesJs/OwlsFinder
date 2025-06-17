'use client'
import { Button, Snackbar, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { Suspense, useEffect, useState } from 'react'
import { Form, Formik, Field, useFormikContext } from 'formik'
import { omit } from 'ramda'

import getClassPrefixer from '~/app/UI/classPrefixer'
import { buhosLogo } from '~/app/images'
import TextField from '~/app/UI/shared/FormikTextField'
import { useApiMutation, useApiQuery } from '~/app/Lib/apiFetch'

import { 
  getResetPasswordValidationSchema, 
  getResetPasswordInitialValues 
} from './utils'
import { Permitted } from '~/app/Permissions/Permitted'
import { NotAvailable } from '~/app/UI/shared/NotAvailable'
import useToken from '../store/useToken'
import Loading from '../UI/shared/Loading'
import { useData } from '../store/useData'

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
    width: '350px',
    height: '500px',
    backgroundColor: theme.palette.contrast.main,  
    borderRadius: 4,
    padding: '1rem',
    textAlign: 'center'
  },
}))

const Success = ({ snackbarMessage, setSnackbarMessage }) => {
  const { data, isLoading, error } = useApiQuery({ path: 'verify' })
  const { setUserId, setType } = useData()
  const { setToken } = useToken()
  const router = useRouter()
  const client = useQueryClient()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { isValid, dirty } = useFormikContext()
  
  useEffect(() => {
    if(token) {
      setToken(token)
    }
    if(data?.userId && data?.type) {
      setUserId(data?.userId)
      setType(data?.type)
    }
    if(error) {
      setToken(null)
      client.clear()
      router.replace('/login')
    }
  }, [
    token,
    setToken,
    data,
    setUserId,
    setType,
    error,
    client,
    router
  ])
  
  if(isLoading) return <Loading/>

  return (
    <Container>
      <div className={classes.contentBox}>
        <Image src={buhosLogo} width={270} height={200} alt='Owls Logo'/>
        <Typography variant="h5">Reestablece tu contraseña</Typography>
        <Stack spacing={2} width="90%">
          <Field 
            component={TextField} 
            fullWidth name="password" 
            type="password" 
            placeholder="Nueva contraseña"
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
          <Button 
            type="submit" 
            variant="contained"
            disabled={!isValid || !dirty}
          >
            Ingresar
          </Button>
        </Form>
      </div>
      <Snackbar 
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={snackbarMessage}
      />
    </Container>
  )
}

const Wrapper = () => {
  const resetPass = useApiMutation({ path: 'me', opts: { method: 'PATCH' } })
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const initialValues = getResetPasswordInitialValues
  const validationSchema = getResetPasswordValidationSchema
  const router = useRouter()
  
  const handleSubmit = async values => {
    const payload = omit(['repeatPass'], values)
    await resetPass.mutate(payload, {
      onSuccess: () => {
        setSnackbarMessage('Información cambiada correctamente')
        setTimeout(() => {
          router.replace('/login')
        }, 1000)
      },
      onError: () => {
        setSnackbarMessage('Hubo un problema en el servidor.')
      }
    })
  }
    
  return (
    <Suspense fallback={<Loading/>}>
      <Permitted 
        requiredType='COUNSELOR'
        Fallback={NotAvailable}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Success 
            snackbarMessage={snackbarMessage} 
            setSnackbarMessage={setSnackbarMessage}
            handleSubmit={handleSubmit}
          />
        </Formik>
      </Permitted>
    </Suspense>
  )
}

export default Wrapper