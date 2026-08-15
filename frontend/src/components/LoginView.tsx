import { useState, useEffect, type FormEvent } from 'react';
import { User, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sun, Moon, TrendingUp, Zap, BarChart2 } from 'lucide-react';
import { Logo } from './Logo';
import { DragonTattooOverlay } from './DragonTattooOverlay';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoModal, setInfoModal] = useState<string | null>(null);
  
  // Loading & Progress Animation States
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusStep, setStatusStep] = useState('AUTHENTICATING...');
  const [isSuccess, setIsSuccess] = useState(false);

  // Synchronize Dark / Light Mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    const isValid = username.trim().toLowerCase() === 'admin' && password === 'admin123';

    // Initialize loading progress state
    setIsLoading(true);
    setIsSuccess(false);
    setProgress(15);
    setStatusStep('AUTHENTICATING...');

    // Step 1: Verifying credentials
    setTimeout(() => {
      setProgress(40);
      setStatusStep('VERIFYING CREDENTIALS...');
    }, 220);

    // Step 2: Validate & proceed through pipeline
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
        // Stop animation immediately on error & return user to login form
        setIsLoading(false);
        setProgress(0);
        setErrorMsg('Invalid Username or Password. Please try admin / admin123.');
      }
    }, 520);
  };

  const handleSnowflakeSSO = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMsg('');
    
    setIsLoading(true);
    setIsSuccess(false);
    setProgress(20);
    setStatusStep('INITIATING SNOWFLAKE SSO...');

    setTimeout(() => {
      setProgress(60);
      setStatusStep('VERIFYING ACCOUNTADMIN SSO TOKENS...');
      
      setTimeout(() => {
        setProgress(90);
        setStatusStep('AUTHENTICATING SNOWFLAKE WAREHOUSE...');

        setTimeout(() => {
          setProgress(100);
          setStatusStep('WELCOME TO INSIGHT INNOVATORS');
          setIsSuccess(true);

          setTimeout(() => {
            onLoginSuccess();
          }, 500);
        }, 300);
      }, 300);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#070A13] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans transition-colors duration-300">
      
      {/* ------------------------------------------------------------- */}
      {/* BLACK AND WHITE DRAGON TATTOO BACKGROUND OVERLAY */}
      {/* ------------------------------------------------------------- */}
      <DragonTattooOverlay />

      {/* ------------------------------------------------------------- */}
      {/* AMBIENT LIGHTING & DATA VISUALIZATION GRAPHICS */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Soft Ambient Radial Glow Orbs */}
        <div className="absolute -top-32 -right-20 w-[550px] h-[550px] rounded-full bg-blue-600/15 dark:bg-blue-600/20 blur-[150px]" />
        <div className="absolute -bottom-32 -left-20 w-[550px] h-[550px] rounded-full bg-purple-600/15 dark:bg-purple-600/20 blur-[160px]" />

        {/* Futuristic SVG Waves & Grid Network Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-15 dark:opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="loginGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400/40 dark:text-slate-700/40" />
              <circle cx="40" cy="40" r="1" fill="currentColor" className="text-blue-500/40" />
            </pattern>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Grid Network */}
          <rect width="100%" height="100%" fill="url(#loginGrid)" />

          {/* Abstract Data Wave Lines */}
          <path
            d="M -100 400 Q 200 250 500 450 T 1100 350 T 1700 500"
            fill="none"
            stroke="url(#waveGrad)"
            strokeWidth="2.5"
            className="animate-pulse"
          />
        </svg>

        {/* FLOATING DEKSTOP DATA METRIC BADGES */}
        <div className="hidden lg:flex justify-between items-center w-full max-w-6xl px-12 absolute inset-0 mx-auto pointer-events-none z-0">
          
          {/* Left Metric Widget */}
          <div className="w-64 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-2 transform -rotate-1 translate-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <BarChart2 size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Platform Capability</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">Data Driven Analytics</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Transforming raw telemetry into actionable marketing ROI insights.
            </p>
          </div>

          {/* Right Metrics Widgets */}
          <div className="space-y-4 translate-y-[-20px] transform rotate-1">
            <div className="w-56 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <TrendingUp size={20} />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">98.7%</h4>
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Data Accuracy Sync</span>
              </div>
            </div>

            <div className="w-56 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">2.45x</h4>
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">ROI Improvement</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOP RIGHT CONTROLS (THEME TOGGLE) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-5 right-5 z-20">
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-md cursor-pointer flex items-center justify-center"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CENTER LOGIN CARD */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full max-w-[420px] z-10 relative">
        
        {/* Outer Glow Border Gradient Wrapper */}
        <div className="p-[1px] rounded-3xl bg-gradient-to-b from-blue-500/30 via-purple-500/20 to-slate-200/40 dark:to-slate-800/40 shadow-2xl">
          
          <div className="w-full bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* PREMIUM PROGRESS LOADING OVERLAY */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl z-30 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in duration-200">
                
                {/* Centered Insight Innovators Logo */}
                <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl shadow-xl shadow-blue-500/20 animate-pulse">
                  <Logo size={56} showText={false} />
                </div>

                {/* Brand Title & Status Message */}
                <div className="space-y-1">
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                    Insight <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Innovators</span>
                  </h2>
                  <p className="text-[11px] font-mono font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase transition-all duration-300">
                    {statusStep}
                  </p>
                </div>

                {/* Premium Animated Progress Bar */}
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono font-extrabold text-slate-500 dark:text-slate-400">
                    <span className="uppercase tracking-wider">AUTHENTICATION</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{progress}%</span>
                  </div>

                  <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-300 ease-out shadow-md shadow-blue-500/30 relative overflow-hidden"
                    />
                  </div>
                </div>

                {/* SUCCESS BADGE */}
                {isSuccess && (
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 rounded-full shadow-lg shadow-emerald-500/20 animate-bounce">
                    <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="tracking-wider uppercase">AUTHENTICATION SUCCESSFUL</span>
                  </div>
                )}

              </div>
            )}

            {/* Info Modal Tooltip (for Forgot Password) */}
            {infoModal && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-6 text-center animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3 max-w-xs">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Account Recovery</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{infoModal}</p>
                  <button
                    type="button"
                    onClick={() => setInfoModal(null)}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}

            {/* LOGO & BRAND HEADER */}
            <div className="flex flex-col items-center text-center space-y-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-600/15 to-purple-600/15 border border-blue-500/30 rounded-2xl shadow-inner shadow-blue-500/10">
                <Logo size={46} showText={false} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  Insight <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Innovators</span>
                </h1>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-500 dark:text-slate-400 tracking-[0.22em] uppercase block mt-1">
                  Marketing ROI Analytics Platform
                </span>
                <div className="w-10 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-2.5 opacity-70" />
              </div>
            </div>

            {/* ERROR ALERT BADGE */}
            {errorMsg && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-2.5 text-red-600 dark:text-red-400 text-xs font-semibold animate-in fade-in duration-200">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 block pl-1">
                  Username
                </label>
                <div className="relative flex items-center">
                  <User size={16} className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-100/80 dark:bg-slate-950/70 border border-slate-300/80 dark:border-slate-800 rounded-2xl text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 block pl-1">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-10 pr-11 py-3 bg-slate-100/80 dark:bg-slate-950/70 border border-slate-300/80 dark:border-slate-800 rounded-2xl text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Additional Options: Remember me & Forgot password */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/40 bg-slate-100 dark:bg-slate-900 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setInfoModal('For password reset or credentials assistance, please contact your Snowflake Administrator.')}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* PRIMARY LOGIN BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-5 mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs tracking-widest uppercase rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  Sign In to Platform
                  <ArrowRight size={15} />
                </span>
              </button>
            </form>

            {/* DIVIDER */}
            <div className="relative flex items-center justify-center my-5">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              <span className="absolute bg-white dark:bg-slate-900 px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* SNOWFLAKE SSO BUTTON */}
            <button
              type="button"
              onClick={handleSnowflakeSSO}
              className="w-full py-3 px-4 bg-slate-100/90 dark:bg-slate-950/60 hover:bg-slate-200/90 dark:hover:bg-slate-800/80 border border-slate-300/80 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <ShieldCheck size={16} className="text-blue-500 shrink-0" />
              <span className="tracking-wide">Sign in with Snowflake SSO</span>
            </button>

            {/* SECURITY BADGE & DISCREET CREDENTIALS TIP */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 text-center space-y-2.5">
              
              <div className="inline-flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <ShieldCheck size={13} className="shrink-0" />
                <span className="tracking-wider uppercase">Snowflake Architecture Protected</span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => { setUsername('admin'); setPassword('admin123'); setErrorMsg(''); }}
                  title="Click to auto-fill default admin credentials"
                  className="text-[10px] text-slate-500 dark:text-slate-400 font-mono hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Default Credentials: <span className="text-blue-600 dark:text-blue-400 font-bold underline">admin</span> / <span className="text-purple-600 dark:text-purple-400 font-bold underline">admin123</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
