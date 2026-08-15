import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  FunnelChart,
  Funnel,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChannelPerformance, CustomerSegment, EmailPerformance, MonthlyData, Campaign } from '../hooks/useDashboardData';

const formatCurrency = (val: number) => {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

// 1. Revenue: Area Chart (Blue)
export function RevenueAreaChart({ monthlyData }: { monthlyData: MonthlyData[] }) {
  const formatShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${val}`;
  };

  return (
    <div className="w-full h-[210px] sm:h-[260px] relative min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={formatShort} width={55} />
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']} />
          <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 2. Spend: Vertical Bar Chart (Blue)
export function SpendBarChart({ channels }: { channels: ChannelPerformance[] }) {
  const formatShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${val}`;
  };

  return (
    <div className="w-full h-[210px] sm:h-[260px] relative min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={channels} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="channel" stroke="var(--text-secondary)" fontSize={9} tickLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={formatShort} width={55} />
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [formatCurrency(Number(val)), 'Spend']} />
          <Bar dataKey="spend" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// 3. ROI: Smooth Line Chart (Purple, strokeWidth = 4)
export function RoiSmoothLineChart({ monthlyData }: { monthlyData: MonthlyData[] }) {
  return (
    <div className="w-full h-[210px] sm:h-[260px] relative min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyData} margin={{ top: 10, right: 15, left: 5, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} width={40} />
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [`${val}%`, 'ROI']} />
          <Line
            type="monotone"
            dataKey="roi"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ stroke: '#8B5CF6', strokeWidth: 2.5, r: 4, fill: 'var(--card)' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 4. CTR: Radial Progress Chart (Purple/Indigo)
export function CtrRadialProgressChart({ ctr }: { ctr: number }) {
  const pct = ctr < 1 ? ctr * 100 : ctr;
  const data = [{ name: 'CTR', value: pct, fill: '#7C3AED' }];

  return (
    <div className="w-full h-[180px] sm:h-[220px] relative min-w-0 flex items-center justify-center overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="95%"
          barSize={12}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: 'var(--border)' }}
            dataKey="value"
            cornerRadius={6}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[9px] uppercase font-bold text-muted tracking-wider block">Average CTR</span>
        <span className="text-base sm:text-lg font-extrabold text-foreground font-sans">{pct.toFixed(2)}%</span>
      </div>
    </div>
  );
}

