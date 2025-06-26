import { Container } from "@/components/ui/container";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      text: "Flappy has transformed how I journal. The personalized insights feel so thoughtful, and being able to just reply to an email has made me consistent for the first time ever.",
      author: "Jamie D.",
      duration: "Journaling for 3 months",
      initials: "JD",
      rating: 5,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      text: "What I love most is Flappy's personality. The thoughtful guidance mixed with warmth makes each interaction meaningful yet enjoyable. It's like having a wise, caring friend.",
      author: "Riley L.",
      duration: "Journaling for 6 months", 
      initials: "RL",
      rating: 5,
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      text: "As someone with anxiety, having Flappy's gentle guidance helps me process my thoughts without feeling overwhelmed. The interface is so calming and beautifully designed.",
      author: "Alex T.",
      duration: "Journaling for 1 year",
      initials: "AT", 
      rating: 5,
      gradient: "from-rose-500 to-pink-600"
    }
  ];

  return (
    <section id="testimonials" className="relative py-24 md:py-32 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-rose-100/30 to-pink-200/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-emerald-100/30 to-teal-200/30 rounded-full blur-xl"></div>
      
      <Container>
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-3 py-1 mb-6 bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            User Stories
          </div>
          <h2 className="font-quicksand font-bold text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white mb-8 leading-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Join a growing community of mindful individuals who've transformed their wellness journey with Flappy's guidance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 group-hover:border-emerald-300/50 dark:group-hover:border-emerald-600/50 h-full flex flex-col">
                
                {/* Quote icon */}
                <div className="mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex text-amber-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                
                {/* Testimonial text */}
                <blockquote className="text-slate-700 dark:text-slate-200 text-lg leading-relaxed mb-8 flex-grow">
                  "{testimonial.text}"
                </blockquote>
                
                {/* Author info */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-semibold text-sm">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <div className="font-quicksand font-semibold text-slate-900 dark:text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-sm">
                      {testimonial.duration}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
            Ready to join them?
          </p>
          <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Free to start, upgrade anytime</span>
          </div>
        </div>
      </Container>
    </section>
  );
}