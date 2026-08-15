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
  Treemap,
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

// 1. Revenue: Area Chart (Green)
export function RevenueAreaChart({ monthlyData }: { monthlyData: MonthlyData[] }) {
  const formatShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${val}`;
  };

  return (
    <div className="w-full h-full min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatShort} />
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
    <div className="w-full h-full min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={channels} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="channel" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatShort} />
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
    <div className="w-full h-full min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [`${val}%`, 'ROI']} />
          <Line
            type="monotone"
            dataKey="roi"
            stroke="#A855F7"
            strokeWidth={4}
            dot={{ stroke: '#A855F7', strokeWidth: 2.5, r: 4, fill: 'var(--card)' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 4. CTR: Radial Progress Chart (Orange)
export function CtrRadialProgressChart({ ctr }: { ctr: number }) {
  const pct = ctr < 1 ? ctr * 100 : ctr;
  const data = [{ name: 'CTR', value: pct, fill: '#7C3AED' }]; // Purple gauge

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="75%"
          outerRadius="100%"
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
        <span className="text-lg font-extrabold text-foreground font-sans">{pct.toFixed(2)}%</span>
      </div>
    </div>
  );
}

// 5. Customer Segments: Interactive Loyalty Share Chart
export function CustomerSegmentsDonutChart({ customers }: { customers: CustomerSegment[] }) {
  const [chartType, setChartType] = useState<'donut' | 'bar' | 'pie'>('donut');

  // High contrast vibrant color palette (Vivid Blue, Emerald Green, Golden Amber, Deep Purple, Bright Pink, Cyan)
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
    <div className="w-full h-full flex flex-col justify-between">
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

      <div className="flex-1 min-h-[220px] relative">
        {chartType === 'donut' && (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={customers}
                  cx="50%"
                  cy="42%"
                  innerRadius={42}
                  outerRadius={68}
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
                  wrapperStyle={{ fontSize: '9px', lineHeight: '1.2', paddingTop: '4px' }}
                  formatter={(value, _, index) => {
                    const color = VIBRANT_PALETTE[index % VIBRANT_PALETTE.length];
                    return <span style={{ color, fontWeight: 700, fontSize: '9px', margin: '0 2px' }}>{value}</span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[38%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[7px] uppercase font-bold text-muted tracking-wider block">Total Customers</span>
              <span className="text-xs font-extrabold text-foreground font-sans">
                {totalCustomersCount.toLocaleString()}
              </span>
            </div>
          </>
        )}

        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customers} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-secondary)" fontSize={10} tickLine={false} tickFormatter={formatCountShort} />
              <YAxis dataKey="customer_segment" type="category" stroke="var(--text-secondary)" fontSize={10} tickLine={false} width={75} />
              <Tooltip wrapperClassName="custom-tooltip" formatter={renderTooltip} />
              <Bar dataKey="total_customers" name="Customer Count" radius={[0, 6, 6, 0]} maxBarSize={22}>
                {customers.map((_, index) => (
                  <Cell key={`bar-cell-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customers}
                cx="50%"
                cy="45%"
                outerRadius={75}
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
                iconSize={8}
                layout="horizontal"
                formatter={(value, _, index) => {
                  const color = VIBRANT_PALETTE[index % VIBRANT_PALETTE.length];
                  return <span style={{ color, fontWeight: 700, fontSize: '11px', margin: '0 4px' }}>{value}</span>;
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

  return (
    <div className="w-full h-full min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={topCampaigns} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" stroke="var(--text-secondary)" fontSize={10} tickLine={false} tickFormatter={formatShort} />
          <YAxis dataKey="campaign" type="category" stroke="var(--text-secondary)" fontSize={9} tickLine={false} width={80} />
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']} />
          <Bar dataKey="revenue" name="Revenue Yield" fill="#7C3AED" radius={[0, 6, 6, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// 7. Revenue Trend: Gradient Area Chart (Green)
export function RevenueTrendGradientAreaChart({ monthlyData }: { monthlyData: MonthlyData[] }) {
  const formatShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${val}`;
  };

  return (
    <div className="w-full h-full min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatShort} />
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']} />
          <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#trendGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 8. Email Funnel Chart (Pink)
export function EmailFunnelChart({ email }: { email: EmailPerformance }) {
  const data = [
    { value: email.emails_sent, name: '1. Sent', fill: '#DBEAFE' },
    { value: email.emails_opened, name: '2. Opened', fill: '#93C5FD' },
    { value: email.emails_clicked, name: '3. Clicked', fill: '#2563EB' },
  ];

  return (
    <div className="w-full h-full min-h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [new Intl.NumberFormat('en-IN').format(Number(val)), 'Count']} />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive
          >
            <LabelList position="right" fill="var(--text)" stroke="none" dataKey="name" fontSize={10} />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomizedTreemapContent = (props: any) => {
  const { x, y, width, height, name } = props;
  
  if (width < 35 || height < 20) return null;
  
  const maxLetters = Math.floor(width / 6.5);
  let displayName = name;
  if (name.length > maxLetters && maxLetters > 5) {
    displayName = name.slice(0, maxLetters - 3) + '...';
  } else if (name.length > maxLetters) {
    displayName = name.slice(0, Math.max(3, maxLetters));
  }

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: props.fill || '#3B82F6',
          stroke: 'var(--card)',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFFFFF"
        stroke="none"
        fontSize={width > 85 ? 10 : 8}
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        className="select-none pointer-events-none fill-white"
        style={{ fill: '#FFFFFF', stroke: 'none' }}
      >
        {displayName}
      </text>
    </g>
  );
};

// 9. Traffic Sources: Treemap (Multicolor/Cyan)
export function TrafficSourcesTreemap() {
  const data = [
    { name: 'Google Search', size: 5500, fill: '#1E3A8A' },
    { name: 'Meta Feed', size: 4200, fill: '#2563EB' },
    { name: 'Newsletters', size: 3000, fill: '#3B82F6' },
    { name: 'YouTube Video', size: 2200, fill: '#6366F1' },
    { name: 'LinkedIn Posts', size: 1500, fill: '#7C3AED' },
  ];

  return (
    <div className="w-full h-full min-h-[260px] text-[10px]">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          stroke="var(--card)"
          isAnimationActive
          content={<CustomizedTreemapContent />}
        />
      </ResponsiveContainer>
    </div>
  );
}

// 10. Marketing Channels: Stacked Bar Chart (Multicolor)
export function MarketingChannelsStackedBarChart({ channels }: { channels: ChannelPerformance[] }) {
  const formatShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${val}`;
  };

  return (
    <div className="w-full h-full min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={channels} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="channel" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatShort} />
          <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [formatCurrency(Number(val)), '']} />
          <Legend verticalAlign="top" height={36} iconType="circle" iconSize={6} fontSize={11} />
          <Bar dataKey="spend" name="Spend" stackId="a" fill="#3B82F6" maxBarSize={20} />
          <Bar dataKey="revenue" name="Revenue" stackId="a" fill="#7C3AED" radius={[6, 6, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerformanceCharts({ channels, customers }: { channels: ChannelPerformance[]; customers: CustomerSegment[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[350px]">
        <div className="mb-3">
          <h3 className="text-xs font-bold text-foreground">Spend Distribution</h3>
          <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Advertising spend breakdown</span>
        </div>
        <div className="flex-1 min-h-0">
          <SpendBarChart channels={channels} />
        </div>
      </div>

      <div className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] flex flex-col h-[350px]">
        <div className="mb-3">
          <h3 className="text-xs font-bold text-foreground">Customer loyalty segments</h3>
          <span className="text-[9px] text-muted uppercase tracking-wide block mt-0.5">Sales contribution breakdown</span>
        </div>
        <div className="flex-1 min-h-0">
          <CustomerSegmentsDonutChart customers={customers} />
        </div>
      </div>
    </div>
  );
}
