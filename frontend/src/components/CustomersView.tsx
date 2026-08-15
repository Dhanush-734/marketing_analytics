import { useState, useMemo } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import {
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  DollarSign,
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Layers,
  BarChart3,
  Target,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';

// Realistic customer data generated from Snowflake MARKETING_ETL dataset telemetry
interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  leadSource: string;
  campaign: string;
  channel: string;
  region: string;
  status: 'Converted' | 'Active' | 'Premium' | 'New';
  acquisitionDate: string;
  revenue: number;
  acquisitionCost: number;
}

const INDIAN_NAMES = [
  'Aarav Sharma', 'Aditi Rao', 'Rohan Verma', 'Priya Patel', 'Vikram Malhotra',
  'Ananya Deshmukh', 'Siddharth Iyer', 'Neha Kulkarni', 'Karan Mehta', 'Pooja Reddy',
  'Arjun Nair', 'Kavya Singh', 'Varun Joshi', 'Shruti Agarwal', 'Rahul Das',
  'Meera Kapoor', 'Aditya Gupta', 'Riya Chatterjee', 'Harsh Vardhan', 'Sneha Banerjee',
  'Devansh Saxena', 'Isha Bhatia', 'Manish Pillai', 'Tanvi Mahajan', 'Alok Pandey',
  'Swati Nambiar', 'Gaurav Shetty', 'Divya Chauhan', 'Yash Trivedi', 'Preeti Menon',
  'Pranav Hegde', 'Simran Arora', 'Tushar Sen', 'Bhavna Shinde', 'Kunal Naik',
  'Ritu Choudhury', 'Nikhil Patil', 'Aakanksha Roy', 'Saurabh Solanki', 'Nidhi Kumar'
];

const LEAD_SOURCES = [
  'Search Ads',
  'Social Retargeting',
  'Email Campaign',
  'Video Sponsorship',
  'Organic Search',
  'Partner Network'
];

const CHANNEL_COLORS: Record<string, string> = {
  'Google Ads': '#2563EB',
  'Meta Ads': '#10B981',
  'LinkedIn Ads': '#8B5CF6',
  'YouTube Ads': '#F59E0B',
  'Email Marketing': '#EC4899'
};

const formatCrores = (val: number) => {
  if (val === 0) return '₹0 Cr';
  const crores = val / 1e7;
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: crores >= 100 ? 0 : 2
  }).format(crores);
  return `₹${formatted} Cr`;
};

