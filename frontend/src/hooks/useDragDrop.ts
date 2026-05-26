import { useState, useCallback, DragEvent } from 'react';

interface UseDragDropOptions {
  onDrop: (file: File) => void;
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

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (accept && !accept.includes(file.type)) return;

    onDrop(file);
  }, [onDrop, accept]);

  return { isDragging, handleDragOver, handleDragLeave, handleDrop };
}
