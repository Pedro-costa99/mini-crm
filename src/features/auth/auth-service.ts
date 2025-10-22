import { MOCK_PASSWORD, MOCK_USER } from '@/features/auth/constants'
import type { AuthState, Credentials } from '@/features/auth/types'
import { readStorage, removeStorage, writeStorage } from '@/lib/storage'

const SESSION_KEY = '@mini-crm/auth-session'

type PersistedSession = Extract<AuthState, { status: 'authenticated' }>

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockSignIn(credentials: Credentials) {
  await delay(650)

  const normalizedEmail = credentials.email.trim().toLowerCase()

  const isValid =
    normalizedEmail === MOCK_USER.email && credentials.password === MOCK_PASSWORD

  if (!isValid) {
    const error = new Error('Credenciais inválidas. Verifique e tente novamente.')
    error.name = 'AuthError'
    throw error
  }

  const session: PersistedSession = {
    status: 'authenticated',
    token: `mock-token-${Date.now()}`,
    user: MOCK_USER,
  }

  persistSession(session)

  return session
}

export async function mockSignOut() {
  await delay(250)
  clearSession()
}

export function persistSession(session: PersistedSession) {
  writeStorage(SESSION_KEY, session)
}

export function clearSession() {
  removeStorage(SESSION_KEY)
}

export function loadPersistedSession(): AuthState {
  const stored = readStorage<AuthState>(SESSION_KEY, {
    status: 'unauthenticated',
    token: null,
    user: null,
  })

  if (stored.status === 'authenticated') {
    return stored
  }

  return {
    status: 'unauthenticated',
    token: null,
    user: null,
  }
}
