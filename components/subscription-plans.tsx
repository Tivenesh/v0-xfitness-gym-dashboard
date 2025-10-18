import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

// Data structure is consistent
const plans = [
    {
        name: "1 MONTH",
        price: "RM139",
        monthly: null,
        features: ["Full Gym Access"],
        isPopular: false,
        isBonus: null,
    },
    {
        name: "3 MONTHS",
        price: "RM349",
        monthly: "RM116.3/month",
        features: ["Free Joining Fee", "Free Shaker & Tote Bag", "Free Key Fob"],
        isPopular: true,
        isBonus: null,
    },
    {
        name: "6 MONTHS",
        price: "RM659",
        monthly: "RM109.8/month",
        features: ["Free Joining Fee", "Free Shaker & Tote Bag", "Free Key Fob"],
        isPopular: false,
        isBonus: null,
    },
    {
        name: "12 MONTHS",
        price: "RM1199",
        monthly: "RM99.9/month",
        features: ["Free Joining Fee", "Free Shaker & Tote Bag", "Free Key Fob"],
        isPopular: false,
        isBonus: "+ 1 MONTH FREE",
    },
];

export function SubscriptionPlans() {
  return (
    <div>
      <h2 className="text-3xl font-black text-white uppercase mb-6 mt-6">Membership Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            // CLEAN ADMIN DESIGN: Black card, white/10 border. Yellow border and light shadow for popular card.
            className={`bg-black border border-white/10 relative transition-all rounded-none p-0 h-full flex flex-col ${
                plan.isPopular 
                    ? "border-primary border-2 bg-zinc-900/50 shadow-[0_0_20px_rgba(252,211,77,0.3)]" 
                    : "hover:border-white/20"
            }`}
          >
            
            {/* POPULAR TAG: Always high contrast (Yellow on Black text) */}
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-black text-xs font-black uppercase px-4 py-1.5 rounded-full shadow-md">
                  POPULAR
                </span>
              </div>
            )}
            
            {/* BONUS TAG: Always green on white text */}
            {plan.isBonus && (
                <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2">
                    <span className="bg-green-500 text-white text-xs font-black uppercase px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
                        {plan.isBonus}
                    </span>
                </div>
            )}

            <CardHeader className="text-center px-6 pt-6 pb-0 flex-grow"> 
              <CardTitle className="text-white text-2xl font-black uppercase tracking-wide">
                {plan.name}
              </CardTitle>
              
              <div className="mt-4">
                {/* PRICE: Huge font, primary color for popular */}
                <span className={`text-6xl font-black ${plan.isPopular ? 'text-primary' : 'text-white'}`}>
                    {plan.price}
                </span>
              </div>
              {/* MONTHLY PRICE: Visible light gray/white text */}
              {plan.monthly && (
                  <p className="text-white/70 text-sm">{plan.monthly}</p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6 px-6 flex flex-col justify-end">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    {/* CHECK ICON: Always primary (Yellow) */}
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /> 
                    {/* FEATURE TEXT: Always white for maximum readability */}
                    <span className="text-sm text-white font-medium">{feature}</span> 
                  </li>
                ))}
              </ul>
              
              {/* BUTTON: Yellow button for popular, dark gray for standard - clear distinction */}
              <Button 
                className={`w-full font-black uppercase py-5 h-auto rounded-none text-base 
                    ${plan.isPopular 
                        ? 'bg-primary text-black hover:bg-yellow-500 shadow-md' 
                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                    }`
                }
              >
                EDIT PLAN
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  )
}