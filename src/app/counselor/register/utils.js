import * as Yup from 'yup'

const registerSchema = Yup.object({
  firstName: Yup.string().required("Ingrese su nombre"),
  fatherName: Yup.string().required('Ingresa sus apellidos'),
  motherName: Yup.string().required('Ingresa sus apellidos'),
  password: Yup.string().required('Ingresa una nueva contraseña'),
  repeatPass: Yup.string().required('Ingresa de nuevo la nueva contraseña'),
})


export default registerSchema