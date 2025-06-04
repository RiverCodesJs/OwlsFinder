import * as Yup from 'yup'

export const getForgotValues = () => ({
  password: '',
  repeatPass: '',
})

export const getForgotSchema = () => Yup.object({
  password: Yup.string().required('Ingresa una nueva contraseña'),
  repeatPass: Yup.string().required('Ingresa de nuevo la nueva contraseña'),
})