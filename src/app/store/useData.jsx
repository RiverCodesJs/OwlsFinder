import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useData = create(
  persist(
    set => ({
      userId: null,
      role: null,
      setUserId: userId => set({ userId }),
      setRole: role => set({ role })
    }),
    {
      name: 'OwlsFinderData',
      whiteList: ['userId']
    }
  )
)