'use client'
import { Button, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import { Field, Form, Formik, useFormikContext } from 'formik'
import { useApiMutation } from '~/app/Lib/apiFetch'
import { shiftOptions } from '~/app/Lib/enums'
import Dialog from '~/app/UI/shared/Dialog'
import FormikSelect from '~/app/UI/shared/FormikSelect'
import FormikTextField from '~/app/UI/shared/FormikTextField'
import { getClassInitialValues, getClassValidationSchema } from './utils'
import { omit } from 'ramda'

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
})

const FormElement = ({ onClose, open, classType, profList }) => {
  const { isValid, dirty } = useFormikContext()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Modificar clase"
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
                isArray
                name="images"
                placeholder="Imágen"
              />
              <Field 
                component={FormikTextField} 
                fullWidth 
                isArray
                name="videos"
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
            { classType === 'training'
              ? <Field
                component={FormikTextField}
                fullWidth 
                placeholder="Docente" 
                name="professor"
              />
              : null
            }
            { classType === 'package' 
              ? <Field 
                component={FormikSelect}
                fullWidth 
                label="Materias" 
                name="subjects"
                options={profList}
              />
              : null
            }
            { classType === 'club'
              ? <Stack direction="row" spacing={1}>
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

const ModifyClassDialog = ({ classInfo, classType, onClose, open, setSnackbarMessage, profList }) => {
  const modifyClass = useApiMutation({ path: `${classType}/${classInfo?.id}`, opts: { method: 'PATCH' } })
  const initialValues = getClassInitialValues({ area: classType, ...classInfo })
  const validationSchema = getClassValidationSchema()
  const queryClient = useQueryClient()

  const omitFields = area => {
    switch (area) {
      case 'club': return ['area', 'subjects', 'professor']
      case 'training': return ['area', 'subjects', 'professorId', 'schedule']
      case 'package': return ['area', 'professorId', 'shift', 'schedule']
    }
    return ['area']
  }

  const handleSubmit = values => {
    //console.log(classType)
    const payload = omit(omitFields(classType), values)
    //console.log(payload)
    modifyClass.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries([classType])
        setSnackbarMessage('Clase modificada con exito')
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
      enableReinitialize
    >
      <FormElement 
        open={open}
        onClose={onClose}
        profList={profList}
        classType={classType}
      />
    </Formik>
  )
}

export default ModifyClassDialog