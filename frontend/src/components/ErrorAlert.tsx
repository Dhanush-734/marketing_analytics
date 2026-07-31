import { AlertCircle, RotateCw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto my-12 animate-fade-in">
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Unable to Load Analytics Data
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md">
          {message}
        </p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition-all shadow-sm hover:shadow active:scale-95 duration-150"
        >
          <RotateCw size={16} />
          Retry Connection
        </button>
      </div>
    </div>
  );
}
