export const clubShape = () => [
  'description',
  'groupNumber',
  'images',
  'limit',
  'name',
  'professorId',
  'schedule',
  'shift',
  'videos',
]

export const loginShape = () => [
  'email',
  'password',
]

export const packageShape = () => [
  'description',
  'groupNumber',
  'images',
  'limit',
  'name',
  'subjects',
  'videos',
]

export const permissionShape = () => [
  'name',
]

export const professorShape = () => [
  'email',
  'maternalSurname',
  'name',
  'paternalSurname',
]

export const subjectShape = () => [
  'description',
  'name',
]

export const trainingShape = () => [
  'description',
  'groupNumber',
  'images',
  'limit',
  'name',
  'professor',
  'shift',
  'videos',
]

export const userShape = () => [
  'clubId',
  'currentGroup',
  'email',
  'enrollmentId',
  'groups',
  'maternalSurname',
  'names',
  'nextGroup',
  'password',
  'paternalSurname',
  'permissions',
  'shift',
  'type',
]
