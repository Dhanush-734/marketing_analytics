import { useState } from 'react';
import { Database, RefreshCw, Search, Sun, Moon, Menu, X, LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  isLoading: boolean;
  onRefresh: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  onLogout?: () => void;
}

export function Header({
  activeTab,
  isLoading,
  onRefresh,
  darkMode,
  setDarkMode,
  setMobileOpen,
  onLogout,
}: HeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Overview';
      case 'channels': return 'Multi-Channel ROI';
      case 'campaigns': return 'Campaign Breakdown';
      case 'customers': return 'Customer Segmentation';
      case 'email': return 'Email Analytics';
      case 'copilot': return 'INSIGHTS AI';
      case 'sql': return 'SQL Analytics Workspace';
      case 'apistatus': return 'Data Connection Status';
      case 'about': return 'About & Team';
      case 'settings': return 'Platform Settings';
      default: return 'ROI Analytics';
    }
  };

  return (
    <header
      className="h-16 px-3 sm:px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 border-b border-border/45 transition-colors duration-200 select-none w-full max-w-full overflow-hidden"
      style={{
        backgroundColor: darkMode ? 'rgba(11, 15, 25, 0.88)' : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >

      {/* Left segment: Mobile menu button & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open Navigation Drawer"
          className="min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center rounded-xl border border-border bg-card hover:bg-hover md:hidden text-foreground shrink-0 cursor-pointer transition-transform active:scale-95 shadow-xs"
        >
          <Menu size={17} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-[11px] sm:text-xs md:text-sm font-extrabold text-foreground tracking-tight leading-none uppercase truncate max-w-[95px] xs:max-w-[125px] sm:max-w-none">
            {getTitle()}
          </h1>
        </div>
      </div>

      {/* Expandable Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-0 h-16 bg-card px-4 flex items-center gap-2 z-40 border-b border-border md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <Search size={15} className="text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search campaigns, metrics, channels..."
            autoFocus
            className="flex-1 bg-transparent text-xs text-foreground placeholder-muted focus:outline-none"
          />
          <button
            onClick={() => setMobileSearchOpen(false)}
            aria-label="Close search"
            className="p-2 text-muted hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Middle segment: Desktop Search Bar */}
      <div className="hidden md:flex items-center relative w-64 xl:w-80 mx-2">
        <Search size={13} className="absolute left-3 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Global BI Search..."
          className="w-full pl-8 pr-4 py-2 border border-border rounded-xl text-[10px] bg-background/40 text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
      </div>

      {/* Right segment: Controls & Profile with uniform 8px gap */}
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 shrink-0">
        
        {/* Mobile search trigger icon */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          aria-label="Search BI Platform"
          className="p-2 border border-border text-muted hover:text-foreground bg-card rounded-xl hover:bg-hover md:hidden transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
        >
          <Search size={13} />
        </button>

        {/* Snowflake Connected Status Indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-xl text-green-700 dark:text-green-400 text-[10px] font-bold shrink-0">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <Database size={11} className="shrink-0" />
          <span className="hidden lg:inline">Snowflake Connected</span>
        </div>

        {/* Sync trigger button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Refresh Data Telemetry"
          className="p-2 border border-border text-muted hover:text-foreground bg-card rounded-xl hover:bg-hover disabled:opacity-50 transition-colors cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center active:scale-95 shrink-0"
          title="Refresh Data"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
        </button>

        {/* Theme Toggle switch */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 border border-border text-muted hover:text-foreground bg-card rounded-xl hover:bg-hover transition-colors cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center active:scale-95 shrink-0"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun size={13} className="text-amber-500" /> : <Moon size={13} />}
        </button>

        {/* User avatar profile & Logout */}
        <div className="flex items-center gap-1.5 select-none shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold text-xs flex items-center justify-center shrink-0">
            A
          </div>
          <div className="hidden lg:flex flex-col text-left leading-none">
            <span className="text-[10px] font-bold text-foreground">Admin</span>
            <span className="text-[8px] font-semibold text-muted mt-0.5">Insight Innovators</span>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              aria-label="Sign Out of Platform"
              title="Sign Out"
              className="p-1.5 border border-border text-muted hover:text-red-400 bg-card rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition-colors cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center shrink-0"
            >
              <LogOut size={13} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
