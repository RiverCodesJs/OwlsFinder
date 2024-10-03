import { omit } from 'ramda'

const cleanerData = ({ _payload: obj, includes }) => {
  const arr = ['password', 'created_at', 'updated_at', 'active', ...(includes || [])]
  const payload = omit(arr, obj)

  includes?.forEach(include => payload[include] = obj[include].map(item => include == 'permissions' ? item.name : item.id))
  
  return payload
}

export default cleanerData
