import { useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useApiQuery } from '~/app/Lib/apiFetch'
import { useData } from '~/app/store/useData'

import useToken from '~/app/store/useToken'
import Loading from './Loading'

export const TokenRedirect = ({ route }) => {

  const { token } = useParams()
  const { setToken } = useToken()
  const { setUserId, setRole } = useData()
  const router = useRouter()
  const client = useQueryClient()
  const { data, isLoading, error } = useApiQuery({ path: 'verify' })
  
  useEffect(() => {
    if(token) {
      setToken(token)
    }
    if(data?.userId && data?.role) {
      setUserId(data?.userId)
      setRole(data?.role)
      router.replace(`/${route}`)
    }
    
    if(error) {
      client.clear()
      router.replace('/login')
    }
  }, [
    data, 
    error, 
    token, 
    route, 
    router, 
    setUserId, 
    setRole,
    client, 
    setToken
  ])

  if(isLoading) return <Loading/>

  return null
}