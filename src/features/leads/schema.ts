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
      .string()
      .trim()
      .min(1, 'Informe o CNPJ.')
      .transform((value) => value.replace(/\D/g, ''))
      .refine((value) => value.length === 14, 'CNPJ invalido.'),
    cep: emptyToUndefined
      .optional()
      .transform((value) => value?.replace(/\D/g, ''))
      .pipe(
        z
          .string()
          .length(8, 'CEP deve ter 8 digitos.')
          .optional()
          .or(z.literal(undefined)),
      ),
    legalName: z
      .string()
      .trim()
      .min(1, 'Informe a razao social.')
      .min(2, 'Razao social muito curta.'),
    tradeName: emptyToUndefined.optional(),
    cnaeCode: emptyToUndefined.optional(),
    cnaeDescription: emptyToUndefined.optional(),
    email: emptyToUndefined
      .optional()
      .pipe(z.string().email('E-mail invalido.').optional().or(z.literal(undefined))),
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
    score: z.number().min(0, 'Pontuacao minima 0').max(100, 'Pontuacao maxima 100'),
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
      message: 'Informe um e-mail valido.',
    },
  )

export type LeadFormValues = z.infer<typeof leadFormSchema> & {
  stage: LeadStage
}
