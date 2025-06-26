import { Container } from "@/components/ui/container";
import { Mail, Reply, BookOpen } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 md:py-40 lg:py-48 overflow-hidden">
      {/* Ultra-sophisticated background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/40 dark:from-slate-900/60 dark:via-transparent dark:to-slate-900/40"></div>
      
      {/* Premium floating elements with advanced animations */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-200/8 to-indigo-300/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 left-16 w-96 h-96 bg-gradient-to-br from-purple-200/6 to-pink-300/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-200/10 to-teal-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      {/* Sophisticated geometric pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]"></div>
      
      <Container>
        <div className="text-center mb-24">
          {/* Ultra-premium section badge */}
          <div className="relative group mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative inline-flex items-center px-6 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-full shadow-xl">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 animate-pulse shadow-sm"></div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase">
                How It Works
              </span>
              <svg className="w-4 h-4 ml-3 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Ultra-elegant typography */}
          <div className="relative mb-12">
            <h2 className="font-quicksand font-black text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-slate-900 dark:text-white mb-8 leading-[0.85] tracking-tighter">
              Wellness Simplified,{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Results Amplified
                </span>
                {/* Sophisticated accent */}
                <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 blur-sm rounded-full"></div>
              </span>
            </h2>
            
            <p className="text-2xl md:text-3xl lg:text-4xl text-slate-600 dark:text-slate-300 max-w-5xl mx-auto leading-relaxed font-light tracking-wide">
              Experience the perfect blend of{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium">advanced technology</span>
              {" "}and{" "}
              <span className="text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text font-medium">human-centered design</span>
              {" "}for effortless daily wellness.
            </p>
          </div>
        </div>
        
        {/* Ultra-premium feature showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Feature 1 - Enhanced */}
          <div className="group relative">
            {/* Sophisticated glow effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-purple-600/15 rounded-[2rem] blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 rounded-3xl"></div>
            
            <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-white/60 dark:border-slate-700/60 group-hover:border-blue-200/70 dark:group-hover:border-blue-800/70 group-hover:-translate-y-2">
              {/* Premium icon design */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Mail className="text-white h-10 w-10" />
                </div>
                {/* Elegant step indicator */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-sm">01</span>
                </div>
              </div>
              
              <h3 className="font-quicksand font-black text-3xl text-slate-900 dark:text-white mb-6 leading-tight">
                Intelligent Insights
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xl leading-relaxed font-light mb-6">
                Receive personalized wellness prompts and thoughtful questions delivered to your inbox each morning, designed to inspire meaningful reflection.
              </p>
              
              {/* Feature highlight */}
              <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Daily personalized content</span>
              </div>
            </div>
          </div>
          
          {/* Feature 2 - Enhanced */}
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/15 via-pink-600/10 to-rose-600/15 rounded-[2rem] blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-600/5 rounded-3xl"></div>
            
            <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 border border-white/60 dark:border-slate-700/60 group-hover:border-purple-200/70 dark:group-hover:border-purple-800/70 group-hover:-translate-y-2">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Reply className="text-white h-10 w-10" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-sm">02</span>
                </div>
              </div>
              
              <h3 className="font-quicksand font-black text-3xl text-slate-900 dark:text-white mb-6 leading-tight">
                Seamless Journaling
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xl leading-relaxed font-light mb-6">
                Transform your thoughts into beautiful journal entries simply by replying to emails. No apps to download, no complex interfaces to learn.
              </p>
              
              <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Email-based simplicity</span>
              </div>
            </div>
          </div>
          
          {/* Feature 3 - Enhanced */}
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600/15 via-teal-600/10 to-cyan-600/15 rounded-[2rem] blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5 rounded-3xl"></div>
            
            <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 border border-white/60 dark:border-slate-700/60 group-hover:border-emerald-200/70 dark:group-hover:border-emerald-800/70 group-hover:-translate-y-2">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <BookOpen className="text-white h-10 w-10" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-sm">03</span>
                </div>
              </div>
              
              <h3 className="font-quicksand font-black text-3xl text-slate-900 dark:text-white mb-6 leading-tight">
                Premium Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xl leading-relaxed font-light mb-6">
                Access sophisticated insights into your wellness journey with beautiful visualizations, mood tracking, and personalized growth recommendations.
              </p>
              
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Advanced insights dashboard</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Premium bottom section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-white shadow-sm"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full border-2 border-white shadow-sm"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Trusted by 10,000+ wellness enthusiasts</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
