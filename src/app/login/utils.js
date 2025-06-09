import * as Yup from 'yup'

export const getStudentsValidationSchema = () => Yup.object({
  names: Yup.string().required('Ingresa tu nombre'),
  paternalSurname: Yup.string().required('Ingresa tu apellido paterno'),
  maternalSurname: Yup.string().required('Ingresa tu apellido materno'),
  enrollmentId: Yup.number().required('Ingresa tu matricula').positive().integer(),
  currentGroup: Yup.number().required('Ingresa tu turno').positive().integer(),
  shift: Yup.string().required('Ingresa tu turno').oneOf(['Matutino','Vespertino'])
})

export const getProfessorLoginValidationSchema = () => Yup.object({
  email: Yup.string().email().required('Correo electronico requerido'),
  password: Yup.string().required('Contraseña requerida'),
})

export const getProfessorLoginInitialValues = () => ({
  email: '',
  password: '',
})

export const getStudentsLoginInitialValues = () => ({
  names: '',
  paternalSurname: '',
  maternalSurname: '',
  enrollmentId: '',
  shift: '',
  currentGroup: ''
})