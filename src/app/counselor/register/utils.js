import * as Yup from 'yup'

export const getRegisterSchema = () => Yup.object({
  names: Yup.string().required("Ingrese su nombre"),
  paternalSurname: Yup.string().required('Ingresa sus apellidos'),
  maternalSurname: Yup.string().required('Ingresa sus apellidos'),
  password: Yup.string().required('Ingresa una nueva contraseña'),
  repeatPass: Yup.string().required('Ingresa de nuevo la nueva contraseña'),
})

export const getRegisterValues = () => ({
  names: '',
  paternalSurname: '',
  maternalSurname: '',
  password: '',
  repeatPass: ''
})