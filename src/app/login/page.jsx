'use client'
import { Alert, Button, Snackbar, Stack, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import getClassPrefixer from "~/app/UI/classPrefixer"
import { images } from "../images"
import { Formik, Form, Field } from "formik"
import TextField from "../UI/shared/FormikTextField"
import { getAlumniSchema, getAlumniValues, getEmailSchema, getEmailValues } from "./utils"

const displayName = 'login'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
    height: "100vh",
  
    [`& .${classes.focused_container}`]: {
      width: "50vw",
      height: "100vh",
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.contrast.main
    },
    [`& .${classes.unfocused_container}`]: {
      width: "50vw",
      height: "100vh",
      backgroundColor: theme.palette.contrast.main,
      color: theme.palette.primary.main
    },
    [`& .${classes.login_teacher_form}`]: {
      backgroundColor: theme.palette.contrast.main,
    },
    [`& .${classes.focused_button}`]: {
      marginTop: "2rem",
      backgroundColor: theme.palette.contrast.main,
      color: theme.palette.primary.main
    },
    [`& .${classes.unfocused_button}`]: {
      marginTop: "2rem",
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.contrast.main
    },
    [`& .${classes.forgot_link}`]: {
      textDecoration: "none",
      color: theme.palette.grey.main,
      fontWeight: 'bold',
      width: "60%",
      textAlign: "left",
    },
    [`& .${classes.aquiEstoy}`]: {
      width: "60%"
    }
  }))

  const LoginForm = styled(Stack)(({theme}) => ({
    direction: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: 'all 0.3s ease',
  }))

  const CustomField = styled(TextField)(({theme}) => ({
    width: "60%",
    backgroundColor: theme.palette.grey.main,
    borderRadius: "4px",
    borderBottom: "2px solid black",
  }))

const Login = ({snackbarMessage, setSnackbarMessage, studentsFormik, teachersFormik}) => {

  const [focused, setFocused] = useState(true)

  return (
    <Container>
      <Stack direction="row">
        <Formik
          initialValues={teachersFormik?.initialValues}
          validationSchema={teachersFormik?.validationSchema}
          onSubmit={teachersFormik?.handleSubmit}>
            <LoginForm className={focused ? classes.unfocused_container : classes.focused_container} spacing={1} onFocus={() => setFocused(true)}>
              {focused ? <Image src={images.buhos_logo} width={250} height={180} alt="Owls Logo"/> : null}
              <Typography variant="h1">Inicio de sesión</Typography>
              <Typography variant="body1">Si ya tienes una cuenta</Typography>
              <Field component={CustomField} type="email" name='email' placeholder="Correo"/>
              <Field component={CustomField} type="password" name='password' placeholder="Contraseña"/>
            {focused ? <Link href="/forgot" className={classes.forgot_link}>¿Olvidó su contraseña?</Link> : null}
          <Form>
              <Button type='submit' className={focused ? classes.unfocused_button : classes.focused_button}>Ingresar</Button>
          </Form>
            </LoginForm>
        </Formik>
        <Formik
          initialValues={studentsFormik?.initialValues}
          validationSchema={studentsFormik?.validationSchema}
          onSubmit={studentsFormik?.handleSubmit}>
            <LoginForm className={focused ? classes.focused_container : classes.unfocused_container} spacing={1} onFocus={() => {
              setFocused(false)
              }}>
              {!focused ? <Image src={images.buho} width={200} height={100} alt="Owls Logo"/> : null}
              <Typography variant="h1">Alumnos</Typography>
              <Typography variant="body1">Verifica tu informacion</Typography>
              <Field component={CustomField} name='firstName' placeholder="Nombre"/>
              <Field component={CustomField} name='fatherName' placeholder="Apellido Materno"/>
              <Field component={CustomField} name='motherName' placeholder="Apellido Paterno"/>
              <Field component={CustomField} name='matricula' placeholder="Matricula"/>
              <Field component={CustomField} name='grupo' placeholder="Turno"/>
              <Field component={CustomField} name='turno' placeholder="Grupo"/>
          <Form>
              <Button type='submit' className={focused ? classes.focused_button : classes.unfocused_button}>Ingresar</Button>
          </Form>
            </LoginForm>
        </Formik>
      <Snackbar 
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{vertical: "bottom", horizontal: "left"}}
        message={snackbarMessage}/>
      </Stack>
    </Container>
  )
}

const Wrapper = () => {
  const [snackbarMessage, setSnackbarMessage] = useState(null)

  const teachersSubmit = values => {
    console.log({"maestro": values})
    setSnackbarMessage("Ola, este es un snackbar")
  }

  const studentsSubmit = values => {
    console.log({"alumnos": values})
    setSnackbarMessage("Ola, este es otro snackbar")
  }


  const teachersFormik = {
    initialValues: getEmailValues(),
    validationSchema: getEmailSchema(),
    handleSubmit: teachersSubmit
  }

  const studentsFormik = {
    initialValues: getAlumniValues(),
    validationSchema: getAlumniSchema(),
    handleSubmit: studentsSubmit
  }

  return (
    <Login teachersFormik={teachersFormik} studentsFormik={studentsFormik} snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage}/>
  )
}

export default Wrapper