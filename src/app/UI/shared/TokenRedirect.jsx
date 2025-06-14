import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useApiQuery } from '~/app/Lib/apiFetch'
import { useData } from '~/app/store/useData'

import useToken from '~/app/store/useToken'
import Loading from './Loading'

export const TokenRedirect = ({ route }) => {

  const { token } = useParams()
  const { setToken } = useToken()
  const { setUserId, setType } = useData()
  const router = useRouter()
  const { data, isLoading, error } = useApiQuery({ path: 'verify' })
  
  useEffect(() => {
    if(token) {
      setToken(token)
    }
    if(data?.userId && data?.type) {
      setUserId(data?.userId)
      setType(data?.type)
      router.replace(`/${route}`)
    }
    
    if(error) {
      setToken(null)
      router.replace('/login')
    }
  }, [
    data, 
    error, 
    token, 
    route, 
    router, 
    setUserId, 
    setType,
    setToken
  ])

  if(isLoading) return <Loading/>

  return null
}