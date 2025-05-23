'use client'
import { Button, Stack, Typography } from "@mui/material"
import Image from "next/image"
import { styled } from '@mui/material/styles'
import getClassPrefixer from "~/app/UI/classPrefixer"
import { images } from "~/app/images"
import { useState } from "react"
import { Form, Formik, Field } from "formik"
import { getForgotSchema, getForgotValues } from "./utils"
import TextField from "~/app/UI/shared/FormikTextField"

const displayName = 'ForgotPassword'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
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
  },
  [`& .${classes.success_form}`]: {
    width: "80%",
  },
  [`& .${classes.password_input}`]: {
    width: "100%",
    backgroundColor: theme.palette.grey.main,
  },
  [`& .${classes.submit_button}`]: {
    color: theme.palette.contrast.main,
    backgroundColor: theme.palette.primary.main,
  },
}))

const Success = ({isSubmitted, setSubmitted, handleSubmit}) => {
  return(
    <Container>
      <Stack className={classes.content_box} spacing={3}>
        <Image src={images.buhos_logo} width={270} height={200} alt='Owls Logo'/>
        <Typography variant="h2">Reestablece tu contraseña</Typography>
        {!isSubmitted ? 
          <>
              <Stack spacing={2} className={classes.success_form}>
                <Field component={TextField} className={classes.password_input} name="password" type="password" placeholder="Nueva contraseña"/>
                <Field component={TextField} className={classes.password_input} name="repeatPass" type="password" placeholder="Repetir contraseña"/>
              </Stack>
                <Button type="submit" className={classes.submit_button}>Ingresar</Button>
          </>
        :
          <>
            <Typography variant="h2">Contraseña reestablecida</Typography>
            <Typography variant="body1">Puedes iniciar sesión con tus nuevos datos</Typography>
            <Button className={classes.access_button}>Ingresar</Button>
          </>
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
        initialValues={getForgotValues}
        validationSchema={getForgotSchema}
        onSubmit={handleSubmit}
      >
        <Form >
          <Success isSubmitted={isSubmitted}/>
        </Form>
      </Formik>
    </>
  )
}

export default Wrapper