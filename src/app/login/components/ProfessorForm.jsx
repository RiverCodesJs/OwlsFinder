import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import CustomField from '~/app/UI/shared/FormikTextField'
import getClassPrefixer from '~/app/UI/classPrefixer'
import { useApiMutation } from '~/app/Lib/apiFetch'
import useToken from '~/app/store/useToken'

import { getProfessorLoginInitialValues, getProfessorLoginValidationSchema } from '../utils'

const displayName = 'TeachersFormik'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  width: 450,
  display: 'flex',
  flexDirection: 'column',
  gap: '1ch',
  justifyContent: 'center',
  alignItems: 'center',
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
    width: '100%',
    textAlign: 'left',
  },
}))

const FormComponent = ({ focused }) => (
  <Container>
    <Field 
      component={CustomField} 
      fullWidth 
      type="email" 
      name='email' 
      placeholder="Correo"
    />
    <Field 
      component={CustomField} 
      fullWidth 
      type="password" 
      name='password' 
      placeholder="Contraseña"
    />
    {focused 
      ? <Link href="/forgot" className={classes.forgotLink}>¿Olvidó su contraseña?</Link> 
      : null}
    <Form>
      <Button 
        type='submit' 
        className={focused 
          ? classes.unfocusedButton 
          : classes.focusedButton}
      >
        Ingresar
      </Button>
    </Form>
  </Container>
)

export const ProfessorForm = ({ setSnackbarMessage, focused }) => {
  const userLogin = useApiMutation({ path: 'login', opts: { method: 'POST' } })
  const { setToken } = useToken()
  const router = useRouter()
  const initialValues = getProfessorLoginInitialValues()
  const validationSchema = getProfessorLoginValidationSchema()

  const handleSubmit = async payload => {
    await userLogin.mutate(payload, {
      onSuccess: response => {
        setToken(response)
        router.replace('/counselor')
      },
      onError: e => {
        if(e.error === 'Invalid Fields') {
          setSnackbarMessage('Lo sentimos, ha ocurrido un error.')
        } else {
          setSnackbarMessage('Ocurrió un error')
        }
      }
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <FormComponent focused={focused}/>
    </Formik>
  )
}