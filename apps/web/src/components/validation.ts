import type { TFunction } from 'i18next'
import { z } from 'zod'

export const nameSchema = z.object({
  name: z.string().min(1, 'validation.nameRequired'),
})

// Form error state in Header mixes validation keys with messages the backend
// returned verbatim; only the keys go through the catalogue.
export function translateFormError(t: TFunction, message: string | undefined, options?: Record<string, unknown>): string | undefined {
  if (!message) return message
  return message.startsWith('validation.') ? t(message, { ...options, defaultValue: message }) : message
}
