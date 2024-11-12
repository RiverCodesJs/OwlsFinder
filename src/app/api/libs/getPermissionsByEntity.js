const getPermissionsByEntity = ({ permissions, entity, action }) => {
  const userPermissions = permissions?.reduce((acc, permission) => {
    const [actionFound, entityKey] = permission.name.split('_')
    if(actionFound === 'admin') return [...acc, action]
    if (entityKey === entity.name) {
      return [...acc, actionFound]
    }
    return acc
  }, [])
  const hasPermission = userPermissions ? userPermissions.includes(action) : false
  const isRequired = entity?.permissions[action] 

  if (!isRequired && permissions != null) return true
  return hasPermission
}

export default getPermissionsByEntity