import { Button, Stack, Typography as T } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useApiDelete } from '~/app/Lib/apiFetch'
import Dialog from '~/app/UI/shared/Dialog'

export const DeleteClassDialog = ({ open, onClose, setSnackbarMessage, classType, id }) => {
  const deleteClass = useApiDelete({ path: `${classType}/${id}` })
  const queryClient = useQueryClient()

  const handleDelete = () => {
    deleteClass.mutate({
      onSuccess: () => {
        queryClient.invalidateQueries([classType])
        setSnackbarMessage('Clase eliminada con exito')
        onClose()
      },
      onError: () => {
        setSnackbarMessage('Ocurrió un error')
      }
    })
  }

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={onClose}
      title="Deshabilitar clase"
      content={
        <T variant="body">La información de esta clase quedará deshabilitada</T>
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