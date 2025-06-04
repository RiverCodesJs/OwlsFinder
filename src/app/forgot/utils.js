import * as Yup from 'yup'

export const getInitialValues = () => ({
  email: ''
})

export const getValidationSchema = () => Yup.object({
  email: Yup.string().email('Se requiere un correo valido').required('Ingrese el correo electronico')
})