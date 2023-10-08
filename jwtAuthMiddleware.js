const jwt = require('jsonwebtoken');
const jwtSecret = "MSprakash"; // Replace with your actual secret key

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Token missing' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Authentication failed: Invalid token' });
    }

    req.user = user;
    next(); // Move to the next middleware or route handler
  });
};

module.exports = { authenticateJWT, jwtSecret };
