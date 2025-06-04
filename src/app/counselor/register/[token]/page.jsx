'use client'
import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect } from "react"
import { useStore } from "zustand"
import useToken from "~/app/store/useToken"
import Loading from "~/app/UI/shared/Loading"

const CounselorRegisterRedir = ({params}) => {

  const { token } = useParams()
  const router = useRouter()
  const client = useQueryClient()
  const setToken = useStore(useToken, (state) => state.setToken)

  useEffect(() => {
    if (token) {
      setToken(token)
      router.replace("/counselor/register")
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
      <CounselorRegisterRedir/>
    </Suspense>
  )
}

export default Wrapper