/**
 * Interactive animated chat bubbles component
 * Used for LLM interactions empty state
 */
export function InteractiveChatCard() {
  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-background via-background/95 to-primary/5 rounded-xl overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.02]">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50 animate-pulse" />
      
      {/* Chat bubble 1 - Left */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-32 h-20 rounded-[2rem] border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm animate-float" style={{ animationDelay: '0s' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2rem] blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
      </div>
      
      {/* Chat bubble 2 - Right */}
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-36 h-24 rounded-[2.5rem] border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-primary/10 backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-[2.5rem] blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
      </div>
      
      {/* Pink glow orb */}
      <div className="absolute top-1/4 right-1/3 w-20 h-20 rounded-full bg-gradient-to-br from-pink-400/30 to-purple-400/30 blur-2xl animate-float" style={{ animationDelay: '0.5s' }} />
      
      {/* Sparkle particles */}
      <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-primary/60 animate-twinkle" style={{ animationDelay: '0s' }} />
      <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-accent/60 animate-twinkle" style={{ animationDelay: '0.7s' }} />
      <div className="absolute bottom-1/3 left-1/2 w-1 h-1 rounded-full bg-primary/50 animate-twinkle" style={{ animationDelay: '1.4s' }} />
    </div>
  );
}
