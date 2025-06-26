import flappyMascotImage from "@assets/August9teen_a_funny_pelican_mascot_logo_for_an_ai_agent_super_683392fe-ba8f-4dd9-a789-d9c339b36d02_3.png";

export function FlappyAvatar({ className = "w-64 h-64" }: { className?: string }) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* Sophisticated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10 rounded-full blur-2xl animate-pulse"></div>
      
      {/* Premium floating sparkles */}
      <div className="absolute top-8 left-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-70"></div>
      <div className="absolute top-12 right-16 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-60" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-16 left-12 w-1 h-1 bg-indigo-400 rounded-full animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-12 right-8 w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse opacity-70" style={{animationDelay: '0.5s'}}></div>
      
      {/* Flappy mascot image */}
      <div className="relative z-10 group">
        <img 
          src={flappyMascotImage} 
          alt="Flappy - Your AI Wellness Companion" 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))',
            animation: 'float 4s ease-in-out infinite'
          }}
        />
      </div>
      

    </div>
  );
}