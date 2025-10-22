import { type PropsWithChildren, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { createQueryClient } from '@/app/query-client'
import { AuthProvider } from '@/features/auth/auth-provider'

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      {import.meta.env.DEV ? (
        <ReactQueryDevtools buttonPosition="bottom-left" />
      ) : null}
    </QueryClientProvider>
  )
}
