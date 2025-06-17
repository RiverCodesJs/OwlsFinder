import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const Redirect = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/login')
  }, [router])

  return null
}