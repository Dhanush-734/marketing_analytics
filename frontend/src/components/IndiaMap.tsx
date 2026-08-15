import { useState, useEffect, useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { Users, Trophy, TrendingUp, MapPin, Database, Sparkles } from 'lucide-react';
import type { StateDistribution } from '../hooks/useDashboardData';

interface IndiaMapProps {
  stateData: StateDistribution[];
}

export function IndiaMap({ stateData }: IndiaMapProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredState, setHoveredState] = useState<{ name: string; customer_count: number; percentage: number } | null>(null);

  // Fetch official India 36 State/UT boundary GeoJSON dataset
  useEffect(() => {
    fetch('/india_states.json')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error('Failed to load India GeoJSON map:', err));
  }, []);

  const totalCustomers = useMemo(() => {
    return stateData.reduce((sum, s) => sum + (s.customer_count || 0), 0);
  }, [stateData]);

  const sortedStates = useMemo(() => {
    return [...stateData].sort((a, b) => b.customer_count - a.customer_count);
  }, [stateData]);

  const top5States = useMemo(() => {
    return sortedStates.slice(0, 5);
  }, [sortedStates]);

  const highestState = useMemo(() => {
    if (sortedStates.length === 0) return { state: 'N/A', customer_count: 0, percentage: 0 };
    return sortedStates[0];
  }, [sortedStates]);

  const maxCustomerCount = useMemo(() => {
    if (sortedStates.length === 0) return 10000;
    return sortedStates[0].customer_count;
  }, [sortedStates]);

  // Create D3 Mercator Projection focused directly on India boundaries
  const projection = useMemo(() => {
    return geoMercator()
      .scale(820)
      .center([82.5, 22.5])
      .translate([230, 250]);
  }, []);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  // Color Intensity Scale tailored for Snowflake Customer Densities
  const getStateFill = (count: number) => {
    if (count === 0) return 'rgba(30, 41, 59, 0.4)';
    const ratio = count / (maxCustomerCount || 1);
    if (ratio > 0.75) return '#1D4ED8'; // Deep Blue
    if (ratio > 0.4) return '#2563EB';  // Vivid Blue
    if (ratio > 0.15) return '#3B82F6'; // Medium Blue
    return '#60A5FA';                   // Light Sky Blue
  };

  const getStateData = (geoStateName: string) => {
    return stateData.find(
      (s) =>
        s.state.toLowerCase() === geoStateName.toLowerCase() ||
        geoStateName.toLowerCase().includes(s.state.toLowerCase()) ||
        s.state.toLowerCase().includes(geoStateName.toLowerCase())
    );
  };

  return (
    <div className="bg-card rounded-3xl p-4 sm:p-6 shadow-[var(--card-shadow)] space-y-5 select-none animate-slide-up w-full max-w-full overflow-hidden">

      {/* Title & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-border/40">
        <div>
          <h3 className="text-xs sm:text-sm font-extrabold text-foreground tracking-tight uppercase flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            India Customer Distribution
          </h3>
          <span className="text-[9px] text-muted uppercase tracking-wider block mt-0.5">
            Geographic customer reach dynamically calculated from Snowflake
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20 self-start sm:self-auto shrink-0">
          <Database size={11} />
          <span>Snowflake Telemetry Active</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">

        {/* Left Column: Authentic Interactive India Map (col-span-7) */}
        <div className="lg:col-span-7 bg-background/40 border border-border rounded-3xl p-3 sm:p-5 relative min-h-[300px] sm:min-h-[460px] flex flex-col justify-between overflow-hidden w-full max-w-full">

          <div className="flex items-center justify-between text-xs text-muted mb-2 gap-2 flex-wrap">
            <span className="font-bold text-foreground text-[11px] sm:text-xs">Interactive State Choropleth Map</span>
            <span className="text-[9px] sm:text-[10px] text-primary font-bold">Customer Distribution Across India</span>
          </div>

          {/* Map Canvas Wrapper */}
          <div className="relative w-full max-w-full flex justify-center items-center py-2 min-h-[320px] sm:min-h-[400px] overflow-hidden">
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
              <div className="absolute top-2 right-2 bg-slate-900/95 border border-primary/50 text-white p-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1 font-sans z-20 pointer-events-none min-w-[170px] max-w-[210px] animate-in fade-in zoom-in-95 duration-150">
                <div className="font-extrabold text-xs text-primary flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="truncate">{hoveredState.name}</span>
                  <MapPin size={12} className="shrink-0 ml-1" />
                </div>
                {hoveredState.customer_count > 0 ? (
                  <>
                    <div className="flex justify-between pt-0.5 text-[10px]">
                      <span className="text-slate-400">Customer Count:</span>
                      <span className="font-bold font-mono text-emerald-400">
                        {hoveredState.customer_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">National Share:</span>
                      <span className="font-bold font-mono text-primary">
                        {hoveredState.percentage.toFixed(2)}%
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-[9px] text-slate-400 pt-0.5 font-medium italic">
                    No active customer records in Snowflake
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-border/40 text-[10px] text-muted gap-2 w-full max-w-full">
            <span className="font-bold text-foreground">Customer Concentration</span>
            <div className="flex items-center gap-1.5 min-w-0 max-w-full">
              <span className="text-[8.5px] font-mono shrink-0">Low (0)</span>
              <div className="flex h-2.5 w-24 xs:w-28 sm:w-32 rounded-full overflow-hidden border border-border shrink-0">
                <div className="w-1/4 bg-slate-700/40" />
                <div className="w-1/4 bg-blue-400" />
                <div className="w-1/4 bg-blue-600" />
                <div className="w-1/4 bg-blue-800 font-bold" />
              </div>
              <span className="text-[8.5px] font-bold text-foreground font-mono truncate">High ({maxCustomerCount.toLocaleString()})</span>
            </div>
          </div>

        </div>

        {/* Right Column: Telemetry Summary Cards & Top 5 Ranking (col-span-5) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5 w-full max-w-full overflow-hidden">

          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-full">

            {/* Total Customers */}
            <div className="bg-background/60 p-3.5 sm:p-4 rounded-2xl border border-border space-y-1 shadow-sm w-full max-w-full overflow-hidden">
              <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">Total Customers</span>
              <div className="flex items-baseline gap-2">
                <h4 className="text-lg font-extrabold text-foreground font-mono">
                  {totalCustomers.toLocaleString()}
                </h4>
                <Users size={14} className="text-primary shrink-0" />
              </div>
              <span className="text-[8.5px] text-muted block">Active Snowflake customer records</span>
            </div>

            {/* TOP CUSTOMER STATE Card */}
            <div className="bg-background/60 p-3.5 sm:p-4 rounded-2xl border border-border space-y-1 shadow-sm relative overflow-hidden w-full max-w-full">
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
            <div className="sm:col-span-2 bg-card p-3.5 sm:p-5 rounded-2xl border border-border/80 shadow-[var(--card-shadow)] hover:shadow-md transition-all duration-200 w-full max-w-full overflow-hidden">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[9.5px] font-extrabold text-muted uppercase tracking-wider">
                  CUSTOMERS &amp; NATIONAL SHARE
                </span>
                <div className="p-1.5 bg-primary/10 text-primary rounded-xl shrink-0">
                  <TrendingUp size={15} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-background/60 p-2.5 rounded-xl border border-border/60">
                  <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">Customer Count</span>
                  <div className="text-base sm:text-lg font-extrabold text-foreground font-mono mt-0.5">
                    {highestState.customer_count.toLocaleString()}
                  </div>
                </div>

                <div className="bg-background/60 p-2.5 rounded-xl border border-border/60">
                  <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">National Share</span>
                  <div className="text-base sm:text-lg font-extrabold text-primary font-mono mt-0.5">
                    {highestState.percentage.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Top 5 States Data Table */}
          <div className="bg-background/40 p-4 sm:p-5 rounded-3xl border border-border space-y-3 shadow-xs w-full max-w-full overflow-hidden">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                Top 5 States
              </h4>
              <span className="text-[9px] font-mono text-muted">Ranked by volume</span>
            </div>

            <div className="space-y-2">
              {top5States.map((st, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] p-2 bg-card/70 border border-border/50 rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-lg bg-primary/10 text-primary font-bold text-[9px] flex items-center justify-center shrink-0">
                      #{i + 1}
                    </span>
                    <span className="font-bold text-foreground truncate">{st.state}</span>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="font-bold text-foreground block text-[10.5px]">
                      {st.customer_count.toLocaleString()}
                    </span>
                    <span className="text-[8.5px] text-muted block">
                      {st.percentage.toFixed(2)}% share
                    </span>
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
