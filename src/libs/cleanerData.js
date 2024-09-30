import * as R from 'ramda'

const cleanerData = ({ _payload: obj, includes }) => {
  const arr = ['password', 'created_at', 'updated_at', 'active', ...(includes || [])]
  const payload = R.omit(arr, obj)

  includes?.forEach(include => payload[include] = obj[include].map(item => {
    console.log(item)
    //TODO Change permisions to permissions
    return include == 'permisions' ? item.name : item.id
  }))
  
  return payload
}

export default cleanerData
