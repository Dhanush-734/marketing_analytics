import { useState, type FormEvent } from 'react';
import { User, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { DragonTattooOverlay } from './DragonTattooOverlay';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusStep, setStatusStep] = useState('AUTHENTICATING...');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    const isValid = username.trim().toLowerCase() === 'admin' && password === 'admin123';

    // Initialize loading state & step animation
    setIsLoading(true);
    setIsSuccess(false);
    setProgress(15);
    setStatusStep('AUTHENTICATING...');

    // Step 1: Verifying credentials (200ms)
    setTimeout(() => {
      setProgress(40);
      setStatusStep('VERIFYING CREDENTIALS...');
    }, 220);

    // Step 2: Process authentication & validation result (500ms)
    setTimeout(() => {
      if (isValid) {
        setProgress(70);
        setStatusStep('CONNECTING TO ANALYTICS PLATFORM...');

        setTimeout(() => {
          setProgress(90);
          setStatusStep('LOADING DASHBOARD...');

          setTimeout(() => {
            setProgress(100);
            setStatusStep('WELCOME TO INSIGHT INNOVATORS');
            setIsSuccess(true);

            setTimeout(() => {
              onLoginSuccess();
            }, 500);
          }, 320);
        }, 280);

      } else {
        // Stop animation immediately on error & return user to form
        setIsLoading(false);
        setProgress(0);
        setErrorMsg('Invalid Username or Password. Please try admin / admin123.');
      }
    }, 520);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      
      {/* Dragon Tattoo Low-Opacity Background Overlay */}
      <DragonTattooOverlay />

      {/* Ambient Animated Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 right-10 w-96 h-96 rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-24 left-10 w-96 h-96 rounded-full bg-purple-600/20 blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 relative overflow-hidden">
        
        {/* PREMIUM LOADING & PROGRESS OVERLAY */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl z-30 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in duration-200">
            
            {/* Centered Insight Innovators Logo */}
            <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl shadow-xl shadow-blue-500/20 animate-pulse">
              <Logo size={56} showText={false} />
            </div>

            {/* Brand Title & Status Message */}
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold tracking-tight text-white uppercase">
                Insight <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Innovators</span>
              </h2>
              <p className="text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase transition-all duration-300">
                {statusStep}
              </p>
            </div>

            {/* Premium Animated Progress Bar */}
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono font-extrabold text-slate-400">
                <span className="uppercase tracking-wider">PROGRESS</span>
                <span className="text-blue-400 font-bold">{progress}%</span>
              </div>

              <div className="w-full h-3 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-300 ease-out shadow-md shadow-blue-500/30 relative overflow-hidden"
                />
              </div>
            </div>

            {/* SUCCESS BADGE */}
            {isSuccess && (
              <div className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 rounded-full shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span className="tracking-wider uppercase">AUTHENTICATION SUCCESSFUL</span>
              </div>
            )}

          </div>
        )}

        {/* Header / Logo */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl shadow-inner">
            <Logo size={44} showText={false} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">
              Insight <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Innovators</span>
            </h1>
            <span className="text-[9px] font-bold text-slate-400 tracking-[0.25em] uppercase block mt-1">
              Marketing ROI Analytics Platform
            </span>
          </div>
        </div>

        {/* Error Alert Badge */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-2.5 text-red-400 text-xs font-semibold animate-in fade-in duration-200">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-1">
              Username
            </label>
            <div className="relative flex items-center">
              <User size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (admin)"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (admin123)"
                required
                className="w-full pl-10 pr-10 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold rounded-2xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In to Platform
                <ArrowRight size={15} />
              </span>
            )}
          </button>
        </form>

        {/* Credentials Tip Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <ShieldCheck size={12} />
            <span>Snowflake Architecture Protected</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            Default Credentials: <span className="text-blue-400 font-bold">admin</span> / <span className="text-purple-400 font-bold">admin123</span>
          </p>
        </div>

      </div>
    </div>
  );
}
