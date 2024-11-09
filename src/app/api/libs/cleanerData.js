import { omit } from 'ramda'

const cleanerData = ({ payload: p, includes = [], password = false, createdAt = false }) => {
  const omitParams = [(password ? '' : 'password'), (createdAt ? '' : 'created_at'), 'updated_at', ...includes]
  const payload = omit(omitParams, p)

  includes?.forEach(include => payload[include] = p[include].map(item => {
    if(include === 'packageSelection' || include === 'trainingSelection'){
      return item
    }else{
      return include == 'permissions' ? item.name : item.id
    }
  }))
  
  return payload
}

export default cleanerData