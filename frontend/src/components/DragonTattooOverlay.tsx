export function DragonTattooOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none opacity-[0.08] dark:opacity-[0.12] transition-opacity duration-500"
    >
      <svg
        viewBox="0 0 1000 1000"
        className="w-[950px] h-[950px] max-w-[98vw] max-h-[98vh] text-slate-100 transform scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path id="dragonTextRingUpper" d="M 220 500 A 280 280 0 1 1 780 500" />
          <path id="dragonTextRingLower" d="M 780 500 A 280 280 0 1 1 220 500" />
          
          <linearGradient id="bwDragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Outer Tattoo Rings */}
        <circle cx="500" cy="500" r="470" stroke="url(#bwDragonGrad)" strokeWidth="2.5" strokeDasharray="14 8 4 8" />
        <circle cx="500" cy="500" r="450" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
        <circle cx="500" cy="500" r="425" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
        <circle cx="500" cy="500" r="390" stroke="currentColor" strokeWidth="2" strokeDasharray="20 10" />

        {/* Outer Tribal Flame Teeth & Spikes */}
        {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 500 500)`}>
            <polygon points="500,32 506,65 500,80 494,65" fill="currentColor" opacity="0.9" />
            <line x1="500" y1="80" x2="500" y2="110" stroke="currentColor" strokeWidth="1" />
          </g>
        ))}

        {/* Curved Tattoo Text Ring */}
        <text fontSize="20" fontWeight="900" letterSpacing="12" fill="currentColor" className="font-mono uppercase">
          <textPath href="#dragonTextRingUpper" startOffset="50%" textAnchor="middle">
            ✦ INSIGHT INNOVATORS · DRAGON ANALYTICS ✦
          </textPath>
        </text>

        <text fontSize="15" fontWeight="800" letterSpacing="10" fill="currentColor" className="font-mono uppercase opacity-75">
          <textPath href="#dragonTextRingLower" startOffset="50%" textAnchor="middle">
            MARKETING ROI PLATFORM · SNOWFLAKE TELEMETRY
          </textPath>
        </text>

        {/* Inner Tattoo Geometric Border */}
        <circle cx="500" cy="500" r="360" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="500" cy="500" r="340" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />

        {/* Dragon Silhouette & Tribal Paths */}
        <g transform="translate(500, 500) scale(0.9) translate(-500, -500)">
          
          {/* Dragon Main Coiled Body */}
          <path
            d="M 500 170 
               C 620 170, 730 240, 750 350 
               C 770 470, 680 580, 560 600 
               C 440 620, 330 530, 320 420 
               C 310 310, 400 220, 510 240 
               C 600 260, 650 340, 620 420 
               C 590 500, 490 520, 430 460 
               C 380 400, 410 330, 470 320
               C 520 310, 550 350, 530 390
               C 510 420, 470 420, 460 390"
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dragon Outer Spine Spikes */}
          <path
            d="M 500 150 Q 520 130 540 160 Q 570 130 590 170 Q 630 140 650 190 Q 690 170 710 220 Q 750 210 760 260 Q 790 270 780 320 Q 810 350 780 400 Q 800 440 760 480 Q 770 530 720 560 Q 710 610 650 630 Q 620 670 560 670 Q 500 700 450 670"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Dragon Scale Accents */}
          {[
            { cx: 580, cy: 220 }, { cx: 640, cy: 260 }, { cx: 680, cy: 320 },
            { cx: 700, cy: 390 }, { cx: 680, cy: 460 }, { cx: 630, cy: 520 },
            { cx: 560, cy: 550 }, { cx: 480, cy: 550 }, { cx: 410, cy: 520 },
            { cx: 370, cy: 460 }, { cx: 370, cy: 380 }, { cx: 410, cy: 310 }
          ].map((sc, i) => (
            <path
              key={i}
              d={`M ${sc.cx - 12} ${sc.cy} Q ${sc.cx} ${sc.cy + 12} ${sc.cx + 12} ${sc.cy}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              opacity="0.8"
            />
          ))}

          {/* Dragon Head */}
          <g transform="translate(430, 110)">
            <path d="M 70 60 C 90 20, 130 -10, 160 0 C 130 30, 100 50, 85 75" fill="currentColor" />
            <path d="M 50 60 C 30 20, -10 -10, -40 0 C -10 30, 20 50, 35 75" fill="currentColor" />
            <path d="M 30 75 Q 60 40 90 75 Q 110 100 110 120 Q 90 145 60 140 Q 30 145 10 120 Q 10 100 30 75 Z" fill="currentColor" />
            <polygon points="40,85 55,92 42,98" fill="none" stroke="currentColor" strokeWidth="2" />
            <polygon points="80,85 65,92 78,98" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M 20 125 C -20 140, -50 130, -80 160 C -40 150, -10 140, 15 132" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M 100 125 C 140 140, 170 130, 200 160 C 160 150, 130 140, 105 132" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Dragon Claws */}
          <g transform="translate(680, 260) rotate(30)">
            <path d="M 0 0 Q 30 -20 50 -10 Q 20 10 0 0 M 0 10 Q 35 0 60 20 Q 25 25 0 10 M -10 20 Q 20 30 45 55 Q 10 40 -10 20" fill="currentColor" />
          </g>

          <g transform="translate(320, 500) rotate(-130)">
            <path d="M 0 0 Q 30 -20 50 -10 Q 20 10 0 0 M 0 10 Q 35 0 60 20 Q 25 25 0 10 M -10 20 Q 20 30 45 55 Q 10 40 -10 20" fill="currentColor" />
          </g>
        </g>
      </svg>
    </div>
  );
}
