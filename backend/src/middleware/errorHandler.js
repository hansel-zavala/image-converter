const multer = require('multer');

/**
 * @param {Error} err
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('[Error]', err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'El archivo supera el límite de 20 MB.' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err.message?.startsWith('Formato no soportado')) {
    return res.status(415).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Error interno del servidor.' });
};

module.exports = { errorHandler };
