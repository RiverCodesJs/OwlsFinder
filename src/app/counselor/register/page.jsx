'use client'
import { Button, Stack, Typography } from "@mui/material"
import Image from "next/image"
import { styled } from '@mui/material/styles'
import getClassPrefixer from "~/app/UI/classPrefixer"
import { images } from "~/app/images"
import { useState } from "react"
import { Field, Form, Formik } from "formik"
import registerSchema from "~/app/counselor/register/utils"
import TextField from "~/app/UI/shared/FormikTextField"

const displayName = 'CounselorRegister'
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
    height: "90%",
    width: "35%",
    backgroundColor: theme.palette.contrast.main,  
    borderRadius: 4,
    padding: "0 30px",
    textAlign: "center"
  },
  [`& .${classes.access_button}`]: {
    color: theme.palette.contrast.main,
    backgroundColor: theme.palette.primary.main,
  },
  [`& .${classes.success_form}`]: {
    width: "80%",
  },
  [`& .${classes.form_input}`]: {
    width: "100%",
  },
}))

const CounselorRegister = ({isSubmitted}) => {
  return(
    <Container>
      <Stack className={classes.content_box} spacing={1}>
        <Image src={images.buhos_logo} width={270} height={200} alt='Owls Logo'/>
        <Typography variant="h3">Bienvenido a OwlsHub</Typography>
        {!isSubmitted ? 
          <>
              <Stack spacing={1} className={classes.success_form}>
                <Field component={TextField} className={classes.form_input} name="firstName" placeholder="Nombre"/>
                <Stack direction="row" spacing={1}>
                  <Field component={TextField} className={classes.form_input} name="fatherName" placeholder="Apellido Paterno"/>
                  <Field component={TextField} className={classes.form_input} name="motherName" placeholder="Apellido Materno"/>
                </Stack>
                <Field component={TextField} className={classes.form_input} name="password" type="password" placeholder="Contraseña"/>
                <Field component={TextField} className={classes.form_input} name="repeatPass" type="password" placeholder="Repetir contraseña"/>
              </Stack>
                <Button variant="contained" type="submit" className={classes.submit_button}>Ingresar</Button>
          </>
          : null
        }
      </Stack>
    </Container>
  )
}

const Wrapper = () => {
  const [isSubmitted, setSubmitted] = useState(false)

  const handleSubmit = async values => {
    console.log(values)
    setSubmitted(!isSubmitted)
  }
  return (
    <>
      <Formik
        initialValues={{firstName: '', fatherName: '', motherName: '', password: '', repeatPass: ''}}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        <Form >
          <CounselorRegister isSubmitted={isSubmitted}/>
        </Form>
      </Formik>
    </>
  )
}

export default Wrapper