const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 5000;
const dotenv = require('dotenv');
const productRoutes = require('./productRoutes');
const useraccount = require('./useraccount');
const login = require('./login');
const order = require('./order');
const payment = require('./payment');
const swagger = require('./swagger');
const categoryRoutes = require('./category');
const { authenticateJWT } = require('./jwtAuthMiddleware');
const { generateToken } = require('./jwtToken'); // Import the generateToken function

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/product', productRoutes(pool,authenticateJWT));
app.use('/useraccount', useraccount(pool,authenticateJWT));
app.use('/login', login(pool,authenticateJWT));
app.use('/ordertable', order(pool,authenticateJWT));
app.use('/payment', payment(pool,authenticateJWT));
app.use('/category', categoryRoutes(pool, authenticateJWT));

// CORS middleware (for development, restrict in production)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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

// Create and send a JWT token to the user upon successful registration or login
app.post('/generatetoken', (req, res) => {
  const { username, password } = req.body;

  // Call the generateToken function
  const tokenResponse = generateToken(username);

  // Send the token or error message to the client
  res.json(tokenResponse);
});

// Your other protected routes go here...

app.use('/api-docs', swagger.serveSwaggerUI, swagger.setupSwaggerUI);

// Start the server

app.get('/', (req, res) => {
  res.send('Hello, World!! Welcome to my API');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); 
});
