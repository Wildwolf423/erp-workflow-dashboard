/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'
import { mockUsers } from '@/mocks/data'
import type { AppUser } from '@/types/purchaseRequest'

type SessionContextValue = {
  currentUser: AppUser
  availableUsers: AppUser[]
  setCurrentUser: (userId: string) => void
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

export function SessionProvider({ children }: PropsWithChildren) {
  const [currentUserId, setCurrentUserId] = useState(mockUsers[0]?.id ?? '')

  const value = useMemo<SessionContextValue>(() => {
    const currentUser = mockUsers.find((user) => user.id === currentUserId) ?? mockUsers[0]

    return {
      currentUser,
      availableUsers: mockUsers,
      setCurrentUser: setCurrentUserId,
    }
  }, [currentUserId])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider.')
  }

  return context
}
