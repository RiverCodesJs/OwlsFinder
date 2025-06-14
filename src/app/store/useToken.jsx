'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useToken = create(
  persist(
    set => ({
      token: null,
      setToken: token => set({ token })
    }),
    {
      name: 'OwlsFinderCredentials',
      whitelist: ['token']
    }
  )
)

export default useToken