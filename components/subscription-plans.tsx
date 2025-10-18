// components/subscription-plans.tsx
"use client"; // Add this if not present

import { useState, useEffect } from "react"; // Import hooks
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

// Remove the static 'plans' array

export function SubscriptionPlans() {
  const [plans, setPlans] = useState<any[]>([]); // State for plans
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      try {
        const response = await fetch('/api/membership-plans'); // Fetch from API
        if (!response.ok) throw new Error('Failed to fetch plans');
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-black text-white uppercase mb-6 mt-6">Membership Plans</h2>
      {loading ? (
         <p className="text-center text-white/70">Loading plans...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id} // Use plan.id from DB
              className={`bg-black border border-white/10 relative transition-all rounded-none p-0 h-full flex flex-col ${
                  plan.is_popular // Use is_popular from DB
                      ? "border-primary border-2 bg-zinc-900/50 shadow-[0_0_20px_rgba(252,211,77,0.3)]"
                      : "hover:border-white/20"
              }`}
            >
              {/* Popular Tag */}
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-black text-xs font-black uppercase px-4 py-1.5 rounded-full shadow-md">
                    POPULAR
                  </span>
                </div>
              )}
              {/* Bonus Tag */}
               {plan.bonus_offer && ( // Use bonus_offer from DB
                  <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2">
                      <span className="bg-green-500 text-white text-xs font-black uppercase px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
                          {plan.bonus_offer}
                      </span>
                  </div>
              )}
              <CardHeader className="text-center px-6 pt-6 pb-0 flex-grow">
                  <CardTitle className="text-white text-2xl font-black uppercase tracking-wide">
                      {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                      <span className={`text-6xl font-black ${plan.is_popular ? 'text-primary' : 'text-white'}`}>
                          RM{plan.price} {/* Ensure price is formatted */}
                      </span>
                  </div>
                  {plan.monthly_equivalent && ( // Use monthly_equivalent from DB
                      <p className="text-white/70 text-sm">RM{plan.monthly_equivalent}/month</p>
                  )}
              </CardHeader>
              <CardContent className="space-y-6 pt-6 px-6 flex flex-col justify-end">
                <ul className="space-y-3">
                    {(plan.features || []).map((feature: string) => ( // Ensure features is an array
                        <li key={feature} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-white font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>
                <Button
                    className={`w-full font-black uppercase py-5 h-auto rounded-none text-base
                        ${plan.is_popular
                            ? 'bg-primary text-black hover:bg-yellow-500 shadow-md'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'
                        }`
                    }
                    // Add onClick handler if needed for admin editing
                    // onClick={() => handleEditPlan(plan.id)}
                >
                    EDIT PLAN
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}