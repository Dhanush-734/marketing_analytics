import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Play, Pause, CheckCircle2 } from 'lucide-react';
import type { Campaign } from '../hooks/useDashboardData';

interface CampaignSummaryTableProps {
  campaigns?: Campaign[];
}

export function CampaignSummaryTable({ campaigns = [] }: CampaignSummaryTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortField, setSortField] = useState<string>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Currency formatter using Crores / Lakhs standard (₹X Cr / ₹X L)
  const formatCrores = (val: number) => {
    if (!val || val === 0) return '₹0 Cr';
    if (Math.abs(val) >= 1e7) {
      const crores = val / 1e7;
      const formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: crores >= 100 ? 0 : 2
      }).format(crores);
      return `₹${formatted} Cr`;
    }
    if (Math.abs(val) >= 1e5) {
      const lakhs = val / 1e5;
      const formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2
      }).format(lakhs);
      return `₹${formatted} L`;
    }
    return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val)}`;
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-IN').format(val || 0);
  };

  // Safe ROI Calculation formula: ((Revenue - Spend) / Spend) * 100 with division by zero protection
  const calculateRoi = (revenue: number, spend: number): number => {
    if (!spend || spend === 0) return 0.0;
    return Number((((revenue - spend) / spend) * 100).toFixed(2));
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

  // Unique channel list for filter dropdown
  const uniqueChannels = useMemo(() => {
    const set = new Set(campaigns.map(c => c.channel));
    return ['All', ...Array.from(set)];
  }, [campaigns]);

  // Unique status list for filter dropdown
  const uniqueStatuses = useMemo(() => {
    const set = new Set(campaigns.map(c => c.status || 'Active'));
    return ['All', ...Array.from(set)];
  }, [campaigns]);

  // Filter and Sort Data (Default: Highest Revenue -> Lowest Revenue)
  const filteredAndSortedData = useMemo(() => {
    let result = [...campaigns];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.campaign.toLowerCase().includes(q) ||
          c.channel.toLowerCase().includes(q)
      );
    }

    // Filter by channel
    if (selectedChannel !== 'All') {
      result = result.filter((c) => c.channel.toLowerCase() === selectedChannel.toLowerCase());
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      result = result.filter((c) => (c.status || 'Active').toLowerCase() === selectedStatus.toLowerCase());
    }

    // Sort by field (Default: revenue DESC)
    result.sort((a, b) => {
      let aVal: any = 0;
      let bVal: any = 0;

      switch (sortField) {
        case 'campaign':
          aVal = a.campaign;
          bVal = b.campaign;
          break;
        case 'channel':
          aVal = a.channel;
          bVal = b.channel;
          break;
        case 'spend':
          aVal = a.spend;
          bVal = b.spend;
          break;
        case 'revenue':
          aVal = a.revenue;
          bVal = b.revenue;
          break;
        case 'roi':
          aVal = a.roi !== undefined ? a.roi : calculateRoi(a.revenue, a.spend);
          bVal = b.roi !== undefined ? b.roi : calculateRoi(b.revenue, b.spend);
          break;
        case 'conversions':
          aVal = a.conversions;
          bVal = b.conversions;
          break;
        case 'status':
          aVal = a.status || 'Active';
          bVal = b.status || 'Active';
          break;
        default:
          aVal = a.revenue;
          bVal = b.revenue;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [campaigns, searchQuery, selectedChannel, selectedStatus, sortField, sortDirection]);

  // Pagination calculation
  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status?: string) => {
    const st = (status || 'Active').toLowerCase();
    if (st === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 uppercase tracking-wider">
          <Play size={10} className="fill-current" /> Active
        </span>
      );
    }
    if (st === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-500 border border-blue-500/30 uppercase tracking-wider">
          <CheckCircle2 size={10} /> Completed
        </span>
      );
    }
    if (st === 'paused') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/30 uppercase tracking-wider">
          <Pause size={10} className="fill-current" /> Paused
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-500/10 text-purple-500 border border-purple-500/30 uppercase tracking-wider">
        {status || 'Scheduled'}
      </span>
    );
  };

  return (
    <div className="bg-card p-4 sm:p-6 rounded-3xl shadow-[var(--card-shadow)] border border-transparent w-full max-w-full overflow-hidden space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-tight">
            CAMPAIGN SUMMARY
          </h3>
          <span className="text-[9px] sm:text-[10px] text-muted uppercase tracking-wider block mt-0.5">
            CAMPAIGN-LEVEL PERFORMANCE ACROSS MARKETING CHANNELS
          </span>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:flex-initial min-w-[160px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 bg-background border border-border/80 rounded-2xl text-xs text-foreground placeholder-muted focus:outline-none focus:border-primary font-medium"
            />
          </div>

          {/* Channel Filter */}
          <div className="relative">
            <select
              value={selectedChannel}
              onChange={(e) => { setSelectedChannel(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-background border border-border/80 rounded-2xl text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="All">All Channels</option>
              {uniqueChannels.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-background border border-border/80 rounded-2xl text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {uniqueStatuses.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Rows Per Page Selector */}
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-background border border-border/80 rounded-2xl text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>All Campaigns</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Area with Internal Horizontal Overflow Scroll */}
      <div className="overflow-x-auto w-full -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-border/60 text-[10px] font-extrabold text-muted uppercase tracking-wider">
              <th className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('campaign')}>
                <div className="flex items-center gap-1">
                  <span>Campaign</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('channel')}>
                <div className="flex items-center gap-1">
                  <span>Channel</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('spend')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Spend</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('revenue')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Revenue</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('roi')}>
                <div className="flex items-center justify-end gap-1">
                  <span>ROI</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('conversions')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Conversions</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3 text-center cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-xs font-semibold">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => {
                const calculatedRoi = row.roi !== undefined ? row.roi : calculateRoi(row.revenue, row.spend);
                return (
                  <tr key={idx} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground max-w-[220px] truncate" title={row.campaign}>
                      {row.campaign}
                    </td>
                    <td className="py-3 px-3 text-muted">
                      {row.channel}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-foreground">
                      {formatCrores(row.spend)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-500">
                      {formatCrores(row.revenue)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-primary">
                      {calculatedRoi >= 0 ? `+${calculatedRoi.toFixed(2)}%` : `${calculatedRoi.toFixed(2)}%`}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-foreground">
                      {formatNumber(row.conversions)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(row.status)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted font-medium text-xs">
                  No matching campaigns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/40 text-xs">
        <span className="text-[10.5px] font-semibold text-muted">
          Showing {totalItems === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} campaigns
        </span>

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-xl border border-border/80 bg-background text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-background border border-border/80 text-foreground hover:bg-accent'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-xl border border-border/80 bg-background text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
