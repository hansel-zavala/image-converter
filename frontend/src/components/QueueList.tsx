import { useRef } from 'react';
import type { QueueItem } from '../types';
import { formatBytes, getSavingsPercent, ACCEPTED_MIME_TYPES } from '../utils/format';

interface QueueListProps {
  queue: QueueItem[];
  selectedItemId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDownload: (item: QueueItem) => void;
  onAddFiles: (files: File[]) => void;
}

export function QueueList({
  queue,
  selectedItemId,
  onSelect,
  onRemove,
  onDownload,
  onAddFiles,
}: QueueListProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddFiles(Array.from(files));
    }
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Imágenes ({queue.length})
        </span>
        <button
          onClick={() => inputRef.current?.click()}
          className="text-xs text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 font-medium transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Añadir más
        </button>
      </div>

      {/* List content */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[380px]">
        {queue.map((item) => {
          const isSelected = item.id === selectedItemId;
          const isDone = item.status === 'done';
          const isConverting = item.status === 'converting';
          const isError = item.status === 'error';
          const saving = item.result ? getSavingsPercent(item.size, item.result.convertedSize) : 0;
          const isSmaller = saving > 0;

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`
                group flex items-center gap-3 p-3 cursor-pointer transition-all duration-150 select-none
                ${isSelected 
                  ? 'bg-sky-50/55 dark:bg-sky-950/20 border-l-2 border-sky-500' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-2 border-transparent'
                }
              `}
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center relative">
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {isConverting && (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate pr-2" title={item.name}>
                    {item.name}
                  </p>
                  <span className="font-mono text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 shrink-0">
                    {item.format}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {formatBytes(item.size)}
                  </span>
                  
                  {isDone && item.result && (
                    <>
                      <span className="text-[10px] text-slate-300 dark:text-slate-700 font-mono">•</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {formatBytes(item.result.convertedSize)}
                      </span>
                      <span className={`text-[10px] font-mono px-1 rounded-sm font-semibold leading-none
                        ${isSmaller 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' 
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                        }
                      `}>
                        {isSmaller ? '-' : '+'}{Math.abs(saving)}%
                      </span>
                    </>
                  )}

                  {isError && (
                    <>
                      <span className="text-[10px] text-slate-300 dark:text-slate-700 font-mono">•</span>
                      <span className="text-[10px] font-medium text-red-600 dark:text-red-400 truncate max-w-[120px]" title={item.error || 'Error'}>
                        {item.error || 'Error'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                {isDone && item.result && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(item);
                    }}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    title="Descargar"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                  title="Eliminar de la cola"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_MIME_TYPES.join(',')}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
