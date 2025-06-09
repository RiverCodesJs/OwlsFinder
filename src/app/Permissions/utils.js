import { useData } from '../store/useData'
import useToken from '../store/useToken'

const usePermitted = () => {
  const { token } = useToken()
  const { userId } = useData()

  if (token && userId) {
    return true
  }
  return false
}

export default usePermitted