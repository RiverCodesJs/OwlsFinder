'use client'
import { 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Stack, 
  Tab, 
  Tabs, 
  Typography as T, 
  Snackbar
} from '@mui/material'
import { AddSharp, Book, CalendarTodaySharp } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'

import ModifyClassDialog from './components/ModifyClassDialog'
import AddClassDialog from './components/AddClassDialog'
import { ClassInfoDialog } from './components/ClassInfoDialog'
import getClassPrefixer from '../UI/classPrefixer'
import usePermitted from '../Permissions/utils'
import { ClubTab } from './components/ClubTab'
import { SubjectCreateDialog } from './components/SubjectCreateDialog'
import { TrainingTab } from './components/TrainingTab'
import { PackageTab } from './components/PackageTab'
import { DeleteClassDialog } from './components/DeleteClassDialog'
import { ConfirmSelectionDialog } from './components/ConfirmSelectionDialog'
import { useApiQuery } from '../Lib/apiFetch'

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
  openAddModal,
  openInfoModal,
  openModifyModal,
  openDeleteModal,
  openConfirmModal,
  openCreateSubjectModal,
  status,
  setStatus,
  setOpenAddModal,
  setOpenInfoModal,
  setOpenModifyModal,
  setOpenDeleteModal,
  setOpenConfirmModal,
  setOpenCreateSubjectModal,
  handleTabChange,
  handleOpenInfoModal,
  handleOpenModifyModal,
  handleOpenDeleteModal,
  handleConfirm,
  handleMenuOpen,
  handleMenuClose,
  snackbarMessage,
  setSnackbarMessage,
  selectedClass,
  confirmed,
  setConfirmed,
  anchorEl,
  profList,
  permitted,
}) => {
  return (
    <Container>
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <T variant="h2" fontWeight="bold">Selección</T>
          <Stack direction="row" justifyContent="right">
            {currentTab === 'package'
              ? <IconButton onClick={() => setOpenCreateSubjectModal(true)}>
                <Book className={classes.iconButton}/>
              </IconButton>
              : null}
            <IconButton onClick={() => setOpenAddModal(true)}>
              <AddSharp className={classes.iconButton}/>
            </IconButton>
            <IconButton onClick={() => setOpenAddModal(true)}>
              <CalendarTodaySharp className={classes.iconButton}/>
            </IconButton>
          </Stack>
        </Stack>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          indicatorColor='none'
        >
          <Tab label='Clubes' value="club"/>
          <Tab label='Capacitaciones' value="training"/>
          <Tab label='Paquetes Prop.' value="package"/>
        </Tabs>

        {currentTab === 'club'
          ? <ClubTab
            handleMenuOpen={handleMenuOpen}
            handleOpenInfoModal={handleOpenInfoModal}
            status={status}
            confirmed={confirmed}
            handleConfirm={handleConfirm}
            permitted={permitted}
          />
          : null}
        {currentTab === 'training'
          ? <TrainingTab
            handleMenuOpen={handleMenuOpen}
            handleOpenInfoModal={handleOpenInfoModal}
            status={status}
            confirmed={confirmed}
            handleConfirm={handleConfirm}
            permitted={permitted}
          />
          : null}
        {currentTab === 'package'
          ? <PackageTab
            handleMenuOpen={handleMenuOpen}
            handleOpenInfoModal={handleOpenInfoModal}
            status={status}
            confirmed={confirmed}
            handleConfirm={handleConfirm}
            permitted={permitted}
          />
          : null}
      </Stack>
      <ClassInfoDialog 
        open={openInfoModal}
        onClose={() => setOpenInfoModal(false)}
        classInfo={selectedClass}
        classType={currentTab}
      />
      <ModifyClassDialog
        open={openModifyModal}
        onClose={() => setOpenModifyModal(false)}
        profList={profList}
        classType={currentTab}
        classInfo={selectedClass}
        setSnackbarMessage={setSnackbarMessage}
      />
      <AddClassDialog 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        profList={profList}
        setSnackbarMessage={setSnackbarMessage}
        currentArea={currentTab}
      />
      <DeleteClassDialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        classType={currentTab}
        setSnackbarMessage={setSnackbarMessage}
      />
      <SubjectCreateDialog
        open={openCreateSubjectModal}
        onClose={() => setOpenCreateSubjectModal(false)}
        setSnackbarMessage={setSnackbarMessage}
      />
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenModifyModal}>Modificar</MenuItem>
        <MenuItem onClick={handleOpenDeleteModal}>Eliminar</MenuItem>
      </Menu>
      <ConfirmSelectionDialog
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        confirmed={confirmed}
        setConfirmed={setConfirmed}
        setSnackbarMessage={setSnackbarMessage}
      />
      <Snackbar
        open={Boolean(snackbarMessage)}
        message={snackbarMessage}
        onClose={() => setSnackbarMessage(null)}
        autoHideDuration={5000}
      />
      {status === 'selecting' 
        ? <Button 
          variant="contained" 
          size='small' 
          className={classes.confirmButton} 
          disabled={!confirmed}
          onClick={() => setOpenConfirmModal(true)}
        >
            Confirmar seleccion
        </Button>
        : <Button 
          variant="contained" 
          size='small' 
          className={classes.confirmButton}
          onClick={() => setStatus('selecting')}
        >
          Seleccionar
        </Button>
      }
    </Container>
  )
}

