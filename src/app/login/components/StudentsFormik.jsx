import { Field, Form, Formik } from 'formik'
import { styled } from '@mui/material/styles'
import { getAlumniInitialValues, getAlumniValidationSchema } from '../utils'
import { useApiMutation } from '~/app/Lib/apiFetch'
import { useRouter } from 'next/navigation'

import getClassPrefixer from '~/app/UI/classPrefixer'
import CustomField from '~/app/UI/shared/FormikTextField'
import { Button, Stack } from '@mui/material'

const displayName = 'StudentsLogin'
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
}))

const FormComponent = ({ focused }) => (
  <Container>
    <Field 
      component={CustomField} 
      fullWidth 
      name='names' 
      placeholder="Nombre"/>
    <Stack direction="row" spacing={1}>
      <Field 
        fullWidth
        component={CustomField} 
        name='paternalSurname' 
        placeholder="Apellido Paterno"/>
      <Field 
        fullWidth
        component={CustomField} 
        name='maternalSurname' 
        placeholder="Apellido Materno"/>
    </Stack>
    <Field 
      component={CustomField} 
      fullWidth 
      name='enrollmentId' 
      placeholder="Matricula"/>
    <Stack direction="row" spacing={1}>
      <Field 
        component={CustomField} 
        fullWidth 
        name='shift' 
        placeholder="Turno"/>
      <Field 
        component={CustomField} 
        fullWidth 
        name='currentGroup' 
        placeholder="Grupo"/>
    </Stack>
    <Form>
      <Button 
        type='submit' 
        className={focused 
          ? classes.focusedButton 
          : classes.unfocusedButton}>Ingresar</Button>
    </Form>
  </Container>
)

export const StudentsFormik = ({ focused, setSnackbarMessage }) => {
  const initialValues = getAlumniInitialValues()
  const validationSchema = getAlumniValidationSchema()
  const studentsLogin = useApiMutation({ path: 'students/login', opts: { method: 'POST' } })
  const router = useRouter()

  const handleSubmit = async payload => {
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      <FormComponent focused={focused}/>
    </Formik>
  )
}