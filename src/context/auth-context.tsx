/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import type { AuthUser, LoginInput } from '@/types'
import { getCurrentUser, loginUser } from '@/api/auth'
import { storedUser, token } from '@/lib/token'
import { queryClient } from '@/lib/query-client'
import { WILDCARD_PERMISSION } from '@/lib/permissions'

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
  login: (input: LoginInput) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(() => storedUser.get())

  // keep permissions fresh: refetch the current user on load so role/permission
  // changes made elsewhere are reflected without a forced re-login
  React.useEffect(() => {
    if (!token.get()) return
    getCurrentUser()
      .then(setUser)
      .catch(() => {})
  }, [])

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

  const hasPermission = React.useCallback(
    (permission: string) => {
      const permissions = user?.permissions ?? []
      return (
        permissions.includes(WILDCARD_PERMISSION) ||
        permissions.includes(permission)
      )
    },
    [user]
  )

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, hasPermission, login, logout }),
    [user, hasPermission, login, logout]
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
