import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

export const DialogTemplate = ({ open, onClose, ...props }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={props?.maxWidth ?? 'sm'}
      fullWidth
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        {props.content}
      </DialogContent>
      <DialogActions>
        {props.actions}
      </DialogActions>
    </Dialog>
  )
}