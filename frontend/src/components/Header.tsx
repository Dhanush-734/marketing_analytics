import { useState, useRef, useEffect } from 'react';
import { Database, RefreshCw, Search, Sun, Moon, Menu, X, LogOut, LayoutDashboard, Layers, TrendingUp, Users, Mail, Sparkles, Activity, Info, Settings as SettingsIcon } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  onLogout?: () => void;
}

const SEARCH_TARGETS = [
  { id: 'dashboard', label: 'Executive Overview', category: 'Dashboard Page', icon: <LayoutDashboard size={14} />, keywords: ['dashboard', 'executive', 'overview', 'kpi', 'revenue'] },
  { id: 'channels', label: 'Multi-Channel ROI', category: 'Analytics Page', icon: <Layers size={14} />, keywords: ['channels', 'roi', 'multi-channel', 'spend', 'roas'] },
  { id: 'prediction', label: 'Campaign Performance Prediction', category: 'AI & ML Page', icon: <TrendingUp size={14} />, keywords: ['prediction', 'predict', 'forecast', 'ml', 'model'] },
  { id: 'customers', label: 'Customer Segmentation', category: 'CRM Page', icon: <Users size={14} />, keywords: ['customers', 'segmentation', 'demographics', 'india', 'map'] },
  { id: 'email', label: 'Email Analytics', category: 'Marketing Page', icon: <Mail size={14} />, keywords: ['email', 'campaigns', 'open rate', 'funnel', 'subscribers'] },
  { id: 'copilot', label: 'INSIGHTS AI', category: 'AI Assistant', icon: <Sparkles size={14} />, keywords: ['copilot', 'ai', 'insights', 'query', 'assistant'] },
  { id: 'sql', label: 'SQL Analytics Workspace', category: 'Developer Page', icon: <Database size={14} />, keywords: ['sql', 'query', 'snowflake', 'database', 'terminal'] },
  { id: 'apistatus', label: 'Data Connection Status', category: 'Infrastructure', icon: <Activity size={14} />, keywords: ['api', 'status', 'connection', 'snowflake', 'telemetry'] },
  { id: 'about', label: 'About & Team', category: 'Info Page', icon: <Info size={14} />, keywords: ['about', 'team', 'creators', 'architects', 'dhanush'] },
  { id: 'settings', label: 'Platform Settings', category: 'System Page', icon: <SettingsIcon size={14} />, keywords: ['settings', 'config', 'preferences', 'theme', 'options'] }
];

export function Header({
  activeTab,
  setActiveTab,
  isLoading,
  onRefresh,
  darkMode,
  setDarkMode,
  setMobileOpen,
  onLogout,
}: HeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Overview';
      case 'channels': return 'Multi-Channel ROI';
      case 'prediction': return 'Campaign Performance Prediction';
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

  const filteredTargets = searchQuery.trim() === ''
    ? []
    : SEARCH_TARGETS.filter(t => 
        t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const handleSelectTab = (tabId: string) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    }
    setSearchQuery('');
    setShowDropdown(false);
    setMobileSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredTargets.length > 0) {
      handleSelectTab(filteredTargets[0].id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages (e.g. Settings, Prediction...)..."
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

      {/* Middle segment: Desktop Interactive Global Search Bar */}
      <div className="hidden md:flex items-center relative w-64 xl:w-80 mx-2" ref={dropdownRef}>
        <Search size={13} className="absolute left-3 text-muted pointer-events-none z-10" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder="Global BI Search (e.g. Settings)..."
          className="w-full pl-8 pr-8 py-2 border border-border rounded-xl text-[10px] bg-background/40 text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowDropdown(false);
            }}
            className="absolute right-2.5 text-muted hover:text-foreground p-0.5 cursor-pointer z-10"
          >
            <X size={12} />
          </button>
        )}

        {/* Floating Search Results Dropdown */}
        {showDropdown && filteredTargets.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-64 overflow-y-auto">
            <div className="px-3 py-1 text-[8.5px] font-extrabold text-muted uppercase tracking-wider border-b border-border/40 mb-1">
              Quick Navigation
            </div>
            {filteredTargets.map((target) => (
              <button
                key={target.id}
                onClick={() => handleSelectTab(target.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-hover transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                    {target.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-foreground block truncate group-hover:text-primary transition-colors">
                      {target.label}
                    </span>
                    <span className="text-[8.5px] font-medium text-muted block truncate">
                      {target.category}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                  Go
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right segment: Controls & Profile */}
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
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-extrabold text-emerald-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Snowflake Live</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh telemetry"
          className="p-2 border border-border text-muted hover:text-foreground bg-card rounded-xl hover:bg-hover transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin text-primary' : ''} />
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 border border-border text-muted hover:text-foreground bg-card rounded-xl hover:bg-hover transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
        >
          {darkMode ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-indigo-600" />}
        </button>

        {/* Logout button */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 border border-border text-muted hover:text-rose-500 bg-card rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
          >
            <LogOut size={13} />
          </button>
        )}

      </div>

    </header>
  );
}
