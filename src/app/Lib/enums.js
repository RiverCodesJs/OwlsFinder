import { Gender, Shift } from '@prisma/client'

const translations = {
  MALE: 'Masculino',
  FEMALE: 'Femenino',
  NON_BINARY: 'No Binario',
  MORNING: 'Matutino',
  EVENING: 'Vespertino'
}

const enumAdapter = enums => (
  Object.keys(enums).map(key => ({
    label: translations[key] ?? '',
    value: key
  }))
)

export const genderOptions = enumAdapter(Gender)
export const shiftOptions = enumAdapter(Shift)