import type { ConversionOptions, ConversionResult, OutputFormat } from '../types';
import { getOutputFileName } from '../utils/format';

const API_BASE = '/api';

export async function convertImage(
  file: File,
  options: ConversionOptions
): Promise<ConversionResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', options.format);
  formData.append('quality', String(options.quality));

  const response = await fetch(`${API_BASE}/convert`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(data.error ?? `Error ${response.status}`);
  }

  const blob = await response.blob();

  const originalSize = Number(response.headers.get('X-Original-Size') ?? file.size);
  const convertedSize = Number(response.headers.get('X-Converted-Size') ?? blob.size);
  const originalFormat = response.headers.get('X-Original-Format') ?? '';
  const width = Number(response.headers.get('X-Image-Width') ?? 0);
  const height = Number(response.headers.get('X-Image-Height') ?? 0);

  return {
    blob,
    originalSize,
    convertedSize,
    originalFormat,
    outputFormat: options.format as OutputFormat,
    outputFileName: getOutputFileName(file.name, options.format),
    width,
    height,
  };
}
