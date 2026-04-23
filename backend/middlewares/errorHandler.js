// Placed AFTER all routes. Catches anything thrown or passed via next(err).
// Logs the full error server-side, responds with a sanitized message client-side.

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(`[error] ${req.method} ${req.originalUrl} ->`, err);

  res.status(status).json({
    success: false,
    message: err.publicMessage || err.message || 'Internal server error',
    ...(isProd ? {} : { stack: err.stack }),
  });
};
