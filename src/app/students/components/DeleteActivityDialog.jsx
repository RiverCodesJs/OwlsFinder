'use client'
import { Button, Stack, Typography as T } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useApiDelete } from '~/app/Lib/apiFetch'
import Dialog from '~/app/UI/shared/Dialog'

export const DeleteActivityDialog = ({ id, classType, open, onClose, setSnackbarMessage }) => {
  const queryClient = useQueryClient()
  const deleteActivity = useApiDelete({ path: `${classType}/${id}` })

  const handleDelete = async () => {
    await deleteActivity.mutate({}, {
      onSuccess: () => {
        queryClient.invalidateQueries(['students'])
        setSnackbarMessage('Actividad deshabilitada con éxito')
        onClose()
      },
      onError: () => {
        setSnackbarMessage('Hubo un error')
      }
    })
  }

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={onClose}
      title="Borrar actividad"
      content={
        <T variant="body">Se deshabilitará la información de esta actividad</T>
      }
      actions={
        <Stack direction="row" spacing={1}>
          <Button
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </Stack>
      }
    />
  )
}