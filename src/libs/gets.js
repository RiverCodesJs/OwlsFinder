import * as R from 'ramda'
import db from '~/libs/db'

export const getAdmin = async id => {

  const adminFound = await db.user.findMany({
    where:{
      id: Number(id),
    },
    include:{
      permisions: true,
    },
  })

  const filteredAdmin = R.omit([ 'password', 'enrollmentId', 'groups', 'beforeGroup', 'nextGroup', 'clubId', 'isAdmin', 'isCounselor', 'shift', 'created_at', 'updated_at', 'active'], adminFound[0])

  const admin = { ...filteredAdmin }

  return admin 
}

export const getAdmins = async () => {

  const adminsFound = await db.user.findMany({
    include:{
      permisions: true,
    },
  })

  const filteredAdmins = adminsFound.map( admin => R.omit(['password', 'enrollmentId', 'groups', 'beforeGroup', 'nextGroup', 'clubId', 'isAdmin', 'isCounselor', 'shift', 'created_at', 'updated_at', 'active'], admin))

  const admins = { ...filteredAdmins }

  return admins 
}

export const getClub = async id => {
  const clubFound = await db.club.findMany({
    where:{ id: Number(id) }, 
    include:{ professor: true }
  })

  const filteredClub = R.omit(['professorId', 'professor', 'created_at', 'updated_at', 'active'], clubFound[0])
  
  const filteredProfessor = R.omit(['clubs', 'training', 'created_at', 'updated_at', 'active'], clubFound[0].professor)

  const club = { ...filteredClub, professor: { ...filteredProfessor } }

  return club
}

export const getClubs = async () => {
  const clubsFound = await db.club.findMany()

  const clubs = clubsFound.map(_club => {
    const filteredClub = R.omit(['professorId', 'professor', 'created_at', 'updated_at', 'active'], _club)

    const filteredProfessor = R.omit(['clubs', 'training', 'created_at', 'updated_at', 'active'], _club.professor)

    const club = { ...filteredClub, professor: { ...filteredProfessor } }

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
  
  const filteredProfessor = R.omit(['clubs', 'training', 'created_at', 'updated_at', 'active'], trainingFound[0].professor)

  const training = { ...filteredTraining, professor: { ...filteredProfessor } }

  return training
}

export const getTrainings = async () => {
  const trainingsFound = await db.training.findMany()

  const trainings = trainingsFound.map(_training => {
    const filteredTraining = R.omit(['professorId', 'professor', 'created_at', 'updated_at', 'active'], _training)

    const filteredProfessor = R.omit(['clubs', 'training', 'created_at', 'updated_at', 'active'], _training.professor)

    const training = { ...filteredTraining, professor: { ...filteredProfessor } }

    return training    
  })

  return trainings
}