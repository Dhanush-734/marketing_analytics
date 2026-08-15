import { motion, type Variants } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Database,
  Sliders,
  Activity,
  Info,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  Building2,
  DollarSign,
  Calculator,
  Globe
} from 'lucide-react';

const cardHoverVariants: Variants = {
  hover: {
    y: -4,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

export function SettingsView() {
  return (
    <div className="space-y-6 md:space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-card p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/15 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
            <SettingsIcon size={12} />
            System Management
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
            Platform Settings
          </h1>
          <p className="text-xs text-muted mt-1 font-medium">
            Configure analytics platform preferences and data parameters
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shrink-0 text-xs font-semibold text-emerald-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Snowflake Data</span>
        </div>
      </div>

      {/* 2-Column Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

        {/* SECTION 1: PROJECT INFORMATION */}
        <motion.div
          variants={cardHoverVariants}
          whileHover="hover"
          className="bg-card p-6 rounded-3xl shadow-[var(--card-shadow)] border border-transparent space-y-5"
        >
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-3.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <FolderGit2 size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Project Configuration
              </h3>
              <span className="text-[9px] text-muted block mt-0.5">Primary platform identifiers and parameters</span>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Project Name</span>
              <span className="font-bold text-foreground text-right max-w-[65%]">
                Marketing Campaign &amp; Multi-Channel ROI Analytics Platform
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Organization</span>
              <span className="font-bold text-primary flex items-center gap-1.5">
                <Building2 size={13} />
                Insight Innovators
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Analytics Type</span>
              <span className="font-bold text-foreground">Marketing Campaign &amp; Multi-Channel ROI Analytics</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Locale</span>
              <span className="font-bold text-foreground flex items-center gap-1">
                <Globe size={13} className="text-primary" />
                India (IN)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted font-medium">Data Source</span>
              <span className="font-bold text-primary flex items-center gap-1.5">
                <Database size={13} />
                Snowflake Data Warehouse
              </span>
            </div>
          </div>
        </motion.div>

        {/* SECTION 2: ANALYTICS PREFERENCES */}
        <motion.div
          variants={cardHoverVariants}
          whileHover="hover"
          className="bg-card p-6 rounded-3xl shadow-[var(--card-shadow)] border border-transparent space-y-5"
        >
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-3.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Sliders size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Analytics Preferences
              </h3>
              <span className="text-[9px] text-muted block mt-0.5">Calculations &amp; metrics configuration</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Reporting Currency</span>
              <span className="font-bold text-foreground font-mono flex items-center gap-1">
                <DollarSign size={13} className="text-emerald-500" />
                INR (₹)
              </span>
            </div>
            <div className="space-y-1.5 border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium block">ROI Formula</span>
              <div className="p-2 bg-background border border-border rounded-xl font-mono text-[11px] text-primary font-bold flex items-center gap-2">
                <Calculator size={14} />
                ((Revenue - Spend) / Spend) × 100
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-muted font-medium block">Primary Metrics</span>
              <div className="flex flex-wrap gap-1.5">
                {['Revenue', 'Spend', 'ROI', 'CTR', 'Conversions', 'Customer Count'].map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 3: DATA & SYSTEM STATUS */}
        <motion.div
          variants={cardHoverVariants}
          whileHover="hover"
          className="bg-card p-6 rounded-3xl shadow-[var(--card-shadow)] border border-transparent space-y-5"
        >
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-3.5">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
              <Activity size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Platform Status
              </h3>
              <span className="text-[9px] text-muted block mt-0.5">Real-time infrastructure health</span>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Snowflake Connection</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 size={13} />
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Data Source</span>
              <span className="font-bold font-mono text-foreground">MARKETING_ETL</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Customer Records</span>
              <span className="font-bold text-primary font-mono">Dynamic (50,000 Verified)</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Analytics Engine</span>
              <span className="font-bold text-emerald-500">Live</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted font-medium">Data Status</span>
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-500" />
                Live Snowflake Data
              </span>
            </div>
          </div>
        </motion.div>

        {/* SECTION 4: ABOUT THE PLATFORM */}
        <motion.div
          variants={cardHoverVariants}
          whileHover="hover"
          className="bg-card p-6 rounded-3xl shadow-[var(--card-shadow)] border border-transparent space-y-4"
        >
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-3.5">
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
              <Info size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                About This Platform
              </h3>
              <span className="text-[9px] text-muted block mt-0.5">Insight Innovators project statement</span>
            </div>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            Insight Innovators&apos; Marketing Campaign &amp; Multi-Channel ROI Analytics Platform provides centralized campaign performance analysis, ROI measurement, customer segmentation, email analytics and AI-assisted business insights using Snowflake-powered analytics.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
