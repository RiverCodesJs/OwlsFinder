import ERROR from '~/error'

const validatorFields = ({ data, shape, omitProps = [] }) => {
  const newShape = shape.reduce((acc, key) => {
    if(omitProps.includes(key)) return [...acc]
    return [...acc, key]
  }, [])
  if(!newShape.every(key => key in data)) return ERROR.INVALID_FIELDS()
  return true
}

export default validatorFields