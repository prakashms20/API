const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./jwtAuthMiddleware'); // Import jwtSecret from your existing middleware module

function generateToken(username) {
  // You can add your authentication logic here if needed
  
  if (username !== 'admin@gmail.com') {
    return { message: 'Invalid credentials' };
  }

  // User is authenticated, create a JWT token
  const token = jwt.sign({ username: username }, jwtSecret, {
    expiresIn: '1h', // Token expiration time (e.g., 1 hour)
  });

  return { token };
}

module.exports = { generateToken };
