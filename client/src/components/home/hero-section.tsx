import { Link } from "wouter";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function HeroSection() {
  const { user } = useAuth();
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Ultra-sophisticated gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/70 to-blue-50/40 dark:from-slate-950 dark:via-slate-900/80 dark:to-indigo-950/30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 dark:from-transparent dark:via-slate-900/20 dark:to-slate-800/30"></div>
      
      {/* Premium floating elements with animations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/10 to-indigo-300/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-200/8 to-pink-300/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-br from-cyan-200/12 to-blue-300/12 rounded-full blur-2xl animate-pulse delay-500"></div>
      <div className="absolute top-10 right-1/4 w-32 h-32 bg-gradient-to-br from-emerald-200/8 to-teal-300/8 rounded-full blur-xl animate-pulse delay-2000"></div>
      
      {/* Sophisticated grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      <Container>
        <div className="relative py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">
            {/* Ultra-premium badge */}
            <div className="relative group mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative inline-flex items-center px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/40 dark:border-slate-700/40 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mr-3 animate-pulse shadow-sm"></div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide">
                  Premium AI Wellness Platform
                </span>
                <div className="w-1 h-1 bg-slate-400 rounded-full ml-3"></div>
              </div>
            </div>

            {/* Ultra-elegant typography with sophisticated effects */}
            <div className="relative mb-12">
              <h1 className="font-quicksand font-black text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-slate-900 dark:text-white mb-6 leading-[0.85] tracking-tighter">
                Meet{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent relative z-10">
                    Flappy
                  </span>
                  {/* Sophisticated accent decoration */}
                  <div className="absolute -top-3 -right-8 w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 blur-2xl -z-10"></div>
                </span>
              </h1>
              
              <div className="relative">
                <h2 className="font-quicksand text-3xl md:text-4xl lg:text-5xl text-slate-600 dark:text-slate-300 font-light leading-tight tracking-wide">
                  Your Intelligent Wellness Companion
                </h2>
                {/* Elegant underline accent */}
                <div className="mt-4 mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
            </div>

            <div className="mb-16">
              <p className="text-2xl md:text-3xl lg:text-4xl text-slate-700 dark:text-slate-300 mb-8 max-w-5xl mx-auto leading-relaxed font-light tracking-wide">
                Experience the future of wellness through
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium"> personalized guidance </span>
                that transforms daily reflection into profound personal growth.
              </p>
              
              <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed font-light">
                Flappy delivers thoughtfully crafted insights directly to your inbox, making wellness accessible, 
                engaging, and beautifully integrated into your everyday life.
              </p>
            </div>

            {/* Ultra-premium CTAs */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-20">
              <Link href={user ? "/journal" : "/auth"}>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70"></div>
                  <Button 
                    size="lg" 
                    className="relative font-quicksand font-bold text-xl px-12 py-6 h-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 border-0 rounded-2xl"
                  >
                    Begin Your Wellness Journey
                    <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </div>
              </Link>
              
              <Link href="#features">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="group font-quicksand font-semibold text-xl px-12 py-6 h-auto text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/70 backdrop-blur-md border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300/70 dark:hover:border-blue-600/70 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Explore Features
                  <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>

            {/* Ultra-premium trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="group flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-quicksand font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">Enterprise Security</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Bank-level encryption and privacy protection</p>
              </div>
              
              <div className="group flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-quicksand font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">AI Excellence</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Advanced language models for personalized insights</p>
              </div>
              
              <div className="group flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 10.793a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-quicksand font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">Daily Growth</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Consistent wellness practices that build over time</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}