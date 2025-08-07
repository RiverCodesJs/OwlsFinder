'use client'
import { 
  IconButton, 
  Stack, 
  Typography as T, 
  Snackbar,
  Tabs,
  Tab
} from '@mui/material'
import { AddSharp } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'

import EditActivityDialog from './components/EditActivityDialog'
import getClassPrefixer from '../UI/classPrefixer'
import usePermitted from '../Permissions/utils'

const displayName = 'PanelStudents'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100vh',
  padding: '2rem',
  '& [class*=MuiTabs-root]': {
    maxWidth: 600,
    minHeight: '30px',
    margin: '2rem 0',
    backgroundColor: theme.palette.grey.main, 
    color: theme.palette.contrast.main,
    borderRadius: '50px',
    '@media(max-width: 768px)': {
      maxWidth: 400
    }
  },
  ['& .MuiTab-root']: {
    width: 200,
    minHeight: '30px',
    padding: '0',
    textTransform: 'none',
    '&.Mui-selected': {
      color: theme.palette.contrast.main,
      backgroundColor: theme.palette.primary.main,
      borderRadius: '25px',
    },
    '@media(max-width: 768px)': {
      width: '33%'
    }
  },
  [`& .${classes.iconButton}`]: {
    fill: theme.palette.primary.main,
    fontSize: '2.5rem'
  },
  [`& .${classes.confirmButton}`]: {
    position: 'fixed',
    zIndex: 5,
    bottom: '1rem',
    right: '1rem',
  },
}))

const PanelStudents = ({ 
  currentTab,
  openDialog,
  setOpenDialog,
  handleDialogClose,
  handleTabChange,
  snackbarMessage,
  setSnackbarMessage,
  selectedClass,
  permitted,
  status,
}) => {
  return (
    <Container>
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <T variant="h2" fontWeight="bold">{ permitted ? 'Clases' : 'Selección'}</T>
          { permitted 
            ? <Stack direction="row" justifyContent="right">
              <IconButton onClick={() => setOpenDialog('editClass')}>
                <AddSharp className={classes.iconButton}/>
              </IconButton>
            </Stack>
            : null}
        </Stack>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          indicatorColor='none'
        >
          <Tab label='Clubes' value="club" disabled={status === 'selecting' || status === 'clubSelected'}/>
          <Tab label='Capacitaciones' value="training" disabled={status === 'selecting' && status !== 'trainingSelected'}/>
          <Tab label='Paquetes Prop.' value="package" disabled={status === 'selecting' && status !== 'packageSelected'}/>
        </Tabs>

        <EditActivityDialog 
          open={openDialog === 'editClass'}
          onClose={handleDialogClose}
          setSnackbarMessage={setSnackbarMessage}
          currentArea={currentTab}
          data={selectedClass}
        />
        <Snackbar
          open={Boolean(snackbarMessage)}
          message={snackbarMessage}
          onClose={() => setSnackbarMessage(null)}
          autoHideDuration={5000}
        />
      </Stack>
    </Container>
  )
}

const Wrapper = () => {
  const [openDialog, setOpenDialog] = useState(null)
  const [status, setStatus] = useState('')
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const [currentTab, setCurrentTab] = useState('club')
  const permitted = usePermitted({ requiredType: 'COUNSELOR' })

  const handleDialogClose = () => {
    setOpenDialog(null)
  }

  const handleTabChange = (_, value) => {
    setCurrentTab(value)
  }

  return (
    <PanelStudents 
      currentTab={currentTab}
      openDialog={openDialog}
      setOpenDialog={setOpenDialog}
      status={status}
      setStatus={setStatus}
      handleDialogClose={handleDialogClose}
      handleTabChange={handleTabChange}
      snackbarMessage={snackbarMessage}
      setSnackbarMessage={setSnackbarMessage}
      permitted={permitted}
    />
  )
}

export default Wrapper