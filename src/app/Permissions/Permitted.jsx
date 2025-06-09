import { Redirect } from './Redirect'
import usePermitted from './utils'

export const Permitted = ({ children }) => {
  const permitted = usePermitted()

  if (permitted) {
    return(
      <>
        {children}
      </>
    )
  }
  return <Redirect/>
}