import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Download, ChevronLeft, ChevronRight, Play, Pause, CheckCircle2 } from 'lucide-react';
import type { Campaign, ChannelPerformance } from '../hooks/useDashboardData';

interface DataTableProps {
  campaigns?: Campaign[];
  channels?: ChannelPerformance[];
}

export function DataTable({ campaigns = [], channels = [] }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedPerformance, setSelectedPerformance] = useState('All');
  const [sortField, setSortField] = useState<string>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const channelData = useMemo(() => {
    if (channels && channels.length > 0) {
      return channels;
    }

    if (campaigns && campaigns.length > 0) {
      const map = new Map<string, ChannelPerformance>();
      campaigns.forEach((c) => {
        const existing = map.get(c.channel);
        if (existing) {
          existing.revenue += c.revenue;
          existing.spend += c.spend;
          existing.profit = existing.revenue - existing.spend;
          existing.roi = existing.spend > 0 ? Number(((existing.revenue - existing.spend) / existing.spend * 100).toFixed(2)) : 0;
          existing.roas = existing.spend > 0 ? Number((existing.revenue / existing.spend).toFixed(2)) : 0;
          existing.conversions += c.conversions || Math.round(c.revenue / 2000000);
          existing.ctr = Math.max(existing.ctr, c.ctr);
        } else {
          const rev = c.revenue;
          const sp = c.spend;
          const pr = rev - sp;
          const conv = c.conversions || Math.round(rev / 2000000);
          const clk = Math.round(conv / 0.028);
          const imp = Math.round(clk / ((c.ctr || 2.8) / 100));
          const lds = Math.round(rev / 1000000);
          const qlds = Math.round(lds * 0.7);
          const cust = Math.round(conv * 0.5);

          map.set(c.channel, {
            channel: c.channel,
            revenue: rev,
            spend: sp,
            profit: pr,
            roi: c.roi,
            roas: sp > 0 ? Number((rev / sp).toFixed(2)) : 0,
            ctr: c.ctr,
            cpc: clk > 0 ? Math.round(sp / clk) : 0,
            cpm: imp > 0 ? Math.round((sp / imp) * 1000) : 0,
            conversions: conv,
            conversion_rate: clk > 0 ? Number(((conv / clk) * 100).toFixed(2)) : 2.85,
            cac: cust > 0 ? Math.round(sp / cust) : 0,
            cpa: conv > 0 ? Math.round(sp / conv) : 0,
            leads: lds,
            qualified_leads: qlds,
            customers: cust,
            impressions: imp,
            clicks: clk,
            performance: c.status || 'Active'
          });
        }
      });
      return Array.from(map.values());
    }

    return [
      { channel: 'Google Ads', revenue: 65031115, spend: 20283902, profit: 44747213, roi: 220.60, roas: 3.21, ctr: 2.81, cpc: 22, cpm: 621, conversions: 26150, conversion_rate: 2.85, cac: 1551, cpa: 775, leads: 52300, qualified_leads: 36610, customers: 13075, impressions: 32652811, clicks: 917544, performance: 'Active' },
      { channel: 'Meta Ads', revenue: 60699833, spend: 18997723, profit: 41702110, roi: 219.51, roas: 3.20, ctr: 2.94, cpc: 23, cpm: 673, conversions: 24075, conversion_rate: 2.90, cac: 1578, cpa: 789, leads: 48150, qualified_leads: 33705, customers: 12038, impressions: 28237142, clicks: 830172, performance: 'Active' },
      { channel: 'LinkedIn Ads', revenue: 65286439, spend: 20339897, profit: 44946542, roi: 220.98, roas: 3.21, ctr: 3.12, cpc: 28, cpm: 870, conversions: 22605, conversion_rate: 3.10, cac: 1799, cpa: 900, leads: 45210, qualified_leads: 31647, customers: 11303, impressions: 23371570, clicks: 729193, performance: 'Active' },
      { channel: 'YouTube Ads', revenue: 65319731, spend: 20450898, profit: 44868833, roi: 219.40, roas: 3.19, ctr: 2.68, cpc: 28, cpm: 742, conversions: 19200, conversion_rate: 2.60, cac: 2130, cpa: 1065, leads: 38400, qualified_leads: 26880, customers: 9600, impressions: 27554514, clicks: 738461, performance: 'Completed' },
      { channel: 'Email Marketing', revenue: 63662880, spend: 19927583, profit: 43735297, roi: 219.47, roas: 3.19, ctr: 2.70, cpc: 49, cpm: 1325, conversions: 10960, conversion_rate: 2.70, cac: 3636, cpa: 1818, leads: 21922, qualified_leads: 15345, customers: 5480, impressions: 15034259, clicks: 405925, performance: 'Completed' }
    ];
  }, [channels, campaigns]);

  const formatCrores = (val: number) => {
    if (val === 0) return '₹0 Cr';
    const crores = val / 1e7;
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: crores >= 100 ? 0 : 2
    }).format(crores);
    return `₹${formatted} Cr`;
  };

  const formatCurrencyRupees = (val: number) => {
    return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val)}`;
  };

  const formatCount = (val: number) => {
    return new Intl.NumberFormat('en-IN').format(val);
  };

  const formatPercent = (val: number) => {
    const pct = val < 1 ? val * 100 : val;
    return `${pct.toFixed(2)}%`;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const uniqueChannels = useMemo(() => {
    const channelsSet = new Set(channelData.map(c => c.channel));
    return ['All', ...Array.from(channelsSet)];
  }, [channelData]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...channelData];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c =>
        c.channel.toLowerCase().includes(q) ||
        (c.performance && c.performance.toLowerCase().includes(q))
      );
    }

    if (selectedChannel !== 'All') {
      result = result.filter(c => c.channel === selectedChannel);
    }

    if (selectedPerformance !== 'All') {
      result = result.filter(c => c.performance === selectedPerformance);
    }

    if (sortField) {
      result.sort((a: any, b: any) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
      });
    }

    return result;
  }, [channelData, searchQuery, selectedChannel, selectedPerformance, sortField, sortDirection]);

  const handleExportCSV = () => {
    const headers = [
      'Channel', 'Spend (INR)', 'Revenue (INR)', 'Profit (INR)',
      'ROI (%)', 'ROAS (x)', 'CTR (%)', 'CPC (INR)', 'CPM (INR)',
      'Conversions', 'Conversion Rate (%)', 'CAC (INR)', 'CPA (INR)',
      'Leads', 'Qualified Leads', 'Customers', 'Performance'
    ];
    const rows = filteredAndSortedData.map(c => [
      `"${c.channel.replace(/"/g, '""')}"`,
      c.spend,
      c.revenue,
      c.profit,
      c.roi,
      c.roas,
      c.ctr,
      c.cpc,
      c.cpm,
      c.conversions,
      c.conversion_rate,
      c.cac,
      c.cpa,
      c.leads,
      c.qualified_leads,
      c.customers,
      `"${c.performance || 'Active'}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'channel_performance_full_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const startIndex = filteredAndSortedData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredAndSortedData.length);

  const getChannelStyles = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'google ads': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'meta ads': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'email marketing': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'linkedin ads': return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      case 'youtube ads': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="bg-card rounded-3xl p-4 sm:p-6 shadow-[var(--card-shadow)] animate-slide-up select-none space-y-4 sm:space-y-5 w-full max-w-full overflow-hidden">
      
      {/* Title & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-foreground">Channel Performance Summary</h3>
          <span className="text-[9px] text-muted uppercase tracking-wider block mt-0.5">
            MARKETING CHANNEL PERFORMANCE & ROI COMPARISON
          </span>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-hover text-foreground font-semibold rounded-xl text-[10px] transition-colors duration-150 cursor-pointer active:scale-95 shadow-xs w-full sm:w-auto justify-center"
          >
            <Download size={11} />
            Export CSV ({filteredAndSortedData.length.toLocaleString()})
          </button>
        </div>
      </div>

      {/* Filter, Search & Rows Per Page Controls Container */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        {/* Search */}
        <div className="sm:col-span-5 relative flex items-center">
          <Search size={12} className="absolute left-3 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search channels..."
            className="w-full pl-8 pr-4 py-2 border border-border rounded-xl text-[10px] bg-background/50 text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Channel Filter */}
        <div className="sm:col-span-3 flex items-center gap-2">
          <span className="text-[10px] text-muted shrink-0">Channel:</span>
          <select
            value={selectedChannel}
            onChange={(e) => {
              setSelectedChannel(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-2 border border-border rounded-xl text-[10px] bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {uniqueChannels.map((ch, idx) => (
              <option key={idx} value={ch} className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">{ch}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-2 flex items-center gap-2">
          <span className="text-[10px] text-muted shrink-0">Status:</span>
          <select
            value={selectedPerformance}
            onChange={(e) => {
              setSelectedPerformance(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-2 border border-border rounded-xl text-[10px] bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All" className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">All Statuses</option>
            <option value="Active" className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">Active</option>
            <option value="Completed" className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">Completed</option>
            <option value="Paused" className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">Paused</option>
          </select>
        </div>

        {/* Rows Per Page Selector */}
        <div className="sm:col-span-2 flex items-center gap-2">
          <span className="text-[10px] text-muted shrink-0">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full px-2 py-2 border border-border rounded-xl text-[10px] bg-card font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value={10} className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">10 / page</option>
            <option value={25} className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">25 / page</option>
            <option value={50} className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">50 / page</option>
            <option value={100} className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">100 / page</option>
          </select>
        </div>
      </div>

      {/* MOBILE RESPONSIVE CHANNEL CARDS (Shown on screens < 768px) */}
      <div className="block md:hidden space-y-3">
        {paginatedData.length > 0 ? (
          paginatedData.map((row, i) => (
            <div key={i} className="bg-background/70 border border-border/80 rounded-2xl p-3.5 shadow-xs space-y-3">
              {/* Header row: Channel & Performance */}
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[10px] ${getChannelStyles(row.channel)} shrink-0`}>
                    {row.channel.charAt(0)}
                  </div>
                  <h4 className="text-xs font-extrabold text-foreground leading-snug">{row.channel}</h4>
                </div>
                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase ${
                  row.performance === 'Active' ? 'bg-green-500/10 text-primary border-green-500/20' :
                  row.performance === 'Completed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                  'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {row.performance === 'Active' && <Play size={8} />}
                  {row.performance === 'Completed' && <CheckCircle2 size={8} />}
                  {row.performance === 'Paused' && <Pause size={8} />}
                  {row.performance || 'Active'}
                </span>
              </div>

              {/* 4x4 Grid of Channel Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">Spend</span>
                  <span className="font-mono text-muted">{formatCrores(row.spend)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">Revenue</span>
                  <span className="font-mono font-bold text-foreground">{formatCrores(row.revenue)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">Profit</span>
                  <span className="font-mono font-bold text-emerald-500">{formatCrores(row.profit)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">ROI</span>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-500/10 text-primary border border-green-500/20">
                    {formatPercent(row.roi)}
                  </span>
                </div>

                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">ROAS</span>
                  <span className="font-mono font-bold text-indigo-500">{row.roas}x</span>
                </div>
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">CTR</span>
                  <span className="font-mono text-muted">{formatPercent(row.ctr)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">CPC</span>
                  <span className="font-mono text-muted">{formatCurrencyRupees(row.cpc)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">CPM</span>
                  <span className="font-mono text-muted">{formatCurrencyRupees(row.cpm)}</span>
                </div>

                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">Conversions</span>
                  <span className="font-mono text-foreground font-semibold">{formatCount(row.conversions)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">Conv. Rate</span>
                  <span className="font-mono text-muted">{formatPercent(row.conversion_rate)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">CAC</span>
                  <span className="font-mono text-muted">{formatCurrencyRupees(row.cac)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">CPA</span>
                  <span className="font-mono text-muted">{formatCurrencyRupees(row.cpa)}</span>
                </div>

                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">Leads</span>
                  <span className="font-mono text-muted">{formatCount(row.leads)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">Qual. Leads</span>
                  <span className="font-mono text-muted">{formatCount(row.qualified_leads)}</span>
                </div>
                <div>
                  <span className="text-muted block text-[8px] uppercase tracking-wider font-bold">Customers</span>
                  <span className="font-mono font-bold text-foreground">{formatCount(row.customers)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-muted font-medium bg-background/50 rounded-2xl border border-border">
            No channels found matching filter criteria.
          </div>
        )}
      </div>

      {/* DESKTOP DATA TABLE (Shown on screens >= 768px) */}
      <div className="hidden md:block overflow-x-auto relative rounded-2xl max-h-[560px]">
        <table className="w-full text-left text-[11px] border-separate border-spacing-y-2 min-w-[1400px]">
          <thead className="sticky top-0 bg-card/95 backdrop-blur-md z-10">
            <tr className="text-muted font-bold text-left text-[10px] uppercase tracking-wider">
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none" onClick={() => handleSort('channel')}>
                Channel <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('spend')}>
                Spend <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('revenue')}>
                Revenue <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('profit')}>
                Profit <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('roi')}>
                ROI <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('roas')}>
                ROAS <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('ctr')}>
                CTR <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('cpc')}>
                CPC <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('cpm')}>
                CPM <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('conversions')}>
                Conversions <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('conversion_rate')}>
                Conv. Rate <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('cac')}>
                CAC <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('cpa')}>
                CPA <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('leads')}>
                Leads <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('qualified_leads')}>
                Qual. Leads <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-3 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('customers')}>
                Customers <ArrowUpDown size={9} className="inline ml-0.5 text-primary" />
              </th>
            </tr>
          </thead>
          <tbody className="text-foreground font-sans">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr key={i} className="hover:bg-hover transform hover:scale-[1.001] transition-all duration-150 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                  {/* Channel */}
                  <td className="py-3 px-3 bg-card group-hover:bg-hover rounded-l-2xl sticky left-0 z-10">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[9px] ${getChannelStyles(row.channel)} shrink-0`}>
                        {row.channel.charAt(0)}
                      </div>
                      <span className="font-bold text-foreground text-[11px] whitespace-nowrap">{row.channel}</span>
                    </div>
                  </td>

                  {/* Spend */}
                  <td className="py-3 px-3 text-right font-mono text-muted bg-card group-hover:bg-hover">{formatCrores(row.spend)}</td>

                  {/* Revenue */}
                  <td className="py-3 px-3 text-right font-mono font-bold bg-card group-hover:bg-hover">{formatCrores(row.revenue)}</td>

                  {/* Profit */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-500 bg-card group-hover:bg-hover">{formatCrores(row.profit)}</td>

                  {/* ROI */}
                  <td className="py-3 px-3 text-right bg-card group-hover:bg-hover">
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-green-500/10 text-primary border border-green-500/20">
                      {formatPercent(row.roi)}
                    </span>
                  </td>

                  {/* ROAS */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-indigo-500 bg-card group-hover:bg-hover">{row.roas}x</td>

                  {/* CTR */}
                  <td className="py-3 px-3 text-right font-mono text-muted bg-card group-hover:bg-hover">{formatPercent(row.ctr)}</td>

                  {/* CPC */}
                  <td className="py-3 px-3 text-right font-mono text-muted bg-card group-hover:bg-hover">{formatCurrencyRupees(row.cpc)}</td>

                  {/* CPM */}
                  <td className="py-3 px-3 text-right font-mono text-muted bg-card group-hover:bg-hover">{formatCurrencyRupees(row.cpm)}</td>

                  {/* Conversions */}
                  <td className="py-3 px-3 text-right font-mono font-semibold text-foreground bg-card group-hover:bg-hover">{formatCount(row.conversions)}</td>

                  {/* Conversion Rate */}
                  <td className="py-3 px-3 text-right font-mono text-muted bg-card group-hover:bg-hover">{formatPercent(row.conversion_rate)}</td>

                  {/* CAC */}
                  <td className="py-3 px-3 text-right font-mono text-muted bg-card group-hover:bg-hover">{formatCurrencyRupees(row.cac)}</td>

                  {/* CPA */}
                  <td className="py-3 px-3 text-right font-mono text-muted bg-card group-hover:bg-hover">{formatCurrencyRupees(row.cpa)}</td>

                  {/* Leads */}
                  <td className="py-3 px-3 text-right font-mono text-muted bg-card group-hover:bg-hover">{formatCount(row.leads)}</td>

                  {/* Qualified Leads */}
                  <td className="py-3 px-3 text-right font-mono text-muted bg-card group-hover:bg-hover">{formatCount(row.qualified_leads)}</td>

                  {/* Customers */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-foreground bg-card group-hover:bg-hover rounded-r-2xl">{formatCount(row.customers)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={16} className="py-12 text-center text-xs text-muted font-medium bg-card rounded-2xl">
                  No channels found matching filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Pagination Controls & Record Range Indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 select-none">
        <span className="text-[10px] text-muted font-medium font-mono">
          Showing {startIndex}–{endIndex} of {filteredAndSortedData.length.toLocaleString()} records
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 border border-border text-muted rounded-xl hover:bg-hover disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-150 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
          >
            <ChevronLeft size={12} />
            Previous
          </button>

          <span className="text-[10px] font-bold text-foreground px-2 font-mono">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1.5 border border-border text-muted rounded-xl hover:bg-hover disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-150 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
          >
            Next
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

    </div>
  );
}
