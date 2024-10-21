export const clubShape = () => [
  'name',
  'groupNumber',
  'description',
  'images',
  'videos',
  'limit',
  'shift',
  'schedule',
]

export const loginShape = () => [
  'email',
  'password',
]

export const packageShape = () => [
  'name',
  'groupNumber',
  'description',
  'images',
  'videos',
  'limit',
  'subjects',
]

export const permissionShape = () => [
  'name',
]

export const professorShape = () => [
  'name',
  'paternalSurname',
  'maternalSurname',
  'email',
]

export const subjectShape = () => [
  'name',
  'description',
]

export const trainingShape = () => [
  'description',
  'groupNumber',
  'images',
  'limit',
  'name',
  'shift',
  'videos',
]

export const userShape = () => [
  'names',
  'paternalSurname',
  'maternalSurname',
  'email',
  'password',
  'enrollmentId',
  'groups',
  'currentGroup',
  'nextGroup',
  'type',
  'shift',
  'permissions',
]

export const meShape = () => [
  'names',
  'paternalSurname',
  'maternalSurname',
  'email',
  'enrollmentId',
  'groups',
  'currentGroup',
  'nextGroup',
  'shift',
]

export const counselorShape = () => [
  'names',
  'paternalSurname',
  'maternalSurname',
  'email',
  'password',
  'enrollmentId',
  'groups',
  'currentGroup',
  'nextGroup',
  'clubId',
  'type',
  'shift',
  'permissions',
]

export const studentShape = () => [
  'names',
  'paternalSurname',
  'maternalSurname',
  'email',
  'enrollmentId',
  'groups',
  'currentGroup',
  'nextGroup',
  'clubId',
  'type',
  'shift',
  'permissions',
]
