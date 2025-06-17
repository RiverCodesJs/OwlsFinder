import usePermitted from './utils'

export const Permitted = ({ children, Fallback, requiredType = 'ADMIN' }) => {
  const permitted = usePermitted({ requiredType })

  if (permitted) {
    return children 
  }
  return <Fallback/>
}