import * as Yup from 'yup'

const registerSchema = Yup.object({
  names: Yup.string().required("Ingrese su nombre"),
  paternalSurname: Yup.string().required('Ingresa sus apellidos'),
  maternalSurname: Yup.string().required('Ingresa sus apellidos'),
  password: Yup.string().required('Ingresa una nueva contraseña'),
  repeatPass: Yup.string().required('Ingresa de nuevo la nueva contraseña'),
})

const formatPayload = (values) => ({
  names: values.names,
  paternalSurname: values.paternalSurname,
  maternalSurname: values.paternalSurname,
  email: `${values.names[0]}${values.paternalSurname}@cobachih.edu.mx`.toLowerCase(),
  password: values.password,
  enrollmentId: "",
  groups: [],
  currentGroup: "",
  nextGroup: "",
  shift: "",
})

export {registerSchema, formatPayload}