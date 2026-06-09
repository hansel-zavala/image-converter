import { useState, useCallback, DragEvent } from 'react';

interface UseDragDropOptions {
  onDrop: (files: File[]) => void;
  accept?: string[];
}

export function useDragDrop({ onDrop, accept }: UseDragDropOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    const filteredFiles = accept
      ? droppedFiles.filter((file) => accept.includes(file.type))
      : droppedFiles;

    if (filteredFiles.length > 0) {
      onDrop(filteredFiles);
    }
  }, [onDrop, accept]);

  return { isDragging, handleDragOver, handleDragLeave, handleDrop };
}
