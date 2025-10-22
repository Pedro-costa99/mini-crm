import { Suspense } from 'react'
import { RouterProvider } from '@tanstack/react-router'

import { AppProviders } from '@/app/providers'
import { router } from '@/app/router'
import { LoadingScreen } from '@/components/loading-screen'
import { useAuth } from '@/features/auth/auth-provider'

const App = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
)

function AppRouter() {
  const auth = useAuth()

  if (auth.isLoading) {
    return <LoadingScreen message="Validando sessão..." />
  }

  return (
    <Suspense fallback={<LoadingScreen message="Carregando mini CRM..." />}>
      <RouterProvider router={router} context={{ auth }} />
    </Suspense>
  )
}

export default App
