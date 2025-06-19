import * as Yup from 'yup'

export const getCounselorCreationInitialValues = () => ({
  names: '',
  paternalSurname: '',
  maternalSurname: '',
  email: '',
  shift: '',
  gender: '',
  groups: '',
})

export const getCounselorCreationValidationSchema = () => Yup.object({
  names: Yup.string().required('Ingrese el/los nombre/s'),
  paternalSurname: Yup.string().required('Ingrese el apellido paterno'),
  maternalSurname: Yup.string().required('Ingrese el apellido materno'),
  email: Yup.string().email('Debe ser un correo electronico valido').required('Ingrese un correo electronico'),
  shift: Yup.string().required('Ingrese el turno'),
  gender: Yup.string().required('Ingrese el género'),
  groups: Yup.string().required('Ingrese los grupos que administra')
})

export const setCounselorCreationValues = async values => ({
  names: values?.names ?? '',
  paternalSurname: values?.paternalSurname ?? '',
  maternalSurname: values?.maternalSurname ?? '',
  email: values?.email ?? '',
  shift: values?.shift ?? '',
  gender: values?.gender ?? '',
  groups: values?.groups.split(', ') ?? []
})