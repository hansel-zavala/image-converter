export type OutputFormat = 'webp' | 'png' | 'jpeg' | 'avif' | 'gif';

export interface ConversionResult {
  blob: Blob;
  originalSize: number;
  convertedSize: number;
  originalFormat: string;
  outputFormat: OutputFormat;
  outputFileName: string;
  width: number;
  height: number;
}

export interface ConversionOptions {
  format: OutputFormat;
  quality: number; // 1-100
}

export type ConversionStatus = 'idle' | 'converting' | 'done' | 'error';

export interface FileInfo {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  format: string;
}

export interface QueueItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  format: string;
  status: ConversionStatus;
  result: ConversionResult | null;
  error: string | null;
}
