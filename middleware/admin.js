require('dotenv').config();

const authenticateAdmin = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ message: 'Invalid API key' });
  }
  next();
};

module.exports = authenticateAdmin;
