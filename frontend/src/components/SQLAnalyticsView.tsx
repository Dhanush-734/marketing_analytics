import { useState, useMemo } from 'react';
import { Database, Play, Download, Table, Terminal, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';

export function SQLAnalyticsView() {
  const { campaigns, channels, customers } = useDashboardData();

  const presetQueries = [
    {
      label: 'Top Campaigns by Revenue',
      query: `SELECT campaign_name, channel, revenue_inr, spend_inr, roi_pct \nFROM snowflake_warehouse.campaigns \nWHERE roi_pct > 150 \nORDER BY revenue_inr DESC;`
    },
    {
      label: 'Channel Performance Aggregates',
      query: `SELECT channel, COUNT(*) as active_campaigns, SUM(revenue_inr) as total_revenue, AVG(roi_pct) as avg_roi \nFROM snowflake_warehouse.marketing_channels \nGROUP BY channel \nORDER BY total_revenue DESC;`
    },
    {
      label: 'High-Value Customer Segments',
      query: `SELECT customer_segment, total_customers, total_revenue_inr, avg_order_value_inr \nFROM snowflake_warehouse.customer_attribution \nORDER BY total_revenue_inr DESC;`
    }
  ];

  const [activeQuery, setActiveQuery] = useState(presetQueries[0].query);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStats, setExecutionStats] = useState({ rows: 5, latency: '14ms', status: '200 OK' });

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  // Compute results dynamically based on active query context
  const queryResults = useMemo(() => {
    const qLower = activeQuery.toLowerCase();

    if (qLower.includes('customer')) {
      return customers.map((c) => ({
        Segment: c.customer_segment,
        'Total Customers': new Intl.NumberFormat('en-IN').format(c.total_customers),
        'Total Revenue': formatCurrency(c.total_revenue),
        'Avg Order Value': formatCurrency(Math.round(c.total_revenue / (c.total_customers || 1)))
      }));
    } else if (qLower.includes('channel')) {
      return channels.map((ch) => ({
        Channel: ch.channel,
        Revenue: formatCurrency(ch.revenue),
        Spend: formatCurrency(ch.spend),
        'ROI (%)': `${ch.roi}%`,
        'CTR (%)': `${ch.ctr}%`
      }));
    } else {
      return campaigns.map((c) => ({
        'Campaign Name': c.campaign,
        Channel: c.channel,
        Revenue: formatCurrency(c.revenue),
        Spend: formatCurrency(c.spend),
        'ROI (%)': `${c.roi}%`,
        Status: c.status
      }));
    }
  }, [activeQuery, campaigns, channels, customers]);

  const handleExecuteQuery = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setExecutionStats({
        rows: queryResults.length,
        latency: `${Math.floor(Math.random() * 10) + 12}ms`,
        status: '200 OK'
      });
    }, 400);
  };

  const handleExportCSV = () => {
    if (!queryResults.length) return;
    const headers = Object.keys(queryResults[0]);
    const rows = queryResults.map((row: any) => headers.map((h) => row[h]));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sql_query_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 select-none max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-card p-6 rounded-3xl shadow-[var(--card-shadow)] border border-transparent flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/15 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-wider">
            <Database size={13} />
            Snowflake SQL Console
          </div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            Advanced SQL Analytics Workspace
          </h2>
          <p className="text-xs text-muted max-w-xl leading-relaxed">
            Execute SQL queries directly against your Snowflake Cloud Data Warehouse schema with real-time query execution telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 border border-border bg-card hover:bg-hover text-foreground font-bold rounded-2xl text-xs transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Download size={13} />
            Export Results CSV
          </button>
        </div>
      </div>

      {/* Preset Query Shortcuts */}
      <div className="flex flex-wrap gap-2">
        {presetQueries.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveQuery(preset.query);
              handleExecuteQuery();
            }}
            className="px-3 py-2 bg-card hover:bg-hover border border-border/70 rounded-2xl text-[11px] font-semibold text-muted hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <Sparkles size={11} className="text-primary" />
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main SQL Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left: Schema Explorer */}
        <div className="bg-card p-5 rounded-3xl shadow-[var(--card-shadow)] border border-transparent space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Table size={15} className="text-primary" />
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Snowflake Schema</h4>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase block font-sans">table: campaigns</span>
              <div className="pl-2 space-y-0.5 text-muted text-[10.5px]">
                <div>• campaign_id (VARCHAR)</div>
                <div>• campaign_name (VARCHAR)</div>
                <div>• revenue_inr (DECIMAL)</div>
                <div>• spend_inr (DECIMAL)</div>
                <div>• roi_pct (FLOAT)</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase block font-sans">table: channels</span>
              <div className="pl-2 space-y-0.5 text-muted text-[10.5px]">
                <div>• channel_name (VARCHAR)</div>
                <div>• revenue_inr (DECIMAL)</div>
                <div>• ctr_pct (FLOAT)</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase block font-sans">table: customers</span>
              <div className="pl-2 space-y-0.5 text-muted text-[10.5px]">
                <div>• customer_segment (VARCHAR)</div>
                <div>• total_customers (INT)</div>
                <div>• total_revenue_inr (DECIMAL)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: SQL Editor & Output Table */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* SQL Code Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 text-slate-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-emerald-400" />
                <span className="text-xs font-bold font-mono text-slate-300">SNOWFLAKE_QUERY_EDITOR.sql</span>
              </div>
              
              <button
                onClick={handleExecuteQuery}
                disabled={isExecuting}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
              >
                <Play size={12} className="fill-current" />
                {isExecuting ? 'Executing...' : 'Run Query'}
              </button>
            </div>

            <textarea
              value={activeQuery}
              onChange={(e) => setActiveQuery(e.target.value)}
              rows={4}
              className="w-full bg-transparent font-mono text-xs text-emerald-400 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />

            {/* Execution status footer */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 size={11} /> {executionStats.status}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {executionStats.latency}
                </span>
              </div>
              <span>{executionStats.rows} rows fetched</span>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-card rounded-3xl p-5 shadow-[var(--card-shadow)] border border-transparent overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Query Output Results</h4>
              <span className="text-[9px] font-mono text-muted">{queryResults.length} records</span>
            </div>

            {queryResults.length > 0 ? (
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-border text-muted font-bold uppercase text-[9.5px]">
                    {Object.keys(queryResults[0]).map((head, idx) => (
                      <th key={idx} className="pb-2 px-3">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {queryResults.map((row: any, rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-hover/50 transition-colors">
                      {Object.keys(row).map((head, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-3 text-foreground font-medium">
                          {row[head]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-xs text-muted">No records returned for current query execution.</div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
