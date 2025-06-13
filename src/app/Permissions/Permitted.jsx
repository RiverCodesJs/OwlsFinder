import usePermitted from './utils'

export const Permitted = ({ children, Fallback }) => {
  const permitted = usePermitted()

  if (permitted) {
    return(
      <>
        {children}
      </>
    )
  }
  return <Fallback/>
}