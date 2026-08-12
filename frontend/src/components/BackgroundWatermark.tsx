export function BackgroundWatermark() {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[650px] lg:w-[800px] h-[500px] sm:h-[650px] lg:h-[800px] pointer-events-none z-0 opacity-[0.035] dark:opacity-[0.045] select-none overflow-hidden transition-all duration-300">
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full transform -rotate-6"
      >
        <defs>
          <linearGradient id="watermarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        
        {/* Emblem ring */}
        <path
          d="M 370,140 A 160,160 0 1,0 345,305"
          fill="none"
          stroke="url(#watermarkGrad)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Nodes and lines */}
        <path
          d="M 185,185 L 205,150 L 225,160 L 245,125"
          fill="none"
          stroke="url(#watermarkGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="185" cy="185" r="7" fill="url(#watermarkGrad)" />
        <circle cx="205" cy="150" r="7" fill="url(#watermarkGrad)" />
        <circle cx="225" cy="160" r="7" fill="url(#watermarkGrad)" />
        <circle cx="245" cy="125" r="7" fill="url(#watermarkGrad)" />

        {/* 3D Pillars */}
        <polygon points="215,200 235,190 235,340 215,340" fill="url(#watermarkGrad)" />
        <polygon points="235,190 255,180 255,340 235,340" fill="url(#watermarkGrad)" />

        <polygon points="270,150 290,140 290,340 270,340" fill="url(#watermarkGrad)" />
        <polygon points="290,140 310,130 310,340 290,340" fill="url(#watermarkGrad)" />

        {/* Growth Arrow */}
        <path
          d="M 215,270 L 260,220 L 285,240 L 380,145"
          fill="none"
          stroke="url(#watermarkGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon points="360,135 395,130 390,165" fill="url(#watermarkGrad)" />
      </svg>
    </div>
  );
}
