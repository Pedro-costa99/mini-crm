import { z } from 'zod'

import type { LeadStage } from '@/features/leads/types'

const leadStageEnum = z.enum(['new', 'contacted', 'qualified', 'proposal', 'won'])

const emptyToUndefined = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))

export const leadFormSchema = z
  .object({
    cnpj: z
      .string({
        required_error: 'Informe o CNPJ.',
      })
      .min(14, 'CNPJ precisa ter 14 dígitos.')
      .transform((value) => value.replace(/\D/g, ''))
      .refine((value) => value.length === 14, 'CNPJ inválido.'),
    cep: emptyToUndefined
      .optional()
      .transform((value) => value?.replace(/\D/g, ''))
      .pipe(
        z
          .string()
          .length(8, 'CEP deve ter 8 dígitos.')
          .optional()
          .or(z.literal(undefined)),
      ),
    legalName: z
      .string({
        required_error: 'Informe a razão social.',
      })
      .trim()
      .min(2, 'Razão social muito curta.'),
    tradeName: emptyToUndefined.optional(),
    cnaeCode: emptyToUndefined.optional(),
    cnaeDescription: emptyToUndefined.optional(),
    email: emptyToUndefined
      .optional()
      .pipe(z.string().email('E-mail inválido.').optional().or(z.literal(undefined))),
    phone: emptyToUndefined.optional(),
    street: emptyToUndefined.optional(),
    number: emptyToUndefined.optional(),
    complement: emptyToUndefined.optional(),
    neighborhood: emptyToUndefined.optional(),
    city: emptyToUndefined.optional(),
    state: emptyToUndefined
      .optional()
      .pipe(
        z
          .string()
          .length(2, 'UF deve ter 2 letras.')
          .toUpperCase()
          .optional()
          .or(z.literal(undefined)),
      ),
    score: z
      .number({
        required_error: 'Pontuação é obrigatória.',
      })
      .min(0)
      .max(100),
    stage: leadStageEnum,
    notes: emptyToUndefined.optional(),
    bankCode: emptyToUndefined.optional(),
  })
  .refine(
    (data) => {
      if (data.email === undefined) return true
      return data.email.length > 0
    },
    {
      path: ['email'],
      message: 'Informe um e-mail válido.',
    },
  )

export type LeadFormValues = z.infer<typeof leadFormSchema> & {
  stage: LeadStage
}
