import { useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import useToken from '~/app/store/useToken'

export const TokenRedirect = ({ route }) => {

  const { token } = useParams()
  const router = useRouter()
  const client = useQueryClient()
  const { setToken } = useToken() 

  useEffect(() => {
    if (token) {
      setToken(token)
      router.replace(`/${route}`)
    } else {
      client.clear()
      router.replace('/login')
    }
  }, [token, router, route, client, setToken])

  return null
}