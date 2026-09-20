import { Base64 } from 'js-base64'

vi.mock('../AnyTLSForm', () => ({ AnyTLSForm: () => null }))
vi.mock('../Hysteria2Form', () => ({ Hysteria2Form: () => null }))
vi.mock('../JuicityForm', () => ({ JuicityForm: () => null }))
vi.mock('../SSForm', () => ({ SSForm: () => null }))
vi.mock('../SSRForm', () => ({ SSRForm: () => null }))
vi.mock('../TrojanForm', () => ({ TrojanForm: () => null }))
vi.mock('../TuicForm', () => ({ TuicForm: () => null }))
vi.mock('../V2rayForm', () => ({ V2rayForm: () => null }))

beforeAll(() => {
  vi.stubGlobal('location', { protocol: 'http:', hostname: 'localhost' })
})

afterAll(() => {
  vi.unstubAllGlobals()
})

it.each([
  { net: 'tcp', type: 'http', path: '/x', expected: { type: 'http', path: '/x' } },
  { net: 'grpc', type: 'none', path: 'svc', expected: { path: 'svc' } },
  { net: 'kcp', type: 'srtp', path: '', expected: { type: 'srtp' } },
  { net: 'ws', type: 'http', path: '/x', expected: { type: '' } },
  { net: 'tcp', type: 'srtp', path: '', expected: { type: 'none' } },
  { net: 'kcp', type: 'http', path: '', expected: { type: 'none' } },
] as const)('preserves supported vmess fields for $net', async ({ net, type, path, expected }) => {
  // Constants read location during module initialization.
  const { v2rayProtocol } = await import('./complex')
  const link = v2rayProtocol.generateLink({ ...v2rayProtocol.defaultValues, net, type, path })

  expect(JSON.parse(Base64.decode(link.slice('vmess://'.length)))).toMatchObject(expected)
})

it('encodes ss and ssr links with URL-safe base64', async () => {
  const { ssProtocol, ssrProtocol } = await import('./complex')
  // '>>?' encodes to Pj4/ in standard base64 and Pj4_ in the URL-safe alphabet.
  const ss = ssProtocol.generateLink({ ...ssProtocol.defaultValues, method: 'aes-256-gcm', password: '>>?', server: 'h', port: 1 })
  expect(ss.slice('ss://'.length, ss.indexOf('@'))).toMatch(/^[\w-]+$/)
  const ssr = ssrProtocol.generateLink({ ...ssrProtocol.defaultValues, server: 'h', port: 1, password: '>>?' })
  expect(ssr.slice('ssr://'.length)).toMatch(/^[\w-]+$/)
})