// 5. Customer Segments: Interactive Loyalty Share Donut Chart
export function CustomerSegmentsDonutChart({ customers }: { customers: CustomerSegment[] }) {
  const [chartType, setChartType] = useState<'donut' | 'bar' | 'pie'>('donut');

  const VIBRANT_PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

  const totalCustomersCount = customers.reduce((sum, c) => sum + (c.total_customers || 0), 0);

  const formatCountShort = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return `${val}`;
  };

  const renderTooltip = (val: any) => {
    const count = Number(val);
    const pct = totalCustomersCount > 0 ? ((count / totalCustomersCount) * 100).toFixed(1) : '0';
    return [`${count.toLocaleString()} (${pct}%)`, 'Customer Count'];
  };

  return (
    <div className="w-full h-full flex flex-col justify-between min-w-0">
      {/* Chart View Switcher Controls */}
      <div className="flex justify-end items-center gap-1 mb-1 z-10">
        <span className="text-[8px] font-bold text-muted uppercase tracking-wider mr-1">Type:</span>
        <button
          onClick={() => setChartType('donut')}
          className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
            chartType === 'donut'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-background hover:bg-card border border-border text-muted'
          }`}
        >
          Donut
        </button>
        <button
          onClick={() => setChartType('bar')}
          className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
            chartType === 'bar'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-background hover:bg-card border border-border text-muted'
          }`}
        >
          Bar
        </button>
        <button
          onClick={() => setChartType('pie')}
          className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
            chartType === 'pie'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-background hover:bg-card border border-border text-muted'
          }`}
        >
          Pie
        </button>
      </div>

      <div className="w-full h-[210px] sm:h-[250px] relative min-w-0 overflow-hidden">
        {chartType === 'donut' && (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={customers}
                  cx="50%"
                  cy="40%"
                  innerRadius="38%"
                  outerRadius="62%"
                  paddingAngle={4}
                  dataKey="total_customers"
                  nameKey="customer_segment"
                >
                  {customers.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip wrapperClassName="custom-tooltip" formatter={renderTooltip} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={7}
                  layout="horizontal"
                  wrapperStyle={{ fontSize: '9px', lineHeight: '1.2', width: '100%', bottom: 0 }}
                  formatter={(value, _, index) => {
                    const color = VIBRANT_PALETTE[index % VIBRANT_PALETTE.length];
                    return <span style={{ color, fontWeight: 700, fontSize: '9px', margin: '0 2px' }}>{value}</span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[36%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[7px] uppercase font-bold text-muted tracking-wider block">Total Customers</span>
              <span className="text-xs font-extrabold text-foreground font-sans">
                {totalCustomersCount.toLocaleString()}
              </span>
            </div>
          </>
        )}

        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customers} layout="vertical" margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-secondary)" fontSize={9} tickLine={false} tickFormatter={formatCountShort} />
              <YAxis dataKey="customer_segment" type="category" stroke="var(--text-secondary)" fontSize={9} tickLine={false} width={80} />
              <Tooltip wrapperClassName="custom-tooltip" formatter={renderTooltip} />
              <Bar dataKey="total_customers" name="Customer Count" radius={[0, 6, 6, 0]} maxBarSize={20}>
                {customers.map((_, index) => (
                  <Cell key={`bar-cell-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={customers}
                cx="50%"
                cy="40%"
                outerRadius="65%"
                paddingAngle={4}
                dataKey="total_customers"
                nameKey="customer_segment"
              >
                {customers.map((_, index) => (
                  <Cell key={`pie-cell-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip wrapperClassName="custom-tooltip" formatter={renderTooltip} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={7}
                layout="horizontal"
                wrapperStyle={{ fontSize: '9px', lineHeight: '1.2', width: '100%', bottom: 0 }}
                formatter={(value, _, index) => {
                  const color = VIBRANT_PALETTE[index % VIBRANT_PALETTE.length];
                  return <span style={{ color, fontWeight: 700, fontSize: '9px', margin: '0 2px' }}>{value}</span>;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// 6. Campaign Performance: Horizontal Bar Chart (Pink)
export function CampaignPerformanceHorizontalBarChart({ campaigns }: { campaigns: Campaign[] }) {
  const topCampaigns = [...campaigns]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const formatShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${val}`;
  };

  const formatYAxisLabel = (val: string) => {
    if (!val) return '';
    return val.length > 14 ? `${val.substring(0, 12)}..` : val;
  };

  return (
    <div className="w-full h-[210px] sm:h-[260px] relative min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={topCampaigns} layout="vertical" margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" stroke="var(--text-secondary)" fontSize={9} tickLine={false} tickFormatter={formatShort} />
          <YAxis dataKey="campaign" type="category" stroke="var(--text-secondary)" fontSize={8.5} tickLine={false} tickFormatter={formatYAxisLabel} width={85} />
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']} />
          <Bar dataKey="revenue" name="Revenue Yield" fill="#7C3AED" radius={[0, 6, 6, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// 7. Revenue Trend: Gradient Area Chart (Purple)
export function RevenueTrendGradientAreaChart({ monthlyData }: { monthlyData: MonthlyData[] }) {
  const formatShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${val}`;
  };

  return (
    <div className="w-full h-[210px] sm:h-[260px] relative min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={formatShort} width={55} />
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']} />
          <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#trendGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 8. Email Funnel: Funnel Chart
export function EmailFunnelChart({ email }: { email: EmailPerformance }) {
  const funnelData = [
    { value: email.emails_sent, name: 'Dispatched', fill: '#3B82F6' },
    { value: email.emails_opened, name: 'Opened', fill: '#10B981' },
    { value: email.emails_clicked, name: 'Clicked', fill: '#7C3AED' },
  ];

  return (
    <div className="w-full h-[210px] sm:h-[260px] relative min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [Number(val).toLocaleString(), 'Count']} />
          <Funnel dataKey="value" data={funnelData} isAnimationActive>
            <LabelList position="right" fill="var(--text)" stroke="none" dataKey="name" fontSize={10} fontWeight={700} />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}

// 9. Attraction Channels Performance Chart (Box Tile Distribution)
export function TrafficSourcesTreemap({ channels }: { channels?: ChannelPerformance[] }) {
  const defaultChannels: ChannelPerformance[] = [
    { channel: 'Google Ads', revenue: 52300000000, spend: 6180000000, roi: 746.28, ctr: 2.81 },
    { channel: 'Meta Ads', revenue: 48150000000, spend: 5680000000, roi: 747.71, ctr: 2.94 },
    { channel: 'LinkedIn Ads', revenue: 45210000000, spend: 5320000000, roi: 749.54, ctr: 3.12 },
    { channel: 'YouTube Ads', revenue: 38400000000, spend: 4540000000, roi: 745.81, ctr: 2.68 },
    { channel: 'Email Marketing', revenue: 21921967467, spend: 2600196730, roi: 743.09, ctr: 2.70 }
  ];

  const data = channels && channels.length > 0 ? channels : defaultChannels;
  const totalRevenue = data.reduce((sum, c) => sum + c.revenue, 0);

  const formatShort = (val: number) => {
    if (val >= 1e9) return `₹${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `₹${(val / 1e6).toFixed(1)}M`;
    return `₹${val}`;
  };

  const tileColors = [
    { bg: 'from-blue-600 to-blue-700', badge: 'bg-blue-900/40 text-blue-100', border: 'border-blue-400/30' },
    { bg: 'from-amber-500 to-amber-600', badge: 'bg-amber-900/40 text-amber-100', border: 'border-amber-400/30' },
    { bg: 'from-purple-600 to-purple-700', badge: 'bg-purple-900/40 text-purple-100', border: 'border-purple-400/30' },
    { bg: 'from-emerald-600 to-emerald-700', badge: 'bg-emerald-900/40 text-emerald-100', border: 'border-emerald-400/30' },
    { bg: 'from-pink-600 to-pink-700', badge: 'bg-pink-900/40 text-pink-100', border: 'border-pink-400/30' }
  ];

  return (
    <div className="w-full h-full min-h-[220px] sm:min-h-[260px] grid grid-cols-2 sm:grid-cols-6 gap-2 select-none overflow-hidden p-0.5">
      {/* Box 1 (Google Ads): Spans 3 cols on sm, 2 on mobile */}
      <div className={`col-span-2 sm:col-span-3 row-span-2 bg-gradient-to-br ${tileColors[0].bg} rounded-2xl p-3.5 flex flex-col justify-between border ${tileColors[0].border} shadow-sm hover:scale-[1.01] transition-transform duration-200 cursor-pointer`}>
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-tight leading-snug">{data[0]?.channel}</h4>
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${tileColors[0].badge} uppercase shrink-0`}>
            {totalRevenue > 0 ? `${((data[0]?.revenue / totalRevenue) * 100).toFixed(1)}%` : ''}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-[8px] text-blue-100 uppercase tracking-wider block font-bold">Revenue Yield</span>
          <span className="text-sm sm:text-base font-extrabold text-white font-mono">{formatShort(data[0]?.revenue || 0)}</span>
        </div>
      </div>

      {/* Box 2 (Meta Ads): Spans 3 cols on sm */}
      <div className={`col-span-2 sm:col-span-3 bg-gradient-to-br ${tileColors[1].bg} rounded-2xl p-3 flex flex-col justify-between border ${tileColors[1].border} shadow-sm hover:scale-[1.01] transition-transform duration-200 cursor-pointer`}>
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-xs font-bold text-white tracking-tight leading-none">{data[1]?.channel}</h4>
          <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${tileColors[1].badge} uppercase shrink-0`}>
            {totalRevenue > 0 ? `${((data[1]?.revenue / totalRevenue) * 100).toFixed(1)}%` : ''}
          </span>
        </div>
        <div>
          <span className="text-xs font-extrabold text-white font-mono">{formatShort(data[1]?.revenue || 0)}</span>
        </div>
      </div>

      {/* Box 3 (LinkedIn Ads): Spans 2 cols on sm */}
      <div className={`col-span-1 sm:col-span-2 bg-gradient-to-br ${tileColors[2].bg} rounded-2xl p-3 flex flex-col justify-between border ${tileColors[2].border} shadow-sm hover:scale-[1.01] transition-transform duration-200 cursor-pointer`}>
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-[11px] sm:text-xs font-bold text-white tracking-tight leading-none truncate">{data[2]?.channel}</h4>
        </div>
        <div>
          <span className="text-xs font-extrabold text-white font-mono">{formatShort(data[2]?.revenue || 0)}</span>
        </div>
      </div>

      {/* Box 4 (YouTube Ads): Spans 2 cols on sm */}
      <div className={`col-span-1 sm:col-span-2 bg-gradient-to-br ${tileColors[3].bg} rounded-2xl p-3 flex flex-col justify-between border ${tileColors[3].border} shadow-sm hover:scale-[1.01] transition-transform duration-200 cursor-pointer`}>
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-[11px] sm:text-xs font-bold text-white tracking-tight leading-none truncate">{data[3]?.channel}</h4>
        </div>
        <div>
          <span className="text-xs font-extrabold text-white font-mono">{formatShort(data[3]?.revenue || 0)}</span>
        </div>
      </div>

      {/* Box 5 (Email Marketing): Spans 2 cols on sm */}
      <div className={`col-span-2 sm:col-span-2 bg-gradient-to-br ${tileColors[4].bg} rounded-2xl p-3 flex flex-col justify-between border ${tileColors[4].border} shadow-sm hover:scale-[1.01] transition-transform duration-200 cursor-pointer`}>
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-[11px] sm:text-xs font-bold text-white tracking-tight leading-none truncate">{data[4]?.channel}</h4>
          <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${tileColors[4].badge} uppercase shrink-0`}>
            {totalRevenue > 0 ? `${((data[4]?.revenue / totalRevenue) * 100).toFixed(1)}%` : ''}
          </span>
        </div>
        <div>
          <span className="text-xs font-extrabold text-white font-mono">{formatShort(data[4]?.revenue || 0)}</span>
        </div>
      </div>
    </div>
  );
}

// 10. Platform Stacked Bar Performance Chart
export function MarketingChannelsStackedBarChart({ channels }: { channels: ChannelPerformance[] }) {
  const formatShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${val}`;
  };

  return (
    <div className="w-full h-[210px] sm:h-[260px] relative min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={channels} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="channel" stroke="var(--text-secondary)" fontSize={9} tickLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={formatShort} width={55} />
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [formatCurrency(Number(val)), 'Amount']} />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
          <Bar dataKey="spend" name="Spend Cost" stackId="a" fill="#3B82F6" maxBarSize={22} />
          <Bar dataKey="revenue" name="Revenue Earned" stackId="a" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
