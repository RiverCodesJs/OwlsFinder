import * as Yup from 'yup'

export const getActivityInitialValues = values => ({
  name: values?.name ?? '',
  description: values?.description ?? '',
  images: values?.images ?? [],
  videos: values?.videos ?? [],
  limit: values?.limit ?? '',
  groupNumber: values?.groupNumber ?? '',
  professorId: values?.professorId ?? '',
  professor: values?.professor ?? '',
  subjects: values?.subjects?.map(subj => ({ id: subj })) ?? [],
  shift: values?.shift ?? '',
  schedule: values?.schedule ?? ''
})

export const getActivityValidationSchema = () => Yup.object({
  name: Yup.string().required('Ingrese el nombre'),
  description: Yup.string().required('Ingrese la descripción'),
  images: Yup.array().of(Yup.string()).required('Ingrese la URL de una imagen'),
  videos: Yup.array().of(Yup.string()).required('Ingrese la URL de un video'),
  limit: Yup.number().required('Ingrese el limite de alumnos'),
  groupNumber: Yup.number().required('Ingrese el numero de grupo'),
  professorId: Yup.number().optional(),
  professor: Yup.string().optional(),
  subjects: Yup.array().optional(),
  shift: Yup.string().optional().oneOf(['MORNING', 'EVENING']),
  schedule: Yup.string().optional()
})

export const getSubjectInitialValues = () => ({
  name: '',
  description: '',
})

export const getSubjectValidationSchema = () => Yup.object({
  name: Yup.string().required('Ingrese el nombre de la materia'),
  description: Yup.string().required('Ingrese una descripción')
})