import * as Yup from 'yup'

export const getResetPasswordInitialValues = () => ({
  password: '',
  repeatPass: '',
})

export const getResetPasswordValidationSchema = () => Yup.object({
  password: Yup.string().
    required('Ingresa una nueva contraseña'),
  repeatPass: Yup.string().
    required('Ingresa de nuevo la nueva contraseña').
    oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden'),
})