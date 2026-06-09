import type { QueueItem } from '../types';
import { formatBytes, getSavingsPercent } from '../utils/format';

interface ResultStatsProps {
  queue: QueueItem[];
  onDownloadAll: () => void;
}

export function ResultStats({ queue, onDownloadAll }: ResultStatsProps) {
  const completedItems = queue.filter((item) => item.status === 'done' && item.result);
  
  if (completedItems.length === 0) return null;

  const totalOriginalSize = completedItems.reduce((acc, item) => acc + item.size, 0);
  const totalConvertedSize = completedItems.reduce((acc, item) => acc + (item.result?.convertedSize ?? 0), 0);
  const saving = getSavingsPercent(totalOriginalSize, totalConvertedSize);
  const isSmaller = saving > 0;
  const countText = `${completedItems.length} de ${queue.length} archivo${queue.length > 1 ? 's' : ''}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap transition-colors duration-200">
      <div className="flex gap-5 flex-wrap">
        <Stat label="Archivos" value={countText} />
        <Stat label="Original Total" value={formatBytes(totalOriginalSize)} />
        <Stat label="Convertido Total" value={formatBytes(totalConvertedSize)} />
        <Stat
          label="Ahorro Total"
          value={`${isSmaller ? '-' : '+'}${Math.abs(saving)}%`}
          valueClass={isSmaller ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}
        />
      </div>

      <button
        onClick={onDownloadAll}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium
                   rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 active:scale-95 transition-all duration-100 shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Descargar todas
      </button>
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass = 'text-slate-800 dark:text-slate-100',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <span className={`font-mono text-sm font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
