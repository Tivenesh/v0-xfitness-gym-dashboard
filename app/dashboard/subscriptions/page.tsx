import { SubscriptionPlans } from "@/components/subscription-plans"
import { SubscriptionsTable } from "@/components/subscriptions-table"

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Manage membership plans and active subscriptions</p>
      </div>

      <SubscriptionPlans />
      <SubscriptionsTable />
    </div>
  )
}
