import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    description: "Perfect for getting started",
    features: ["Access to gym facilities", "Group fitness classes", "Personalized workout plan"],
    popular: false,
  },
  {
    name: "Premium",
    price: "$49",
    period: "/month",
    description: "Most popular choice",
    features: ["All Basic features", "Unlimited classes", "Nutrition guidance", "1 personal training session/month"],
    popular: true,
  },
  {
    name: "Elite",
    price: "$79",
    period: "/month",
    description: "For serious athletes",
    features: [
      "All Premium features",
      "Exclusive training sessions",
      "VIP access",
      "4 personal training sessions/month",
    ],
    popular: false,
  },
]

export function SubscriptionPlans() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-4">Membership Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`bg-card border-border relative ${plan.popular ? "border-primary border-2" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  POPULAR
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-foreground">{plan.name}</CardTitle>
              <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Edit Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
