'use client'
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import useToken from "~/app/store/useToken"

const VerifyRedirect = ({params}) => {

  const { token } = params
  const router = useRouter()
  const client = useQueryClient()
  const { setToken } = useToken()

  useEffect(() => {
    if (token) {
      setToken(token)
      router.replace("/forgot/success")
    } else {
      client.clear()
      router.replace('/forgot')
    }
  }, [client, token, setToken, router])

  return null
}

export default VerifyRedirect