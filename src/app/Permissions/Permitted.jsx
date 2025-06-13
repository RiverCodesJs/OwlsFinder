import usePermitted from './utils'

export const Permitted = ({ children, Fallback, requiredRole = 'Admin' }) => {
  const permitted = usePermitted({ requiredRole })

  if (permitted) {
    return(
      <>
        {children}
      </>
    )
  }
  return <Fallback/>
}