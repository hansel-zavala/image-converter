import type { OutputFormat } from '../types';
import { FORMAT_LABELS, LOSSLESS_FORMATS } from '../utils/format';

const OUTPUT_FORMATS: OutputFormat[] = ['webp', 'png', 'jpeg', 'avif', 'gif'];

interface ConversionControlsProps {
  sourceFormat: string;
  outputFormat: OutputFormat;
  quality: number;
  onFormatChange: (f: OutputFormat) => void;
  onQualityChange: (q: number) => void;
}

export function ConversionControls({
  sourceFormat,
  outputFormat,
  quality,
  onFormatChange,
  onQualityChange,
}: ConversionControlsProps) {
  const isLossless = LOSSLESS_FORMATS.includes(outputFormat);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors duration-200">
      {/* Format row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-4">
        {/* Source */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Formato origen
          </label>
          <div className="h-9 px-3 flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <span className="font-mono text-sm text-slate-500 dark:text-slate-300">{sourceFormat || 'Auto'}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-end pb-2">
          <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>

        {/* Destination */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Convertir a
          </label>
          <select
            value={outputFormat}
            onChange={(e) => onFormatChange(e.target.value as OutputFormat)}
            className="h-9 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200
                       focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                       cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            {OUTPUT_FORMATS.map((f) => (
              <option key={f} value={f}>{FORMAT_LABELS[f]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quality slider */}
      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Calidad
            {isLossless && (
              <span className="ml-2 normal-case font-normal text-slate-400 dark:text-slate-500">(sin pérdida)</span>
            )}
          </label>
          <span className={`font-mono text-sm font-medium ${isLossless ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-200'}`}>
            {quality}%
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          step={1}
          value={quality}
          disabled={isLossless}
          onChange={(e) => onQualityChange(Number(e.target.value))}
          className={`w-full h-1.5 rounded-full appearance-none cursor-pointer
            ${isLossless
              ? 'bg-slate-100 dark:bg-slate-800 opacity-40 cursor-not-allowed'
              : 'bg-slate-200 dark:bg-slate-700 [&::-webkit-slider-thumb]:bg-slate-800 dark:[&::-webkit-slider-thumb]:bg-slate-200 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer'
            }
          `}
        />
        {!isLossless && (
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            <span>Menor tamaño</span>
            <span>Mayor calidad</span>
          </div>
        )}
      </div>
    </div>
  );
}
