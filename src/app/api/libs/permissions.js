import { authenticateToken } from '~/app/api/libs/auth'
import queryDB from '~/app/api/libs/queryDB'
import { EMPTY_OBJECT } from '~/app/Lib/Utils/constants'

export const getPermissionsByEntity = ({ permissions, entity, action }) => {
  const userPermissions = permissions?.reduce((acc, permission) => {
    const [action, entityKey] = permission.name.split('_')
    if (entityKey === entity.name) {
      return [...acc, action]
    }
    return acc
  }, [])
  const hasPermission = userPermissions ? userPermissions.includes(action) : false
  const isRequired = entity?.permissions[action]

  if (!isRequired && permissions != null) return true
  return hasPermission
}

export const validatePermission = async ({ entity, action, request }) => {
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

export const hydratedPermissions = permissions => permissions.reduce((acc, permission) => ({
  ...acc,
  [permission.name]: EMPTY_OBJECT
}), {})