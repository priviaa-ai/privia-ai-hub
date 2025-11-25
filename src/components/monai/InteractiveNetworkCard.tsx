/**
 * Interactive animated network/location pin component
 * Used for embeddings and logs empty state
 */
export function InteractiveNetworkCard() {
  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-background via-background/95 to-primary/5 rounded-xl overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.02]">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent opacity-50 animate-pulse" />
      
      {/* Center location pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-16 h-20 animate-bounce-slow">
          {/* Pin head */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-primary bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm">
            <div className="absolute inset-2 rounded-full bg-primary/40 animate-ping" />
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary to-accent" />
          </div>
          {/* Pin point */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary/80" />
        </div>
      </div>
      
      {/* Network lines radiating from center */}
      <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 0 8px rgba(var(--primary-rgb), 0.3))' }}>
        {/* Horizontal lines */}
        <line x1="0" y1="50%" x2="40%" y2="50%" stroke="url(#gradient1)" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '0s' }} />
        <line x1="60%" y1="50%" x2="100%" y2="50%" stroke="url(#gradient1)" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '0s' }} />
        
        {/* Diagonal lines */}
        <line x1="15%" y1="20%" x2="42%" y2="45%" stroke="url(#gradient2)" strokeWidth="1.5" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
        <line x1="58%" y1="55%" x2="85%" y2="80%" stroke="url(#gradient2)" strokeWidth="1.5" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
        <line x1="85%" y1="20%" x2="58%" y2="45%" stroke="url(#gradient2)" strokeWidth="1.5" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
        <line x1="42%" y1="55%" x2="15%" y2="80%" stroke="url(#gradient2)" strokeWidth="1.5" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
        
        {/* Define gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Connection nodes */}
      <div className="absolute top-1/2 left-[15%] w-3 h-3 rounded-full bg-accent border-2 border-accent/40 animate-pulse" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/2 right-[15%] w-3 h-3 rounded-full bg-primary border-2 border-primary/40 animate-pulse" style={{ animationDelay: '0.3s' }} />
      <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-accent/70 animate-twinkle" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-[20%] right-[15%] w-2 h-2 rounded-full bg-primary/70 animate-twinkle" style={{ animationDelay: '0.8s' }} />
    </div>
  );
}