const Wrapper = () => {
  const [openModifyModal, setOpenModifyModal] = useState(false)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [openCreateSubjectModal, setOpenCreateSubjectModal] = useState(false)
  const [openInfoModal, setOpenInfoModal] = useState(false)
  const [status, setStatus] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [confirmed, setConfirmed] = useState(null)
  const [currentTab, setCurrentTab] = useState('club')
  const { data } = useApiQuery({ path: 'professor' })
  const professors = Object.values(data ?? [])
  const profList = professors.map(prof => ({
    label: `${prof.name} ${prof.paternalSurname} ${prof.maternalSurname}`,
    value: prof.id
  }))

  const handleConfirm = (id, groupNumber) => {
    setConfirmed({ area: currentTab, id: id, groupNumber: groupNumber })
  }

  const handleOpenInfoModal = selection => {
    setSelectedClass(selection)
    setOpenInfoModal(true)
  }

  const handleMenuOpen = (event, classInfo) => {
    setAnchorEl(event.currentTarget)
    setSelectedClass(classInfo)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleTabChange = (_, value) => {
    setCurrentTab(value)
  }

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true)
    handleMenuClose()
  }
  
  const handleOpenModifyModal = () => {
    setOpenModifyModal(true)
    handleMenuClose()
  }

  const permitted = usePermitted({ requiredType: 'COUNSELOR' })

  return (
    <PanelStudents 
      currentTab={currentTab}
      openAddModal={openAddModal} 
      openInfoModal={openInfoModal}
      openModifyModal={openModifyModal}
      openDeleteModal={openDeleteModal}
      openConfirmModal={openConfirmModal}
      openCreateSubjectModal={openCreateSubjectModal}
      status={status}
      setStatus={setStatus}
      setOpenInfoModal={setOpenInfoModal}
      setOpenAddModal={setOpenAddModal}
      setOpenModifyModal={setOpenModifyModal}
      setOpenDeleteModal={setOpenDeleteModal}
      setOpenConfirmModal={setOpenConfirmModal}
      setOpenCreateSubjectModal={setOpenCreateSubjectModal}
      handleTabChange={handleTabChange}
      handleOpenInfoModal={handleOpenInfoModal}
      handleOpenModifyModal={handleOpenModifyModal}
      handleOpenDeleteModal={handleOpenDeleteModal}
      handleConfirm={handleConfirm}
      handleMenuOpen={handleMenuOpen}
      handleMenuClose={handleMenuClose}
      setConfirmed={setConfirmed}
      snackbarMessage={snackbarMessage}
      setSnackbarMessage={setSnackbarMessage}
      selectedClass={selectedClass}
      confirmed={confirmed}
      anchorEl={anchorEl}
      profList={profList}
      permitted={permitted}
    />
  )
}

export default Wrapper