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
    <>
      {/* Subtle top gradient transition overlay */}
      <div className="fixed bottom-16 left-0 right-0 h-6 bg-gradient-to-t from-white/60 dark:from-background/60 to-transparent pointer-events-none md:hidden z-40" />

      {/* Glassmorphism Sticky Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-card/85 border-t border-slate-200 dark:border-border/60 z-50 grid grid-cols-5 items-center md:hidden px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] select-none w-full max-w-full overflow-hidden"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center h-full w-full min-h-[44px] min-w-0 transition-all duration-150 active:scale-95 cursor-pointer px-0.5 ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <div className={`${isActive ? 'text-primary scale-110 drop-shadow-xs' : 'text-muted/80'} transition-transform`}>
                {item.icon}
              </div>
              <span className={`text-[8.5px] xs:text-[9.5px] mt-1 font-semibold tracking-tight text-center truncate max-w-full block leading-none ${isActive ? 'text-primary font-extrabold' : 'text-muted'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
