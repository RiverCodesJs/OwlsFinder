'use client'
import { Suspense } from 'react'
import Loading from '~/app/UI/shared/Loading'
import { TokenRedirect } from '~/app/UI/shared/TokenRedirect'

const ForgotPasswordRedirect = () => {
  return (
    <Suspense fallback={<Loading/>}>
      <TokenRedirect route='forgot'/>
    </Suspense>
  )
}

export default ForgotPasswordRedirect