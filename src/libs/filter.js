import * as R from 'ramda'

const filter = obj => {
  return R.omit(['password', 'created_at', 'updated_at', 'active'], obj)
}

export default filter
