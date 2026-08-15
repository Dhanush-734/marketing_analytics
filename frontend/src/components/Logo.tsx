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
        className="shrink-0 select-none drop-shadow-lg"
      >
        <defs>
          {/* Royal Blue to Electric Violet Gradient matching exact brand image */}
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1752F3" />
            <stop offset="45%" stopColor="#4A37EE" />
            <stop offset="100%" stopColor="#9C17EC" />
          </linearGradient>

          {/* Crisp Pure White Icon Fill */}
          <linearGradient id="logoIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>

          {/* Soft Outer Shadow */}
          <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. Rounded Square Background App Icon Tile */}
        <rect
          x="16"
          y="16"
          width="480"
          height="480"
          rx="108"
          fill="url(#logoBgGrad)"
          filter="url(#logoShadow)"
        />

        {/* Inner Highlight Ring Border */}
        <rect
          x="18"
          y="18"
          width="476"
          height="476"
          rx="106"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.32"
          strokeWidth="2.5"
        />

        {/* 2. Main Sweeping Circular Ring Arc */}
        <path
          d="M 330 365 A 160 160 0 1 1 370 175"
          fill="none"
          stroke="url(#logoIconGrad)"
          strokeWidth="19"
          strokeLinecap="round"
        />

        {/* Bottom Arc Arrow Tail Tip */}
        <path
          d="M 315 352 L 350 372 L 340 348"
          fill="none"
          stroke="url(#logoIconGrad)"
          strokeWidth="17"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Ascending Bar Chart Pillars */}
        {/* Bar 1 (Short) */}
        <rect x="165" y="295" width="42" height="70" rx="7" fill="url(#logoIconGrad)" />

        {/* Bar 2 (Medium) */}
        <rect x="227" y="235" width="42" height="130" rx="7" fill="url(#logoIconGrad)" />

        {/* Bar 3 (Tall) */}
        <rect x="289" y="180" width="42" height="185" rx="7" fill="url(#logoIconGrad)" />

        {/* 4. Trending Line Across Chart */}
        <path
          d="M 135 340 L 210 260 L 252 290 L 365 170"
          fill="none"
          stroke="url(#logoIconGrad)"
          strokeWidth="21"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Upward Arrowhead at Top-Right */}
        <path
          d="M 315 160 L 372 155 L 362 212"
          fill="none"
          stroke="url(#logoIconGrad)"
          strokeWidth="21"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
