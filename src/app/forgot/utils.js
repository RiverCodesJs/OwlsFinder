import * as Yup from 'yup'

const getInitialValues = () => ({
  email: ''
})

const getValidationSchema = () => Yup.object({
  email: Yup.string().email('Se requiere un correo valido').required('Ingrese el correo electronico')
})


export { getInitialValues, getValidationSchema }