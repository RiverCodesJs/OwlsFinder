import { Button, Typography as T } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import Link from 'next/link'
import { buhosLogo } from '~/app/images'
import getClassPrefixer from '../classPrefixer'

const displayName = 'NotAvailable'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100vw',
  height: '100vh',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  [`& .${classes.textContainer}`]: {
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '3ch',
  }
}))

export const NotAvailable = () => {
  return (
    <Container>
      <div className={classes.textContainer}>
        <T variant='h2' color='primary.main'>¡Ha ocurrido un error!</T>
        <T variant='h6'>Lo que buscas no está disponible en este momento. Haz click en el boton de abajo para continuar</T>
        <Link href='/login'><Button variant='contained'>Regresar</Button></Link>
      </div>
      <Image src={buhosLogo} alt='Buhos logo' width={500} height={350}/>
    </Container>
  )
}