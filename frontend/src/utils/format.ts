import type { OutputFormat } from '../types';

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getSavingsPercent(original: number, converted: number): number {
  return Math.round((1 - converted / original) * 100);
}

export function getOutputFileName(originalName: string, format: OutputFormat): string {
  const base = originalName.replace(/\.[^.]+$/, '');
  return `${base}.${format}`;
}

export function getFormatFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'image/gif': 'GIF',
    'image/avif': 'AVIF',
    'image/bmp': 'BMP',
    'image/tiff': 'TIFF',
  };
  return map[mime] ?? mime.split('/')[1]?.toUpperCase() ?? '?';
}

export const FORMAT_LABELS: Record<OutputFormat, string> = {
  webp: 'WebP',
  png: 'PNG',
  jpeg: 'JPEG',
  avif: 'AVIF',
  gif: 'GIF',
};

export const LOSSLESS_FORMATS: OutputFormat[] = ['png', 'gif'];

export const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/bmp',
  'image/tiff',
];
