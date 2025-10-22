import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/auth-provider'

const formSchema = z.object({
  email: z.string().email('Informe um e-mail valido.'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
})

type FormValues = z.infer<typeof formSchema>

type LoginFormProps = {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'pedro@mini-crm.dev',
      password: '123456',
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setErrorMessage(null)
    try {
      await login(values)
      onSuccess?.()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao autenticar.')
    }
  })

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Acessar o painel</h2>
        <p>
          Use as credenciais mockadas para logar e explorar o mini CRM com dados da
          BrasilAPI.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="seu.email@empresa.com"
                      className="pl-9"
                      autoComplete="email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="*******"
                      className="pl-9 pr-10"
                      autoComplete="current-password"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorMessage ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <Button
            type="submit"
            className="h-11 w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Form>

      <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Credenciais mock:</p>
        <p>Email: <span className="font-mono">pedro@mini-crm.dev</span></p>
        <p>Senha: <span className="font-mono">123456</span></p>
      </div>
    </div>
  )
}
