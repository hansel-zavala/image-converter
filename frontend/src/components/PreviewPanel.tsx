import { useState, useEffect } from 'react';
import type { QueueItem, OutputFormat } from '../types';
import { formatBytes } from '../utils/format';

interface PreviewPanelProps {
  selectedItem: QueueItem | null;
  outputFormat: OutputFormat;
}

export function PreviewPanel({ selectedItem, outputFormat }: PreviewPanelProps) {
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'original' | 'result'>('result');

  useEffect(() => {
    if (selectedItem?.result?.blob) {
      const url = URL.createObjectURL(selectedItem.result.blob);
      setConvertedUrl(url);
      setActiveTab('result');
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setConvertedUrl(null);
      setActiveTab('original');
    }
  }, [selectedItem?.result?.blob]);

  if (!selectedItem) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Vista previa
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500 min-h-[200px]">
          <svg className="w-8 h-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-sans">Selecciona una imagen para previsualizar</span>
        </div>
      </div>
    );
  }

  const status = selectedItem.status;
  const result = selectedItem.result;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between px-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex gap-1 py-1.5">
          <button
            onClick={() => setActiveTab('original')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'original'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350'
            }`}
          >
            Original ({selectedItem.format})
          </button>
          <button
            onClick={() => setActiveTab('result')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'result'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350'
            }`}
          >
            Resultado ({outputFormat.toUpperCase()})
          </button>
        </div>
        <span className="font-mono text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-305 border border-slate-200 dark:border-slate-700 mr-2 select-none">
          {activeTab === 'original' ? selectedItem.format : outputFormat.toUpperCase()}
        </span>
      </div>

      {/* Preview Container */}
      <div className="flex-1 flex items-center justify-center checkerboard min-h-[240px] relative overflow-hidden bg-slate-50 dark:bg-slate-950/20">
        {activeTab === 'original' ? (
          <img
            src={selectedItem.previewUrl}
            alt="Original"
            className="max-w-full max-h-full object-contain p-2"
          />
        ) : (
          <>
            {status === 'converting' && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-700 border-t-slate-700 dark:border-t-slate-200 rounded-full animate-spin" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Convirtiendo...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-2 px-6 text-center">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-sm text-red-650 dark:text-red-400 font-medium font-sans">Error en la conversión</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-sans max-w-[200px] truncate" title={selectedItem.error || ''}>
                  {selectedItem.error}
                </p>
              </div>
            )}

            {status === 'done' && convertedUrl && (
              <img
                src={convertedUrl}
                alt="Imagen convertida"
                className="max-w-full max-h-full object-contain p-2 animate-fade-in"
              />
            )}

            {status === 'idle' && (
              <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                <svg className="w-8 h-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008v.008H13.5V12zm0 0h.008v.008H13.5V12zm-3 0h.008v.008H12V12zm0 0h.008v.008H12V12z" />
                </svg>
                <span className="text-xs font-sans">Presiona "Convertir imagen" para procesar</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer meta */}
      <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
        <span className="font-mono text-xs text-slate-400 dark:text-slate-500 truncate max-w-[200px]" title={activeTab === 'original' ? selectedItem.name : (result?.outputFileName ?? '—')}>
          {activeTab === 'original' ? selectedItem.name : (result?.outputFileName ?? '—')}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          {activeTab === 'original'
            ? formatBytes(selectedItem.size)
            : result
              ? formatBytes(result.convertedSize)
              : '—'}
        </span>
      </div>
    </div>
  );
}
