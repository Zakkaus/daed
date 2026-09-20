import en from '~/i18n/locales/en.json'
import zh from '~/i18n/locales/zh-Hans.json'
import { nameSchema } from './validation'

it('stores an empty-name error key present in both validation catalogues', () => {
  const result = nameSchema.safeParse({ name: '' })
  expect(result.success).toBe(false)
  if (result.success) return
  const message = result.error.issues[0].message
  expect(message).toMatch(/^validation\./)
  for (const locale of [en, zh]) {
    expect(locale.validation).toHaveProperty(message.replace(/^validation\./, ''), expect.stringMatching(/\S/))
  }
})

it('provides the same non-empty validation key set in both languages', () => {
  const keys = Object.keys(en.validation).sort()
  expect(keys.length).toBeGreaterThan(0)
  expect(Object.keys(zh.validation).sort()).toEqual(keys)
})
