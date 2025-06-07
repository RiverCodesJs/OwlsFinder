import * as Yup from 'yup'

export const getForgotInitialValues = () => ({
  password: '',
  repeatPass: '',
})

export const getForgotValidationSchema = () => Yup.object({
  password: Yup.string().required('Ingresa una nueva contraseña'),
  repeatPass: Yup.string().required('Ingresa de nuevo la nueva contraseña'),
})