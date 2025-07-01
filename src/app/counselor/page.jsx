'use client'
import { AddSharp, CalendarTodaySharp } from '@mui/icons-material'
import { IconButton, Snackbar, Stack, Typography as T } from '@mui/material'
import { styled } from '@mui/material/styles'
import getClassPrefixer from '../UI/classPrefixer'
import { Permitted } from '../Permissions/Permitted'
import { NotAvailable } from '../UI/shared/NotAvailable'
import { useState } from 'react'
import CounselorCreationForm from './components/CounselorCreationForm'

const displayName = 'PanelCounselor'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100vh',
  padding: '2rem',
  [`& .${classes.iconButton}`]: {
    fill: theme.palette.primary.main,
    fontSize: '2.5rem'
  }
}))

const PanelCounselor = ({
  openCounselorCreateModal,
  setOpenCounselorCreateModal,
  snackbarMessage,
  setSnackbarMessage
}) => {
  return (
    <Container>
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <T variant="h2" fontWeight="bold">Clases</T>
          <Stack direction="row" justifyContent="right">
            <IconButton onClick={() => setOpenCounselorCreateModal(true)}>
              <AddSharp className={classes.iconButton}/>
            </IconButton>
            <IconButton>
              <CalendarTodaySharp className={classes.iconButton}/>
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <CounselorCreationForm 
        open={openCounselorCreateModal}
        onClose={() => setOpenCounselorCreateModal(false)}
        setSnackbarMessage={setSnackbarMessage}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        message={snackbarMessage}
      />
    </Container>
  )
}

const Wrapper = () => {

  const [openCounselorCreateModal, setOpenCounselorCreateModal] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState(null)

  return (
    <Permitted Fallback={NotAvailable} requiredType='Counselor'>
      <PanelCounselor
        openCounselorCreateModal={openCounselorCreateModal}
        setOpenCounselorCreateModal={setOpenCounselorCreateModal}
        snackbarMessage={snackbarMessage}
        setSnackbarMessage={setSnackbarMessage}
      />
    </Permitted>
  )
}

export default Wrapper