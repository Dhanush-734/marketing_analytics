import { useState, useMemo } from 'react';
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
export function SpendBarChart({ channels, showTypeToggle = false }: { channels: ChannelPerformance[]; showTypeToggle?: boolean }) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const VIBRANT_PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

  const formatShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${val}`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between min-w-0">
      {showTypeToggle && (
        <div className="flex justify-end items-center gap-1 mb-1 z-10">
          <span className="text-[8px] font-bold text-muted uppercase tracking-wider mr-1">Type:</span>
          <button
            type="button"
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
            type="button"
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
      )}

      <div className="w-full h-[210px] sm:h-[250px] relative min-w-0 overflow-hidden">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channels} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="channel" stroke="var(--text-secondary)" fontSize={9} tickLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={formatShort} width={55} />
              <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [formatCurrency(Number(val)), 'Spend']} />
              <Bar dataKey="spend" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={channels}
                cx="50%"
                cy="42%"
                outerRadius="62%"
                paddingAngle={4}
                dataKey="spend"
                nameKey="channel"
              >
                {channels.map((_, index) => (
                  <Cell key={`spend-pie-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [formatCurrency(Number(val)), 'Spend Cost']} />
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

// Custom Recharts Treemap Node Renderer for zero-overflow crisp text rendering
const CustomTreemapNode = (props: any) => {
  const { x, y, width, height, index, name } = props;
  if (width <= 0 || height <= 0) return null;

  const COLORS = ['#2563EB', '#F59E0B', '#8B5CF6', '#10B981', '#EC4899', '#06B6D4'];
  const fill = COLORS[index % COLORS.length];

  const words = name ? name.split(' ') : [];
  const line1 = words[0] || '';
  const line2 = words.slice(1).join(' ') || '';

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        style={{
          fill,
          rx: 8,
          ry: 8,
          stroke: '#ffffff',
          strokeWidth: 2,
        }}
      />
      {width > 30 && height > 22 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#FFFFFF"
          fontSize={width < 70 ? 10 : 12}
          fontWeight={700}
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          className="select-none pointer-events-none"
        >
          {line2 ? (
            <>
              <tspan x={x + width / 2} dy="-0.6em">{line1}</tspan>
              <tspan x={x + width / 2} dy="1.2em">{line2}</tspan>
            </>
          ) : (
            line1
          )}
        </text>
      )}
    </g>
  );
};

// 9. Authentic Recharts Attraction Treemap Chart (Dynamic Snowflake channel names)
export function TrafficSourcesTreemap({ channels }: { channels?: ChannelPerformance[] }) {
  const treemapData = useMemo(() => {
    if (channels && channels.length > 0) {
      return channels.map((c) => ({
        name: c.channel,
        size: c.revenue || c.spend || 1000,
      }));
    }
    return [
      { name: 'Google Ads', size: 52300000000 },
      { name: 'Meta Ads', size: 48150000000 },
      { name: 'LinkedIn Ads', size: 45210000000 },
      { name: 'YouTube Ads', size: 38400000000 },
      { name: 'Email Marketing', size: 21921967467 },
      { name: 'Direct Traffic', size: 18500000000 },
    ];
  }, [channels]);

  const formatTooltipVal = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `${val.toLocaleString()} Visits`;
    return `${val}`;
  };

  return (
    <div className="w-full h-[210px] sm:h-[260px] relative min-w-0 overflow-hidden">
      <ResponsiveContainer width="99%" height="100%">
        <Treemap
          data={treemapData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#ffffff"
          content={<CustomTreemapNode />}
        >
          <Tooltip
            wrapperClassName="custom-tooltip"
            formatter={(val: any) => [formatTooltipVal(Number(val)), 'Revenue Yield']}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}

// 10. Platform Stacked Bar Performance Chart
export function MarketingChannelsStackedBarChart({ channels, showTypeToggle = false }: { channels: ChannelPerformance[]; showTypeToggle?: boolean }) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const VIBRANT_PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

  const formatShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${val}`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between min-w-0">
      {showTypeToggle && (
        <div className="flex justify-end items-center gap-1 mb-1 z-10">
          <span className="text-[8px] font-bold text-muted uppercase tracking-wider mr-1">Type:</span>
          <button
            type="button"
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
            type="button"
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
      )}

      <div className="w-full h-[210px] sm:h-[250px] relative min-w-0 overflow-hidden">
        {chartType === 'bar' ? (
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
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={channels}
                cx="50%"
                cy="42%"
                outerRadius="62%"
                paddingAngle={4}
                dataKey="revenue"
                nameKey="channel"
              >
                {channels.map((_, index) => (
                  <Cell key={`rev-pie-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue Earned']} />
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

// 11. Channel ROI & ROAS Analysis Chart
export function ChannelRoiRoasChart({ channels, showTypeToggle = false }: { channels: ChannelPerformance[]; showTypeToggle?: boolean }) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const VIBRANT_PALETTE = ['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#06B6D4'];

  return (
    <div className="w-full h-full flex flex-col justify-between min-w-0">
      {showTypeToggle && (
        <div className="flex justify-end items-center gap-1 mb-1 z-10">
          <span className="text-[8px] font-bold text-muted uppercase tracking-wider mr-1">Type:</span>
          <button
            type="button"
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
            type="button"
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
      )}

      <div className="w-full h-[210px] sm:h-[250px] relative min-w-0 overflow-hidden">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channels} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="channel" stroke="var(--text-secondary)" fontSize={9} tickLine={false} />
              <YAxis yAxisId="left" stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={45} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}x`} width={35} />
              <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any, name: any) => [name === 'ROI %' ? `${val}%` : `${val}x`, name]} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar yAxisId="left" dataKey="roi" name="ROI %" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={20} />
              <Bar yAxisId="right" dataKey="roas" name="ROAS (x)" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={channels}
                cx="50%"
                cy="42%"
                outerRadius="62%"
                paddingAngle={4}
                dataKey="roi"
                nameKey="channel"
              >
                {channels.map((_, index) => (
                  <Cell key={`roi-pie-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [`${Number(val).toFixed(2)}%`, 'ROI']} />
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

