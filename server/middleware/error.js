export const notFound = (req, res) =>
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });

export const errorHandler = (err, _req, res, _next) => {
  let status = err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message || 'Something went wrong';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join('. ');
  } else if (err.name === 'CastError') {
    status = 404;
    message = 'Resource not found';
  } else if (err.code === 11000) {
    status = 409;
    message = 'That email is already registered';
  } else if (err.name === 'MulterError' || /Only JPG/.test(message)) {
    status = 400;
    if (err.code === 'LIMIT_FILE_SIZE') message = 'Each image must be under 5 MB';
  }
  if (process.env.NODE_ENV !== 'production' && status === 500) console.error(err);
  res.status(status).json({ message });
};
