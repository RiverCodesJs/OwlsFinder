'use client'
import { Button, Stack, Typography as T } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Field, Form, Formik, useFormikContext } from 'formik'

import FormikTextField from '~/app/UI/shared/FormikTextField'
import getClassPrefixer from '~/app/UI/classPrefixer'
import { useApiMutation } from '~/app/Lib/apiFetch'

import { setCounselorInitialValues, getCounselorValidationSchema } from './utils'

const displayName = 'CounselorCreationForm'
const classes = getClassPrefixer(displayName)

const ModalContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  top: 100,
  bottom: 0,
  left: 0,
  right: 0,
  [`& .${classes.contentBox}`]: {
    width: 600,
    height: 250,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
    borderRadius: 4,
    backgroundColor: theme.palette.contrast.main,
  },
  [`& .${classes.formSection}`]: {
    height: 400,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  [`& .${classes.IconButton}`]: {
    height: 30,
    width: 30,
  }
}))

const CounselorCreationForm = ({ onClose }) => {
  const { isValid, dirty } = useFormikContext()

  return (
    <ModalContainer>
      <div className={classes.contentBox}>
        <T variant='h3' fontWeight='bold'>Crear nuevo orientador</T>
        <div className={classes.formSection}>
          <Field
            fullWidth
            component={FormikTextField}
            name='email'
            type='email'
            placeholder='Correo electronico'
          />
        </div>
        <Stack direction='row' spacing={2} justifyContent='end'>
          <Button variant='contained' onClick={onClose}>Cancelar</Button>
          <Form>
            <Button 
              variant='contained' 
              type='submit'
              disabled={!isValid || !dirty}
            >
              Registrar
            </Button>
          </Form>
        </Stack>
      </div>
    </ModalContainer>
  )
}

const Wrapper = ({ onClose, setSnackbarMessage }) => {

  const initialValues = setCounselorInitialValues()
  const validationSchema = getCounselorValidationSchema()
  const counselorRegister = useApiMutation({ path: 'counselor', opts: { method: 'POST' } })

  const handleSubmit = async payload => {
    await counselorRegister.mutate(payload, {
      onSuccess: async () => {
        setSnackbarMessage('Orientador creado con éxito')
        onClose()
      },
      onError: () => {
        setSnackbarMessage('Ha ocurrido un error')
      }
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <CounselorCreationForm 
        onClose={onClose}
        setSnackbarMessage={setSnackbarMessage}
      />
    </Formik>
  )
} 

export default Wrapper