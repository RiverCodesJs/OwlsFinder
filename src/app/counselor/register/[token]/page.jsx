'use client'
import { Suspense } from 'react'
import Loading from '~/app/UI/shared/Loading'
import { TokenRedirect } from '~/app/UI/shared/TokenRedirect'

const Wrapper = () => {

  return (
    <Suspense fallback={<Loading/>}>
      <TokenRedirect route='counselor/register'/>
    </Suspense>
  )
}

export default Wrapper