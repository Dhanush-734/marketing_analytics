import { LayoutDashboard, Layers, BarChart3, Users, Settings } from 'lucide-react';

interface StickyBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function StickyBottomNav({ activeTab, setActiveTab }: StickyBottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'channels', label: 'Channels', icon: <Layers size={18} /> },
    { id: 'campaigns', label: 'Campaigns', icon: <BarChart3 size={18} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-card/85 backdrop-blur-xl border-t border-border/60 z-40 flex items-center justify-around md:hidden px-2 shadow-2xl select-none">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative ${
              isActive
                ? 'text-primary scale-105 font-bold'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {isActive && (
              <span className="absolute top-0 w-8 h-0.5 bg-primary rounded-full animate-pulse" />
            )}
            <div className={`${isActive ? 'text-primary' : 'text-muted/80'}`}>
              {item.icon}
            </div>
            <span className="text-[9px] mt-0.5 font-medium tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
