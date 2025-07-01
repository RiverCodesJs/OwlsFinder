import * as Yup from 'yup'

export const getCounselorValidationSchema = () => Yup.object({
  email: Yup.string().email('Debe ser un correo electronico valido').required('Ingrese un correo electronico'),
})

export const setCounselorInitialValues = values => ({
  email: values?.email ?? '',
})