const jwt = require('jsonwebtoken');
/**
 * @swagger
 * /generatetoken:
 *   post:
 *     summary: Generate a JWT token
 *     description: Generate a JWT token upon successful login
 *     parameters:
 *       - in: body
 *         name: credentials
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: JWT token generated successfully
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
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
