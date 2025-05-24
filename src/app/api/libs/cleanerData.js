import { omit } from 'ramda'

const OMIT_DATA = {
  active: true,
  createdAt: true,
  password: true,
  updatedAt: true
}


const cleanerData = ({ payload, ...rest }) => {
  const omitParams = Object.entries(OMIT_DATA).reduce((acc, [key, value]) => {
    const { [key]: permitParam = false } = rest
    if (value && !permitParam) {
      return [...acc, key]
    }
    return acc
  }, [])
  return omit(omitParams, payload)
}

export default cleanerData