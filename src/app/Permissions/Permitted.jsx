import usePermitted from './utils'

export const Permitted = ({ children, Fallback, requiredType = 'Admin' }) => {
  const permitted = usePermitted({ requiredType })

  if (permitted) {
    return children 
  }
  return <Fallback/>
}