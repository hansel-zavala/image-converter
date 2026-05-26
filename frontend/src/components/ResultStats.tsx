import type { ConversionResult } from '../types';
import { formatBytes, getSavingsPercent } from '../utils/format';

interface ResultStatsProps {
  result: ConversionResult;
  onDownload: () => void;
}

export function ResultStats({ result, onDownload }: ResultStatsProps) {
  const saving = getSavingsPercent(result.originalSize, result.convertedSize);
  const isSmaller = saving > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex gap-5 flex-wrap">
        <Stat label="Original" value={formatBytes(result.originalSize)} />
        <Stat label="Convertido" value={formatBytes(result.convertedSize)} />
        <Stat
          label="Ahorro"
          value={`${isSmaller ? '-' : '+'}${Math.abs(saving)}%`}
          valueClass={isSmaller ? 'text-emerald-600' : 'text-amber-500'}
        />
        <Stat label="Dimensiones" value={`${result.width} × ${result.height}`} />
        <Stat label="Formato" value={result.outputFormat.toUpperCase()} />
      </div>

      <button
        onClick={onDownload}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium
                   rounded-lg hover:bg-slate-700 active:scale-95 transition-all duration-100 shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Descargar {result.outputFileName.split('.').pop()?.toUpperCase()}
      </button>
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass = 'text-slate-800',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className={`font-mono text-sm font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
