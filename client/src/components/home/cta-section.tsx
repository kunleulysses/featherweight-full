import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, ArrowRight } from "lucide-react";

export function CTASection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Thanks for your interest!",
        description: "Redirecting you to create your account.",
      });
      navigate("/auth", { replace: true });
    }, 1000);
  };

  if (user) {
    return (
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90"></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <Container className="relative text-center text-white">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 mb-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
              <Sparkles className="w-5 h-5 mr-2 text-amber-300" />
              <span className="font-medium">Ready to Continue</span>
            </div>
            
            <h2 className="font-quicksand font-bold text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
              Your Journey with{" "}
              <span className="text-amber-300">Flappy</span>{" "}
              Awaits
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Head to your personal journal and continue your cosmic exploration with your ancient pelican guide.
            </p>
            
            <Link href="/journal">
              <Button 
                size="lg"
                className="font-quicksand font-semibold text-lg px-8 py-4 h-auto bg-white text-indigo-600 hover:bg-white/90 shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all duration-200"
              >
                Enter Your Cosmic Journal
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden">
      {/* Cosmic background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-white rounded-full animate-pulse delay-700"></div>
      </div>
      
      <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-xl"></div>
      
      <Container className="relative text-center text-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 mb-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <Sparkles className="w-5 h-5 mr-2 text-amber-300" />
            <span className="font-medium">Begin Your Cosmic Journey</span>
          </div>
          
          <h2 className="font-quicksand font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-8 leading-[0.9]">
            Ready to Meet{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Flappy?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Join thousands who have discovered the transformative power of intelligent wellness guidance through mindful journaling. 
            Your personalized companion is waiting to begin this extraordinary journey with you.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <Link href="/auth">
              <Button 
                size="lg"
                className="font-quicksand font-semibold text-lg px-8 py-4 h-auto bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105 transition-all duration-200 border-0"
              >
                Begin Your Wellness Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="lg"
              className="font-quicksand font-semibold text-lg px-8 py-4 h-auto text-white hover:bg-white/10 backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-200"
            >
              Watch Flappy's Introduction
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/60">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Free to start</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Expert guidance</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Personal growth</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}