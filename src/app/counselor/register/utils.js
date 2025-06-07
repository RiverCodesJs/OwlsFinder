import * as Yup from 'yup'

export const getRegisterValidationSchema = () => Yup.object({
  names: Yup.string().required('Ingrese su nombre'),
  password: Yup.string().required('Ingresa una nueva contraseña'),
  repeatPass: Yup.string().required('Ingresa de nuevo la nueva contraseña').oneOf([Yup.ref('password'),null], 'Las contraseñas no coinciden'),
})

export const getRegisterInitialValues = () => ({
  names: '',
  password: '',
  repeatPass: ''
})