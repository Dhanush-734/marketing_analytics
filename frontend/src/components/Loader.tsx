
export function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm h-80 animate-pulse flex flex-col justify-between">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-6"></div>
      <div className="flex-1 flex items-end gap-4 px-4 pb-2">
        {[20, 50, 80, 40, 60, 90, 30, 70, 45, 85].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t"
          ></div>
        ))}
      </div>
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full mt-4"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm animate-pulse">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6 mb-6"></div>
      <div className="space-y-4">
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 bg-slate-50 dark:bg-slate-900/50 rounded border-b border-slate-100 dark:border-slate-800"></div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-64"></div>
        </div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
      </div>
      <KPISkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}
