'use client'
import { Button, Snackbar, Stack, Typography } from "@mui/material"
import Image from "next/image"
import { styled } from '@mui/material/styles'
import getClassPrefixer from "../UI/classPrefixer"
import { images } from "../images"
import { useState } from "react"
import { getInitialValues, getValidationSchema } from "./utils"
import { Field, Form, Formik } from "formik"
import TextField from "../UI/shared/FormikTextField"
import { useApiMutation } from "../Lib/apiFetch"

const displayName = 'ForgotPassword'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
  backgroundColor: theme.palette.primary.main,
  
  [`& .${classes.contentBox}`]: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    justifyContent: "center",
    alignItems: "center",
    height: 450,
    width: 450,
    backgroundColor: theme.palette.contrast.main,  
    borderRadius: 4,
    padding: "1rem",
    textAlign: "center"
  },
}))

const ForgotPassword = ({snackbarMessage, setSnackbarMessage}) => {
  return(
    <Container>
      <div className={classes.contentBox}>
        <Image src={images.buhosLogo} width={270} height={200} alt="Buhos Logo"/>
        <Stack spacing={2} alignItems="center">
          <Stack>
            <Typography variant="h5">Reestablece tu contraseña</Typography>
            <Typography>Ingresa tu correo para reestablecer tu contraseña</Typography>
          </Stack>
          <Field fullWidth component={TextField} name="email" type="email" placeholder="Correo electrónico"/>
          <Button variant="contained" type="submit">Enviar</Button>
        </Stack>
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage(null)}
        message={snackbarMessage}/>
      </div>
    </Container>
  )
}

const Wrapper = () => {
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const forgotControl = useApiMutation({path: "/forgot", opts: {method: "POST"}})
  const handleSubmit = async payload => {
    await forgotControl.mutate(payload, {
      onSuccess: () => {
        setSnackbarMessage("Un correo ha sido enviado a su cuenta")
      },
      onError: () => {
        setSnackbarMessage("El correo no ha sido encontrado")
      }
    })
  }

  return (
    <>
      <Formik
        initialValues={getInitialValues}
        validationSchema={getValidationSchema}
        onSubmit={handleSubmit}>
        <Form>
          <ForgotPassword snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage}/>
        </Form>
      </Formik>
    </>
  )
}

export default Wrapper