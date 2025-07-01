'use client'
import { Button, Stack } from '@mui/material'
import { Field, Form, Formik, useFormikContext } from 'formik'

import { useApiMutation } from '~/app/Lib/apiFetch'
import { DialogTemplate } from '~/app/UI/shared/DialogTemplate'
import FormikTextField from '~/app/UI/shared/FormikTextField'
import { setCounselorInitialValues, getCounselorValidationSchema } from './utils'

const CounselorCreationForm = ({ open, onClose }) => {
  const { isValid, dirty } = useFormikContext()
  
  return (
    <DialogTemplate
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      title="Crear nuevo orientador"
      content={
        <Field
          fullWidth
          component={FormikTextField}
          name="email"
          type="email"
          placeholder="Correo electronico"
        />
      }
      actions={
        <Stack direction="row" spacing={1}>
          <Button 
            variant="contained" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Form>
            <Button 
              variant="contained"
              type="submit"
              disabled={!isValid || !dirty}
            >
              Registrar
            </Button>
          </Form>
        </Stack>
      }
    />
  )
}

const Wrapper = ({ open, onClose, setSnackbarMessage }) => {

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
        open={open}
        onClose={onClose}
      />
    </Formik>
  )
} 

export default Wrapper