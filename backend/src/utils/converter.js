const sharp = require('sharp');

/** @typedef {'webp'|'png'|'jpeg'|'avif'|'gif'} OutputFormat */

/**
 * Opciones de calidad por formato.
 * PNG y GIF son sin pérdida, no usan quality.
 */
const FORMAT_SUPPORTS_QUALITY = ['webp', 'jpeg', 'avif'];

/**
 * Convierte un buffer de imagen al formato destino.
 *
 * @param {Buffer} inputBuffer  - Buffer de la imagen original
 * @param {OutputFormat} format - Formato de salida
 * @param {number} quality      - Calidad 1-100 (para webp/jpeg/avif)
 * @returns {Promise<{ buffer: Buffer, info: sharp.OutputInfo }>}
 */
async function convertImage(inputBuffer, format, quality = 85) {
  const pipeline = sharp(inputBuffer);

  // Leer metadatos para el log / respuesta
  const metadata = await pipeline.metadata();

  const options = FORMAT_SUPPORTS_QUALITY.includes(format)
    ? { quality: Math.max(1, Math.min(100, quality)) }
    : {};

  const { data, info } = await pipeline
    .toFormat(format, options)
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    info: {
      ...info,
      originalFormat: metadata.format,
      originalWidth: metadata.width,
      originalHeight: metadata.height,
    },
  };
}

/**
 * Devuelve el MIME type para un formato de salida.
 * @param {OutputFormat} format
 */
function getMimeType(format) {
  const map = {
    webp: 'image/webp',
    png: 'image/png',
    jpeg: 'image/jpeg',
    avif: 'image/avif',
    gif: 'image/gif',
  };
  return map[format] ?? 'application/octet-stream';
}

module.exports = { convertImage, getMimeType };
