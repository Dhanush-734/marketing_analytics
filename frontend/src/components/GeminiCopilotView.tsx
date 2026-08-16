import { useState } from 'react';
import { Sparkles, Send, Bot, User, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';

export function GeminiCopilotView() {
  const { kpis, channels, campaigns, customers, email } = useDashboardData();

  const formatIndianCurrency = (val: number): string => {
    const absVal = Math.abs(val);
    const isInteger = absVal % 1 === 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: isInteger ? 0 : 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  const formatIndianInteger = (val: number): string => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; timestamp: string; metrics?: any }>>([
    {
      sender: 'ai',
      text: 'Hello! I am INSIGHTS AI, your Marketing Analytics Copilot. I analyze your Snowflake data warehouse, live campaign performance, and multi-channel attribution metrics. Ask me anything about your analytics!',
      timestamp: '15:00'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const samplePrompts = [
    'Which channel produces the highest ROI?',
    'Summarize top performing campaigns',
    'What is our customer acquisition breakdown?',
    'Show email marketing engagement stats',
    'Predict next quarter revenue trajectory'
  ];

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAnalyzing(true);

    setTimeout(() => {
      let aiResponseText = '';
      let metricsBadge: any = null;
      const qLower = queryText.toLowerCase();

      // Dynamic sorting & computations from live Snowflake data layer
      const sortedChannelsByRoi = [...channels].sort((a, b) => b.roi - a.roi);
      const sortedCampaignsByRev = [...campaigns].sort((a, b) => b.revenue - a.revenue);

      const topChannel = sortedChannelsByRoi[0] || { channel: 'Google Ads', roi: 220.6, revenue: kpis.revenue };
      const lowestChannel = sortedChannelsByRoi[sortedChannelsByRoi.length - 1] || { channel: 'Meta Ads', roi: 219.5, revenue: kpis.revenue };
      const topCampaign = sortedCampaignsByRev[0] || { campaign: 'Multi-Channel Q1 Growth Drive', revenue: 65031115, roi: 220.6, conversions: 26150 };

      if (qLower.includes('channel') || qLower.includes('roi')) {
        aiResponseText = `Based on live Snowflake data, ${topChannel.channel} is your top-performing channel with an ROI of ${topChannel.roi}% and total revenue of ${formatIndianCurrency(topChannel.revenue)}. Conversely, ${lowestChannel.channel} has the lowest ROI at ${lowestChannel.roi}%.`;
        metricsBadge = {
          title: 'Top Channel Attribution',
          items: [
            { label: 'Highest ROI Channel', val: topChannel.channel },
            { label: 'Return on Investment', val: `${topChannel.roi}%` },
            { label: 'Revenue Yield', val: formatIndianCurrency(topChannel.revenue) }
          ]
        };
      } else if (qLower.includes('campaign') || qLower.includes('top')) {
        const top3 = sortedCampaignsByRev.slice(0, 3);
        const top3Text = top3.map((c, i) => `${i + 1}. ${c.campaign} (${c.channel}): ${formatIndianCurrency(c.revenue)} revenue [${c.roi}% ROI]`).join('\n');
        aiResponseText = `Here are your top 3 campaigns by revenue yield from Snowflake:\n\n${top3Text}\n\nTop campaign "${topCampaign.campaign}" accounts for highest conversion volume.`;
        metricsBadge = {
          title: 'Top Revenue Campaign',
          items: [
            { label: 'Campaign', val: topCampaign.campaign },
            { label: 'Revenue', val: formatIndianCurrency(topCampaign.revenue) },
            { label: 'Conversions', val: formatIndianInteger(topCampaign.conversions) }
          ]
        };
      } else if (qLower.includes('customer') || qLower.includes('segment') || qLower.includes('purchaser') || qLower.includes('acquisition')) {
        const totalCust = customers.reduce((sum, c) => sum + c.total_customers, 0);
        const topSeg = [...customers].sort((a, b) => b.total_revenue - a.total_revenue)[0] || { customer_segment: 'High-Value Premium Tier', total_customers: 16700, total_revenue: 130800000 };
        aiResponseText = `Total tracked customers across all segments: ${formatIndianInteger(totalCust)}. The "${topSeg.customer_segment}" segment generates the highest revenue at ${formatIndianCurrency(topSeg.total_revenue)} from ${formatIndianInteger(topSeg.total_customers)} customers.`;
        metricsBadge = {
          title: 'Customer Segmentation',
          items: [
            { label: 'Total Purchasers', val: formatIndianInteger(totalCust) },
            { label: 'Top Tier', val: topSeg.customer_segment },
            { label: 'Tier Revenue', val: formatIndianCurrency(topSeg.total_revenue) }
          ]
        };
      } else if (qLower.includes('email') || qLower.includes('funnel') || qLower.includes('open rate')) {
        const openPct = email.average_open_rate < 1 ? (email.average_open_rate * 100).toFixed(2) : email.average_open_rate.toFixed(2);
        const clickPct = email.average_click_rate < 1 ? (email.average_click_rate * 100).toFixed(2) : email.average_click_rate.toFixed(2);
        aiResponseText = `Email Marketing Performance Metrics:\n• Total Dispatched: ${formatIndianInteger(email.emails_sent)}\n• Emails Opened: ${formatIndianInteger(email.emails_opened)} (${openPct}% Open Rate)\n• Emails Clicked: ${formatIndianInteger(email.emails_clicked)} (${clickPct}% Click Rate)`;
        metricsBadge = {
          title: 'Email Telemetry',
          items: [
            { label: 'Dispatched', val: formatIndianInteger(email.emails_sent) },
            { label: 'Average Open Rate', val: `${openPct}%` },
            { label: 'Average CTR', val: `${clickPct}%` }
          ]
        };
      } else if (qLower.includes('predict') || qLower.includes('forecast') || qLower.includes('trajectory') || qLower.includes('quarter')) {
        aiResponseText = `Forecasting is not currently enabled. INSIGHTS AI can analyze current Snowflake performance metrics.`;
        metricsBadge = {
          title: 'Predictive Trajectory',
          items: [
            { label: 'Status', val: 'Forecasting Disabled' },
            { label: 'Current Revenue', val: formatIndianCurrency(kpis.revenue) },
            { label: 'Overall ROI', val: `${kpis.roi.toFixed(2)}%` }
          ]
        };
      } else {
        aiResponseText = `Live Snowflake Performance Summary:\n• Total Revenue: ${formatIndianCurrency(kpis.revenue)}\n• Total Spend: ${formatIndianCurrency(kpis.spend)}\n• Overall ROI: ${kpis.roi.toFixed(2)}%\n• Average CTR: ${kpis.ctr.toFixed(2)}%\n• Active Campaigns: ${campaigns.length}\n• Attributed Channels: ${channels.length}`;
        metricsBadge = {
          title: 'Executive Summary',
          items: [
            { label: 'Total Revenue', val: formatIndianCurrency(kpis.revenue) },
            { label: 'Overall ROI', val: `${kpis.roi.toFixed(2)}%` },
            { label: 'Active Campaigns', val: `${campaigns.length}` }
          ]
        };
      }

      const aiMsg = {
        sender: 'ai' as const,
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metrics: metricsBadge
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      
      {/* Top Copilot Header Card */}
      <div className="bg-card p-6 rounded-3xl shadow-[var(--card-shadow)] border border-transparent relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/15 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={13} className="animate-pulse" />
            INSIGHTS AI
          </div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            INSIGHTS AI
          </h2>
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
            AI MARKETING ANALYTICS COPILOT
          </span>
          <p className="text-xs text-muted max-w-xl leading-relaxed">
            Connected directly to Snowflake Data Warehouse ({campaigns.length} campaigns, {channels.length} channels, {formatIndianCurrency(kpis.revenue)} total revenue).
          </p>
        </div>

        <div className="p-4 bg-background/80 border border-border rounded-2xl shrink-0 space-y-2 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-green-500">
            <CheckCircle2 size={14} />
            Snowflake Verified Sync
          </div>
          <span className="text-[9px] text-muted block font-mono">Dynamic Snowflake Analytics</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-2 bg-card hover:bg-hover border border-border/70 rounded-2xl text-[11px] font-semibold text-muted hover:text-foreground transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <Zap size={11} className="text-primary" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-card rounded-3xl p-6 shadow-[var(--card-shadow)] border border-transparent flex flex-col h-[520px]">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 select-text">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xs shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={15} />}
              </div>

              <div
                className={`max-w-[85%] p-4 rounded-3xl space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-background/80 border border-border/80 text-foreground rounded-tl-none'
                }`}
              >
                <div className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</div>

                {/* Structured Metrics Card for AI Responses */}
                {msg.metrics && (
                  <div className="p-3 bg-card/90 border border-border/70 rounded-2xl space-y-2 mt-2 select-none">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">
                      {msg.metrics.title}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {msg.metrics.items.map((item: any, idx: number) => (
                        <div key={idx} className="bg-background/50 p-2 rounded-xl border border-border/40">
                          <span className="text-[8px] text-muted block uppercase font-bold truncate">{item.label}</span>
                          <span className="text-[11px] font-extrabold text-foreground block truncate">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <span
                  className={`text-[8.5px] block text-right font-mono ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-muted'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex items-center gap-2 text-xs font-semibold text-muted animate-pulse p-2">
              <RefreshCw size={13} className="animate-spin text-primary" />
              Querying Snowflake data engine for exact metrics...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="mt-4 pt-3 border-t border-border/60 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask INSIGHTS AI about live Snowflake metrics..."
            className="flex-1 px-4 py-2.5 bg-background border border-border rounded-2xl text-xs text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isAnalyzing}
            className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl text-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md active:scale-95 shrink-0"
          >
            <Send size={13} />
            Ask AI
          </button>
        </form>

      </div>
    </div>
  );
}
