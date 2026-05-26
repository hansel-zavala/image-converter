import { useEffect, useState } from 'react';
import { useConverter } from './hooks/useConverter';
import { DropZone } from './components/DropZone';
import { PreviewPanel } from './components/PreviewPanel';
import { ConversionControls } from './components/ConversionControls';
import { ResultStats } from './components/ResultStats';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const {
    fileInfo,
    format,
    quality,
    status,
    result,
    error,
    loadFile,
    setFormat,
    setQuality,
    convert,
    download,
    reset,
  } = useConverter();

  const canConvert = !!fileInfo && status !== 'converting';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      {/* Top bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center transition-colors duration-200">
            <svg className="w-4 h-4 text-white dark:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Convertidor de imágenes</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Convierte entre WebP · PNG · JPEG · AVIF · GIF</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Cambiar tema"
            onClick={() => setIsDark((prev) => !prev)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-slate-300 dark:bg-slate-700"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isDark ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>

          {fileInfo && (
            <button
              onClick={reset}
              className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Nueva imagen
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 flex flex-col gap-4">

        {/* Image panels */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors duration-200">
            <DropZone fileInfo={fileInfo} onFile={loadFile} />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors duration-200">
            <PreviewPanel status={status} result={result} outputFormat={format} />
          </div>
        </div>

        {/* Controls */}
        <ConversionControls
          sourceFormat={fileInfo?.format ?? ''}
          outputFormat={format}
          quality={quality}
          onFormatChange={setFormat}
          onQualityChange={setQuality}
        />

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3 flex items-center gap-3 transition-colors duration-200">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Convert button */}
        <button
          onClick={convert}
          disabled={!canConvert}
          className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-xl
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:bg-slate-700 dark:hover:bg-slate-300 active:scale-[0.99] transition-all duration-100
                     flex items-center justify-center gap-2"
        >
          {status === 'converting' ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Convirtiendo...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Convertir imagen
            </>
          )}
        </button>

        {/* Result stats */}
        {result && <ResultStats result={result} onDownload={download} />}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 dark:text-slate-500 transition-colors duration-200">
        Powered by Sharp · Procesamiento en servidor · Máximo 20 MB
      </footer>
    </div>
  );
}
