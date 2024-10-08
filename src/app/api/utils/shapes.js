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
  'clubId', 
  'type', 
  'shift', 
  'permissions'
]

export const professorShape = () => [
  'name',
  'paternalSurname',
  'maternalSurname',
  'email',
]

export const packageShape = () => [
  'name',
  'groupNumber',
  'description',
  'images',
  'videos',
  'limit',
  'subject1',
  'subject2',
  'subject3',
]

export const subjectShape = () => [
  'name',
  'description',
]

export const trainingShape = () => [
  'name',
  'groupNumber',
  'description',
  'images',
  'videos',
  'shift',
  'limit',
  'professor',
]

export const clubShape = () => [
  'name',
  'groupNumber',
  'description',
  'images',
  'videos',
  'limit',
  'shift',
  'schedule',
  'professorId',
]

export const permissionShape = () => [
  'name',
]
