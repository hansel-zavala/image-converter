import { useState, useCallback, useEffect } from 'react';
import type { ConversionStatus, QueueItem, OutputFormat } from '../types';
import { convertImage } from '../utils/api';
import { getFormatFromMime, ACCEPTED_MIME_TYPES } from '../utils/format';

export function useConverter() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [format, setFormat] = useState<OutputFormat>('webp');
  const [quality, setQuality] = useState(85);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback((files: File[]) => {
    const newItems: QueueItem[] = [];

    for (const file of files) {
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        setError(`Formato no soportado: ${file.type}`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      newItems.push({
        id,
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        format: getFormatFromMime(file.type),
        status: 'idle',
        result: null,
        error: null,
      });
    }

    setQueue((prev) => [...prev, ...newItems]);
    setError(null);
    setStatus('idle');
  }, []);

  const removeFile = useCallback((id: string) => {
    setQueue((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const convert = useCallback(async () => {
    if (queue.length === 0) return;
    setStatus('converting');
    setError(null);

    const itemsToConvert = queue.filter((item) => item.status !== 'done');
    if (itemsToConvert.length === 0) {
      setStatus('done');
      return;
    }

    // Poner en estado 'converting' las imágenes correspondientes
    setQueue((prev) =>
      prev.map((item) =>
        item.status !== 'done'
          ? { ...item, status: 'converting', error: null }
          : item
      )
    );

    let hasError = false;

    // Convertir de forma secuencial para no sobrecargar el servidor
    for (const item of itemsToConvert) {
      try {
        const res = await convertImage(item.file, { format, quality });
        setQueue((prev) =>
          prev.map((qItem) =>
            qItem.id === item.id
              ? { ...qItem, status: 'done', result: res, error: null }
              : qItem
          )
        );
      } catch (err) {
        hasError = true;
        const errMsg = err instanceof Error ? err.message : 'Error desconocido';
        setQueue((prev) =>
          prev.map((qItem) =>
            qItem.id === item.id
              ? { ...qItem, status: 'error', error: errMsg }
              : qItem
          )
        );
      }
    }

    setStatus(hasError ? 'error' : 'done');
  }, [queue, format, quality]);

  const downloadFile = useCallback((item: QueueItem) => {
    if (!item.result) return;
    const url = URL.createObjectURL(item.result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.result.outputFileName;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const downloadAll = useCallback(() => {
    const completed = queue.filter((item) => item.status === 'done' && item.result);
    if (completed.length === 0) return;

    completed.forEach((item, index) => {
      setTimeout(() => {
        downloadFile(item);
      }, index * 250); // Delay pequeño para evitar descargas bloqueadas
    });
  }, [queue, downloadFile]);

  const reset = useCallback(() => {
    queue.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl);
    });
    setQueue([]);
    setSelectedItemId(null);
    setError(null);
    setStatus('idle');
  }, [queue]);

  const selectedItem = queue.find((item) => item.id === selectedItemId) || null;

  // Ajuste de selección reactivo cuando cambia la cola
  useEffect(() => {
    if (queue.length > 0) {
      if (!selectedItemId || !queue.some((item) => item.id === selectedItemId)) {
        setSelectedItemId(queue[0].id);
      }
    } else {
      setSelectedItemId(null);
    }
  }, [queue, selectedItemId]);

  return {
    queue,
    selectedItem,
    selectedItemId,
    setSelectedItemId,
    format,
    quality,
    status,
    error,
    loadFiles,
    removeFile,
    setFormat,
    setQuality,
    convert,
    downloadFile,
    download: () => selectedItem && downloadFile(selectedItem),
    downloadAll,
    reset,
  };
}
