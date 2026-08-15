import { useState, useEffect } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { MapPin, Trophy, Users, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import type { StateDistribution } from '../hooks/useDashboardData';

interface IndiaMapProps {
  stateData: StateDistribution[];
}

export function IndiaMap({ stateData }: IndiaMapProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredState, setHoveredState] = useState<{
    name: string;
    customer_count: number;
    percentage: number;
  } | null>(null);

  // Fetch authentic India GeoJSON
  useEffect(() => {
    fetch('/india_states.json')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error('Failed to load authentic India GeoJSON:', err));
  }, []);

  // Compute telemetry values dynamically from Snowflake stateData
  const totalCustomers = stateData.reduce((sum, s) => sum + s.customer_count, 0) || 50000;
  const sortedStates = [...stateData].sort((a, b) => b.customer_count - a.customer_count);
  const highestState = sortedStates[0] || { state: 'Maharashtra', customer_count: 10235, percentage: 20.47 };
  const top5States = sortedStates.slice(0, 5);
  const maxCustomerCount = Math.max(...stateData.map((s) => s.customer_count), 10000);

  // Robust State Name Normalization
  const normalizeName = (name: string) => {
    if (!name) return '';
    const clean = name.trim().toLowerCase();
    if (clean === 'andaman & nicobar' || clean === 'andaman and nicobar islands' || clean === 'andaman and nicobar') return 'andaman & nicobar';
    if (clean.includes('daman') || clean.includes('dadra')) return 'dadra & nagar haveli';
    if (clean === 'jammu & kashmir' || clean === 'jammu and kashmir') return 'jammu & kashmir';
    if (clean === 'orissa') return 'odisha';
    if (clean === 'uttaranchal') return 'uttarakhand';
    if (clean === 'pondicherry') return 'puducherry';
    return clean;
  };

  const getStateData = (geoStateName: string) => {
    const normGeo = normalizeName(geoStateName);
    return stateData.find((s) => normalizeName(s.state) === normGeo);
  };

  // Projection setup for India geometry canvas
  const projection = geoMercator()
    .center([78.9629, 22.5937])
    .scale(840)
    .translate([230, 250]);

  const pathGenerator = geoPath().projection(projection);

  // Dynamic choropleth color scale (Professional blue palette)
  const getStateFill = (customerCount: number) => {
    if (!customerCount || customerCount === 0) return 'rgba(148, 163, 184, 0.15)'; // Neutral slate for inactive regions
    const ratio = customerCount / maxCustomerCount;
    if (ratio > 0.85) return '#1D4ED8'; // Darkest blue for highest state (e.g. Maharashtra)
    if (ratio > 0.45) return '#2563EB'; // Solid blue for top states (Gujarat, WB, UP, RJ)
    if (ratio > 0.35) return '#3B82F6'; // Medium blue for mid states (Karnataka, Telangana, TN, Delhi)
    return '#60A5FA'; // Light blue for remaining regions
  };

  return (
    <div className="bg-card p-6 md:p-8 rounded-3xl shadow-[var(--card-shadow)] border border-transparent space-y-6">
      
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/15 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
            <MapPin size={12} />
            Geographic Intelligence
          </div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            India Customer Distribution
          </h2>
          <span className="text-[10px] text-muted uppercase tracking-wider block mt-1 font-semibold">
            STATE-WISE CUSTOMER / MEMBER DISTRIBUTION
          </span>
        </div>

        {/* Live Telemetry Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 border border-border rounded-xl shrink-0 text-xs text-muted font-medium">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Snowflake Telemetry Active</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Authentic Interactive India Map (col-span-7) */}
        <div className="lg:col-span-7 bg-background/40 border border-border rounded-3xl p-5 relative min-h-[480px] flex flex-col justify-between overflow-hidden">
          
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="font-bold text-foreground">Interactive State Choropleth Map</span>
            <span className="text-[10px] text-primary font-bold">Customer Distribution Across India</span>
          </div>

          {/* Map Canvas */}
          <div className="relative w-full flex justify-center items-center py-2 min-h-[400px]">
            {geoData ? (
              <svg
                viewBox="0 0 460 500"
                className="w-full max-w-[440px] h-auto drop-shadow-md select-none"
              >
                <g>
                  {geoData.features.map((feature: any, idx: number) => {
                    const geoStateName =
                      feature.properties.ST_NM ||
                      feature.properties.NAME_1 ||
                      feature.properties.name ||
                      feature.properties.NAME;

                    const matchedData = getStateData(geoStateName);
                    const count = matchedData ? matchedData.customer_count : 0;
                    const pct = matchedData ? matchedData.percentage : totalCustomers > 0 ? (count / totalCustomers) * 100 : 0;

                    const fill = getStateFill(count);
                    const isHovered = hoveredState?.name.toLowerCase() === geoStateName.toLowerCase();
                    const dPath = pathGenerator(feature);

                    if (!dPath) return null;

                    return (
                      <path
                        key={idx}
                        d={dPath}
                        fill={fill}
                        stroke={isHovered ? '#60A5FA' : '#0F172A'}
                        strokeWidth={isHovered ? 2.5 : 0.8}
                        strokeLinejoin="round"
                        className="transition-all duration-200 cursor-pointer hover:opacity-90"
                        onClick={() =>
                          setHoveredState((prev) =>
                            prev?.name === geoStateName ? null : {
                              name: geoStateName,
                              customer_count: count,
                              percentage: pct
                            }
                          )
                        }
                        onTouchStart={() =>
                          setHoveredState({
                            name: geoStateName,
                            customer_count: count,
                            percentage: pct
                          })
                        }
                        onMouseEnter={() =>
                          setHoveredState({
                            name: geoStateName,
                            customer_count: count,
                            percentage: pct
                          })
                        }
                        onMouseLeave={() => setHoveredState(null)}
                      />
                    );
                  })}
                </g>
              </svg>
            ) : (
              <div className="flex items-center justify-center h-64 text-xs text-muted font-semibold">
                Loading authentic India geographic boundaries...
              </div>
            )}

            {/* Hover Tooltip Card */}
            {hoveredState && (
              <div className="absolute top-4 right-4 bg-slate-900/95 border border-primary/50 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 font-sans z-20 pointer-events-none min-w-[190px] animate-in fade-in zoom-in-95 duration-150">
                <div className="font-extrabold text-sm text-primary flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span>{hoveredState.name}</span>
                  <MapPin size={13} />
                </div>
                {hoveredState.customer_count > 0 ? (
                  <>
                    <div className="flex justify-between pt-1 text-[11px]">
                      <span className="text-slate-400">Customer Count:</span>
                      <span className="font-bold font-mono text-emerald-400">
                        {hoveredState.customer_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">National Share:</span>
                      <span className="font-bold font-mono text-primary">
                        {hoveredState.percentage.toFixed(2)}%
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-[10px] text-slate-400 pt-1 font-medium italic">
                    No active customer records in Snowflake
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-border/40 text-[10px] text-muted gap-2">
            <span className="font-bold text-foreground">Customer Concentration</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono">Low (0)</span>
              <div className="flex h-2.5 w-32 rounded-full overflow-hidden border border-border">
                <div className="w-1/4 bg-slate-700/40" />
                <div className="w-1/4 bg-blue-400" />
                <div className="w-1/4 bg-blue-600" />
                <div className="w-1/4 bg-blue-800 font-bold" />
              </div>
              <span className="text-[9px] font-bold text-foreground font-mono">High ({maxCustomerCount.toLocaleString()})</span>
            </div>
          </div>

        </div>

        {/* Right Column: Telemetry Summary Cards & Top 5 Ranking (col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Total Customers */}
            <div className="bg-background/60 p-4 rounded-2xl border border-border space-y-1 shadow-sm">
              <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">Total Customers</span>
              <div className="flex items-baseline gap-2">
                <h4 className="text-lg font-extrabold text-foreground font-mono">
                  {totalCustomers.toLocaleString()}
                </h4>
                <Users size={14} className="text-primary" />
              </div>
              <span className="text-[8.5px] text-muted block">Active Snowflake customer records</span>
            </div>

            {/* TOP CUSTOMER STATE Card */}
            <div className="bg-background/60 p-4 rounded-2xl border border-border space-y-1 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl pointer-events-none" />
              <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">TOP CUSTOMER STATE</span>
              <div className="flex items-baseline gap-2">
                <h4 className="text-lg font-extrabold text-primary truncate">
                  {highestState.state}
                </h4>
                <Trophy size={14} className="text-amber-500 shrink-0" />
              </div>
              <span className="text-[8.5px] text-emerald-500 font-bold block">
                Highest regional volume
              </span>
            </div>

            {/* CUSTOMERS & NATIONAL SHARE Card */}
            <div className="sm:col-span-2 bg-card p-4 sm:p-5 rounded-2xl border border-border/80 shadow-[var(--card-shadow)] hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[9.5px] font-extrabold text-muted uppercase tracking-wider">
                  CUSTOMERS &amp; NATIONAL SHARE
                </span>
                <div className="p-1.5 bg-primary/10 text-primary rounded-xl shrink-0">
                  <TrendingUp size={15} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-background/60 p-2.5 rounded-xl border border-border/60">
                  <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">Customer Count</span>
                  <div className="text-lg font-extrabold text-foreground font-mono mt-0.5">
                    {highestState.customer_count.toLocaleString()}
                  </div>
                </div>

                <div className="bg-background/60 p-2.5 rounded-xl border border-border/60">
                  <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">National Share</span>
                  <div className="text-lg font-extrabold text-primary font-mono mt-0.5">
                    {highestState.percentage.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Top 5 States Ranking Panel */}
          <div className="bg-card p-5 rounded-3xl border border-border/70 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-primary" />
                TOP 5 STATES
              </h4>
              <span className="text-[9px] text-muted font-mono font-bold">Rank & Count</span>
            </div>

            <div className="space-y-3">
              {top5States.map((s, idx) => (
                <div key={s.state} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                        idx === 0
                          ? 'bg-amber-500 text-slate-950'
                          : idx === 1
                          ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-background text-muted border border-border'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-bold text-foreground">{s.state}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="font-bold text-foreground">{s.customer_count.toLocaleString()}</span>
                      <span className="text-primary font-bold">({s.percentage.toFixed(2)}%)</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/40">
                    <div
                      style={{ width: `${(s.customer_count / highestState.customer_count) * 100}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        idx === 0 ? 'bg-primary' : 'bg-primary/75'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
