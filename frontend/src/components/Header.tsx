import { Database, RefreshCw, Bell, Search, Sun, Moon, Menu } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  isLoading: boolean;
  onRefresh: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export function Header({
  activeTab,
  isLoading,
  onRefresh,
  darkMode,
  setDarkMode,
  setMobileOpen,
}: HeaderProps) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Overview';
      case 'channels': return 'Multi-Channel ROI';
      case 'campaigns': return 'Campaign Breakdown';
      case 'customers': return 'Customer Segmentation';
      case 'email': return 'Email Analytics';
      case 'copilot': return 'INSIGHTS AI';
      case 'sql': return 'SQL Analytics Workspace';
      case 'apistatus': return 'API Status Monitor';
      case 'about': return 'About & Team';
      case 'settings': return 'Platform Settings';
      default: return 'ROI Analytics';
    }
  };

  return (
    <header
      className="h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 border-b border-border/45 transition-colors duration-200 select-none"
      style={{
        backgroundColor: darkMode ? 'rgba(11, 15, 25, 0.75)' : 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >

      {/* Left segment: Mobile menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg border border-border bg-card hover:bg-hover md:hidden text-foreground shrink-0 cursor-pointer"
        >
          <Menu size={16} />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-sm font-extrabold text-foreground tracking-tight leading-none uppercase">
            {getTitle()}
          </h1>
        </div>
      </div>

      {/* Middle segment: Mock Search Bar (Desktop only) */}
      <div className="hidden md:flex items-center relative w-64 xl:w-80">
        <Search size={13} className="absolute left-3 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Global BI Search..."
          className="w-full pl-8 pr-4 py-1.5 border border-border rounded-xl text-[10px] bg-background/40 text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
      </div>

      {/* Right segment: Controls & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Connected Status Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-xl text-green-700 dark:text-green-400 text-[10px] font-bold">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <Database size={11} className="shrink-0" />
          <span className="hidden lg:inline">Snowflake Connected</span>
        </div>

        {/* Sync trigger */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 border border-border text-muted hover:text-foreground bg-card rounded-xl hover:bg-hover disabled:opacity-50 transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
        </button>

        {/* Notifications indicator */}
        <div className="relative cursor-pointer">
          <button className="p-2 border border-border text-muted hover:text-foreground bg-card rounded-xl hover:bg-hover cursor-pointer">
            <Bell size={13} />
          </button>
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </div>

        {/* Theme Toggle switch */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 border border-border text-muted hover:text-foreground bg-card rounded-xl hover:bg-hover transition-colors cursor-pointer"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun size={13} className="text-amber-500" /> : <Moon size={13} />}
        </button>

        {/* Separator */}
        <div className="h-5 w-px bg-border hidden sm:block" />

        {/* User avatar */}
        <div className="flex items-center gap-2 select-none group cursor-pointer pl-1">
          <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold text-xs flex items-center justify-center">
            A
          </div>
          <div className="hidden lg:flex flex-col text-left leading-none">
            <span className="text-[10px] font-bold text-foreground">Admin</span>
            <span className="text-[8px] font-semibold text-muted mt-0.5">Account Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
}


