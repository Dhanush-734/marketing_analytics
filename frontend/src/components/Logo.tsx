import logoImg from '../assets/logo.png';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = '', size = 40, showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logoImg}
        alt="Insight Innovators Brand Logo"
        style={{ width: `${size}px`, height: `${size}px` }}
        className="shrink-0 select-none rounded-2xl object-cover drop-shadow-md border border-slate-700/50"
      />

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
