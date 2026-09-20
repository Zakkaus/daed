import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useSubscriptionsQuery, useUpdateSubscriptionsMutation } from '~/apis'
import { Button } from '~/components/ui/button'
import { SimpleTooltip } from '~/components/ui/tooltip'

export function UpdateSubscriptionAction({ id, loading }: { id: string; loading?: boolean }) {
  const { t } = useTranslation()
  const updateSubscriptionsMutation = useUpdateSubscriptionsMutation()
  const { data: subscriptionsQuery } = useSubscriptionsQuery()

  return (
    <SimpleTooltip label={t('actions.update')}>
      <Button
        variant="ghost"
        size="xs"
        loading={loading || updateSubscriptionsMutation.isPending}
        onClick={() =>
          updateSubscriptionsMutation.mutate([id], {
            onSuccess: (results) => {
              for (const result of results) {
                if (result.status !== 'error') continue
                const subscription = subscriptionsQuery?.subscriptions.find(({ id }) => id === result.id)
                toast.error(
                  t('subscriptionUpdateFailed', {
                    name: subscription?.tag || subscription?.link || result.id,
                    error: result.error,
                  }),
                )
              }
            },
          })
        }
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </SimpleTooltip>
  )
}
