import { Field, Form, Formik, useFormikContext } from 'formik'
import { styled } from '@mui/material/styles'
import { Button, Stack } from '@mui/material'
import { useRouter } from 'next/navigation'

import { useApiMutation } from '~/app/Lib/apiFetch'
import CustomField from '~/app/UI/shared/FormikTextField'
import { getStudentsLoginInitialValues, getStudentsLoginValidationSchema } from '../utils'

const Container = styled('div')({
  width: 450,
  display: 'flex',
  flexDirection: 'column',
  gap: '1ch',
  justifyContent: 'center',
  alignItems: 'center',
})

const FormComponent = ({ isActive }) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Container>
      <Field 
        component={CustomField} 
        fullWidth 
        name='names' 
        placeholder="Nombre"
      />
      <Stack direction="row" spacing={1}>
        <Field 
          fullWidth
          component={CustomField} 
          name='paternalSurname' 
          placeholder="Apellido Paterno"
        />
        <Field 
          fullWidth
          component={CustomField} 
          name='maternalSurname' 
          placeholder="Apellido Materno"
        />
      </Stack>
      <Field 
        component={CustomField} 
        fullWidth 
        name='enrollmentId' 
        placeholder="Matricula"
      />
      <Stack direction="row" spacing={1}>
        <Field 
          component={CustomField} 
          fullWidth 
          name='shift' 
          placeholder="Turno"
        />
        <Field 
          component={CustomField} 
          fullWidth 
          name='currentGroup' 
          placeholder="Grupo"  
        />
      </Stack>
      <Form>
        {!isActive 
          ? <Button 
            type='submit' 
            disabled={isActive || (!isValid || !dirty)}
          >
            Ingresar
          </Button>
          : null}
        
      </Form>
    </Container>
  )
}

export const StudentsForm = ({ isActive, setSnackbarMessage }) => {
  const initialValues = getStudentsLoginInitialValues()
  const validationSchema = getStudentsLoginValidationSchema()
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
        setSnackbarMessage('Lo sentimos, ha ocurrido un error.')
      }
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <FormComponent isActive={isActive}/>
    </Formik>
  )
}