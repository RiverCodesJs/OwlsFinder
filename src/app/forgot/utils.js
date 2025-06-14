import * as Yup from 'yup'

export const getForgotPasswordInitialValues = () => ({
  email: ''
})

export const getForgotPasswordValidationSchema = () => Yup.object({
  email: Yup.string().email('Se requiere un correo valido').required('Ingrese el correo electronico')
})