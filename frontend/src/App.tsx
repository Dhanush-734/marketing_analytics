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
import { Send, Eye, MousePointerClick, Database, CheckCircle, Code, User, Info, Cpu, Layers, GitBranch, Check, Filter, BarChart3, Settings } from 'lucide-react';
import { GeminiCopilotView } from './components/GeminiCopilotView';
import { SQLAnalyticsView } from './components/SQLAnalyticsView';
import { IndiaMap } from './components/IndiaMap';
import { SettingsView } from './components/SettingsView';
import { CustomersView } from './components/CustomersView';
import { LoginView } from './components/LoginView';
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const handleLoginSuccess = () => {
    sessionStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const { kpis, channels, campaigns, customers, stateDistribution, email, monthlyData, loading, error, refetch } = useDashboardData();

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

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

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
          <Header activeTab={activeTab} isLoading={loading} onRefresh={refetch} darkMode={darkMode} setDarkMode={setDarkMode} setMobileOpen={setMobileOpen} onLogout={handleLogout} />
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

        <main className="p-3 sm:p-6 lg:p-8 w-full max-w-full min-w-0 space-y-6 md:space-y-8 overflow-x-hidden flex-1 pb-28 md:pb-8">
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
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                    {/* Middle Left: Large Revenue Area Chart (col-span-3) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-4 sm:p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[260px] sm:h-[340px] lg:col-span-3 border border-transparent w-full max-w-full overflow-hidden"
                    >
                      <div className="mb-2">
                        <h3 className="text-xs font-bold text-foreground">Revenue Earnings Area</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Snowflake sales telemetry</span>
                      </div>
                      <div className="flex-1 min-h-0 w-full overflow-hidden">
                        <RevenueAreaChart monthlyData={monthlyData} />
                      </div>
                    </motion.div>

                    {/* Middle Right: Customer loyalty segments (col-span-2) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-4 sm:p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[260px] sm:h-[340px] lg:col-span-2 border border-transparent w-full max-w-full overflow-hidden"
                    >
                      <div className="mb-2">
                        <h3 className="text-xs font-bold text-foreground">Customer loyalty share</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Purchases attribution ratios</span>
                      </div>
                      <div className="flex-1 min-h-0 w-full overflow-hidden">
                        <CustomerSegmentsDonutChart customers={customers} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom Row (Asymmetrical layout) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                    {/* Bottom Left: Campaign Performance Horizontal Bars (col-span-2) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-4 sm:p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[260px] sm:h-[320px] lg:col-span-2 border border-transparent w-full max-w-full overflow-hidden"
                    >
                      <div className="mb-2">
                        <h3 className="text-xs font-bold text-foreground">Campaigns Revenue Yield</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Top campaigns returns</span>
                      </div>
                      <div className="flex-1 min-h-0 w-full overflow-hidden">
                        <CampaignPerformanceHorizontalBarChart campaigns={campaigns} />
                      </div>
                    </motion.div>

                    {/* Bottom Middle: ROI Trend Line Chart (col-span-2) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-4 sm:p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[260px] sm:h-[320px] lg:col-span-2 border border-transparent w-full max-w-full overflow-hidden"
                    >
                      <div className="mb-2">
                        <h3 className="text-xs font-bold text-foreground">ROI Trend Analysis</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">MONTHLY ROI TREND</span>
                      </div>
                      <div className="flex-1 min-h-0 w-full overflow-hidden">
                        <RoiSmoothLineChart monthlyData={monthlyData} />
                      </div>
                    </motion.div>

                    {/* Bottom Right: Radial Progress CTR (col-span-1) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-4 sm:p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col justify-between h-[240px] sm:h-[320px] lg:col-span-1 border border-transparent w-full max-w-full overflow-hidden"
                    >
                      <div className="mb-1">
                        <h3 className="text-xs font-bold text-foreground">Average CTR Gauge</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Click-through rate gauge</span>
                      </div>
                      <div className="flex-1 min-h-0 w-full overflow-hidden">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Spend: Vertical Bar Chart (Blue) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-4 sm:p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[260px] sm:h-[350px] border border-transparent w-full max-w-full overflow-hidden"
                    >
                      <div className="mb-2">
                        <h3 className="text-xs font-bold text-foreground">Spend Distribution</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Advertising cost by channel</span>
                      </div>
                      <div className="flex-1 min-h-0 w-full overflow-hidden">
                        <SpendBarChart channels={channels} />
                      </div>
                    </motion.div>

                    {/* Marketing Channels: Stacked Bar (Multicolor) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-4 sm:p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[260px] sm:h-[350px] border border-transparent w-full max-w-full overflow-hidden"
                    >
                      <div className="mb-2">
                        <h3 className="text-xs font-bold text-foreground">Platform Stacked Revenue Performance</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Stacked cost vs income returns</span>
                      </div>
                      <div className="flex-1 min-h-0 w-full overflow-hidden">
                        <MarketingChannelsStackedBarChart channels={channels} />
                      </div>
                    </motion.div>
                  </div>

                  <DataTable campaigns={campaigns} />
                </>
              )}

              {/* VIEW: CAMPAIGN BREAKDOWN */}
              {activeTab === 'campaigns' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                  {/* Campaign Performance: Horizontal Bars (Pink) */}
                  <div className="lg:col-span-2 space-y-6 w-full max-w-full overflow-hidden">
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-4 sm:p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[260px] sm:h-[350px] border border-transparent w-full max-w-full overflow-hidden"
                    >
                      <div className="mb-2">
                        <h3 className="text-xs font-bold text-foreground">Top Campaigns Revenue Yield</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Campaigns sales yield breakdown</span>
                      </div>
                      <div className="flex-1 min-h-0 w-full overflow-hidden">
                        <CampaignPerformanceHorizontalBarChart campaigns={campaigns} />
                      </div>
                    </motion.div>
                  </div>
                  <div className="lg:col-span-3 w-full max-w-full overflow-hidden">
                    <DataTable campaigns={campaigns} />
                  </div>
                </div>
              )}

              {/* VIEW: CUSTOMER SEGMENTATION */}
              {activeTab === 'customers' && (
                <div className="space-y-6">
                  {/* Top Section: India Customer Distribution Map */}
                  <IndiaMap stateData={stateDistribution} />

                  {/* Bottom Section: Traffic Sources & Segment Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                    {/* Traffic Sources: Treemap (Cyan/Multicolor) */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-4 sm:p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[260px] sm:h-[360px] lg:col-span-2 border border-transparent w-full max-w-full overflow-hidden"
                    >
                      <div className="mb-2">
                        <h3 className="text-xs font-bold text-foreground">Attraction Traffic Sources</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Asymmetrical treemap of inbound acquisition channels</span>
                      </div>
                      <div className="flex-1 min-h-0 w-full overflow-hidden">
                        <TrafficSourcesTreemap channels={channels} />
                      </div>
                    </motion.div>

                    {/* Customer segments details */}
                    <div className="lg:col-span-3 bg-card p-4 sm:p-6 rounded-3xl shadow-[var(--card-shadow)] border border-transparent w-full max-w-full overflow-hidden">
                      <div className="mb-4 sm:mb-6">
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
                              <div className="flex justify-between text-[10px] text-muted flex-wrap gap-1">
                                <span>Reach: {new Intl.NumberFormat('en-IN').format(c.total_customers)} purchasers</span>
                                <span>Sales: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(c.total_revenue)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: EMAIL CAMPAIGNS */}
              {activeTab === 'email' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-card p-4 sm:p-5 rounded-2xl shadow-[var(--card-shadow)] flex flex-col justify-between h-28">
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

                    <div className="bg-card p-4 sm:p-5 rounded-2xl shadow-[var(--card-shadow)] flex flex-col justify-between h-28">
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

                    <div className="bg-card p-4 sm:p-5 rounded-2xl shadow-[var(--card-shadow)] flex flex-col justify-between h-28">
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

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                    {/* Funnel chart left */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-4 sm:p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[260px] sm:h-[340px] lg:col-span-2 border border-transparent w-full max-w-full overflow-hidden"
                    >
                      <div className="mb-2">
                        <h3 className="text-xs font-bold text-foreground">Email Dispatch Funnel</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Sent vs Opened vs Clicked proportions</span>
                      </div>
                      <div className="flex-1 min-h-0 w-full overflow-hidden">
                        <EmailFunnelChart email={email} />
                      </div>
                    </motion.div>

                    {/* Gradient Area Chart right */}
                    <motion.div
                      variants={cardHoverVariants}
                      whileHover="hover"
                      className="bg-card p-4 sm:p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[260px] sm:h-[340px] lg:col-span-3 border border-transparent w-full max-w-full overflow-hidden"
                    >
                      <div className="mb-2">
                        <h3 className="text-xs font-bold text-foreground">Revenue Trend Gradient</h3>
                        <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Rolling monthly sales timeline</span>
                      </div>
                      <div className="flex-1 min-h-0 w-full overflow-hidden">
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

              {/* VIEW: DATA CONNECTION STATUS */}
              {activeTab === 'apistatus' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-card p-5 rounded-2xl shadow-[var(--card-shadow)] flex items-center gap-4 border border-transparent">
                      <div className="p-2 bg-green-500/10 text-primary border border-green-500/20 rounded-xl shrink-0">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-muted block uppercase tracking-wider">Connection Status</span>
                        <span className="text-xs font-bold text-foreground">Snowflake Connected</span>
                      </div>
                    </div>

                    <div className="bg-card p-5 rounded-2xl shadow-[var(--card-shadow)] flex items-center gap-4 border border-transparent">
                      <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
                        <Database size={20} />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-muted block uppercase tracking-wider">Snowflake Data Warehouse</span>
                        <span className="text-xs font-bold text-foreground">MARKETING_ANALYTICS</span>
                      </div>
                    </div>

                    <div className="bg-card p-5 rounded-2xl shadow-[var(--card-shadow)] flex items-center gap-4 border border-transparent">
                      <div className="p-2 bg-green-500/10 text-primary border border-green-500/20 rounded-xl shrink-0">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-muted block uppercase tracking-wider">Warehouse Latency</span>
                        <span className="text-xs font-bold text-foreground">~42ms (MARKETING_WH)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card p-6 rounded-2xl shadow-[var(--card-shadow)] flex flex-col border border-transparent">
                      <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Code size={12} className="text-primary" />
                        RECENT SNOWFLAKE QUERIES
                      </h4>
                      <div className="bg-background border border-border rounded-xl p-4 font-mono text-[9px] text-primary/95 h-60 overflow-y-auto space-y-2 select-text">
                        <div><span className="text-muted">[08:34:10]</span> SELECT SUM(revenue2), SUM(spend) FROM MARKETING_ETL - Latency: 42ms</div>
                        <div><span className="text-muted">[08:34:11]</span> SELECT channel_name, SUM(revenue2) FROM MARKETING_ETL GROUP BY channel_name - Latency: 74ms</div>
                        <div><span className="text-muted">[08:34:11]</span> SELECT campaign_name, spend, roi FROM MARKETING_ETL ORDER BY roi DESC - Latency: 95ms</div>
                        <div><span className="text-muted">[08:34:12]</span> SELECT customer_segment, COUNT(*) FROM MARKETING_ETL GROUP BY customer_segment - Latency: 65ms</div>
                        <div><span className="text-muted">[08:34:12]</span> SELECT email_sent, email_opened FROM MARKETING_ETL - Latency: 58ms</div>
                        <div className="text-primary font-bold">&gt;&gt; Live connection active with Snowflake Data Warehouse (MARKETING_ANALYTICS.MARKETING_SCHEMA.MARKETING_ETL).</div>
                      </div>
                    </div>

                    <div className="bg-card p-6 rounded-2xl shadow-[var(--card-shadow)] flex flex-col border border-transparent">
                      <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Database size={12} className="text-primary" />
                        Snowflake Connection Details
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
                          <span className="font-semibold">MARKETING_WH</span>
                        </div>
                        <div className="flex justify-between border-b border-border/60 pb-2">
                          <span className="text-muted">Connection Status</span>
                          <span className="font-semibold text-emerald-500">Connected &amp; Synced</span>
                        </div>
                        <div className="flex justify-between border-b border-border/60 pb-2">
                          <span className="text-muted">Active Table</span>
                          <span className="font-semibold">MARKETING_ETL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Active Role</span>
                          <span className="font-semibold">ACCOUNTADMIN</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* platform settings view */}
              {activeTab === 'settings' && <SettingsView />}

              {/* VIEW: CUSTOMERS */}
              {activeTab === 'customers' && <CustomersView />}

              {/* VIEW: ABOUT & TEAM */}
              {activeTab === 'about' && (
                <div className="space-y-4 sm:space-y-6 select-none w-full max-w-full overflow-hidden font-sans min-w-0 box-border">
                  
                  {/* About Section */}
                  <div className="bg-white dark:bg-card p-4 sm:p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 relative overflow-hidden w-full max-w-full min-w-0 box-border">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/25 rounded-full text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
                      <Info size={12} />
                      ABOUT INSIGHT INNOVATORS
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 dark:text-foreground leading-snug tracking-tight mb-2 break-words">
                      Transforming Raw Business Data<br className="hidden sm:inline" /> into Strategic Insights
                    </h2>

                    <div className="w-12 h-1 bg-primary rounded-full mb-4" />

                    <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-700 dark:text-foreground/85 leading-relaxed font-normal break-words">
                      <p>
                        Insight Innovators is a student development team focused on building solutions to transform raw business data into meaningful insights through analytics and technology.
                      </p>
                      <p>
                        This project demonstrates how marketing campaign data can be leveraged for smarter decision-making. It combines data engineering, cloud warehousing, business intelligence, and data governance.
                      </p>
                      <p>
                        Our mission is to create scalable, modern, and enterprise-ready solutions that deliver measurable ROI, understand customer behavior, and automate reporting processes.
                      </p>
                    </div>
                  </div>

                  {/* Workflow Pipeline Card */}
                  <div className="bg-white dark:bg-card p-4 sm:p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-4 w-full max-w-full overflow-hidden min-w-0 box-border">
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-foreground uppercase tracking-wider flex items-center gap-2">
                        <GitBranch size={16} className="text-primary shrink-0" />
                        PROJECT DATA PIPELINE &amp; WORKFLOW
                      </h3>
                      <span className="text-[8.5px] sm:text-[10px] text-slate-500 dark:text-muted block mt-0.5 uppercase tracking-wide">
                        END-TO-END DATA ORCHESTRATION &amp; GOVERNANCE LIFECYCLE
                      </span>
                    </div>

                    {/* Mobile Vertically Stacked Layout (< 768px) */}
                    <div className="block md:hidden border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-slate-900/40 p-3.5 rounded-2xl w-full max-w-full min-w-0 box-border space-y-1.5">
                      {[
                        { step: '1. Data Sources', desc: 'Collect data from multiple marketing channels and platforms.', icon: Database, color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' },
                        { step: '2. Ingestion', desc: 'Extract and ingest raw data into the staging environment.', icon: Filter, color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' },
                        { step: '3. Processing', desc: 'Clean, validate, and transform data for analysis.', icon: Settings, color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400' },
                        { step: '4. Storage', desc: 'Load curated data into Snowflake warehouse.', icon: Layers, color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' },
                        { step: '5. Analytics', desc: 'Perform analysis and generate insights & visualizations.', icon: BarChart3, color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' },
                        { step: '6. Governance', desc: 'Ensure data quality, security, and compliance at every step.', icon: CheckCircle, color: 'bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400' },
                      ].map((item, idx, arr) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-full bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/80 dark:border-border/60 flex items-center gap-3 min-w-0 box-border shadow-xs">
                            <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center shrink-0 shadow-xs`}>
                              <item.icon size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-[11px] font-extrabold text-slate-900 dark:text-foreground">{item.step}</h4>
                              <p className="text-[9px] text-slate-600 dark:text-muted leading-tight mt-0.5 break-words">{item.desc}</p>
                            </div>
                          </div>
                          {idx < arr.length - 1 && (
                            <div className="text-primary font-bold text-xs py-1">↓</div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Desktop Horizontal Layout (>= 768px) */}
                    <div className="hidden md:block border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-slate-900/40 p-6 rounded-2xl w-full max-w-full min-w-0 box-border">
                      <div className="grid grid-cols-6 gap-3.5 w-full max-w-full min-w-0">
                        
                        {/* Node 1 */}
                        <div className="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-border/50 text-center space-y-1.5 flex flex-col items-center justify-center min-w-0 shadow-xs">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                            <Database size={17} />
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-foreground">1. Data Sources</h4>
                          <p className="text-[9px] text-slate-600 dark:text-muted leading-tight">Collect data from multiple marketing channels.</p>
                        </div>

                        {/* Node 2 */}
                        <div className="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-border/50 text-center space-y-1.5 flex flex-col items-center justify-center min-w-0 shadow-xs">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                            <Filter size={17} />
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-foreground">2. Ingestion</h4>
                          <p className="text-[9px] text-slate-600 dark:text-muted leading-tight">Extract and ingest raw data into staging.</p>
                        </div>

                        {/* Node 3 */}
                        <div className="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-border/50 text-center space-y-1.5 flex flex-col items-center justify-center min-w-0 shadow-xs">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                            <Settings size={17} />
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-foreground">3. Processing</h4>
                          <p className="text-[9px] text-slate-600 dark:text-muted leading-tight">Clean, validate, and transform data.</p>
                        </div>

                        {/* Node 4 */}
                        <div className="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-border/50 text-center space-y-1.5 flex flex-col items-center justify-center min-w-0 shadow-xs">
                          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                            <Layers size={17} />
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-foreground">4. Storage</h4>
                          <p className="text-[9px] text-slate-600 dark:text-muted leading-tight">Load curated data into Snowflake.</p>
                        </div>

                        {/* Node 5 */}
                        <div className="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-border/50 text-center space-y-1.5 flex flex-col items-center justify-center min-w-0 shadow-xs">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                            <BarChart3 size={17} />
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-foreground">5. Analytics</h4>
                          <p className="text-[9px] text-slate-600 dark:text-muted leading-tight">Generate insights &amp; visualizations.</p>
                        </div>

                        {/* Node 6 */}
                        <div className="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-border/50 text-center space-y-1.5 flex flex-col items-center justify-center min-w-0 shadow-xs">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center shadow-xs">
                            <CheckCircle size={17} />
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-foreground">6. Governance</h4>
                          <p className="text-[9px] text-slate-600 dark:text-muted leading-tight">Ensure data quality &amp; compliance.</p>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* OUR TEAM Section Grid */}
                  <div className="bg-white dark:bg-card p-4 sm:p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-4 w-full max-w-full overflow-hidden min-w-0 box-border">
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-foreground uppercase tracking-wider flex items-center gap-2">
                        <User size={16} className="text-primary shrink-0" />
                        OUR TEAM
                      </h3>
                      <span className="text-[8.5px] sm:text-[10px] text-slate-500 dark:text-muted block mt-0.5 uppercase tracking-wide">
                        THE MINDS BEHIND INSIGHT INNOVATORS
                      </span>
                    </div>

                    {/* Team Members Grid: 2 cols on mobile, 6 cols on desktop */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 w-full max-w-full min-w-0">
                      {[
                        { name: 'Dhanush S', initial: 'D', color: 'from-blue-600 to-indigo-600' },
                        { name: 'Nireeksha K', initial: 'N', color: 'from-indigo-600 to-purple-600' },
                        { name: 'Dhanya', initial: 'D', color: 'from-purple-600 to-pink-600' },
                        { name: 'Rakshitha', initial: 'R', color: 'from-blue-500 to-cyan-500' },
                        { name: 'Sakshi S', initial: 'S', color: 'from-cyan-500 to-emerald-500' },
                        { name: 'Vinisha', initial: 'V', color: 'from-violet-600 to-fuchsia-600' },
                      ].map((dev, i) => (
                        <div
                          key={i}
                          className="bg-slate-50/70 dark:bg-background/50 p-3.5 sm:p-5 rounded-2xl border border-slate-200 dark:border-border/70 text-center space-y-2 flex flex-col justify-center items-center w-full min-w-0 box-border shadow-xs"
                        >
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${dev.color} text-white font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-md`}>
                            {dev.initial}
                          </div>
                          <div className="w-full min-w-0">
                            <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-foreground truncate w-full">{dev.name}</h4>
                            <span className="text-[8.5px] sm:text-[9px] text-slate-500 dark:text-muted block font-semibold mt-0.5 truncate">Insight Innovators</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technology & Features Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-full overflow-hidden min-w-0 box-border">

                    {/* Technologies Used Card */}
                    <div className="bg-white dark:bg-card p-4 sm:p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-4 w-full max-w-full min-w-0 box-border">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-foreground uppercase tracking-wider flex items-center gap-2">
                        <Cpu size={14} className="text-primary shrink-0" />
                        PROJECT TECHNOLOGIES
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-full min-w-0">
                        {[
                          { category: 'Frontend', tech: 'React, TypeScript, Tailwind CSS, Recharts' },
                          { category: 'Database', tech: 'MySQL Database' },
                          { category: 'ETL Pipeline', tech: 'Alteryx Designer' },
                          { category: 'Cloud Warehouse', tech: 'Snowflake Data Cloud' },
                          { category: 'Analytics', tech: 'Snowflake SQL, INSIGHTS AI' },
                          { category: 'Business Intelligence', tech: 'Power BI (Future Enhancement)' },
                        ].map((t, idx) => (
                          <div key={idx} className="space-y-1 bg-slate-50/70 dark:bg-background/40 p-3 rounded-2xl border border-slate-200 dark:border-border min-w-0 box-border">
                            <span className="text-[8.5px] sm:text-[9px] font-extrabold text-primary uppercase block">{t.category}</span>
                            <p className="text-[10px] font-semibold text-slate-900 dark:text-foreground leading-relaxed break-words">{t.tech}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features & Future Enhancements */}
                    <div className="bg-white dark:bg-card p-4 sm:p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-4 sm:space-y-6 w-full max-w-full min-w-0 box-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0">

                        {/* Implemented Features */}
                        <div className="space-y-2.5 sm:space-y-4 min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-foreground uppercase tracking-wider flex items-center gap-2">
                            <CheckCircle size={14} className="text-primary shrink-0" />
                            CORE FEATURES
                          </h4>
                          <ul className="space-y-1.5 sm:space-y-2">
                            {[
                              'Executive Dashboard',
                              'KPI Analytics',
                              'Revenue Monitoring',
                              'Campaign Performance Analysis',
                              'Channel Performance',
                              'Customer Segmentation',
                              'Email Campaign Analytics',
                              'ROI Analysis',
                              'Snowflake Integration',
                              'SQL Analytics Workspace',
                              'INSIGHTS AI Copilot',
                              'Responsive Dashboard',
                              'Dark & Light Theme',
                              'Data Visualization',
                              'Enterprise UI'
                            ].map((f, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-900 dark:text-foreground break-words">
                                <Check size={12} className="text-primary shrink-0" strokeWidth={3} />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Future Enhancements */}
                        <div className="space-y-2.5 sm:space-y-4 min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-foreground uppercase tracking-wider flex items-center gap-2">
                            <Layers size={14} className="text-primary shrink-0" />
                            FUTURE EXPANSION
                          </h4>
                          <ul className="space-y-1.5 sm:space-y-2">
                            {[
                              'Power BI Executive Reporting',
                              'AI-Based Campaign Recommendations',
                              'Predictive Marketing Analytics',
                              'Automated Email Reports',
                              'Real-Time Snowflake stream',
                              'Role-Based Access Control (RBAC)',
                              'Alert & Notification System'
                            ].map((f, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 break-words">
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
      <StickyBottomNav activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
    </div>
  );
}
