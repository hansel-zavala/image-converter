import type { ConversionResult, ConversionStatus, OutputFormat } from '../types';
import { formatBytes } from '../utils/format';

interface PreviewPanelProps {
  status: ConversionStatus;
  result: ConversionResult | null;
  outputFormat: OutputFormat;
}

export function PreviewPanel({ status, result, outputFormat }: PreviewPanelProps) {
  const previewUrl = result ? URL.createObjectURL(result.blob) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Resultado
        </span>
        <span className="font-mono text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {outputFormat.toUpperCase()}
        </span>
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center checkerboard min-h-[200px] relative overflow-hidden">
        {status === 'converting' && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-700 border-t-slate-700 dark:border-t-slate-200 rounded-full animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Convirtiendo...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm text-red-600 font-medium">Error en la conversión</p>
          </div>
        )}

        {status === 'done' && previewUrl && (
          <img
            src={previewUrl}
            alt="Imagen convertida"
            className="max-w-full max-h-full object-contain"
          />
        )}

        {(status === 'idle') && (
          <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
            <svg className="w-8 h-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008v.008H13.5V12zm0 0h.008v.008H13.5V12zm-3 0h.008v.008H12V12zm0 0h.008v.008H12V12z" />
            </svg>
            <span className="text-xs">Vista previa aparecerá aquí</span>
          </div>
        )}
      </div>

      {/* Footer meta */}
      <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <span className="font-mono text-xs text-slate-400 dark:text-slate-500 truncate max-w-[160px]">
          {result?.outputFileName ?? '—'}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {result ? formatBytes(result.convertedSize) : '—'}
        </span>
      </div>
    </div>
  );
}
