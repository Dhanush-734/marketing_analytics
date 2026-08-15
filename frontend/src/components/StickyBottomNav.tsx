import { LayoutDashboard, Layers, BarChart3, Users, Settings } from 'lucide-react';

interface StickyBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode?: boolean;
}

export function StickyBottomNav({ activeTab, setActiveTab, darkMode }: StickyBottomNavProps) {
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
      <div
        className="fixed bottom-16 left-0 right-0 h-6 pointer-events-none md:hidden z-40"
        style={{
          background: darkMode
            ? 'linear-gradient(to top, rgba(11, 15, 25, 0.7), transparent)'
            : 'linear-gradient(to top, rgba(255, 255, 255, 0.7), transparent)'
        }}
      />

      {/* Glassmorphism Sticky Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 h-16 border-t z-50 grid grid-cols-5 items-center md:hidden px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] select-none w-full max-w-full overflow-hidden"
        style={{
          backgroundColor: darkMode ? 'rgba(19, 26, 46, 0.94)' : 'rgba(255, 255, 255, 0.94)',
          borderColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(226, 232, 240, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const labelColor = isActive
            ? 'text-primary font-extrabold'
            : darkMode
            ? 'text-slate-400 font-semibold'
            : 'text-slate-600 font-semibold';

          const iconColor = isActive
            ? 'text-primary scale-110 drop-shadow-xs'
            : darkMode
            ? 'text-slate-400'
            : 'text-slate-600';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              className="flex flex-col items-center justify-center h-full w-full min-h-[44px] min-w-0 transition-all duration-150 active:scale-95 cursor-pointer px-0.5"
            >
              <div className={`${iconColor} transition-transform`}>
                {item.icon}
              </div>
              <span className={`text-[8.5px] xs:text-[9.5px] mt-1 tracking-tight text-center truncate max-w-full block leading-none ${labelColor}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
