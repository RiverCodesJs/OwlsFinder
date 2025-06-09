import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useData = create(
  persist(
    set => ({
      userId: null,
      setUserId: userId => set({ userId })
    }),
    {
      name: 'OwlsFinderData',
      whiteList: ['userId']
    }
  )
)