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
        className="shrink-0 select-none drop-shadow-md"
      >
        <defs>
          {/* Rich Royal Blue to Electric Purple Background Gradient */}
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E52F4" />
            <stop offset="45%" stopColor="#4F38F3" />
            <stop offset="100%" stopColor="#9322E7" />
          </linearGradient>

          {/* Crisp White/Silver Icon Fill Gradient */}
          <linearGradient id="logoIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          {/* Subtle Outer Drop Shadow */}
          <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. Rounded Square Gradient Container (Matching User's Logo Image) */}
        <rect
          x="16"
          y="16"
          width="480"
          height="480"
          rx="105"
          fill="url(#logoBgGrad)"
          filter="url(#logoShadow)"
        />

        {/* Inner Highlight Border */}
        <rect
          x="18"
          y="18"
          width="476"
          height="476"
          rx="103"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.3"
          strokeWidth="2.5"
        />

        {/* 2. Main Upper Surrounding Circular Arc */}
        <path
          d="M 130 335 A 160 160 0 1 1 370 175"
          fill="none"
          stroke="url(#logoIconGrad)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* 3. Bottom Complementary Arc Curve */}
        <path
          d="M 140 375 A 155 155 0 0 0 350 375"
          fill="none"
          stroke="url(#logoIconGrad)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* 4. Three Ascending Bar Chart Pillars */}
        {/* Left Bar (Short) */}
        <rect x="175" y="295" width="40" height="75" rx="8" fill="url(#logoIconGrad)" />

        {/* Middle Bar (Medium) */}
        <rect x="236" y="235" width="40" height="135" rx="8" fill="url(#logoIconGrad)" />

        {/* Right Bar (Tall) */}
        <rect x="297" y="185" width="40" height="185" rx="8" fill="url(#logoIconGrad)" />

        {/* 5. Upward Growth Arrow Line Across Chart */}
        <path
          d="M 138 340 L 222 245 L 262 275 L 365 168"
          fill="none"
          stroke="url(#logoIconGrad)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Arrow Head at Top-Right */}
        <path
          d="M 318 164 L 372 155 L 362 208"
          fill="none"
          stroke="url(#logoIconGrad)"
          strokeWidth="20"
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
