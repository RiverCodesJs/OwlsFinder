import { Dialog as MUIDialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { styled } from '@mui/material/styles'

const Container = styled('div')(({
  padding: '1ch'
}))

const Dialog = ({ open, onClose, title, actions, content, ...props }) => {
  return (
    <MUIDialog
      {...props}
      open={open}
      onClose={onClose}
    >
      <Container>
        <DialogTitle fontWeight="bold">{title}</DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>
      </Container>
    </MUIDialog>
  )
}

export default Dialog