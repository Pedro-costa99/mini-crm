import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { Building2, Download, MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { fetchAddressByCEP, fetchBanks, fetchCompanyByCNPJ } from '@/services/brasilapi'
import { leadFormSchema, type LeadFormValues } from '@/features/leads/schema'
import { useCreateLeadMutation } from '@/features/leads/hooks'
import { LEAD_STAGES, type LeadStage } from '@/features/leads/types'

const stageOptions = Object.entries(LEAD_STAGES).map(([value, meta]) => ({
  value: value as LeadStage,
  label: meta.label,
  description: meta.description,
}))

export function NewLeadPage() {
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState<string | null>(null)

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      cnpj: '',
      cep: '',
      legalName: '',
      tradeName: '',
      cnaeCode: '',
      cnaeDescription: '',
      email: '',
      phone: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      notes: '',
      score: 60,
      stage: 'new',
      bankCode: '',
    },
  })

  const createLeadMutation = useCreateLeadMutation({
    onSuccess: async () => {
      setFeedback('Lead cadastrado com sucesso! Redirecionando...')
      form.reset({
        cnpj: '',
        cep: '',
        legalName: '',
        tradeName: '',
        cnaeCode: '',
        cnaeDescription: '',
        email: '',
        phone: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        notes: '',
        score: 60,
        stage: 'new',
        bankCode: '',
      })

      setTimeout(() => {
        setFeedback(null)
        void navigate({ to: '/leads' })
      }, 1100)
    },
  })

  const banksQuery = useQuery({
    queryKey: ['banks'],
    queryFn: fetchBanks,
    staleTime: Infinity,
  })

  const banksByCode = useMemo(() => {
    if (!banksQuery.data) return new Map<string, { name: string; code: number }>()
    return new Map(
      banksQuery.data.map((bank) => [
        String(bank.code),
        { name: bank.name, code: bank.code },
      ]),
    )
  }, [banksQuery.data])

  const enrichCnpjMutation = useMutation({
    mutationFn: fetchCompanyByCNPJ,
    onSuccess: (data) => {
      form.setValue('legalName', data.razao_social ?? '', { shouldValidate: true })
      form.setValue('tradeName', data.nome_fantasia ?? '', { shouldValidate: true })
      form.setValue('cnaeCode', data.cnae_fiscal ? String(data.cnae_fiscal) : '', {
        shouldValidate: true,
      })
      form.setValue('cnaeDescription', data.cnae_fiscal_descricao ?? '', {
        shouldValidate: true,
      })
      form.setValue('email', data.email ?? '', { shouldValidate: false })
      form.setValue('phone', data.ddd_telefone_1 ?? '', { shouldValidate: false })
      form.setValue('cep', data.cep ?? '', { shouldValidate: false })
      form.setValue('street', [data.logradouro, data.numero].filter(Boolean).join(', '), {
        shouldValidate: false,
      })
      form.setValue('city', data.municipio ?? '', { shouldValidate: false })
      form.setValue('state', data.uf ?? '', { shouldValidate: false })
    },
    onError: (error) => {
      form.setError('cnpj', {
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível enriquecer com o CNPJ informado.',
      })
    },
  })

  const enrichCepMutation = useMutation({
    mutationFn: fetchAddressByCEP,
    onSuccess: (data) => {
      form.setValue('street', `${data.street ?? ''}`, { shouldValidate: false })
      form.setValue('neighborhood', data.neighborhood ?? '', { shouldValidate: false })
      form.setValue('city', data.city ?? '', { shouldValidate: false })
      form.setValue('state', data.state ?? '', { shouldValidate: false })
    },
    onError: (error) => {
      form.setError('cep', {
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível enriquecer com o CEP informado.',
      })
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setFeedback(null)
    try {
      const bank = values.bankCode ? banksByCode.get(values.bankCode) : undefined
      await createLeadMutation.mutateAsync({
        legalName: values.legalName,
        tradeName: values.tradeName,
        cnpj: values.cnpj,
        cnaeCode: values.cnaeCode,
        cnaeDescription: values.cnaeDescription,
        email: values.email,
        phone: values.phone,
        cep: values.cep,
        street: values.street,
        number: values.number,
        complement: values.complement,
        neighborhood: values.neighborhood,
        city: values.city ?? '',
        state: values.state ?? '',
        bank: bank ? { code: bank.code, name: bank.name } : undefined,
        score: values.score,
        stage: values.stage,
        notes: values.notes,
      })
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar o lead. Tente novamente em instantes.',
      )
    }
  })

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>Novo lead</h1>
        <p>
          Cadastre um potencial cliente e utilize a BrasilAPI para enriquecer os dados
          automaticamente.
        </p>
      </header>

      <Card className="border border-border/60 bg-card/80">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Building2 className="h-5 w-5 text-primary" />
            Dados do lead
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Campos marcados com * são obrigatórios. Use os botões laterais para enriquecer
            via BrasilAPI.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-4 md:grid-cols-[2fr_auto]">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Somente números"
                            maxLength={18}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder="00000000" maxLength={10} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3 md:items-stretch">
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-center gap-2"
                    disabled={enrichCnpjMutation.isLoading || form.watch('cnpj').length === 0}
                    onClick={() => enrichCnpjMutation.mutate(form.getValues('cnpj'))}
                  >
                    <Download className="h-4 w-4" />
                    {enrichCnpjMutation.isLoading ? 'Buscando CNPJ...' : 'Enriquecer por CNPJ'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-center gap-2"
                    disabled={enrichCepMutation.isLoading || form.watch('cep')?.length === 0}
                    onClick={() => enrichCepMutation.mutate(form.getValues('cep') ?? '')}
                  >
                    <MapPin className="h-4 w-4" />
                    {enrichCepMutation.isLoading ? 'Buscando CEP...' : 'Autofill por CEP'}
                  </Button>
                </div>
              </div>

              <section className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razão Social *</FormLabel>
                      <FormControl>
                        <Input placeholder="Razão social" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tradeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Fantasia</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome fantasia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cnaeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNAE</FormLabel>
                      <FormControl>
                        <Input placeholder="Código CNAE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cnaeDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição CNAE</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="contato@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Logradouro</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, avenida..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Sala, bloco, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF</FormLabel>
                      <FormControl>
                        <Input placeholder="UF" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <section className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <div className="space-y-2 rounded-xl border border-border/50 bg-muted/20 p-4">
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>0</span>
                            <Badge variant="outline" weight="medium">
                              {field.value} pontos
                            </Badge>
                            <span>100</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etapa</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a etapa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {stageOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground">
                                  {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bankCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banco principal</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o banco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {banksQuery.isLoading ? (
                            <SelectItem value="loading" disabled>
                              Carregando...
                            </SelectItem>
                          ) : (
                            banksQuery.data?.slice(0, 25).map((bank) => (
                              <SelectItem
                                key={`${bank.code ?? bank.ispb ?? bank.name}`}
                                value={String(bank.code ?? bank.ispb ?? bank.name ?? '')}
                              >
                                {bank.code} - {bank.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas internas</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Contexto, próximos passos, dores do cliente..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {feedback ? (
                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                  {feedback}
                </div>
              ) : null}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="min-w-[180px]"
                  disabled={createLeadMutation.isPending}
                >
                  {createLeadMutation.isPending ? 'Salvando...' : 'Salvar lead'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

