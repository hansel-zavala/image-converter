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
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      {/* Format row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-4">
        {/* Source */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Formato origen
          </label>
          <div className="h-9 px-3 flex items-center bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono text-sm text-slate-500">{sourceFormat || 'Auto'}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-end pb-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>

        {/* Destination */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Convertir a
          </label>
          <select
            value={outputFormat}
            onChange={(e) => onFormatChange(e.target.value as OutputFormat)}
            className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                       cursor-pointer hover:border-slate-300 transition-colors"
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
          <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Calidad
            {isLossless && (
              <span className="ml-2 normal-case font-normal text-slate-400">(sin pérdida)</span>
            )}
          </label>
          <span className={`font-mono text-sm font-medium ${isLossless ? 'text-slate-300' : 'text-slate-700'}`}>
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
              ? 'bg-slate-100 opacity-40 cursor-not-allowed'
              : 'bg-slate-200 [&::-webkit-slider-thumb]:bg-slate-800 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer'
            }
          `}
        />
        {!isLossless && (
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Menor tamaño</span>
            <span>Mayor calidad</span>
          </div>
        )}
      </div>
    </div>
  );
}
