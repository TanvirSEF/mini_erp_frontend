/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import type { AuthUser, LoginInput } from '@/types'
import { loginUser } from '@/api/auth'
import { storedUser, token } from '@/lib/token'
import { queryClient } from '@/lib/query-client'

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (input: LoginInput) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(() => storedUser.get())

  const login = React.useCallback(async (input: LoginInput) => {
    const { accessToken, user: loggedInUser } = await loginUser(input)
    token.set(accessToken)
    storedUser.set(loggedInUser)
    setUser(loggedInUser)
  }, [])

  const logout = React.useCallback(() => {
    token.clear()
    storedUser.clear()
    setUser(null)
    queryClient.clear()
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
