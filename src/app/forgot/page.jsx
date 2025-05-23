'use client'
import { Button, Stack, Typography } from "@mui/material"
import Image from "next/image"
import { styled } from '@mui/material/styles'
import getClassPrefixer from "../UI/classPrefixer"
import { images } from "../images"
import { useState } from "react"
import { getInitialValues, getValidationSchema } from "./utils"
import { Field, Form, Formik } from "formik"
import TextField from "../UI/shared/FormikTextField"

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
}))

const ForgotPassword = ({isSubmitted, setSubmitted}) => {
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
    </Container>
  )
}

const Wrapper = () => {
  const [isSubmitted, setSubmitted] = useState(false)

  const initialValues = getInitialValues()
  const validationSchema = getValidationSchema()
  const handleSubmit = values => {
    console.log(values)
    setSubmitted(true)
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        <Form>
          <ForgotPassword isSubmitted={isSubmitted} setSubmitted={setSubmitted}/>
        </Form>
      </Formik>
    </>
  )
}

export default Wrapper