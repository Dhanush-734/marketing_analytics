import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Download, ChevronLeft, ChevronRight, Play, Pause, CheckCircle2, MoreHorizontal } from 'lucide-react';
import type { Campaign } from '../hooks/useDashboardData';

interface DataTableProps {
  campaigns: Campaign[];
}

export function DataTable({ campaigns }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortField, setSortField] = useState<string>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const formatCompact = (val: number, isCurrency: boolean = false) => {
    if (val === 0) return isCurrency ? '₹0' : '0';
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
    return isCurrency ? `₹${formatted}` : formatted;
  };

  const formatRaw = (val: number, isCurrency: boolean = false) => {
    return isCurrency
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
      : new Intl.NumberFormat('en-IN').format(val);
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
    const channelsSet = new Set(campaigns.map(c => c.channel));
    return ['All', ...Array.from(channelsSet)];
  }, [campaigns]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...campaigns];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c =>
        c.campaign.toLowerCase().includes(q) ||
        c.channel.toLowerCase().includes(q) ||
        (c.status && c.status.toLowerCase().includes(q))
      );
    }

    if (selectedChannel !== 'All') {
      result = result.filter(c => c.channel === selectedChannel);
    }

    if (selectedStatus !== 'All') {
      result = result.filter(c => c.status === selectedStatus);
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
  }, [campaigns, searchQuery, selectedChannel, selectedStatus, sortField, sortDirection]);

  const handleExportCSV = () => {
    const headers = ['Campaign Name', 'Channel', 'Revenue (INR)', 'Spend (INR)', 'ROI (%)', 'CTR (%)', 'Status'];
    const rows = filteredAndSortedData.map(c => [
      `"${c.campaign.replace(/"/g, '""')}"`,
      `"${c.channel.replace(/"/g, '""')}"`,
      c.revenue,
      c.spend,
      c.roi,
      c.ctr,
      `"${c.status || 'Active'}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'campaigns_filtered_export.csv');
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
    <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] animate-slide-up select-none space-y-5">
      
      {/* Title & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-foreground">Campaign Registers</h3>
          <span className="text-[9px] text-muted uppercase tracking-wider block mt-0.5">
            Complete attribution listings from Snowflake ({campaigns.length.toLocaleString()} total campaigns)
          </span>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-hover text-foreground font-semibold rounded-xl text-[10px] transition-colors duration-150 cursor-pointer active:scale-95 shadow-xs"
          >
            <Download size={11} />
            Export CSV ({filteredAndSortedData.length.toLocaleString()})
          </button>
        </div>
      </div>

      {/* Filter, Search & Rows Per Page Controls Container */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
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
            placeholder="Search campaigns by name, channel, status..."
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
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
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
            <option value={10} className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">10 per page</option>
            <option value={25} className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">25 per page</option>
            <option value={50} className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">50 per page</option>
            <option value={100} className="bg-white text-slate-900 dark:bg-[#131A2E] dark:text-slate-100">100 per page</option>
          </select>
        </div>
      </div>

      {/* Responsive Data Table Container */}
      <div className="overflow-x-auto relative rounded-2xl max-h-[540px]">
        <table className="w-full text-left text-[11px] border-separate border-spacing-y-2 min-w-[650px]">
          <thead className="sticky top-0 bg-card/95 backdrop-blur-md z-10">
            <tr className="text-muted font-bold text-left">
              <th className="py-2.5 px-4 hover:text-foreground cursor-pointer select-none" onClick={() => handleSort('campaign')}>
                Campaign Name <ArrowUpDown size={10} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-4 hover:text-foreground cursor-pointer select-none" onClick={() => handleSort('channel')}>
                Channel <ArrowUpDown size={10} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-4 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('revenue')}>
                Revenue <ArrowUpDown size={10} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-4 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('spend')}>
                Spend <ArrowUpDown size={10} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-4 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('roi')}>
                ROI <ArrowUpDown size={10} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-4 hover:text-foreground cursor-pointer select-none text-right" onClick={() => handleSort('ctr')}>
                CTR <ArrowUpDown size={10} className="inline ml-0.5 text-primary" />
              </th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr key={i} className="hover:bg-hover transform hover:scale-[1.001] transition-all duration-150 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                  {/* Left corner rounded */}
                  <td className="py-3 px-4 font-bold max-w-[180px] truncate bg-card group-hover:bg-hover rounded-l-2xl">{row.campaign}</td>
                  
                  <td className="py-3 px-4 bg-card group-hover:bg-hover">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[9px] ${getChannelStyles(row.channel)} shrink-0`}>
                        {row.channel.charAt(0)}
                      </div>
                      <span className="font-semibold text-muted text-[10px]">{row.channel}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold bg-card group-hover:bg-hover" title={formatRaw(row.revenue, true)}>
                    {formatCompact(row.revenue, true)}
                  </td>
                  
                  <td className="py-3 px-4 text-right font-mono text-muted bg-card group-hover:bg-hover" title={formatRaw(row.spend, true)}>
                    {formatCompact(row.spend, true)}
                  </td>

                  <td className="py-3 px-4 text-right bg-card group-hover:bg-hover">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                      row.roi >= 200
                        ? 'bg-green-500/10 text-primary border border-green-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {formatPercent(row.roi)}
                    </span>
                  </td>
                  
                  <td className="py-3 px-4 text-right font-mono text-muted bg-card group-hover:bg-hover">{formatPercent(row.ctr)}</td>

                  <td className="py-3 px-4 text-center bg-card group-hover:bg-hover">
                    <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-wider ${
                      row.status === 'Active'
                        ? 'bg-green-500/10 text-primary border-green-500/20'
                        : row.status === 'Completed'
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {row.status === 'Active' && <Play size={8} />}
                      {row.status === 'Completed' && <CheckCircle2 size={8} />}
                      {row.status === 'Paused' && <Pause size={8} />}
                      {row.status}
                    </span>
                  </td>

                  {/* Right corner rounded */}
                  <td className="py-3 px-4 text-center bg-card group-hover:bg-hover rounded-r-2xl">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => alert(`Campaign Details: "${row.campaign}"\nChannel: ${row.channel}\nRevenue: ${formatRaw(row.revenue, true)}\nSpend: ${formatRaw(row.spend, true)}\nROI: ${formatPercent(row.roi)}`)}
                        className="p-1.5 hover:bg-hover hover:text-foreground text-muted rounded-lg transition-colors cursor-pointer"
                        title="View Campaign Details"
                      >
                        <MoreHorizontal size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-xs text-muted font-medium bg-card rounded-2xl">
                  No campaigns found matching filter criteria.
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
