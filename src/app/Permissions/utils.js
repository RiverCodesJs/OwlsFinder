import { useData } from '../store/useData'
import useToken from '../store/useToken'

const isValidType = ({ type, requiredType }) => {
  if (type === 'Admin') return true
  if (type === requiredType) return true
  return false
}

const usePermitted = ({ requiredType = 'Admin' }) => {
  const { token } = useToken()
  const { userId, type } = useData()

  if (token && userId && isValidType(type, requiredType)) {
    return true
  }
  return false
}

export default usePermitted