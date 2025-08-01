const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error('❌ Error:', err.message);
  if (!isProd) {
    console.error(err.stack);
  }

  res.status(status).json({
    message: err.message || 'Server Error',
    ...(isProd ? {} : { stack: err.stack }),
  });
};

export default errorHandler;
