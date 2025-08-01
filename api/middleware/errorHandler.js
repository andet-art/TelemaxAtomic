const errorHandler = (err, req, res, next) => {
  console.error('Middleware Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};

module.exports = errorHandler;
