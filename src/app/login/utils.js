import * as Yup from 'yup'

const getAlumniSchema = () => Yup.object({
  firstName: Yup.string().required('Ingresa tu nombre'),
  fatherName: Yup.string().required('Ingresa tu apellido paterno'),
  motherName: Yup.string().required('Ingresa tu apellido materno'),
  matricula: Yup.number().required('Ingresa tu matricula').positive().integer(),
  grupo: Yup.number().required('Ingresa tu turno').positive().integer(),
  turno: Yup.string().required('Ingresa tu turno').oneOf(['Matutino','Vespertino'])
})

const getEmailSchema = () => Yup.object({
  email: Yup.string().email().required('Correo electronico requerido'),
  password: Yup.string().required('Contraseña requerida'),
})

const getEmailValues = () => ({
  email: '',
  password: '',
})

const getAlumniValues = () => ({
  names: '',
  parentalSurname: '',
  maternalSurname: '',
  enrollmentId: '',
  shift: '',
  grade: ''
})

export {
  getAlumniSchema,
  getAlumniValues,
  getEmailSchema,
  getEmailValues
}