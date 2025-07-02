import { Dialog as MUIDialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

const Dialog = ({ open, onClose, title, actions, content, ...props }) => {
  return (
    <MUIDialog
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
    </MUIDialog>
  )
}

export default Dialog