// 12. Channel CTR & Impressions Analysis Chart
export function ChannelCtrImpressionsChart({ channels, showTypeToggle = false }: { channels: ChannelPerformance[]; showTypeToggle?: boolean }) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const VIBRANT_PALETTE = ['#3B82F6', '#EC4899', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4'];

  return (
    <div className="w-full h-full flex flex-col justify-between min-w-0">
      {showTypeToggle && (
        <div className="flex justify-end items-center gap-1 mb-1 z-10">
          <span className="text-[8px] font-bold text-muted uppercase tracking-wider mr-1">Type:</span>
          <button
            type="button"
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
            type="button"
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
      )}

      <div className="w-full h-[210px] sm:h-[250px] relative min-w-0 overflow-hidden">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channels} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="channel" stroke="var(--text-secondary)" fontSize={9} tickLine={false} />
              <YAxis yAxisId="left" stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} width={45} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={35} />
              <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any, name: any) => [name === 'CTR %' ? `${val}%` : Number(val).toLocaleString(), name]} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar yAxisId="left" dataKey="impressions" name="Impressions" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={20} />
              <Bar yAxisId="right" dataKey="ctr" name="CTR %" fill="#EC4899" radius={[6, 6, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={channels}
                cx="50%"
                cy="42%"
                outerRadius="62%"
                paddingAngle={4}
                dataKey="impressions"
                nameKey="channel"
              >
                {channels.map((_, index) => (
                  <Cell key={`ctr-pie-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [Number(val).toLocaleString(), 'Impressions']} />
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

// 13. Channel Conversion & Lead Analysis Chart
export function ChannelConversionChart({ channels, showTypeToggle = false }: { channels: ChannelPerformance[]; showTypeToggle?: boolean }) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const VIBRANT_PALETTE = ['#06B6D4', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

  return (
    <div className="w-full h-full flex flex-col justify-between min-w-0">
      {showTypeToggle && (
        <div className="flex justify-end items-center gap-1 mb-1 z-10">
          <span className="text-[8px] font-bold text-muted uppercase tracking-wider mr-1">Type:</span>
          <button
            type="button"
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
            type="button"
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
      )}

      <div className="w-full h-[210px] sm:h-[250px] relative min-w-0 overflow-hidden">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channels} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="channel" stroke="var(--text-secondary)" fontSize={9} tickLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} width={45} />
              <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any, name: any) => [Number(val).toLocaleString(), name]} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="leads" name="Leads" fill="#06B6D4" maxBarSize={16} />
              <Bar dataKey="qualified_leads" name="Qualified Leads" fill="#3B82F6" maxBarSize={16} />
              <Bar dataKey="conversions" name="Conversions" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={channels}
                cx="50%"
                cy="42%"
                outerRadius="62%"
                paddingAngle={4}
                dataKey="conversions"
                nameKey="channel"
              >
                {channels.map((_, index) => (
                  <Cell key={`conv-pie-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [Number(val).toLocaleString(), 'Conversions']} />
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

// 14. Channel Customer Acquisition Chart & Leader Banner
export function ChannelCustomerAcquisitionChart({ channels, showTypeToggle = false }: { channels: ChannelPerformance[]; showTypeToggle?: boolean }) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const VIBRANT_PALETTE = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];

  const topCustomerChannel = useMemo(() => {
    if (!channels || channels.length === 0) return null;
    return [...channels].sort((a, b) => (b.customers || 0) - (a.customers || 0))[0];
  }, [channels]);

  return (
    <div className="w-full flex flex-col space-y-2.5">
      {topCustomerChannel && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-primary/10 border border-primary/20 p-2.5 px-4 rounded-2xl gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Top Customer Acquisition Leader:</span>
            <span className="text-[11px] font-extrabold text-primary">{topCustomerChannel.channel}</span>
          </div>
          <span className="text-[10px] font-bold font-mono text-foreground">
            {topCustomerChannel.customers.toLocaleString()} Customers Acquired
          </span>
        </div>
      )}

      {showTypeToggle && (
        <div className="flex justify-end items-center gap-1 mb-1 z-10">
          <span className="text-[8px] font-bold text-muted uppercase tracking-wider mr-1">Type:</span>
          <button
            type="button"
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
            type="button"
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
      )}

      <div className="w-full h-[180px] sm:h-[210px] relative min-w-0 overflow-hidden">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channels} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="channel" stroke="var(--text-secondary)" fontSize={9} tickLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} width={45} />
              <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any, name: any) => [Number(val).toLocaleString(), name]} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="customers" name="Customers Acquired" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={channels}
                cx="50%"
                cy="42%"
                outerRadius="62%"
                paddingAngle={4}
                dataKey="customers"
                nameKey="channel"
              >
                {channels.map((_, index) => (
                  <Cell key={`cust-pie-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip wrapperClassName="custom-tooltip" formatter={(val: any) => [Number(val).toLocaleString(), 'Customers Acquired']} />
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

// 15. Dynamic Channel Insights Cards
export function ChannelInsightsCards({ channels }: { channels: ChannelPerformance[] }) {
  const bestRoi = useMemo(() => (!channels || channels.length === 0) ? null : [...channels].sort((a, b) => b.roi - a.roi)[0], [channels]);
  const bestRoas = useMemo(() => (!channels || channels.length === 0) ? null : [...channels].sort((a, b) => b.roas - a.roas)[0], [channels]);
  const bestCtr = useMemo(() => (!channels || channels.length === 0) ? null : [...channels].sort((a, b) => b.ctr - a.ctr)[0], [channels]);
  const highestRevenue = useMemo(() => (!channels || channels.length === 0) ? null : [...channels].sort((a, b) => b.revenue - a.revenue)[0], [channels]);
  const lowestCac = useMemo(() => (!channels || channels.length === 0) ? null : [...channels].sort((a, b) => a.cac - b.cac)[0], [channels]);
  const highestConv = useMemo(() => (!channels || channels.length === 0) ? null : [...channels].sort((a, b) => b.conversion_rate - a.conversion_rate)[0], [channels]);

  if (!channels || channels.length === 0) return null;

  const cards = [
    {
      title: 'BEST ROI CHANNEL',
      channel: bestRoi?.channel || 'LinkedIn Ads',
      metric: `${bestRoi?.roi.toFixed(2)}% ROI`,
      badge: 'Top Return',
      color: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
    },
    {
      title: 'BEST ROAS CHANNEL',
      channel: bestRoas?.channel || 'LinkedIn Ads',
      metric: `${bestRoas?.roas.toFixed(2)}x ROAS`,
      badge: 'Max Efficiency',
      color: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-500'
    },
    {
      title: 'BEST CTR CHANNEL',
      channel: bestCtr?.channel || 'LinkedIn Ads',
      metric: `${bestCtr?.ctr.toFixed(2)}% CTR`,
      badge: 'Highest Engagement',
      color: 'border-purple-500/20 bg-purple-500/10 text-purple-500'
    },
    {
      title: 'HIGHEST REVENUE CHANNEL',
      channel: highestRevenue?.channel || 'Google Ads',
      metric: formatCurrency(highestRevenue?.revenue || 52300000000),
      badge: 'Top Revenue',
      color: 'border-blue-500/20 bg-blue-500/10 text-blue-500'
    },
    {
      title: 'LOWEST CAC CHANNEL',
      channel: lowestCac?.channel || 'LinkedIn Ads',
      metric: `₹${new Intl.NumberFormat('en-IN').format(lowestCac?.cac || 470672)} CAC`,
      badge: 'Lowest Cost',
      color: 'border-sky-500/20 bg-sky-500/10 text-sky-500'
    },
    {
      title: 'HIGHEST CONVERSION CHANNEL',
      channel: highestConv?.channel || 'LinkedIn Ads',
      metric: `${highestConv?.conversion_rate.toFixed(2)}% Conv Rate`,
      badge: 'Best Conversion',
      color: 'border-rose-500/20 bg-rose-500/10 text-rose-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 w-full">
      {cards.map((c, idx) => (
        <div key={idx} className="bg-card p-3.5 sm:p-4 rounded-3xl shadow-[var(--card-shadow)] border border-border flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[8px] font-extrabold text-muted uppercase tracking-wider block">{c.title}</span>
            <h4 className="text-xs font-bold text-foreground mt-1">{c.channel}</h4>
          </div>
          <div>
            <span className="text-xs sm:text-sm font-extrabold font-mono text-foreground block truncate">{c.metric}</span>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase mt-1 ${c.color}`}>
              {c.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
