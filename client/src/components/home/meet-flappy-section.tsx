import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { FlappyAvatar } from "@/components/flappy-avatar";

export function MeetFlappySection() {
  const { user } = useAuth();
  
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-br from-indigo-50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-800/80 dark:to-indigo-900/20 overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-300/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-teal-200/20 to-cyan-300/20 rounded-full blur-lg"></div>
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          <div className="lg:w-2/5 relative">
            <div className="relative group flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
              <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-200/50 dark:border-slate-700/50 group-hover:scale-105 transition-transform duration-300">
                <FlappyAvatar className="w-80 h-80" />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform rotate-12">✨ Your Personal Companion</div>
            </div>
          </div>
          
          <div className="lg:w-3/5 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 bg-purple-100/70 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Meet Your Guide
              </div>
              
              <h2 className="font-quicksand font-bold text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-tight">
                Meet{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Flappy
                  </span>
                  <svg className="absolute -top-1 -right-6 w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              </h2>
              
              <h3 className="font-quicksand text-2xl md:text-3xl text-slate-700 dark:text-slate-200 font-medium">
                Your Intelligent Wellness Companion
              </h3>
            </div>
            
            <div className="space-y-6 text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Flappy isn't just another AI assistant. He's an exceptionally intelligent companion with a distinctive personality, 
                profound understanding of human nature, and an innate ability to guide meaningful conversations. With sophisticated 
                insights and genuine warmth, he transforms journaling into an engaging, therapeutic experience.
              </p>
              <p>
                Through thoughtfully crafted emails delivered to your inbox, Flappy provides personalized guidance and prompts 
                that help you process life's experiences with clarity, depth, and renewed perspective.
              </p>
            </div>
            
            {/* Flappy's voice example */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🦢</span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-slate-700 dark:text-slate-200 text-lg leading-relaxed font-light italic mb-3">
                      "Hello there! I've been reflecting on the beauty of small moments today, and I'm curious about yours. 
                      What's one thing that happened today that brought you a sense of peace or accomplishment? I'd love to hear your thoughts."
                    </p>
                    <p className="text-right text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium">
                      — Flappy, Your Wellness Guide ✨
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={user ? "/journal" : "/auth"}>
                <Button 
                  size="lg" 
                  className="font-quicksand font-semibold text-lg px-8 py-4 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  Start Your Wellness Journey
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="lg"
                className="font-quicksand font-semibold text-lg px-8 py-4 h-auto text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
              >
                Discover Flappy's Features
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
