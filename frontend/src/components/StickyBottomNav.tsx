import { LayoutDashboard, Layers, BarChart3, Users, Settings } from 'lucide-react';

interface StickyBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function StickyBottomNav({ activeTab, setActiveTab }: StickyBottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'channels', label: 'Channels', icon: <Layers size={16} /> },
    { id: 'campaigns', label: 'Campaigns', icon: <BarChart3 size={16} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-card border-t border-border/80 z-40 grid grid-cols-5 items-center md:hidden px-1 shadow-lg select-none w-full max-w-full overflow-hidden">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-0 transition-all duration-150 active:scale-95 cursor-pointer px-0.5 ${
              isActive
                ? 'text-primary font-bold'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <div className={`${isActive ? 'text-primary scale-110' : 'text-muted/80'} transition-transform`}>
              {item.icon}
            </div>
            <span className="text-[8px] xs:text-[9px] mt-0.5 font-semibold tracking-tight text-center truncate max-w-full block leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
