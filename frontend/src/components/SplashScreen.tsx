import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { DragonTattooOverlay } from './DragonTattooOverlay';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING PLATFORM');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 0% -> INITIALIZING PLATFORM
    setProgress(5);

    const timer1 = setTimeout(() => {
      setProgress(25);
      setStatusText('LOADING ANALYTICS ENGINE');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(50);
      setStatusText('CONNECTING DATA SERVICES');
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(75);
      setStatusText('PREPARING DASHBOARD');
    }, 1400);

    const timer4 = setTimeout(() => {
      setProgress(100);
      setStatusText('READY');
    }, 1900);

    const timer5 = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onFinish();
      }, 400); // 400ms smooth fade-out transition
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-50 dark:bg-[#070A13] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 select-none font-sans transition-opacity duration-400 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Low-Opacity Dragon Tattoo Background */}
      <DragonTattooOverlay />

      {/* Ambient Animated Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -right-20 w-[550px] h-[550px] rounded-full bg-blue-600/15 dark:bg-blue-600/20 blur-[150px]" />
        <div className="absolute -bottom-32 -left-20 w-[550px] h-[550px] rounded-full bg-purple-600/15 dark:bg-purple-600/20 blur-[160px]" />
      </div>

      {/* Center Content Container */}
      <div className="w-full max-w-sm flex flex-col items-center justify-center text-center space-y-6 z-10 relative px-4">
        
        {/* Prominent Logo with Pulsing Glow */}
        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-2xl shadow-blue-500/20 animate-pulse">
          <Logo size={64} showText={false} />
        </div>

        {/* Brand Name & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Insight <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Innovators</span>
          </h1>
          <span className="text-[9.5px] sm:text-[10.5px] font-extrabold text-slate-500 dark:text-slate-400 tracking-[0.25em] uppercase block">
            Marketing ROI Analytics Platform
          </span>
        </div>

        {/* Premium Progress Bar & Status */}
        <div className="w-full space-y-2.5 pt-2">
          
          <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-300 ease-out shadow-md shadow-blue-500/30 relative overflow-hidden"
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono font-extrabold">
            <span className="text-slate-500 dark:text-slate-400 uppercase tracking-widest">{statusText}</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{progress}%</span>
          </div>

        </div>

      </div>
    </div>
  );
}
