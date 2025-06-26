import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function PricingSection() {
  const { user } = useAuth();
  
  const pricingPlans = [
    {
      name: "Essentials",
      description: "Begin your wellness transformation",
      price: "$0",
      period: "/month",
      features: [
        "Personalized daily insights from Flappy",
        "Unlimited email-based journaling",
        "7-day reflection history",
        "Thoughtful wellness prompts",
        "Basic mood tracking"
      ],
      buttonText: "Start Your Journey",
      buttonVariant: "outline" as const,
      highlight: false,
      gradient: "from-slate-600 to-slate-700",
      badge: null,
      icon: "🌱"
    },
    {
      name: "Premium Experience",
      description: "Complete wellness ecosystem",
      price: "$4.99",
      period: "/month",
      features: [
        "Everything in Essentials",
        "SMS wellness check-ins with Flappy",
        "Unlimited reflection archive",
        "Advanced analytics and insights",
        "Personalized growth recommendations",
        "Priority intelligent responses",
        "Premium ad-free experience",
        "Exclusive wellness content library"
      ],
      buttonText: "Unlock Premium",
      buttonVariant: "default" as const,
      highlight: true,
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      badge: "Most Popular",
      icon: "⭐"
    }
  ];

  return (
    <section id="pricing" className="relative py-32 md:py-40 lg:py-48 overflow-hidden">
      {/* Ultra-sophisticated background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/80 to-blue-50/40 dark:from-slate-950 dark:via-slate-900/90 dark:to-indigo-950/30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-slate-50/30 dark:from-slate-900/50 dark:via-transparent dark:to-slate-800/30"></div>
      
      {/* Premium floating elements with sophisticated animations */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-indigo-200/8 to-purple-300/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-br from-blue-200/6 to-cyan-300/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-200/10 to-pink-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      {/* Elegant geometric pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.03),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.03),transparent_50%)]"></div>
      
      <Container>
        <div className="text-center mb-24 relative">
          {/* Ultra-premium section badge */}
          <div className="relative group mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative inline-flex items-center px-6 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-full shadow-xl">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3 animate-pulse shadow-sm"></div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase">
                Investment Plans
              </span>
              <Sparkles className="w-4 h-4 ml-3 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          
          {/* Ultra-elegant typography */}
          <div className="relative mb-12">
            <h2 className="font-quicksand font-black text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-slate-900 dark:text-white mb-8 leading-[0.85] tracking-tighter">
              Invest in Your{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Best Self
                </span>
                {/* Sophisticated accent */}
                <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-blue-600/20 blur-sm rounded-full"></div>
              </span>
            </h2>
            
            <p className="text-2xl md:text-3xl lg:text-4xl text-slate-600 dark:text-slate-300 max-w-5xl mx-auto leading-relaxed font-light tracking-wide">
              Choose the perfect wellness plan for your{" "}
              <span className="text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text font-medium">personal transformation</span>
              {" "}journey.
            </p>
          </div>
        </div>
        
        {/* Ultra-premium pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div key={plan.name} className={`group relative ${plan.highlight ? 'lg:scale-105' : ''}`}>
              {/* Premium popular badge */}
              {plan.badge && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-lg"></div>
                    <div className="relative bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-2xl">
                      <span className="text-lg">{plan.icon}</span>
                      {plan.badge}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Sophisticated glow effects */}
              <div className={`absolute -inset-6 bg-gradient-to-r ${plan.highlight ? 'from-indigo-600/15 via-purple-600/10 to-blue-600/15' : 'from-slate-600/10 to-slate-700/10'} rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100`}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-slate-50/5 dark:from-slate-800/5 dark:to-slate-700/5 rounded-3xl"></div>
              
              <Card className={`relative h-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 transition-all duration-500 rounded-3xl group-hover:-translate-y-2 ${
                plan.highlight 
                  ? 'border-indigo-200/70 dark:border-indigo-800/70 shadow-2xl group-hover:shadow-indigo-500/20 group-hover:border-indigo-300/80 dark:group-hover:border-indigo-700/80' 
                  : 'border-slate-200/60 dark:border-slate-700/60 shadow-xl hover:shadow-2xl group-hover:border-slate-300/80 dark:group-hover:border-slate-600/80'
              }`}>
                <CardContent className="p-10 lg:p-12">
                  {/* Premium icon and header */}
                  <div className="text-center mb-10">
                    <div className="relative mb-6">
                      <div className={`absolute inset-0 bg-gradient-to-br ${plan.highlight ? 'from-indigo-400/20 to-purple-500/20' : 'from-slate-400/20 to-slate-500/20'} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300`}></div>
                      <div className={`relative w-20 h-20 mx-auto bg-gradient-to-br ${plan.gradient} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <span className="text-3xl">{plan.icon}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-quicksand font-black text-3xl lg:text-4xl text-slate-900 dark:text-white mb-3 leading-tight">
                      {plan.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xl mb-8 leading-relaxed font-light">
                      {plan.description}
                    </p>
                    
                    <div className="flex items-baseline justify-center mb-8">
                      <span className={`font-quicksand font-bold text-5xl lg:text-6xl bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        {plan.price}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-lg ml-1">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-200 text-lg leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Link href={user ? "/journal" : "/auth"}>
                    <Button 
                      size="lg" 
                      variant={plan.buttonVariant}
                      className={`w-full font-quicksand font-semibold text-lg py-4 h-auto transition-all duration-200 ${
                        plan.highlight 
                          ? `bg-gradient-to-r ${plan.gradient} hover:shadow-xl hover:scale-105 border-0 text-white` 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-2'
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Need something custom? {" "}
            <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              Contact us
            </Link>
            {" "} for enterprise solutions.
          </p>
        </div>
      </Container>
    </section>
  );
}