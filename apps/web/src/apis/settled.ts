export type SettledItem<T> = T & { status: 'ok' | 'error'; error?: string }

export function settledItems<T extends object>(items: T[], results: PromiseSettledResult<unknown>[]): SettledItem<T>[] {
  return results.map((result, index) => {
    if (result.status === 'rejected') {
      return {
        ...items[index],
        status: 'error',
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      }
    }
    return { ...items[index], status: 'ok' }
  })
}
