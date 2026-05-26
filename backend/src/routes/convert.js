const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { convertImage, getMimeType } = require('../utils/converter');

const VALID_FORMATS = ['webp', 'png', 'jpeg', 'avif', 'gif'];

/**
 * POST /api/convert
 *
 * Body (multipart/form-data):
 *   file    - imagen a convertir
 *   format  - formato destino (webp | png | jpeg | avif | gif)
 *   quality - número 1-100 (opcional, default 85)
 */
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo.' });
    }

    const format = req.body.format?.toLowerCase();
    if (!VALID_FORMATS.includes(format)) {
      return res.status(400).json({
        error: `Formato inválido. Usa: ${VALID_FORMATS.join(', ')}.`,
      });
    }

    const quality = parseInt(req.body.quality, 10) || 85;

    const { buffer, info } = await convertImage(req.file.buffer, format, quality);

    const originalName = req.file.originalname.replace(/\.[^.]+$/, '');
    const outputName = `${originalName}.${format}`;

    res.set({
      'Content-Type': getMimeType(format),
      'Content-Disposition': `attachment; filename="${outputName}"`,
      'Content-Length': buffer.length,
      'X-Original-Size': req.file.size,
      'X-Converted-Size': buffer.length,
      'X-Original-Format': info.originalFormat ?? 'unknown',
      'X-Output-Format': format,
      'X-Image-Width': info.originalWidth ?? info.width,
      'X-Image-Height': info.originalHeight ?? info.height,
    });

    return res.send(buffer);
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/convert/formats
 * Devuelve los formatos de entrada y salida soportados.
 */
router.get('/formats', (_req, res) => {
  res.json({
    input: ['jpeg', 'png', 'webp', 'gif', 'avif', 'bmp', 'tiff'],
    output: VALID_FORMATS,
  });
});

module.exports = router;
