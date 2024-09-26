import * as R from 'ramda'
import db from '~/libs/db'

export const getClub = async id => {
  const clubFound = await db.club.findMany({
    where:{ id: Number(id) }, 
    include:{ professor: true, users: true  }
  })

  const filteredClub = R.omit(['professorId', 'professor', 'created_at', 'updated_at', 'active'], clubFound[0])
  
  const filteredProfessor = R.omit(['clubs', 'trainings', 'created_at', 'updated_at', 'active'], clubFound[0].professor)
  
  const filteredUsers = clubFound[0].users.map(user => {
    return R.omit(['password', 'clubId', 'club', 'permisions', 'created_at', 'updated_at', 'active'], user)
  })

  const club = { ...filteredClub, professor: { ...filteredProfessor }, students: { ...filteredUsers } }

  return club
}

export const getClubs = async () => {
  const clubsFound = await db.club.findMany({
    include: { professor: true, users: true }
  })

  const clubs = clubsFound.map(_club => {
    const filteredClub = R.omit(['professorId', 'professor', 'users', 'created_at', 'updated_at', 'active'], _club)

    const filteredProfessor = R.omit(['clubs', 'trainings', 'created_at', 'updated_at', 'active'], _club.professor)

    const filteredUsers = _club?.users.map(user => {
      return R.omit(['password', 'clubId', 'club', 'permisions', 'created_at', 'updated_at', 'active'], user)
    })

    const club = { ...filteredClub, professor: { ...filteredProfessor }, students: { ...filteredUsers } }

    return club    
  })

  return clubs
}

export const getTraining = async id => {
  const trainingFound = await db.training.findMany({
    where:{ id: Number(id) }, 
    include:{ professor: true }
  })

  const filteredTraining = R.omit(['professorId', 'professor', 'created_at', 'updated_at', 'active'], trainingFound[0])
  
  const filteredProfessor = R.omit(['clubs', 'trainings', 'created_at', 'updated_at', 'active'], trainingFound[0].professor)

  const training = { ...filteredTraining, professor: { ...filteredProfessor } }

  return training
}

export const getTrainings = async () => {
  const trainingsFound = await db.training.findMany({
    include: { professor: true }
  })

  const trainings = trainingsFound.map(_training => {
    const filteredTraining = R.omit(['professorId', 'professor', 'created_at', 'updated_at', 'active'], _training)

    const filteredProfessor = R.omit(['clubs', 'trainings', 'created_at', 'updated_at', 'active'], _training.professor)

    const training = { ...filteredTraining, professor: { ...filteredProfessor } }

    return training    
  })

  return trainings
}

export const getProfessor = async id => {
  const professorFound = await db.professor.findMany({
    where: { id: Number(id) },
    include: { clubs: true, trainings: true }
  })

  const filteredProfessor = R.omit(['clubs', 'training', 'created_at', 'updated_at', 'active', professorFound[0]])
  const filteredClubs = R.omit(['professorId', 'professor', 'created_at', 'updated_at', 'active'], professorFound[0].clubs)
  const filteredTrainings = R.omit(['professorId', 'professor', 'created_at', 'updated_at', 'active'], professorFound[0].trainings)
  const professor = { ...filteredProfessor, clubs: { ...filteredClubs }, trainings: { ...filteredTrainings } }

  return professor
}

export const getProfessors = async () => {
  const professorFound = await db.professor.findMany({
    include: { clubs: true, trainings: true }
  })

  const professors = professorFound.map(_professor =>{
    const filteredProfessor = R.omit(['clubs', 'training', 'created_at', 'updated_at', 'active', _professor])
    const filteredClubs = R.omit(['professorId', 'professor', 'created_at', 'updated_at', 'active'], _professor.clubs)
    const filteredTrainings = R.omit(['professorId', 'professor', 'created_at', 'updated_at', 'active'], _professor.trainings)
    const professor = { ...filteredProfessor, clubs: { ...filteredClubs }, trainings: { ...filteredTrainings } }
    return professor
  })

  return professors
}

export const getPackage = async id => {
  const packageFound = await db.package.findMany({
    where: { id: Number(id) },
    include: { trainings: true }
  })

  const filteredPackage = R.omit(['subjects', 'created_at', 'updated_at', 'active'], packageFound[0])
  const filteredSubjects = packageFound[0].subjects.map(_subject => {
    return R.omit(['package', 'created_at', 'updated_at', 'active'], _subject)
  })

  return { ...filteredPackage, subjects: filteredSubjects }
}

export const getPackages = async () => {
  const packagesFound = await db.package.findMany({
    include: { trainings: true }
  })

  const packages = packagesFound.map( _package => {
    const packageFiltered = R.omit(['subjects', 'created_at', 'updated_at', 'active'], _package)
    const subjectsFiltered = _package.subjects.map(_subject => {
      return R.omit(['package', 'created_at', 'updated_at', 'active'], _subject)
    })
    
    return { ...packageFiltered, subjects: subjectsFiltered }
  })

  return packages  
}

export const getSubject = async id => {
  const subjectFound = await db.subject.findMany({
    where: { id: Number(id) },
    include: { package: false }
  })

  const subject = R.omit(['package', 'created_at', 'updated_at', 'active'], subjectFound[0])

  return subject
}

export const getSubjects = async () => {
  const subjectsFound = await db.subject.findMany({
    include: { package: false }
  })

  const subjects = subjectsFound.map(subject => {
    const subjectFiltered = R.omit(['package', 'created_at', 'updated_at', 'active'], subject)

    return { ...subjectFiltered }
  })

  return subjects
}

export const getUser = async id => {
  const userFound = await db.user.findMany({
    where: { id: Number(id) },
    include: { club: true, permisions: true }
  })

  const userFiltered = R.omit(['password', 'clubId', 'club', 'permisions', 'created_at', 'updated_at', 'active'], userFound[0])
  const clubFiltered = R.omit(['users', 'professorId', 'professor', 'created_at', 'updated_at', 'active'], userFound[0].club)
  
  return { ...userFiltered, club: { ...clubFiltered } }
}

export const getUsers = async () => {
  const usersFound = await db.user.findMany({
    include: { club: true, permisions: true }
  })

  const users = usersFound.map( _user => {
    const userFiltered = R.omit(['password', 'clubId', 'club', 'permisions', 'created_at', 'updated_at', 'active'], _user)
    const clubFiltered = R.omit(['users', 'professorId', 'professor', 'created_at', 'updated_at', 'active'], _user)

    const user = { ...userFiltered, club: { ...clubFiltered } }

    return user
  })

  return users
}