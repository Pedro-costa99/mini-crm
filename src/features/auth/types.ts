export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'admin' | 'sales'
  avatarUrl?: string
}

export type Credentials = {
  email: string
  password: string
}

export type AuthState =
  | {
      status: 'loading'
      user: null
      token: null
    }
  | {
      status: 'authenticated'
      user: AuthUser
      token: string
    }
  | {
      status: 'unauthenticated'
      user: null
      token: null
    }

export type AuthContextValue = {
  state: AuthState
  login: (credentials: Credentials) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}
