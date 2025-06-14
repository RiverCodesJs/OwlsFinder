'use client'
import { Suspense } from 'react'

import Loading from '~/app/UI/shared/Loading'
import { TokenRedirect } from '~/app/UI/shared/TokenRedirect'

const VerifyRedirect = () => {
  return (
    <Suspense fallback={<Loading/>}>
      <TokenRedirect route='verify'/>
    </Suspense>
  )
}

export default VerifyRedirect