export const Package = {
  name: 'package',
  permissions: {
    create: true,
    update: true,
    delete: true
  }, 
  shape: [
    'description',
    'groupNumber',
    'images',
    'limit',
    'name',
    'subjects',
    'videos',
  ]
}

export const Club = {
  name: 'club',
  permissions: {
    create: true,
    update: true,
    delete: true
  },
  shape: [
    'description',
    'groupNumber',
    'images',
    'limit',
    'name',
    'schedule',
    'videos',
  ]
}

export const Permission = {
  name: 'permission',
  permissions: {
    findUnique: true,
    findMany: true,
    create: true,
    update: true,
    delete: true
  },
  shape: [
    'name',
  ]
}

export const Professor = {
  name: 'professor',
  permissions: {
    create: true,
    update: true,
    delete: true
  },
  shape: [
    'email',
    'maternalSurname',
    'name',
    'paternalSurname',
  ]
}

export const Subject = {
  name: 'subject',
  permissions: {
    create: true,
    update: true,
    delete: true
  },
  shape: [
    'description',
    'name',
  ]
}

export const Training = {
  name: 'training',
  permissions: {
    create: true,
    update: true,
    delete: true
  },
  shape: [
    'description',
    'groupNumber',
    'images',
    'limit',
    'name',
    'shift',
    'videos',
  ]
}

export const Me = {
  name: 'me',
  permissions: {
    update: true,
    delete: true
  },
  shape: [
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
}

export const Students = {
  name: 'students',
  permissions: {
    findUnique: true,
    findMany :true,
    create: true,
    update: true,
    delete: true
  },
  shape: [
    'names',
    'paternalSurname',
    'maternalSurname',
    'currentGroup',
    'grade',
    'enrollmentId',
    'email',
    'type',
    'shift',
  ]
}

export const Counselor = {
  name: 'counselor',
  permissions: {
    findUnique: true,
    findMany :true,
    create: true,
    update: true,
    delete: true
  },
}

export const Admin = {
  name: 'admin',
  permissions: {
    findUnique: true,
    findMany :true,
    create: true,
    update: true,
    delete: true
  }
}

export const SelectionConfig = {
  name: 'selectionConfig',
  permissions: {
    findUnique: true,
    findMany :true,
    create: true,
    update: true,
    delete: true
  },
  shape:  [
    'groups',
    'packageSelection',
    'trainingSelection',
    'clubSelection'
  ]
}

export const Login = {
  name: 'login',
  shape: [
    'email',
    'password',
  ]
}

export const LoginStudents = {
  name: 'loginStudents',
  shape: [
    'names',
    'paternalSurname',
    'maternalSurname',
    'email',
    'enrollmentId',
    'currentGroup',
    'shift'
  ]
}