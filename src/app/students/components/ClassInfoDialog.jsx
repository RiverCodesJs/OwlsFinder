import { Button, Typography as T } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { useMemo } from 'react'
import { buhosLogo } from '~/app/images'
import getClassPrefixer from '~/app/UI/classPrefixer'
import Dialog from '~/app/UI/shared/Dialog'

const displayName = 'ClubInfoModal'
const classes = getClassPrefixer(displayName)

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  [`& .${classes.clubImage}`]: {
    borderRadius: '4px 4px 0 0',
    '@media(max-width: 768px)': {
      width: 250,
      height: 170,
    }
  },
})

export const ClassInfoDialog = ({ classType, classInfo, open, onClose }) => {

  const title = useMemo(() => {
    switch (classType) {
      case 'club': return 'Club'
      case 'training': return 'Capacitación'
      case 'package': return 'Paquete'
    }
    return ''
  }, [classType])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`${title} ${classInfo?.name}` ?? 'Titulo'}
      content={
        <Container>
          <Image src={classInfo?.images[0] ?? buhosLogo} width={500} height={200} className={classes.clubImage} alt="Club image"/>
          <T >{classInfo?.description ?? 'Sin informacion'}</T>
        </Container>
      }
      actions={
        <Button variant="contained" onClick={onClose}>Cerrar</Button>
      }
    />
  )
}
