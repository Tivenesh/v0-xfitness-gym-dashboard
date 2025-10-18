// components/subscription-plans.tsx

"use client";

import { useState, useEffect } from "react";
// Removed Card import as we are using divs now
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  monthly_equivalent: number | null;
  duration_months: number;
  features: string[];
  is_popular: boolean;
  bonus_offer: string | null;
}

export function SubscriptionPlans() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // ... (fetchData and auth listener remain the same)
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const role = session?.user?.app_metadata?.role;
        setIsOwner(role === "Owner");

        const response = await fetch("/api/membership-plans");
        if (!response.ok) {
          throw new Error("Failed to fetch membership plans");
        }
        const data = await response.json();
        setPlans(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const role = session?.user?.app_metadata?.role;
        setIsOwner(role === "Owner");
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);


  return (
    <div>
      {/* ... (header and loading/error states remain the same) */}
       <div className="flex justify-between items-center mb-6 mt-6">
        <h2 className="text-3xl font-black text-white uppercase">
          Membership Plans
        </h2>
        {isOwner && (
          <Link href="/dashboard/settings">
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/10 hover:text-white font-bold">
              Manage Plans
            </Button>
          </Link>
        )}
      </div>

      {loading && <p className="text-center text-white/50">Loading plans...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl border transition-all h-full
                  ${
                    plan.is_popular
                      ? "border-primary border-2 bg-zinc-900/50 shadow-[0_0_20px_rgba(252,211,77,0.3)]"
                      : "border-white/10 bg-black hover:border-white/20"
                  }
                  `}
            >
              <div className="rounded-3xl overflow-hidden p-8 h-full flex flex-col">
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-primary text-black text-xs font-black uppercase px-4 py-1.5 rounded-full shadow-md">
                      POPULAR
                    </span>
                  </div>
                )}
                {plan.bonus_offer && (
                  <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2 z-10">
                    <span className="bg-green-500 text-white text-xs font-black uppercase px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
                      {plan.bonus_offer}
                    </span>
                  </div>
                )}
                <CardHeader className="text-center p-0 flex-grow">
                  <CardTitle className="text-white text-2xl font-black uppercase tracking-wide">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span
                      className={`text-6xl font-black ${
                        plan.is_popular ? "text-primary" : "text-white"
                      }`}
                    >
                      RM{plan.price}
                    </span>
                  </div>
                  {plan.monthly_equivalent && (
                    <p className="text-white/70 text-sm">
                      RM{plan.monthly_equivalent}/month
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4 pt-6 p-0 flex flex-col justify-end">
                  <ul className="space-y-3">
                    {Array.isArray(plan.features) &&
                      plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-white font-medium">
                            {feature}
                          </span>
                        </li>
                      ))}
                  </ul>

                  {/* --- CHANGE HERE: Wrap Button in Link and conditionally render --- */}
                  {isOwner && (
                    <Link href="/dashboard/settings" className="block mt-6"> {/* Added block and margin-top */}
                        <Button
                          className={`w-full font-black uppercase py-5 h-auto text-base rounded-xl
                              ${
                                plan.is_popular
                                  ? "bg-primary text-black hover:bg-yellow-500 shadow-md"
                                  : "bg-zinc-800 text-white hover:bg-zinc-700"
                              }
                              `
                          }
                          // Removed disabled prop
                        >
                          Edit Plan {/* Changed text */}
                        </Button>
                    </Link>
                   )}
                  {/* --- END CHANGE --- */}

                </CardContent>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}