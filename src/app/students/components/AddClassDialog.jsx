'use client'
import { Button, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import { Field, Form, Formik, useFormikContext } from 'formik'
import { omit } from 'ramda'

import Dialog from '~/app/UI/shared/Dialog'
import FormikSelect from '~/app/UI/shared/FormikSelect'
import FormikTextField from '~/app/UI/shared/FormikTextField'
import { useApiMutation } from '~/app/Lib/apiFetch'
import { getClassInitialValues, getClassValidationSchema } from './utils'
import { shiftOptions } from '~/app/Lib/enums'

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '5px 0',
})

const FormElement = ({ 
  onClose, 
  open, 
  profList,
  currentArea,
}) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Agregar clase"
      fullWidth
      content={
        <Container>
          <Stack spacing={1}>
            <Field 
              fullWidth 
              component={FormikTextField} 
              name="name" 
              placeholder="Nombre"
            />
            <Field 
              component={FormikTextField} 
              fullWidth 
              multiline 
              rows={5} 
              name="description"
              placeholder="Descripción"
            />
            <Stack direction="row" spacing={1}>
              <Field 
                component={FormikTextField} 
                fullWidth 
                name="images"
                isArray
                placeholder="Imágen"
              />
              <Field 
                component={FormikTextField} 
                fullWidth 
                name="videos"
                isArray
                placeholder="Video"
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Field 
                component={FormikTextField}
                fullWidth 
                placeholder="Limite" 
                name="limit"
              />
              <Field
                component={FormikTextField}
                fullWidth
                placeholder="Numero de grupo"
                name="groupNumber"
              />
            </Stack>
            { currentArea === 'training' 
              ? <Stack direction="row" spacing={1}>
                <Field
                  component={FormikTextField}
                  fullWidth 
                  placeholder="Docente" 
                  name="professor"
                />
                <Field
                  component={FormikSelect}
                  fullWidth
                  label="Turno"
                  name="shift"
                  options={shiftOptions}
                />
              </Stack>
              : null
            }
            { currentArea === 'package' 
              ? <Field 
                component={FormikSelect}
                fullWidth 
                label="Materias" 
                name="subjects"
                options={profList}
              />
              : null
            }
            { currentArea === 'club'
              ? <Stack spacing={1}>
                <Field
                  component={FormikSelect}
                  fullWidth
                  label="Docente"
                  name="professorId"
                  options={profList}
                />
                <Stack direction="row" spacing={1}>
                  <Field
                    component={FormikSelect}
                    fullWidth
                    label="Turno"
                    name="shift"
                    options={shiftOptions}
                  />
                  <Field
                    component={FormikTextField}
                    fullWidth
                    placeholder="Horario"
                    name="schedule"
                  />
                </Stack>
              </Stack>
              : null
            }
          </Stack>
        </Container>
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

const AddClassDialog = ({ onClose, open, setSnackbarMessage, currentArea, profList }) => {
  const initialValues = getClassInitialValues()
  const validationSchema = getClassValidationSchema()
  const addClass = useApiMutation({ path: currentArea, opts: { method: 'POST' } })
  const queryClient = useQueryClient()

  const omitFields = area => {
    switch (area) {
      case 'club': return ['subjects']
      case 'training': return ['subjects', 'professorId', 'schedule']
      case 'package': return ['professorId', 'shift', 'schedule']
    }
    return []
  }

  const handleSubmit = values => {
    const payload = omit(omitFields(currentArea), values)
    payload.limit = Number(payload.limit)
    payload.groupNumber = Number(payload.groupNumber)
    addClass.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries([currentArea])
        setSnackbarMessage('Clase agregada con exito')
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
      <FormElement 
        open={open}
        onClose={onClose}
        profList={profList}
        currentArea={currentArea}
      />
    </Formik>
  )
}

export default AddClassDialog