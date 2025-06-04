'use client'
import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect } from "react"
import useToken from "~/app/store/useToken"
import Loading from "~/app/UI/shared/Loading"

const VerifyRedirect = ({params}) => {

  const { token } = useParams()
  const router = useRouter()
  const client = useQueryClient()
  const { setToken } = useToken() 

  useEffect(() => {
    if (token) {
      setToken(token)
      router.replace("/verify")
    } else {
      client.clear()
      router.replace('/login')
    }
  }, [])

  return null
}

const Wrapper = () => {

  return (
    <Suspense fallback={<Loading/>}>
      <VerifyRedirect/>
    </Suspense>
  )
}

export default Wrapper