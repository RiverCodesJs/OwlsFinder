import { Field, Form, Formik, useFormikContext } from 'formik'
import { getSubjectInitialValues, getSubjectValidationSchema } from './utils'
import { useApiMutation } from '~/app/Lib/apiFetch'
import Dialog from '~/app/UI/shared/Dialog'
import FormikTextField from '~/app/UI/shared/FormikTextField'
import { Button, Stack } from '@mui/material'


const SubjectCreateDialog = ({ open, onClose }) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      title="Agregar nueva materia"
      content={
        <Stack spacing={2}>
          <Field
            component={FormikTextField}
            fullWidth
            name="name"
            placeholder="Nombre"
          />
          <Field
            component={FormikTextField}
            fullWidth
            multiline
            rows={3}
            name="description"
            placeholder="Descripcion"
          />
        </Stack>
      }
      actions={
        <Stack direction='row' spacing={2} justifyContent='end'>
          <Button variant='contained' onClick={onClose}>Cancelar</Button>
          <Form>
            <Button 
              variant='contained' 
              type='submit'
              disabled={!isValid || !dirty}
            >Registrar</Button>
          </Form>
        </Stack>
      }
    />
  )
}


const Wrapper = ({ open, onClose, setSnackbarMessage }) => {
  const initialValues = getSubjectInitialValues()
  const validationSchema = getSubjectValidationSchema()
  const addSubject = useApiMutation({ path: 'subject', opts: { method: 'POST' } })

  const handleSubmit = payload => {
    addSubject.mutate(payload, {
      onSuccess: () => {
        setSnackbarMessage('Materia registrada con éxito')
        onClose()
      }
    })
  }
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <SubjectCreateDialog
        open={open}
        onClose={onClose}
      />
    </Formik>
  )
}

export default Wrapper