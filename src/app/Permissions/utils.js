import { useData } from '../store/useData'
import useToken from '../store/useToken'

const isValidRole = ({ role, requiredRole }) => {
  if (role === 'Admin') return true
  if (role === requiredRole) return true
  return false
}

const usePermitted = ({ requiredRole = 'Admin' }) => {
  const { token } = useToken()
  const { userId, role } = useData()

  if (token && userId && isValidRole(role, requiredRole)) {
    return true
  }
  return false
}

export default usePermitted