import { omit } from 'ramda'

const cleanerData = ({ payload: p, includes = [], password }) => {
  const omitProps = [password ? '' : 'password', 'created_at', 'updated_at', ...includes]
  const payload = omit(omitProps, p)

  includes?.forEach(include => payload[include] = p[include].map(item => include == 'permissions' ? item.name : item.id))
  
  return payload
}

export default cleanerData
