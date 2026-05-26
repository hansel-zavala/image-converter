import { useRef } from 'react';
import { useDragDrop } from '../hooks/useDragDrop';
import { ACCEPTED_MIME_TYPES } from '../utils/format';
import type { FileInfo } from '../types';

interface DropZoneProps {
  fileInfo: FileInfo | null;
  onFile: (file: File) => void;
}

export function DropZone({ fileInfo, onFile }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useDragDrop({
    onDrop: onFile,
    accept: ACCEPTED_MIME_TYPES,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Original
        </span>
        <span className="font-mono text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {fileInfo?.format ?? '—'}
        </span>
      </div>

      {/* Drop area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex-1 flex flex-col items-center justify-center gap-3 cursor-pointer
          transition-colors duration-150 select-none min-h-[200px]
          ${isDragging
            ? 'bg-sky-50 dark:bg-sky-950/30 border-2 border-dashed border-sky-300 dark:border-sky-700 m-2 rounded-xl'
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
          }
        `}
      >
        {fileInfo ? (
          <div className="flex flex-col items-center gap-2 px-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 text-center truncate max-w-[180px]">
              {fileInfo.name}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Haz clic para cambiar</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Arrastra tu imagen aquí
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">o haz clic para seleccionar</p>
            </div>
            <p className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
              JPG · PNG · WebP · GIF · AVIF · BMP · TIFF
            </p>
          </>
        )}
      </div>

      {/* Footer meta */}
      <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <span className="font-mono text-xs text-slate-400 dark:text-slate-500 truncate max-w-[160px]">
          {fileInfo?.name ?? 'Sin archivo'}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {fileInfo
            ? fileInfo.size < 1024 * 1024
              ? `${(fileInfo.size / 1024).toFixed(1)} KB`
              : `${(fileInfo.size / (1024 * 1024)).toFixed(2)} MB`
            : '—'}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MIME_TYPES.join(',')}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}
