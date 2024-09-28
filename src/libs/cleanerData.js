import * as R from 'ramda'

const cleanerData = obj => {
  return R.omit(['password', 'created_at', 'updated_at', 'active'], obj)
}

export default cleanerData
