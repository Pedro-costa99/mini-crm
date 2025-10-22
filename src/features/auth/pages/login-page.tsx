import { useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { LoginForm } from '@/features/auth/components/login-form'
import { useAuth } from '@/features/auth/auth-provider'

export function LoginPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/login' })
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      void navigate({ to: search.redirect ?? '/' })
    }
  }, [isAuthenticated, isLoading, navigate, search.redirect])

  return (
    <div className="space-y-8">
      <LoginForm
        onSuccess={() => {
          void navigate({ to: search.redirect ?? '/' })
        }}
      />
    </div>
  )
}
