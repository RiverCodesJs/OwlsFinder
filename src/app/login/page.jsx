'use client'
import { Button, Snackbar, Stack, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import getClassPrefixer from "~/app/UI/classPrefixer"
import { images } from "../images"
import { Formik, Form, Field } from "formik"
import CustomField from "../UI/shared/FormikTextField"
import { getAlumniSchema, getAlumniValues, getEmailSchema, getEmailValues } from "./utils"
import { useApiMutation } from "../Lib/apiFetch"
import { useRouter } from "next/navigation"

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
    ['& .MuiFormControl-root']: {
      width: "60%",
    }
    
  }))

  const LoginForm = styled(Stack)(({theme}) => ({
    direction: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: 'all 0.3s ease',
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
              <Field component={CustomField} name='names' placeholder="Nombre"/>
              <Field component={CustomField} name='paternalSurname' placeholder="Apellido Materno"/>
              <Field component={CustomField} name='maternalSurname' placeholder="Apellido Paterno"/>
              <Field component={CustomField} name='enrollmentId' placeholder="Matricula"/>
              <Field component={CustomField} name='shift' placeholder="Turno"/>
              <Field component={CustomField} name='currentGroup' placeholder="Grupo"/>
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
  const userLogin = useApiMutation({path: "/login", opts: {method: "POST"}})
  const studentsLogin = useApiMutation({path: "/students/login", opts: {method: "POST"}})
  const router = useRouter()

  const teachersSubmit = async payload => {
    await userLogin.mutate(payload, {
      onSuccess: () => {
        router.replace("/counselor")
      },
      onError: (e) => {
        if(e.error === "Invalid Fields") {
          setSnackbarMessage("Datos incorrectos. Intenta ingresarlos de nuevo")
        } else {
          setSnackbarMessage("Ocurrió un error")
        }
      }
    })
  }

  const studentsSubmit = async payload => {
    payload.email = `${payload.enrollmentId}@cobachih.edu.mx`
    payload.grade = payload.currentGroup[0]
    studentsLogin.mutate(payload, {
      onSuccess: () => {
        setSnackbarMessage("Inicio de sesión exitoso")
        router.replace("/verify")
      },
      onError: () => {
        setSnackbarMessage("Datos incorrectos. Intenta ingresarlos de nuevo.")
      }
    })
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