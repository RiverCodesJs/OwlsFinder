'use client'
import { Button, Stack, Typography } from "@mui/material"
import Image from "next/image"
import { styled } from '@mui/material/styles'
import getClassPrefixer from "../UI/classPrefixer"
import { images } from "../images"

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
  return(
    <Container>
      <Stack className={classes.content_box} spacing={3}>
        <Image src={images.buhos_logo} width={330} height={250}/>
        <Typography variant="h2">Verifica tu correo</Typography>
        <Typography variant="body1">Un correo ha sido enviado a tu cuenta. Revísalo para acceder al proceso de selección</Typography>
      </Stack>
    </Container>
  )
}

export default Verify