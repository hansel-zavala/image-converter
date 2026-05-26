import { useState, useCallback } from 'react';
import type { ConversionResult, ConversionStatus, FileInfo, OutputFormat } from '../types';
import { convertImage } from '../utils/api';
import { getFormatFromMime, ACCEPTED_MIME_TYPES } from '../utils/format';

export function useConverter() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [format, setFormat] = useState<OutputFormat>('webp');
  const [quality, setQuality] = useState(85);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const loadFile = useCallback((file: File) => {
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setError(`Formato no soportado: ${file.type}`);
      return;
    }

    // Liberar URL anterior
    if (objectUrl) URL.revokeObjectURL(objectUrl);

    const previewUrl = URL.createObjectURL(file);
    setObjectUrl(previewUrl);
    setFileInfo({
      file,
      previewUrl,
      name: file.name,
      size: file.size,
      format: getFormatFromMime(file.type),
    });
    setResult(null);
    setError(null);
    setStatus('idle');
  }, [objectUrl]);

  const convert = useCallback(async () => {
    if (!fileInfo) return;
    setStatus('converting');
    setError(null);
    setResult(null);

    try {
      const res = await convertImage(fileInfo.file, { format, quality });
      setResult(res);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setStatus('error');
    }
  }, [fileInfo, format, quality]);

  const download = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.outputFileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const reset = useCallback(() => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setFileInfo(null);
    setResult(null);
    setError(null);
    setStatus('idle');
    setObjectUrl(null);
  }, [objectUrl]);

  return {
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
  };
}
