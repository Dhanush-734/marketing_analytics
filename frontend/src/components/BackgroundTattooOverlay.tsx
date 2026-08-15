export function BackgroundTattooOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden select-none opacity-[0.035] dark:opacity-[0.06] transition-opacity duration-500"
    >
      <svg
        viewBox="0 0 1000 1000"
        className="w-[900px] h-[900px] max-w-[95vw] max-h-[95vh] text-primary dark:text-primary transform rotate-6 scale-110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="textPathUpper"
            d="M 200 500 A 300 300 0 1 1 800 500"
          />
          <path
            id="textPathLower"
            d="M 800 500 A 300 300 0 1 1 200 500"
          />
          <linearGradient id="tattooGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Outer Geometric Compass Ring */}
        <circle cx="500" cy="500" r="460" stroke="url(#tattooGrad)" strokeWidth="2" strokeDasharray="12 8 4 8" />
        <circle cx="500" cy="500" r="440" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
        <circle cx="500" cy="500" r="410" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Outer Tribal Radial Spikes */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 500 500)`}>
            <polygon points="500,45 508,80 500,95 492,80" fill="currentColor" opacity="0.8" />
            <line x1="500" y1="95" x2="500" y2="160" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="500" cy="170" r="3" fill="currentColor" />
          </g>
        ))}

        {/* Curved Watermark Text Rings */}
        <text fontSize="22" fontWeight="900" letterSpacing="12" fill="currentColor" className="font-mono uppercase">
          <textPath href="#textPathUpper" startOffset="50%" textAnchor="middle">
            ✦ INSIGHT INNOVATORS ✦
          </textPath>
        </text>

        <text fontSize="16" fontWeight="800" letterSpacing="10" fill="currentColor" className="font-mono uppercase opacity-75">
          <textPath href="#textPathLower" startOffset="50%" textAnchor="middle">
            DATA · ANALYTICS · IMPACT
          </textPath>
        </text>

        {/* Mid Geometric Shield / Diamond Tattoo Structure */}
        <circle cx="500" cy="500" r="280" stroke="currentColor" strokeWidth="2" strokeDasharray="20 10 5 10" />
        <circle cx="500" cy="500" r="240" stroke="currentColor" strokeWidth="1" />

        {/* Central Geometric Cyber Lotus / Diamond Wings */}
        <g transform="rotate(45 500 500)">
          <rect x="360" y="360" width="280" height="280" rx="20" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <rect x="390" y="390" width="220" height="220" rx="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 4" fill="none" />
        </g>

        <g transform="rotate(0 500 500)">
          <rect x="375" y="375" width="250" height="250" rx="15" stroke="currentColor" strokeWidth="2" fill="none" />
        </g>

        {/* Sharp Tribal Diamond Core */}
        <polygon points="500,290 540,460 710,500 540,540 500,710 460,540 290,500 460,460" stroke="currentColor" strokeWidth="3" fill="none" />
        <polygon points="500,340 525,475 660,500 525,525 500,660 475,525 340,500 475,475" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />

        {/* Center Emblem Core */}
        <circle cx="500" cy="500" r="60" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <circle cx="500" cy="500" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        <polygon points="500,465 520,500 500,535 480,500" fill="currentColor" opacity="0.85" />
        <circle cx="500" cy="500" r="8" fill="currentColor" />

        {/* Corner Flourishes */}
        <path d="M 150 150 L 300 300 M 150 150 L 250 150 M 150 150 L 150 250" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <path d="M 850 150 L 700 300 M 850 150 L 750 150 M 850 150 L 850 250" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <path d="M 150 850 L 300 700 M 150 850 L 250 850 M 150 850 L 150 750" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <path d="M 850 850 L 700 700 M 850 850 L 750 850 M 850 850 L 850 750" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      </svg>
    </div>
  );
}
