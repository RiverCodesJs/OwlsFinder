import { authenticateToken } from '~/app/api/libs/auth'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'
import queryDB from '~/app/api/libs/queryDB'

const validatePermission = async ({ entity, action, request }) => {
  const userId = authenticateToken(request)
  const { permissions } = await queryDB({
    entity: 'user',
    queryType: 'findUnique',
    filter: { id: Number(userId) },
    includes: ['permissions']
  })
  if(permissions){
    const hasPermission = getPermissionsByEntity({ permissions, entity, action })
    if (hasPermission) return true
  }
  return false
}

export default validatePermission