import { Button, Stack, Typography as T } from '@mui/material'
import { useApiMutation } from '~/app/Lib/apiFetch'
import Dialog from '~/app/UI/shared/Dialog'

export const ConfirmSelectionDialog = ({ open, onClose, setSnackbarMessage, confirmed, setStatus, setConfirmed }) => {
  const selectAction = useApiMutation({ path: 'me', opts: { method: 'PATCH' } })

  const handleCancel = () => {
    setConfirmed(null)
    onClose()
  }

  const handleConfirm = () => {
    const payload = confirmed.area === 'club'
      ? { clubId: confirmed.id }
      : { nextGroup: confirmed.groupNumber }
    selectAction.mutate(payload, {
      onSuccess: () => {
        setSnackbarMessage('Se realizó la selección con éxito')
        setStatus('hasSelected')
        onClose()
      }
    })
  }
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      title="Confirmar selección"
      content={
        <T>¿Estás de acuerdo con la opción que elegiste?</T>
      }
      actions={
        <Stack direction="row" spacing={1}>
          <Button
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
          >
            Confirmar
          </Button>
        </Stack>
      }
    />
  )
}