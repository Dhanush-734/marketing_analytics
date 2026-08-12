import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, Percent, BarChart3, Users, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardsProps {
  revenue: number;
  spend: number;
  roi: number;
  ctr: number;
  campaignsCount: number;
  customersCount: number;
}

// Animated Counter component
function AnimatedCounter({ value, isCurrency = false }: { value: number; isCurrency?: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) return;
    const duration = 1200; // 1.2s count transition
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quad ease-out curve
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.round(start + (end - start) * easeProgress);
      setDisplayValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value]);

  const formatCompact = (val: number, isCurr: boolean) => {
    if (val === 0) return isCurr ? '₹0' : '0';
    let formatted = '';
    if (val >= 1e12) {
      formatted = `${(val / 1e12).toFixed(2).replace(/\.00$/, '')}T`;
    } else if (val >= 1e9) {
      formatted = `${(val / 1e9).toFixed(2).replace(/\.00$/, '')}B`;
    } else if (val >= 1e6) {
      formatted = `${(val / 1e6).toFixed(2).replace(/\.00$/, '')}M`;
    } else if (val >= 1e3) {
      formatted = `${(val / 1e3).toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1')}K`;
    } else {
      formatted = val.toString();
    }
    return isCurr ? `₹${formatted}` : formatted;
  };

  return <span>{formatCompact(displayValue, isCurrency)}</span>;
}

// Custom sparkline chart
function Sparkline({ data, strokeColor }: { data: { value: number }[]; strokeColor: string }) {
  return (
    <div className="h-6 w-full mt-2 select-none overflow-hidden rounded-lg pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.5}
            fillOpacity={0.06}
            fill={strokeColor}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function KPICards({
  revenue,
  spend,
  roi,
  ctr,
  campaignsCount,
  customersCount,
}: KPICardsProps) {

  const formatRaw = (val: number, isCurrency: boolean = false) => {
    return isCurrency
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
      : new Intl.NumberFormat('en-IN').format(val);
  };

  // Sparkline curves data
  const revenueSpark = [{ value: revenue * 0.86 }, { value: revenue * 0.90 }, { value: revenue * 0.89 }, { value: revenue * 0.94 }, { value: revenue }];
  const spendSpark = [{ value: spend * 0.92 }, { value: spend * 0.96 }, { value: spend * 0.94 }, { value: spend * 1.01 }, { value: spend }];
  const roiSpark = [{ value: roi * 0.88 }, { value: roi * 0.90 }, { value: roi * 0.93 }, { value: roi * 0.96 }, { value: roi }];
  const ctrSpark = [{ value: ctr * 0.91 }, { value: ctr * 0.93 }, { value: ctr * 0.95 }, { value: ctr * 0.98 }, { value: ctr }];
  const campaignsSpark = [{ value: campaignsCount - 15 }, { value: campaignsCount - 10 }, { value: campaignsCount - 8 }, { value: campaignsCount - 3 }, { value: campaignsCount }];
  const customersSpark = [{ value: customersCount * 0.94 }, { value: customersCount * 0.96 }, { value: customersCount * 0.98 }, { value: customersCount * 0.99 }, { value: customersCount }];

  const cards = [
    {
      title: 'Total Revenue',
      rawValue: formatRaw(revenue, true),
      numericValue: revenue,
      isCurrency: true,
      icon: <DollarSign size={15} />,
      iconStyle: 'bg-green-500/10 text-[#16C47F]',
      strokeColor: '#16C47F',
      trend: { label: '+12.8%', isPositive: true },
      status: { text: 'Target Met', style: 'bg-green-500/10 text-[#16C47F]' },
      sparkData: revenueSpark,
    },
    {
      title: 'Total Spend',
      rawValue: formatRaw(spend, true),
      numericValue: spend,
      isCurrency: true,
      icon: <TrendingDown size={15} />,
      iconStyle: 'bg-orange-500/10 text-orange-500',
      strokeColor: '#F97316',
      trend: { label: '+3.1%', isPositive: false },
      status: { text: 'Controlled', style: 'bg-orange-500/10 text-orange-500' },
      sparkData: spendSpark,
    },
    {
      title: 'Average ROI',
      rawValue: formatRaw(roi) + '%',
      numericValue: roi,
      isCurrency: false,
      isPercent: true,
      icon: <TrendingUp size={15} />,
      iconStyle: 'bg-blue-500/10 text-blue-500',
      strokeColor: '#3B82F6',
      trend: { label: '+8.2%', isPositive: true },
      status: { text: 'Optimal', style: 'bg-blue-500/10 text-blue-500' },
      sparkData: roiSpark,
    },
    {
      title: 'Average CTR',
      rawValue: formatRaw(ctr) + '%',
      numericValue: ctr,
      isCurrency: false,
      isPercent: true,
      icon: <Percent size={15} />,
      iconStyle: 'bg-purple-500/10 text-purple-500',
      strokeColor: '#A855F7',
      trend: { label: '+0.5%', isPositive: true },
      status: { text: 'Steady', style: 'bg-purple-500/10 text-purple-500' },
      sparkData: ctrSpark,
    },
    {
      title: 'Total Campaigns',
      rawValue: formatRaw(campaignsCount),
      numericValue: campaignsCount,
      isCurrency: false,
      icon: <BarChart3 size={15} />,
      iconStyle: 'bg-pink-500/10 text-pink-500',
      strokeColor: '#EC4899',
      trend: { label: '+3.5%', isPositive: true },
      status: { text: 'Active', style: 'bg-pink-500/10 text-pink-500' },
      sparkData: campaignsSpark,
    },
    {
      title: 'Total Customers',
      rawValue: formatRaw(customersCount),
      numericValue: customersCount,
      isCurrency: false,
      icon: <Users size={15} />,
      iconStyle: 'bg-cyan-500/10 text-cyan-500',
      strokeColor: '#06B6D4',
      trend: { label: '+4.8%', isPositive: true },
      status: { text: 'Growing', style: 'bg-cyan-500/10 text-cyan-500' },
      sparkData: customersSpark,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5 mb-6 md:mb-8 select-none">
      {cards.map((card, idx) => (
        <div
          key={idx}
          title={card.rawValue}
          className="glass-panel rounded-2xl p-3.5 sm:p-4 hover:shadow-lg hover:scale-[1.02] border border-border/60 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
        >
          {/* Header segment with different visual gradients */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wide">
              {card.title}
            </span>
            <div className={`p-1.5 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${card.iconStyle}`}>
              {card.icon}
            </div>
          </div>

          {/* Metric Details */}
          <div>
            <div className="text-xl font-bold tracking-tight text-foreground font-sans">
              <AnimatedCounter value={card.numericValue} isCurrency={card.isCurrency} />
              {card.isPercent && '%'}
            </div>

            <div className="flex items-center justify-between mt-1 mb-2">
              <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide select-none ${card.status.style}`}>
                {card.status.text}
              </span>
              <span className={`inline-flex items-center text-[9px] font-extrabold ${card.trend.isPositive ? 'text-primary' : 'text-orange-500'
                }`}>
                {card.trend.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {card.trend.label}
              </span>
            </div>

            {/* Sparkline chart */}
            <Sparkline data={card.sparkData} strokeColor={card.strokeColor} />
          </div>
        </div>
      ))}
    </div>
  );
}
