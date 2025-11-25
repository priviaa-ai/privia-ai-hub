export function InteractiveWaveCard() {
  return (
    <div className="relative w-full h-48 rounded-2xl overflow-hidden glass-card group cursor-pointer transition-all duration-500 hover:scale-105">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-gradient-shift" />
      
      {/* Animated waves */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-32">
          <svg className="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path 
              className="fill-primary/30 animate-wave"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
          <svg className="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path 
              className="fill-accent/20 animate-wave-delayed"
              d="M0,224L48,208C96,192,192,160,288,154.7C384,149,480,171,576,186.7C672,203,768,213,864,197.3C960,181,1056,139,1152,128C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl" />
      
      {/* Grid overlay for tech feel */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }} />
      </div>
    </div>
  );
}

// Add these keyframes to your index.css or tailwind config
// @keyframes gradient-shift {
//   0%, 100% { transform: translateX(0%); }
//   50% { transform: translateX(-20%); }
// }
// @keyframes wave {
//   0% { transform: translateX(0) translateY(0); }
//   100% { transform: translateX(-50%) translateY(-10px); }
// }
// @keyframes wave-delayed {
//   0% { transform: translateX(0) translateY(0); }
//   100% { transform: translateX(-60%) translateY(-5px); }
// }