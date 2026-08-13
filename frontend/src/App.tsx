import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StickyBottomNav } from './components/StickyBottomNav';
import { KPICards } from './components/KPICards';
import { DataTable } from './components/DataTable';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardSkeleton } from './components/Loader';
import { ErrorAlert } from './components/ErrorAlert';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RevenueAreaChart,
  SpendBarChart,
  RoiSmoothLineChart,
  CtrRadialProgressChart,
  CustomerSegmentsDonutChart,
  CampaignPerformanceHorizontalBarChart,
  RevenueTrendGradientAreaChart,
  EmailFunnelChart,
  TrafficSourcesTreemap,
  MarketingChannelsStackedBarChart
} from './components/PerformanceCharts';
import { Send, Eye, MousePointerClick, Database, CheckCircle, Code, User, Settings as SettingsIcon, Info, Terminal, Cpu, Layers, GitBranch, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { Logo } from './components/Logo';
import { GeminiCopilotView } from './components/GeminiCopilotView';
import { SQLAnalyticsView } from './components/SQLAnalyticsView';
import type { Variants } from 'framer-motion';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

const cardHoverVariants: Variants = {
  hover: {
    y: -4,
    scale: 1.015,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.25, ease: 'easeOut' }
  }
};

const formatVolumeCount = (val: number) => {
  if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
  return val.toLocaleString();
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const { kpis, channels, campaigns, customers, email, monthlyData, loading, error, refetch } = useDashboardData();

  // Sync dark mode styles
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Sync mobile viewport drawer
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
          <Header activeTab={activeTab} isLoading={loading} onRefresh={refetch} darkMode={darkMode} setDarkMode={setDarkMode} setMobileOpen={setMobileOpen} />
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
          <Header activeTab={activeTab} isLoading={loading} onRefresh={refetch} darkMode={darkMode} setDarkMode={setDarkMode} setMobileOpen={setMobileOpen} />
          <ErrorAlert message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  const totalCustomersCount = customers.reduce((acc, c) => acc + c.total_customers, 0);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200 pb-14 md:pb-0 font-sans">

      {/* Navigation panel */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main panel panel */}
      <div className={`flex-1 transition-all duration-300 min-h-screen flex flex-col ${sidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
        <Header
          activeTab={activeTab}
          isLoading={loading}
          onRefresh={refetch}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setMobileOpen={setMobileOpen}
        />

        <main className="p-4 md:p-6 lg:p-8 w-full space-y-6 md:space-y-8 overflow-hidden flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6 md:space-y-8"
            >

              {/* VIEW: EXECUTIVE DASHBOARD */}
              {activeTab === 'dashboard' && (
                <>
                  {/* Top: 6 Distinct KPI cards */}
                  <KPICards
                    revenue={kpis.revenue}
                    spend={kpis.spend}
                    roi={kpis.roi}
                    ctr={kpis.ctr}
                    campaignsCount={campaigns.length}
                    customersCount={totalCustomersCount}
                  />

                  {/* Middle Row (Asymmetrical layout) */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Middle Left: Large Revenue Area Chart (col-span-3) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[340px] lg:col-span-3 border border-transparent"
                    >
                      <div className="mb-3">
                        <h3 className="text-xs font-bold text-foreground">Revenue Earnings Area</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Snowflake sales telemetry</span>
                      </div>
                      <div className="flex-1 min-h-0">
                        <RevenueAreaChart monthlyData={monthlyData} />
                      </div>
                    </motion.div>

                    {/* Middle Right: Customer loyalty segments (col-span-2) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[340px] lg:col-span-2 border border-transparent"
                    >
                      <div className="mb-3">
                        <h3 className="text-xs font-bold text-foreground">Customer loyalty share</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Purchases attribution ratios</span>
                      </div>
                      <div className="flex-1 min-h-0">
                        <CustomerSegmentsDonutChart customers={customers} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom Row (Asymmetrical layout) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* Bottom Left: Campaign Performance Horizontal Bars (col-span-2) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[320px] lg:col-span-2 border border-transparent"
                    >
                      <div className="mb-3">
                        <h3 className="text-xs font-bold text-foreground">Campaigns Revenue Yield</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Top campaigns returns</span>
                      </div>
                      <div className="flex-1 min-h-0">
                        <CampaignPerformanceHorizontalBarChart campaigns={campaigns} />
                      </div>
                    </motion.div>

                    {/* Bottom Middle: ROI Trend Line Chart (col-span-2) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[320px] lg:col-span-2 border border-transparent"
                    >
                      <div className="mb-3">
                        <h3 className="text-xs font-bold text-foreground">ROI Trend Analysis</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">MONTHLY ROI TREND</span>
                      </div>
                      <div className="flex-1 min-h-0">
                        <RoiSmoothLineChart monthlyData={monthlyData} />
                      </div>
                    </motion.div>

                    {/* Bottom Right: Radial Progress CTR (col-span-1) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col justify-between h-[320px] lg:col-span-1 border border-transparent"
                    >
                      <div className="mb-1">
                        <h3 className="text-xs font-bold text-foreground">Average CTR Gauge</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Click-through rate gauge</span>
                      </div>
                      <div className="flex-1 min-h-0">
                        <CtrRadialProgressChart ctr={kpis.ctr} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Last Row: campaigns table */}
                  <DataTable campaigns={campaigns} />
                </>
              )}

              {/* VIEW: MULTI-CHANNEL ROI */}
              {activeTab === 'channels' && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Spend: Vertical Bar Chart (Blue) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[350px] border border-transparent"
                    >
                      <div className="mb-3">
                        <h3 className="text-xs font-bold text-foreground">Spend Distribution</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Advertising cost by channel</span>
                      </div>
                      <div className="flex-1 min-h-0">
                        <SpendBarChart channels={channels} />
                      </div>
                    </motion.div>

                    {/* Marketing Channels: Stacked Bar (Multicolor) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[350px] border border-transparent"
                    >
                      <div className="mb-3">
                        <h3 className="text-xs font-bold text-foreground">Platform Stacked Revenue Performance</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Stacked cost vs income returns</span>
                      </div>
                      <div className="flex-1 min-h-0">
                        <MarketingChannelsStackedBarChart channels={channels} />
                      </div>
                    </motion.div>
                  </div>

                  <DataTable campaigns={campaigns} />
                </>
              )}

              {/* VIEW: CAMPAIGN BREAKDOWN */}
              {activeTab === 'campaigns' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Campaign Performance: Horizontal Bars (Pink) */}
                  <div className="lg:col-span-2 space-y-6">
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[350px] border border-transparent"
                    >
                      <div className="mb-3">
                        <h3 className="text-xs font-bold text-foreground">Top Campaigns Revenue Yield</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Campaigns sales yield breakdown</span>
                      </div>
                      <div className="flex-1 min-h-0">
                        <CampaignPerformanceHorizontalBarChart campaigns={campaigns} />
                      </div>
                    </motion.div>
                  </div>
                  <div className="lg:col-span-3">
                    <DataTable campaigns={campaigns} />
                  </div>
                </div>
              )}

              {/* VIEW: CUSTOMER SEGMENTATION */}
              {activeTab === 'customers' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Traffic Sources: Treemap (Cyan/Multicolor) */}
                  <motion.div
                    variants={cardHoverVariants}
                    whileHover="hover"
                    className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[360px] lg:col-span-2 border border-transparent"
                  >
                    <div className="mb-3">
                      <h3 className="text-xs font-bold text-foreground">Attraction Traffic Sources</h3>
                      <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Asymmetrical treemap of inbound acquisition channels</span>
                    </div>
                    <div className="flex-1 min-h-0">
                      <TrafficSourcesTreemap />
                    </div>
                  </motion.div>

                  {/* Customer segments details */}
                  <div className="lg:col-span-3 bg-card p-6 rounded-3xl shadow-[var(--card-shadow)] border border-transparent">
                    <div className="mb-6">
                      <h3 className="text-xs font-bold text-foreground">Attributed Segment Breakdown</h3>
                      <span className="text-[9px] text-muted uppercase tracking-wider block mt-0.5">Detailed CRM purchasers data</span>
                    </div>
                    <div className="space-y-4">
                      {customers.map((c, i) => {
                        const totalRev = customers.reduce((sum, curr) => sum + curr.total_revenue, 0);
                        const percentage = totalRev > 0 ? (c.total_revenue / totalRev) * 100 : 0;
                        return (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                              <span>{c.customer_segment}</span>
                              <span className="font-mono text-primary font-bold">{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-background rounded-full overflow-hidden">
                              <div
                                style={{ width: `${percentage}%` }}
                                className="h-full bg-primary rounded-full"
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted">
                              <span>Reach: {new Intl.NumberFormat('en-IN').format(c.total_customers)} purchasers</span>
                              <span>Sales: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(c.total_revenue)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: EMAIL CAMPAIGNS */}
              {activeTab === 'email' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card p-5 rounded-2xl shadow-[var(--card-shadow)] flex flex-col justify-between h-28">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-muted uppercase tracking-wide">Emails Dispatched</span>
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                          <Send size={14} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground leading-none mb-1">
                          {formatVolumeCount(email.emails_sent)}
                        </h3>
                        <span className="text-[8px] text-muted">Delivery volumes ({email.emails_sent.toLocaleString()} total)</span>
                      </div>
                    </div>

                    <div className="bg-card p-5 rounded-2xl shadow-[var(--card-shadow)] flex flex-col justify-between h-28">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-muted uppercase tracking-wide">Open Rate</span>
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                          <Eye size={14} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground leading-none mb-1">
                          {email.average_open_rate < 1 ? (email.average_open_rate * 100).toFixed(2) : email.average_open_rate.toFixed(2)}%
                        </h3>
                        <span className="text-[8px] text-muted">Total read counts ({email.emails_opened.toLocaleString()})</span>
                      </div>
                    </div>

                    <div className="bg-card p-5 rounded-2xl shadow-[var(--card-shadow)] flex flex-col justify-between h-28">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-muted uppercase tracking-wide">Clicks CTR</span>
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                          <MousePointerClick size={14} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground leading-none mb-1">
                          {email.average_click_rate < 1 ? (email.average_click_rate * 100).toFixed(2) : email.average_click_rate.toFixed(2)}%
                        </h3>
                        <span className="text-[8px] text-muted">Click-through conversion ({email.emails_clicked.toLocaleString()})</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Funnel chart left */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[340px] lg:col-span-2 border border-transparent"
                    >
                      <div className="mb-3">
                        <h3 className="text-xs font-bold text-foreground">Email Dispatch Funnel</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Sent vs Opened vs Clicked proportions</span>
                      </div>
                      <div className="flex-1 min-h-0">
                        <EmailFunnelChart email={email} />
                      </div>
                    </motion.div>

                    {/* Gradient Area Chart right */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[340px] lg:col-span-3 border border-transparent"
                    >
                      <div className="mb-3">
                        <h3 className="text-xs font-bold text-foreground">Revenue Trend Gradient</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Rolling monthly sales timeline</span>
                      </div>
                      <div className="flex-1 min-h-0">
                        <RevenueTrendGradientAreaChart monthlyData={monthlyData} />
                      </div>
                    </motion.div>
                  </div>
                </>
              )}

              {/* VIEW: GEMINI AI COPILOT */}
              {activeTab === 'copilot' && <GeminiCopilotView />}

              {/* VIEW: SQL ANALYTICS WORKSPACE */}
              {activeTab === 'sql' && <SQLAnalyticsView />}

              {/* VIEW: API STATUS MONITOR */}
              {activeTab === 'apistatus' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card p-5 rounded-2xl shadow-[var(--card-shadow)] flex items-center gap-4 border border-transparent">
                      <div className="p-2 bg-green-500/10 text-primary border border-green-500/20 rounded-xl shrink-0">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-muted block uppercase tracking-wider">REST Endpoints Status</span>
                        <span className="text-xs font-bold text-foreground">All APIs Online</span>
                      </div>
                    </div>

                    <div className="bg-card p-5 rounded-2xl shadow-[var(--card-shadow)] flex items-center gap-4 border border-transparent">
                      <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
                        <Database size={20} />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-muted block uppercase tracking-wider">Snowflake Database</span>
                        <span className="text-xs font-bold text-foreground">Connected (v10.24.101)</span>
                      </div>
                    </div>

                    <div className="bg-card p-5 rounded-2xl shadow-[var(--card-shadow)] flex items-center gap-4 border border-transparent">
                      <div className="p-2 bg-green-500/10 text-primary border border-green-500/20 rounded-xl shrink-0">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-muted block uppercase tracking-wider">Average API Latency</span>
                        <span className="text-xs font-bold text-foreground">~82ms (Optimized)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card p-6 rounded-2xl shadow-[var(--card-shadow)] flex flex-col border border-transparent">
                      <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Code size={12} className="text-primary" />
                        Live API Response Logs
                      </h4>
                      <div className="bg-background border border-border rounded-xl p-4 font-mono text-[9px] text-primary/95 h-60 overflow-y-auto space-y-2 select-text">
                        <div><span className="text-muted">[15:00:22]</span> GET /api/kpi - Status: 200 OK - Latency: 42ms</div>
                        <div><span className="text-muted">[15:00:22]</span> GET /api/dashboard - Status: 200 OK - Latency: 95ms</div>
                        <div><span className="text-muted">[15:00:23]</span> GET /api/channels - Status: 200 OK - Latency: 74ms</div>
                        <div><span className="text-muted">[15:00:23]</span> GET /api/campaigns - Status: 200 OK - Latency: 110ms</div>
                        <div><span className="text-muted">[15:00:23]</span> GET /api/customers - Status: 200 OK - Latency: 65ms</div>
                        <div><span className="text-muted">[15:00:24]</span> GET /api/email - Status: 200 OK - Latency: 58ms</div>
                        <div className="text-primary font-bold">&gt;&gt; Live sync active with Snowflake Data Warehouse. Listening for telemetry...</div>
                      </div>
                    </div>

                    <div className="bg-card p-6 rounded-2xl shadow-[var(--card-shadow)] flex flex-col border border-transparent">
                      <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Database size={12} className="text-primary" />
                        Snowflake Sync Info
                      </h4>
                      <div className="space-y-3 text-[11px]">
                        <div className="flex justify-between border-b border-border/60 pb-2">
                          <span className="text-muted">Database Name</span>
                          <span className="font-semibold">MARKETING_ANALYTICS</span>
                        </div>
                        <div className="flex justify-between border-b border-border/60 pb-2">
                          <span className="text-muted">Schema</span>
                          <span className="font-semibold">MARKETING_SCHEMA</span>
                        </div>
                        <div className="flex justify-between border-b border-border/60 pb-2">
                          <span className="text-muted">Warehouse</span>
                          <span className="font-semibold">MARKETING_WH (X-Small)</span>
                        </div>
                        <div className="flex justify-between border-b border-border/60 pb-2">
                          <span className="text-muted">Active Role</span>
                          <span className="font-semibold">ACCOUNTADMIN</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">User Account</span>
                          <span className="font-semibold">dhanush</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* platform settings view */}
              {activeTab === 'settings' && (
                <div className="bg-card p-6 rounded-3xl shadow-[var(--card-shadow)] max-w-xl mx-auto space-y-6 border border-transparent">
                  <div>
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <SettingsIcon size={14} className="text-primary" />
                      Platform Settings
                    </h3>
                    <span className="text-[9px] text-muted uppercase tracking-wider block mt-0.5">Configure layout and budgeting parameters</span>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <User size={12} className="text-primary" />
                      User Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] text-muted font-bold block mb-1 uppercase">Full Name</label>
                        <input
                          type="text"
                          defaultValue="Administrator"
                          className="w-full px-3 py-2 border border-border bg-background rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-muted font-bold block mb-1 uppercase">Security Role</label>
                        <input
                          type="text"
                          defaultValue="ACCOUNTADMIN"
                          disabled
                          className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-xs text-muted focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Database size={12} className="text-primary" />
                      Budget Targets
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] text-muted font-bold block mb-1 uppercase">Monthly Budget Cap</label>
                        <input
                          type="text"
                          defaultValue="₹5,00,00,000"
                          className="w-full px-3 py-2 border border-border bg-background rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-muted font-bold block mb-1 uppercase">Currency Symbol</label>
                        <select className="w-full px-2.5 py-2 border border-border bg-card rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                          <option value="INR" className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">INR (₹) - Default</option>
                          <option value="USD" className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">USD ($)</option>
                          <option value="EUR" className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">EUR (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => alert('Platform Settings Saved!')}
                      className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer active:scale-95"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW: ABOUT & TEAM */}
              {activeTab === 'about' && (
                <div className="space-y-8 select-none">
                  {/* About Section */}
                  <div className="bg-card p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-transparent relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative max-w-4xl space-y-4 font-sans">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/15 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-wider">
                        <Info size={11} />
                        About Insight Innovators
                      </div>
                      <h2 className="text-xl md:text-2xl font-extrabold text-foreground leading-tight tracking-tight">
                        Transforming Raw Business Data into Strategic Value
                      </h2>
                      <p className="text-xs md:text-sm text-muted leading-relaxed">
                        Insight Innovators is a student development team focused on building intelligent, data-driven software solutions using modern technologies. Our goal is to transform raw business data into meaningful insights through analytics, visualization, automation, and cloud technologies.
                      </p>
                      <p className="text-xs md:text-sm text-muted leading-relaxed">
                        This project demonstrates how marketing campaign data can be collected, processed, analyzed, and visualized to support better business decision-making. It combines data engineering, cloud warehousing, business intelligence, and web development into one integrated platform.
                      </p>
                      <p className="text-xs md:text-sm text-muted leading-relaxed">
                        Our mission is to create scalable, modern, and enterprise-ready analytics solutions that help organizations monitor campaign performance, measure ROI, understand customer behavior, and automate reporting processes.
                      </p>
                    </div>
                  </div>

                  {/* Workflow Pipeline */}
                  <div className="bg-card p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-transparent space-y-6">
                    <div>
                      <h3 className="text-xs md:text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <GitBranch size={16} className="text-primary animate-pulse" />
                        Project Data Pipeline & Workflow
                      </h3>
                      <span className="text-[9px] text-muted block mt-0.5 uppercase tracking-wide">END-TO-END DATA ORCHESTRATION & GOVERNANCE LIFECYCLE</span>
                    </div>

                    {/* Responsive Pipeline Flowchart */}
                    <div className="flex flex-col xl:flex-row gap-3 items-center justify-between relative py-2">

                      {/* Box 1 */}
                      <div className="w-full xl:w-36 min-h-[140px] bg-background/50 border border-border p-3.5 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center">
                        <div className="mx-auto w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-2">
                          <Terminal size={16} />
                        </div>
                        <h4 className="text-[10px] font-bold text-foreground">Marketing Source Data</h4>
                        <span className="text-[8px] text-muted block mt-1">Google • Meta • Email CSVs</span>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center text-muted shrink-0 xl:rotate-0 rotate-90 py-0.5">
                        <ArrowRight size={15} className="text-primary" />
                      </div>

                      {/* Box 2 */}
                      <div className="w-full xl:w-36 min-h-[140px] bg-background/50 border border-border p-3.5 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center">
                        <div className="mx-auto w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                          <Database size={16} />
                        </div>
                        <h4 className="text-[10px] font-bold text-foreground">MySQL Operational Database</h4>
                        <span className="text-[8px] text-muted block mt-1">Structured data storage</span>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center text-muted shrink-0 xl:rotate-0 rotate-90 py-0.5">
                        <ArrowRight size={15} className="text-primary" />
                      </div>

                      {/* Box 3 */}
                      <div className="w-full xl:w-36 min-h-[140px] bg-background/50 border border-border p-3.5 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center">
                        <div className="mx-auto w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2">
                          <Cpu size={16} />
                        </div>
                        <h4 className="text-[10px] font-bold text-foreground">Alteryx ETL & Data Preparation</h4>
                        <span className="text-[8px] text-muted block mt-1">Clean • Transform • Validate</span>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center text-muted shrink-0 xl:rotate-0 rotate-90 py-0.5">
                        <ArrowRight size={15} className="text-primary" />
                      </div>

                      {/* Box 4 */}
                      <div className="w-full xl:w-36 min-h-[140px] bg-background/50 border border-border p-3.5 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center">
                        <div className="mx-auto w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                          <Layers size={16} />
                        </div>
                        <h4 className="text-[10px] font-bold text-foreground">Snowflake Data Warehouse</h4>
                        <span className="text-[8px] text-muted block mt-1">Cloud analytics warehouse</span>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center text-muted shrink-0 xl:rotate-0 rotate-90 py-0.5">
                        <ArrowRight size={15} className="text-primary" />
                      </div>

                      {/* Box 5 */}
                      <div className="w-full xl:w-36 min-h-[140px] bg-background/50 border border-border p-3.5 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center">
                        <div className="mx-auto w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                          <ShieldCheck size={16} />
                        </div>
                        <h4 className="text-[10px] font-bold text-foreground">Data Governance & Quality</h4>
                        <span className="text-[8px] text-muted block mt-1">Validation • Consistency • Security • Lineage</span>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center text-muted shrink-0 xl:rotate-0 rotate-90 py-0.5">
                        <ArrowRight size={15} className="text-primary" />
                      </div>

                      {/* Box 6 */}
                      <div className="w-full xl:w-36 min-h-[140px] bg-background/50 border border-border p-3.5 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center">
                        <div className="mx-auto w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                          <Code size={16} />
                        </div>
                        <h4 className="text-[10px] font-bold text-foreground">Flask REST API Layer</h4>
                        <span className="text-[8px] text-muted block mt-1">Analytics endpoints</span>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center text-muted shrink-0 xl:rotate-0 rotate-90 py-0.5">
                        <ArrowRight size={15} className="text-primary" />
                      </div>

                      {/* Box 7 (Final Web Portal with side features) */}
                      <div className="w-full xl:w-64 bg-primary/5 border-2 border-primary/20 p-4 rounded-3xl text-center shadow-md relative">
                        <div className="absolute top-3 right-3 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </div>
                        <div className="mx-auto w-9 h-9 rounded-2xl bg-primary text-white flex items-center justify-center mb-1.5 shadow-sm shadow-primary/20">
                          <Logo size={22} />
                        </div>
                        <h4 className="text-xs font-extrabold text-foreground">React Analytics Platform</h4>
                        <span className="text-[8px] text-muted block mt-0.5 font-semibold">Insight Innovators UI Portal</span>

                        <div className="mt-3 pt-2.5 border-t border-border space-y-2 text-left">
                          <div className="text-[8.5px] font-bold text-primary uppercase tracking-wider block">
                            Platform Capabilities
                          </div>
                          <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5 text-[8px] font-semibold text-foreground/80">
                            <div>• Executive Dashboard</div>
                            <div>• Multi-Channel ROI</div>
                            <div>• Campaign Analysis</div>
                            <div>• Customer Segments</div>
                            <div>• Email Analytics</div>
                            <div>• SQL Analytics</div>
                            <div className="col-span-2 text-primary font-extrabold">• INSIGHTS AI</div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-border/60 space-y-1">
                            <div className="flex items-center gap-1.5 text-[8px] font-bold text-foreground/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              Swagger API Documentation
                            </div>
                            <div className="flex items-center gap-1.5 text-[8px] font-bold text-muted/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Power BI (Future Dev)
                            </div>
                            <div className="flex items-center gap-1.5 text-[8px] font-bold text-muted/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Power Automate (Future Dev)
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Developers Grid */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs md:text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <User size={16} className="text-primary" />
                        Project Developers
                      </h3>
                      <span className="text-[9px] text-muted block mt-0.5 uppercase tracking-wide">The core team behind the system</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { name: 'Dhanush S', initial: 'D', color: 'from-blue-600 to-indigo-600' },
                        { name: 'Nireeksha K', initial: 'N', color: 'from-indigo-600 to-purple-600' },
                        { name: 'Dhanya', initial: 'D', color: 'from-purple-600 to-pink-600' },
                        { name: 'Rakshitha', initial: 'R', color: 'from-blue-500 to-cyan-500' },
                        { name: 'Sakshi S', initial: 'S', color: 'from-cyan-500 to-emerald-500' },
                        { name: 'Vinisha', initial: 'V', color: 'from-violet-600 to-fuchsia-600' },
                      ].map((dev, i) => (
                        <div key={i} className="bg-card p-5 rounded-3xl border border-transparent shadow-[var(--card-shadow)] text-center space-y-3 flex flex-col justify-center items-center group hover:scale-[1.03] transition-all duration-200">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${dev.color} text-white font-extrabold text-sm flex items-center justify-center shadow-md`}>
                            {dev.initial}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground truncate w-full">{dev.name}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technology & Features Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Technologies Used Card */}
                    <div className="bg-card p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-transparent space-y-5">
                      <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <Cpu size={14} className="text-primary" />
                        Project Technologies
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { category: 'Frontend', tech: 'React, TypeScript, Tailwind CSS, ShadCN UI, Recharts' },
                          { category: 'Backend', tech: 'Flask REST APIs, Python' },
                          { category: 'Database', tech: 'MySQL Database' },
                          { category: 'ETL Pipeline', tech: 'Alteryx Designer' },
                          { category: 'Cloud Warehouse', tech: 'Snowflake Data Cloud' },
                          { category: 'API Docs', tech: 'Swagger OpenAPI' },
                          { category: 'Business Intelligence', tech: 'Power BI (Future Enhancement)' },
                          { category: 'Workflow Automation', tech: 'Power Automate (Future Enhancement)' },
                        ].map((t, idx) => (
                          <div key={idx} className="space-y-1 bg-background/40 p-3 rounded-2xl border border-border">
                            <span className="text-[9px] font-extrabold text-primary uppercase block">{t.category}</span>
                            <p className="text-[10px] font-semibold text-foreground leading-relaxed">{t.tech}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features & Future Enhancements */}
                    <div className="bg-card p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-transparent space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* Implemented Features */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                            <CheckCircle size={14} className="text-primary" />
                            Core Features
                          </h4>
                          <ul className="space-y-2.5">
                            {[
                              'Executive Dashboard',
                              'KPI Analytics',
                              'Revenue Monitoring',
                              'Campaign Performance Analysis',
                              'Channel Performance',
                              'Customer Segmentation',
                              'Email Campaign Analytics',
                              'ROI Analysis',
                              'REST APIs',
                              'Snowflake Integration',
                              'Responsive Dashboard',
                              'Dark & Light Theme',
                              'API Documentation',
                              'Data Visualization',
                              'Enterprise UI'
                            ].map((f, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-[10px] font-bold text-foreground">
                                <Check size={12} className="text-primary shrink-0" strokeWidth={3} />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Future Enhancements */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                            <Layers size={14} className="text-primary" />
                            Future Expansion
                          </h4>
                          <ul className="space-y-2.5">
                            {[
                              'Power BI Executive Reporting',
                              'Microsoft Power Automate Workflows',
                              'AI-Based Campaign Recommendations',
                              'Predictive Marketing Analytics',
                              'Automated Email Reports',
                              'Real-Time Snowflake stream',
                              'Role-Based Access Control (RBAC)',
                              'Alert & Notification System'
                            ].map((f, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-border mt-auto text-center text-xs text-slate-400 dark:text-slate-500 select-none px-4 md:px-8 space-y-1 bg-card/25 backdrop-blur-sm">
          <p className="font-bold text-slate-700 dark:text-slate-300">© 2026 Insight Innovators</p>
          <p className="text-[10px]">Marketing Campaign & Multi-Channel ROI Analytics Platform</p>
          <p className="text-[9px] font-semibold tracking-wider text-primary uppercase mt-1">Data • Insight • Impact</p>
        </footer>
      </div>

      {/* Sticky Bottom Navigation for Mobile */}
      <StickyBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
