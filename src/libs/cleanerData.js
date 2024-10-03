import { omit } from 'ramda'

const cleanerData = ({ payload: p, includes }) => {
  const arr = ['password', 'created_at', 'updated_at', 'active', ...(includes || [])]
  const payload = omit(arr, p)

  includes?.forEach(include => payload[include] = p[include].map(item => include == 'permissions' ? item.name : item.id))
  
  return payload
}

export default cleanerData
