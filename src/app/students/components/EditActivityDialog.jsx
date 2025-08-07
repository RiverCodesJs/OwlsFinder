'use client'
import { Button, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import { Field, Form, Formik, useFormikContext } from 'formik'
import { omit, uniq } from 'ramda'

import Dialog from '~/app/UI/shared/Dialog'
import FormikSelect from '~/app/UI/shared/FormikSelect'
import FormikTextField from '~/app/UI/shared/FormikTextField'
import { useApiMutation, useApiQuery } from '~/app/Lib/apiFetch'
import { getActivityInitialValues, getActivityValidationSchema } from './utils'
import { shiftOptions } from '~/app/Lib/enums'

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '5px 0',
})

const EditActivityDialog = ({ 
  onClose, 
  open, 
  profList,
  subjectList,
  currentArea,
  mode
}) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`${mode === 'edit' ? 'Modificar' : 'Agregar'} actividad`}
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
                multiple
                label="Materias" 
                name="subjects"
                options={subjectList}
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
              Guardar
            </Button>
          </Form>
        </Stack>
      }
    />
  )
} 

const Wrapper = ({ onClose, open, setSnackbarMessage, currentArea, data }) => {
  const initialValues = getActivityInitialValues(data ?? {})
  const validationSchema = getActivityValidationSchema()
  const addActivity = useApiMutation({ path: currentArea, opts: { method: 'POST' } })
  const editActivity = useApiMutation({ path: `${currentArea}/${data?.id ?? ''}`, opts: { method: 'PUT' } })
  const { data: professorData } = useApiQuery({ path: 'professor' })
  const professors = Object.values(professorData ?? [])
  const profList = professors.map(prof => ({
    label: `${prof.name} ${prof.paternalSurname} ${prof.maternalSurname}`,
    value: prof.id
  }))
  const { data: subjectData } = useApiQuery({ path: 'subject' })
  const subjects = Object.values(subjectData ?? [])
  const subjectList = subjects.map(subject => ({
    label: subject.name,
    value: { id: subject.id }
  }))
  const queryClient = useQueryClient()

  const omitFields = area => {
    switch (area) {
      case 'club': return ['subjects']
      case 'training': return ['subjects', 'professorId', 'schedule']
      case 'package': return ['professorId', 'professor', 'shift', 'schedule']
    }
    return []
  }

  const handleSubmit = values => {
    const payload = omit(omitFields(currentArea), values)
    payload.limit = Number(payload.limit)
    payload.groupNumber = Number(payload.groupNumber)
    if(payload.subjects) payload.subjects = uniq(payload.subjects)
    if(data) {
      editActivity.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries([currentArea])
          setSnackbarMessage('Actividad modificada con exito')
          onClose()
        },
        onError: () => {
          setSnackbarMessage('Ha ocurrido un error')
        }
      })
    } else {
      addActivity.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries([currentArea])
          setSnackbarMessage('Actividad agregada con exito')
          onClose()
        },
        onError: () => {
          setSnackbarMessage('Ha ocurrido un error')
        }
      })
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      <EditActivityDialog 
        open={open}
        onClose={onClose}
        profList={profList}
        subjectList={subjectList}
        currentArea={currentArea}
        mode={data ? 'edit' : 'add'}
      />
    </Formik>
  )
}

export default Wrapper