'use client'
import { Button, Stack, Typography } from "@mui/material"
import Image from "next/image"
import { styled } from '@mui/material/styles'
import getClassPrefixer from "../UI/classPrefixer"
import { images } from "../images"
import useToken from "../store/useToken"
import Link from "next/link"
import { useStore } from "zustand"

const displayName = 'VerifyEmail'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
  backgroundColor: theme.palette.primary.main,
  
  [`& .${classes.content_box}`]: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    width: "40%",
    backgroundColor: theme.palette.contrast.main,  
    borderRadius: 4,
    padding: "0 30px",
    textAlign: "center"
  },
  [`& .${classes.access_button}`]: {
    color: theme.palette.contrast.main,
    backgroundColor: theme.palette.primary.main,
  }
}))

const Verify = () => {
  const token = useStore(useToken, (state) => state.token)

  if(token) {
    return (
      <Container>
        <Stack className={classes.content_box} spacing={3}>
          <Image src={images.buhos_logo} width={330} height={250} alt="Buho's Logo"/>
          <Typography variant="h2">Verifica tu cuenta</Typography>
          <Typography variant="body1">Para comenzar a utilizar todas las herramientas y recursos disponibles, por favor, confirma tu cuenta haciendo clic en el botón de abajo.</Typography>
          <Link href="/students"><Button className={classes.access_button}>Ingresar</Button></Link>
        </Stack>
      </Container>
    )
  }

  return(
    <Container>
      <Stack className={classes.content_box} spacing={3}>
        <Image src={images.buhos_logo} width={330} height={250} alt="Buho's Logo"/>
        <Typography variant="h2">Verifica tu correo</Typography>
        <Typography variant="body1">Un correo ha sido enviado a tu cuenta. Revísalo para acceder al proceso de selección</Typography>
      </Stack>
    </Container>
  )
}

export default Verify