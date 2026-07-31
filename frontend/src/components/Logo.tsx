interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = '', size = 40, showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 512 512"
        width={size}
        height={size}
        className="shrink-0 select-none"
      >
        <defs>
          {/* Primary Blue-to-Purple Gradient */}
          <linearGradient id="logoPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          {/* Circular Ring Gradient */}
          <linearGradient id="logoCircleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--logo-white)" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>

        {/* 1. Circular Emblem Outline */}
        <path
          d="M 370,140 A 160,160 0 1,0 345,305"
          fill="none"
          stroke="url(#logoCircleGrad)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* 2. Data Nodes and Connected Analytics Lines (Upper Left) */}
        <path
          d="M 185,185 L 205,150 L 225,160 L 245,125"
          fill="none"
          stroke="#2563EB"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <circle cx="185" cy="185" r="7" fill="var(--logo-white)" />
        <circle cx="205" cy="150" r="7" fill="#2563EB" />
        <circle cx="225" cy="160" r="7" fill="#2563EB" />
        <circle cx="245" cy="125" r="7" fill="#7C3AED" />

        {/* 3. Stylized "I" Pillars (Insight Innovators) */}
        {/* Left "I" Pillar (with 3D bevel effect) */}
        <polygon points="215,200 235,190 235,340 215,340" fill="var(--logo-gray)" />
        <polygon points="235,190 255,180 255,340 235,340" fill="var(--logo-white)" />

        {/* Right "I" Pillar (with 3D bevel effect) */}
        <polygon points="270,150 290,140 290,340 270,340" fill="var(--logo-gray)" />
        <polygon points="290,140 310,130 310,340 290,340" fill="var(--logo-white)" />

        {/* 4. Upward Growth Arrow (Winding through and shooting up) */}
        <path
          d="M 215,270 L 260,220 L 285,240 L 380,145"
          fill="none"
          stroke="url(#logoPrimaryGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon points="360,135 395,130 390,165" fill="url(#logoPrimaryGrad)" />
      </svg>

      {showText && (
        <div className="flex flex-col text-left leading-none font-sans select-none">
          <span className="font-extrabold text-[13px] tracking-tight text-foreground uppercase">
            Insight <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Innovators</span>
          </span>
          <span className="text-[7.5px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.25em] uppercase mt-1">
            Data • Insight • Impact
          </span>
        </div>
      )}
    </div>
  );
}
