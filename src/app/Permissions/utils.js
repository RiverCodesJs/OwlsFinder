import { useData } from '../store/useData'
import useToken from '../store/useToken'

const usePermitted = () => {
  const { token } = useToken()
  const { userId, role } = useData()

  if (token && userId && role) {
    return true
  }
  return false
}

export default usePermitted