const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id format' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value: record already exists' });
  }
  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors)[0]?.message || 'Validation failed';
    return res.status(400).json({ message: msg });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
};

module.exports = { notFound, errorHandler };
