import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

export const DialogTemplate = ({ open, onClose, title, actions, content, ...props }) => {
  return (
    <Dialog
      {...props}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        {actions}
      </DialogActions>
    </Dialog>
  )
}