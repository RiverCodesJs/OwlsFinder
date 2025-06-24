import * as Yup from 'yup'

export const getRegisterValidationSchema = () => Yup.object({
  names: Yup.string().required('Ingrese su nombre'),
  paternalSurname: Yup.string().required('Ingrese su apellido paterno'),
  maternalSurname: Yup.string().required('Ingrese su apellido materno'),
  gender: Yup.string().required('Ingrese su género'),
  shift: Yup.string().required('Ingrese su turno asignado'),
  password: Yup.string().required('Ingresa una contraseña'),
  repeatPass: Yup.string().required('Ingresa de nuevo la contraseña').oneOf([Yup.ref('password'),null], 'Las contraseñas no coinciden'),
})

export const getRegisterInitialValues = () => ({
  names: '',
  paternalSurname: '',
  maternalSurname: '',
  gender: '',
  shift: '',
  password: '',
  repeatPass: ''
})