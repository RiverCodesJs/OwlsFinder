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
  ['& .MuiFormControl-root']: {
    width: "80%",
  }
}))

const ForgotPassword = ({isSubmitted, setSubmitted, snackbarMessage, setSnackbarMessage}) => {
  return(
    <Container>
      <Stack className={classes.content_box} spacing={3}>
        <Image src={images.buhos_logo} width={270} height={200}/>
        <Typography variant="h2">Reestablece tu contraseña</Typography>
        { isSubmitted ?
          <Typography variant="body1">Un correo ha sido enviado a tu cuenta!</Typography>
          :
          <>
            <Typography variant="body1">Ingresa tu correo para reestablecer tu contraseña</Typography>
            <Field component={TextField} name="email" type="email" placeholder="Correo electrónico"/>
            <Button variant="contained" type="submit">Ingresar</Button>
          </>
        }
      </Stack>
      <Snackbar
      open={Boolean(snackbarMessage)}
      autoHideDuration={3000}
      onClose={() => setSnackbarMessage(null)}>
        {snackbarMessage}
      </Snackbar>
    </Container>
  )
}

const Wrapper = () => {
  const [isSubmitted, setSubmitted] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState(null)

  const initialValues = getInitialValues()
  const validationSchema = getValidationSchema()
  const forgotControl = useApiMutation({path: "/forgot", opts: {method: "POST"}})
  const handleSubmit = async payload => {
    await forgotControl.mutate(payload, {
      onSuccess: () => {
        setSubmitted(true)
      },
      onError: () => {
        setSnackbarMessage("Hubo un error. Intenta de nuevo.")
      }
    })
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        <Form>
          <ForgotPassword isSubmitted={isSubmitted} setSubmitted={setSubmitted} snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage}/>
        </Form>
      </Formik>
    </>
  )
}

export default Wrapper