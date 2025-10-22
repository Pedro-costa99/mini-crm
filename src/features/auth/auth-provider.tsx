import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

import { loadPersistedSession, mockSignIn, mockSignOut } from '@/features/auth/auth-service'
import type { AuthContextValue, AuthState, Credentials } from '@/features/auth/types'

const loadingState: AuthState = {
  status: 'loading',
  user: null,
  token: null,
}

const unauthenticatedState: AuthState = {
  status: 'unauthenticated',
  user: null,
  token: null,
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>(loadingState)

  useEffect(() => {
    const persisted = loadPersistedSession()
    setState(persisted)
  }, [])

  const login = useCallback(async (credentials: Credentials) => {
    setState(loadingState)
    try {
      const session = await mockSignIn(credentials)
      setState(session)
    } catch (error) {
      setState(unauthenticatedState)
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    setState(loadingState)
    try {
      await mockSignOut()
    } finally {
      setState(unauthenticatedState)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      login,
      logout,
      isAuthenticated: state.status === 'authenticated',
      isLoading: state.status === 'loading',
    }),
    [login, logout, state],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider')
  }

  return context
}
