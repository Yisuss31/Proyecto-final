
function errorHandler(err, req, res, next) {

  if (err.code === 'LIMIT_FILE_SIZE') {
    err.status = 413;
    err.message = 'La imagen excede el tamaño máximo permitido (3MB)';
  }

  const status = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) console.error(`[${status}]`, err.message);

  const wantsJson = (req.headers.accept || '').includes('application/json');

  if (wantsJson) {
    return res.status(status).json({
      error: err.message || 'Error interno',
      ...(err.errors && { errors: err.errors }),
      ...(isDev && err.stack && { stack: err.stack })
    });
  }

  res.status(status).render('error', {
    title: `Error ${status}`,
    status,
    message: err.message || 'Ha ocurrido un error inesperado',
    stack: isDev ? err.stack : null
  });
}

module.exports = errorHandler;