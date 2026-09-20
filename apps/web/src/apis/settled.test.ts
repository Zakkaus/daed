import { settledItems } from './settled'

it('retains failed and successful subscription identities in input order', async () => {
  const results = await Promise.allSettled([Promise.reject(new Error('unavailable')), Promise.resolve('imported')])
  expect(settledItems([{ link: 'https://failed.example' }, { link: 'https://ok.example' }], results)).toEqual([
    { link: 'https://failed.example', status: 'error', error: 'unavailable' },
    { link: 'https://ok.example', status: 'ok' },
  ])
})
