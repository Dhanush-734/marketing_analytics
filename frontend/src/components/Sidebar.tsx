import {
  LayoutDashboard,
  Layers,
  BarChart3,
  Users,
  Mail,
  ChevronLeft,
  ChevronRight,
  Settings,
  Activity,
  X,
  Info,
  Sparkles,
  Database
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'channels', label: 'Multi-Channel ROI', icon: <Layers size={18} /> },
    { id: 'campaigns', label: 'Campaign Breakdown', icon: <BarChart3 size={18} /> },
    { id: 'customers', label: 'Customer Segmentation', icon: <Users size={18} /> },
    { id: 'email', label: 'Email Analytics', icon: <Mail size={18} /> },
    { id: 'copilot', label: 'Gemini AI Copilot', icon: <Sparkles size={18} /> },
    { id: 'sql', label: 'SQL Analytics', icon: <Database size={18} /> },
    { id: 'apistatus', label: 'API Status', icon: <Activity size={18} /> },
    { id: 'about', label: 'About & Team', icon: <Info size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false); // close drawer on mobile selection
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-sidebar transition-all duration-300 flex flex-col justify-between select-none ${
          mobileOpen 
            ? 'w-64 translate-x-0' 
            : 'md:translate-x-0 -translate-x-full'
        } ${
          isOpen ? 'md:w-64' : 'md:w-20'
        }`}
      >
        {/* Top Header Logo */}
        <div>
          <div className="h-16 flex items-center px-4 justify-between border-b border-border/40">
            <div className="flex items-center gap-3 overflow-hidden">
              <Logo size={28} showText={isOpen || mobileOpen} />
            </div>
            
            {/* Close buttons */}
            {mobileOpen ? (
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg hover:bg-hover text-muted hover:text-foreground md:hidden"
              >
                <X size={16} />
              </button>
            ) : (
              isOpen && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-hover text-muted hover:text-foreground hidden md:block"
                >
                  <ChevronLeft size={16} />
                </button>
              )
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1 mt-4">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative cursor-pointer ${
                    isActive
                      ? 'bg-hover text-primary'
                      : 'text-muted hover:bg-hover/50 hover:text-foreground'
                  }`}
                >
                  <div className={`shrink-0 transition-transform duration-150 ${isActive ? 'scale-110 text-primary' : 'text-muted'}`}>
                    {item.icon}
                  </div>
                  {(isOpen || mobileOpen) && <span className="truncate">{item.label}</span>}
                  
                  {/* Collapsed Tooltip (Desktop only) */}
                  {!isOpen && !mobileOpen && (
                    <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-150 origin-left bg-slate-900 dark:bg-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-md z-50 pointer-events-none font-medium whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-3 flex justify-end">
          {/* Expand toggle */}
          {!isOpen && !mobileOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="w-full flex items-center justify-center py-2 text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          )}
          {isOpen && (
            <span className="text-[9px] font-bold text-muted w-full text-center py-2">v1.2.0 Enterprise</span>
          )}
        </div>
      </aside>
    </>
  );
}
