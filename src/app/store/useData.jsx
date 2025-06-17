import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useData = create(
  persist(
    set => ({
      userId: null,
      type: null,
      setUserId: userId => set({ userId }),
      setType: type => set({ type })
    }),
    {
      name: 'OwlsFinderData',
      whiteList: ['userId']
    }
  )
)