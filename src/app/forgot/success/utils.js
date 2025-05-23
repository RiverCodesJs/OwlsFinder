import * as Yup from 'yup'

const getForgotValues = () => ({
  password: '',
  repeatPass: '',
})

const getForgotSchema = () => Yup.object({
  password: Yup.string().required('Ingresa una nueva contraseña'),
  repeatPass: Yup.string().required('Ingresa de nuevo la nueva contraseña'),
})

export {getForgotSchema, getForgotValues}