'use client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import useToken from '~/app/store/useToken'
import Loading from '~/app/UI/shared/Loading'

const ForgotRedirect = () => {
  const { token } = useParams()
  const router = useRouter()
  const client = useQueryClient()
  const { setToken } = useToken()

  useEffect(() => {
    if (token) {
      setToken(token)
      router.replace('/forgot/success')
    } else {
      client.clear()
      router.replace('/forgot')
    }
  }, [client, router, token, setToken])
}

const Wrapper = () => {
  return (
    <Suspense fallback={<Loading/>}>
      <ForgotRedirect/>
    </Suspense>
  )
}

export default Wrapper