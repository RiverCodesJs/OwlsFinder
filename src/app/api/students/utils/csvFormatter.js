import { Students } from '~/app/api/entities'
import validatorFields from '~/app/api/libs/validatorFields'
import ERROR from '~/error'

const translator = key => {
  switch(key.toLowerCase()){
    case 'grupo':
      return 'currentGroup'
    case 'matricula':
      return 'enrollmentId'
    case 'paterno':
      return 'paternalSurname'
    case 'materno':
      return 'maternalSurname'
    case 'nombre':
      return 'names'
    case 'promedio':
      return 'grade'
    default:
      return ERROR.INVALID_FIELDS()
  }
}

const csvFormatter = parsedData => {
  try {
    return (
      parsedData.map(student => {
        const processedStudent = Object.keys(student).reduce((acc, key) => {
          return {
            ...acc,
            [translator(key)]: student[key] 
          }
        }, {})
        processedStudent.type = 'student'
        processedStudent.email = `${processedStudent.enrollmentId}@cobachih.edu.mx`
        processedStudent.shift = processedStudent.currentGroup.slice(1, 2) == '5' ? 'afternoon' : 'morning'
        if(!validatorFields({ data: processedStudent, shape: Students.shape })) return ERROR.INVALID_FIELDS()
        return processedStudent
      }))
  } catch (error) {
    return ERROR.INVALID_FIELDS()
  }
}

export default csvFormatter