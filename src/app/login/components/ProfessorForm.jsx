import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Field, Form, Formik, useFormikContext } from 'formik'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import CustomField from '~/app/UI/shared/FormikTextField'
import getClassPrefixer from '~/app/UI/classPrefixer'
import { useApiMutation, useApiQuery } from '~/app/Lib/apiFetch'
import useToken from '~/app/store/useToken'

import { getProfessorLoginInitialValues, getProfessorLoginValidationSchema } from '../utils'
import { useData } from '~/app/store/useData'

const displayName = 'TeachersFormik'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  width: 400,
  display: 'flex',
  flexDirection: 'column',
  gap: '1ch',
  justifyContent: 'center',
  alignItems: 'center',
  '@media(max-width: 768px)': {
    width: 300
  },
  [`& .${classes.forgotLink}`]: {
    textDecoration: 'none',
    color: theme.palette.grey.main,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'left',
  },
}))

const FormComponent = ({ isActive }) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Container>
      <Field 
        component={CustomField} 
        fullWidth 
        type="email" 
        name="email"
        placeholder="Correo"
      />
      <Field 
        component={CustomField} 
        fullWidth 
        type="password" 
        name="password" 
        placeholder="Contraseña"
      />
      {isActive 
        ? <Link href="/forgot" className={classes.forgotLink}>¿Olvidó su contraseña?</Link> 
        : null}
      <Form>
        {isActive
          ? <Button 
            type="submit" 
            variant="contained"
            disabled={!isActive || (!isValid || !dirty)}
          >
            Ingresar
          </Button>
          : null}
      </Form>
    </Container>
  )
}

export const ProfessorForm = ({ setSnackbarMessage, isActive }) => {
  const userLogin = useApiMutation({ path: 'login', opts: { method: 'POST' } })
  const { promise: promiseMe } = useApiQuery({ 
    path: 'me', 
    opts: { queryOptions: { 
      enabled: !!userLogin.data, 
      experimental_prefetchInRender: true
    } } 
  })
  const { setToken } = useToken()
  const { setUserId, setType } = useData()
  const router = useRouter()
  const initialValues = getProfessorLoginInitialValues()
  const validationSchema = getProfessorLoginValidationSchema()

  const handleSubmit = async payload => {
    const token = await userLogin.mutateAsync(payload, {
      onSuccess: response => {
        setToken(response)
      },
      onError: () => {
        setSnackbarMessage('Lo sentimos, ha ocurrido un error.')
      }
    })
    if(token) {
      const meData = await promiseMe
      if(meData.id && meData.type) {
        setUserId(meData.id)
        setType(meData.type)
        router.replace('/counselor')
      }
    }
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