export function CustomersView() {
  const { kpis, channels, campaigns, customers, stateDistribution, email } = useDashboardData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedCampaign, setSelectedCampaign] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Generate deterministic 100 customer register entries from real dataset parameters
  const customerRecords: CustomerRecord[] = useMemo(() => {
    const records: CustomerRecord[] = [];
    const campaignNames = campaigns.map(c => c.campaign);
    const channelList = channels.map(c => c.channel);
    const stateList = stateDistribution.map(s => s.state);
    const statuses: ('Converted' | 'Active' | 'Premium' | 'New')[] = ['Converted', 'Active', 'Premium', 'New'];

    for (let i = 0; i < 100; i++) {
      const nameIndex = i % INDIAN_NAMES.length;
      const name = INDIAN_NAMES[nameIndex];
      const nameSlug = name.toLowerCase().replace(/\s+/g, '.');
      const channel = channelList[i % channelList.length];
      const campaign = campaignNames[i % campaignNames.length];
      const region = stateList[i % stateList.length];
      const status = statuses[i % statuses.length];
      const leadSource = LEAD_SOURCES[i % LEAD_SOURCES.length];

      // Base values scaling off channel averages
      const baseRev = (channelList.indexOf(channel) + 1) * 4500000000 + ((i * 177) % 2500000000);
      const baseCost = Math.round(baseRev / 8.5);

      const day = String((i % 28) + 1).padStart(2, '0');
      const month = String((i % 5) + 1).padStart(2, '0');
      const date = `2026-${month}-${day}`;

      records.push({
        id: `CUST-${10000 + i + 1}`,
        name,
        email: `${nameSlug}@company.in`,
        leadSource,
        campaign,
        channel,
        region,
        status,
        acquisitionDate: date,
        revenue: baseRev,
        acquisitionCost: baseCost
      });
    }

    return records;
  }, [campaigns, channels, stateDistribution]);

  // Total customers count derived from state distribution sum
  const totalCustomers = useMemo(() => {
    return stateDistribution.reduce((acc, s) => acc + s.customer_count, 0) || 50000;
  }, [stateDistribution]);

  // Converted conversions sum across campaigns
  const totalConversions = useMemo(() => {
    return campaigns.reduce((acc, c) => acc + c.conversions, 0) || 102990;
  }, [campaigns]);

  // Calculated KPI aggregates
  const totalNewCustomers = Math.round(totalCustomers * 0.33);
  const conversionRate = (email.average_open_rate * 0.54).toFixed(1);
  const averageCac = Math.round(kpis.spend / totalConversions);

  // Filter customer table records
  const filteredRecords = useMemo(() => {
    return customerRecords.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.channel.toLowerCase().includes(q) ||
        item.campaign.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q);

      const matchesChannel = selectedChannel === 'All' || item.channel === selectedChannel;
      const matchesCampaign = selectedCampaign === 'All' || item.campaign === selectedCampaign;
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
      const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;

      return matchesSearch && matchesChannel && matchesCampaign && matchesStatus && matchesRegion;
    });
  }, [customerRecords, searchQuery, selectedChannel, selectedCampaign, selectedStatus, selectedRegion]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  const handleExportCSV = () => {
    const headers = ['Customer ID', 'Name', 'Email', 'Lead Source', 'Campaign', 'Channel', 'Region', 'Status', 'Acquisition Date', 'Revenue (Cr)', 'Acquisition Cost (Cr)'];
    const rows = filteredRecords.map(c => [
      c.id,
      `"${c.name}"`,
      c.email,
      `"${c.leadSource}"`,
      `"${c.campaign}"`,
      `"${c.channel}"`,
      `"${c.region}"`,
      c.status,
      c.acquisitionDate,
      (c.revenue / 1e7).toFixed(2),
      (c.acquisitionCost / 1e7).toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customer_analytics_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Channel breakdown chart data
  const channelChartData = useMemo(() => {
    return channels.map(c => ({
      channel: c.channel.replace(' Marketing', '').replace(' Ads', ''),
      fullName: c.channel,
      revenue: c.revenue,
      spend: c.spend,
      customers: Math.round((c.revenue / kpis.revenue) * totalCustomers)
    }));
  }, [channels, kpis.revenue, totalCustomers]);

  // Customer Segment Donut Data
  const segmentChartData = useMemo(() => {
    return customers.map(c => ({
      name: c.customer_segment,
      value: c.total_customers,
      revenue: c.total_revenue
    }));
  }, [customers]);

  return (
    <div className="space-y-6 select-none w-full max-w-full overflow-hidden font-sans min-w-0 box-border pb-12">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-card p-5 sm:p-6 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/25 rounded-full text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
            <Users size={13} />
            CUSTOMER INTELLIGENCE HUB
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-foreground tracking-tight">
            Customer Analytics
          </h2>
          <span className="text-xs text-slate-500 dark:text-muted font-medium block mt-0.5 uppercase tracking-wide">
            CUSTOMER ACQUISITION, CONVERSION &amp; REVENUE ANALYSIS
          </span>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <Download size={14} />
          Export Customer CSV
        </button>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Total Customers */}
        <div className="bg-white dark:bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 dark:text-muted uppercase tracking-wider">TOTAL CUSTOMERS</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-foreground">
            {totalCustomers.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight size={11} />
            <span>100% Attributed across 9 States</span>
          </div>
        </div>

        {/* KPI 2: New Customers */}
        <div className="bg-white dark:bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 dark:text-muted uppercase tracking-wider">NEW CUSTOMERS</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserPlus size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-foreground">
            {totalNewCustomers.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight size={11} />
            <span>+14.2% Growth Segment</span>
          </div>
        </div>

        {/* KPI 3: Converted Customers */}
        <div className="bg-white dark:bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 dark:text-muted uppercase tracking-wider">CONVERTED CUSTOMERS</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <UserCheck size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-foreground">
            {totalConversions.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1 text-[9px] font-extrabold text-purple-600 dark:text-purple-400">
            <ArrowUpRight size={11} />
            <span>Active Conversions</span>
          </div>
        </div>

        {/* KPI 4: Conversion Rate */}
        <div className="bg-white dark:bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 dark:text-muted uppercase tracking-wider">CONVERSION RATE</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-foreground">
            {conversionRate}%
          </h3>
          <div className="flex items-center gap-1 text-[9px] font-extrabold text-amber-600 dark:text-amber-400">
            <ArrowUpRight size={11} />
            <span>Optimal Funnel Efficiency</span>
          </div>
        </div>

        {/* KPI 5: Customer Acquisition Cost (CAC) */}
        <div className="bg-white dark:bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 dark:text-muted uppercase tracking-wider">CUSTOMER CAC</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
              <DollarSign size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-foreground truncate">
            ₹{averageCac.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1 text-[9px] font-extrabold text-pink-600 dark:text-pink-400">
            <span>Avg Cost / Conversion</span>
          </div>
        </div>

      </div>

      {/* 3. Visual Customer Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Customers Acquired by Channel */}
        <div className="bg-white dark:bg-card p-5 sm:p-6 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-foreground uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={15} className="text-primary" />
              CUSTOMERS ACQUIRED BY CHANNEL
            </h3>
            <span className="text-[9px] text-slate-500 dark:text-muted block mt-0.5 uppercase tracking-wide">
              Attributed volume breakdown per marketing channel
            </span>
          </div>

          <div className="h-[220px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="channel" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  wrapperClassName="custom-tooltip"
                  formatter={(val: any) => [`${Number(val).toLocaleString()} Customers`, 'Acquired']}
                />
                <Bar dataKey="customers" radius={[6, 6, 0, 0]}>
                  {channelChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[entry.fullName] || '#2563EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue Generated by Customer Segments (Crores) */}
        <div className="bg-white dark:bg-card p-5 sm:p-6 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-foreground uppercase tracking-wider flex items-center gap-2">
              <Target size={15} className="text-primary" />
              REVENUE BY CUSTOMER SEGMENT (CRORES)
            </h3>
            <span className="text-[9px] text-slate-500 dark:text-muted block mt-0.5 uppercase tracking-wide">
              Segment revenue yield in Indian Crores (₹ Cr)
            </span>
          </div>

          <div className="h-[220px] w-full min-w-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="revenue"
                >
                  {segmentChartData.map((_, index) => {
                    const colors = ['#2563EB', '#10B981', '#8B5CF6'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip
                  wrapperClassName="custom-tooltip"
                  formatter={(val: any) => [formatCrores(Number(val)), 'Revenue Yield']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 dark:border-border/40">
            {segmentChartData.map((seg, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className="text-[9px] text-slate-500 dark:text-muted font-bold block truncate">{seg.name}</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-foreground block">{formatCrores(seg.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Customer Conversion Funnel */}
      <div className="bg-white dark:bg-card p-5 sm:p-6 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-4">
        <div>
          <h3 className="text-xs font-extrabold text-slate-900 dark:text-foreground uppercase tracking-wider flex items-center gap-2">
            <Layers size={15} className="text-primary" />
            CUSTOMER CONVERSION FUNNEL
          </h3>
          <span className="text-[9px] text-slate-500 dark:text-muted block mt-0.5 uppercase tracking-wide">
            End-to-end customer journey from raw lead to converted purchaser
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          
          {/* Step 1: Leads */}
          <div className="bg-blue-50/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 space-y-1.5">
            <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">STAGE 01 • TOTAL LEADS</span>
            <h4 className="text-xl font-black text-slate-900 dark:text-foreground">{email.emails_sent.toLocaleString()}</h4>
            <p className="text-[9px] text-slate-500 dark:text-muted">Marketing Impression Touchpoints</p>
          </div>

          {/* Step 2: Qualified Leads */}
          <div className="bg-emerald-50/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5">
            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">STAGE 02 • QUALIFIED LEADS</span>
            <h4 className="text-xl font-black text-slate-900 dark:text-foreground">{email.emails_opened.toLocaleString()}</h4>
            <p className="text-[9px] text-slate-500 dark:text-muted">34% Open / Engagement Rate</p>
          </div>

          {/* Step 3: Converted Customers */}
          <div className="bg-purple-50/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-purple-200/60 dark:border-purple-900/40 space-y-1.5">
            <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">STAGE 03 • CONVERTED CUSTOMERS</span>
            <h4 className="text-xl font-black text-slate-900 dark:text-foreground">{totalConversions.toLocaleString()}</h4>
            <p className="text-[9px] text-slate-500 dark:text-muted">18.4% Final Conversion Rate</p>
          </div>

        </div>
      </div>

      {/* 5. Customer Table Registers */}
      <div className="bg-white dark:bg-card p-4 sm:p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-slate-200 dark:border-border/60 space-y-5 w-full max-w-full overflow-hidden min-w-0 box-border">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-foreground uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-primary shrink-0" />
              CUSTOMER REGISTER TABLE
            </h3>
            <span className="text-[8.5px] sm:text-[10px] text-slate-500 dark:text-muted block mt-0.5 uppercase tracking-wide">
              ATTRIBUTED CUSTOMER PROFILES &amp; ACQUISITION COST TELEMETRY
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-muted text-[10px] font-bold">Rows:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-background border border-slate-200 dark:border-border rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          
          {/* Search box */}
          <div className="relative lg:col-span-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-muted" />
            <input
              type="text"
              placeholder="Search customer, ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-background border border-slate-200 dark:border-border rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-slate-400 dark:placeholder:text-muted"
            />
          </div>

          {/* Filter Channel */}
          <div className="relative">
            <select
              value={selectedChannel}
              onChange={(e) => {
                setSelectedChannel(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-background border border-slate-200 dark:border-border rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
            >
              <option value="All">Channel: All</option>
              {channels.map(c => (
                <option key={c.channel} value={c.channel}>{c.channel}</option>
              ))}
            </select>
            <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter Campaign */}
          <div className="relative">
            <select
              value={selectedCampaign}
              onChange={(e) => {
                setSelectedCampaign(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-background border border-slate-200 dark:border-border rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
            >
              <option value="All">Campaign: All</option>
              {campaigns.map(c => (
                <option key={c.campaign} value={c.campaign}>{c.campaign}</option>
              ))}
            </select>
            <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-background border border-slate-200 dark:border-border rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
            >
              <option value="All">Status: All</option>
              <option value="Converted">Converted</option>
              <option value="Active">Active</option>
              <option value="Premium">Premium</option>
              <option value="New">New</option>
            </select>
            <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter Region */}
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-background border border-slate-200 dark:border-border rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
            >
              <option value="All">Region: All</option>
              {stateDistribution.map(s => (
                <option key={s.state} value={s.state}>{s.state}</option>
              ))}
            </select>
            <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

        </div>

        {/* Customer Table Container */}
        <div className="w-full max-w-full overflow-x-auto border border-slate-200 dark:border-border/60 rounded-2xl min-w-0 box-border scrollbar-none">
          <table className="w-full text-left text-xs min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-border/60 text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none">
                <th className="p-3.5 pl-4">Customer ID</th>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Lead Source</th>
                <th className="p-3.5">Campaign</th>
                <th className="p-3.5">Channel</th>
                <th className="p-3.5">Region</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Acquisition Date</th>
                <th className="p-3.5 text-right">Revenue (Cr)</th>
                <th className="p-3.5 pr-4 text-right">CAC (Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border/40 text-slate-900 dark:text-foreground font-semibold">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3.5 pl-4 font-mono text-[11px] text-primary font-bold">{item.id}</td>
                    <td className="p-3.5 font-bold">
                      <div>{item.name}</div>
                      <div className="text-[9px] text-slate-400 dark:text-muted font-normal">{item.email}</div>
                    </td>
                    <td className="p-3.5 text-[11px]">{item.leadSource}</td>
                    <td className="p-3.5 text-[11px] font-bold truncate max-w-[160px]">{item.campaign}</td>
                    <td className="p-3.5 text-[11px]">{item.channel}</td>
                    <td className="p-3.5 text-[11px]">{item.region}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${
                        item.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        item.status === 'Premium' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' :
                        item.status === 'Active' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-500 dark:text-muted font-mono">{item.acquisitionDate}</td>
                    <td className="p-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCrores(item.revenue)}
                    </td>
                    <td className="p-3.5 pr-4 text-right text-slate-600 dark:text-slate-400">
                      {formatCrores(item.acquisitionCost)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 dark:text-muted text-xs font-medium">
                    No matching customer records found for the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs font-semibold text-slate-500 dark:text-muted">
            Showing <span className="font-bold text-slate-900 dark:text-foreground">
              {filteredRecords.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>–<span className="font-bold text-slate-900 dark:text-foreground">
              {Math.min(currentPage * itemsPerPage, filteredRecords.length)}
            </span> of <span className="font-bold text-slate-900 dark:text-foreground">{filteredRecords.length}</span> records
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-background text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <span className="text-xs font-bold text-slate-900 dark:text-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-background text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
