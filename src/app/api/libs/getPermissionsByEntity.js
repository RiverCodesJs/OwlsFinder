const getPermissionsByEntity = ({ permissions, entity, action }) => {
  const userPermissions = permissions?.reduce((acc, permissision) => {
    const [action, entityKey] = permissision.split('_')
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

export default getPermissionsByEntity