const express = require('express');
const{ Pool } = require('pg');
const app = express();
const port = 5000;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const productRoutes = require('./productRoutes');
const useraccount = require('./useraccount');
const login = require('./login');
const order = require('./order');
const payment = require('./payment');

dotenv.config();

const { authenticateJWT, jwtSecret } = require('./jwtAuthMiddleware');

app.get('/', (req, res) => {
  res.send('Hello, World!!!!!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/product', productRoutes(pool)); 
app.use('/useraccount', useraccount(pool)); 
app.use('/login', login(pool)); 
app.use('/ordertable', order(pool)); 
app.use('/payment', payment(pool)); 


// CORS middleware (for development, restrict in production)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/category', authenticateJWT);

app.get('/category', (req, res) => {
  // This route is protected and can only be accessed with a valid token
  res.json({ message: 'Protected resource accessed successfully', user: req.user });
});

app.use('/product', authenticateJWT);

app.get('/product', (req, res) => {
  // This route is protected and can only be accessed with a valid token
  res.json({ message: 'Protected resource accessed successfully', user: req.user });
});

app.use('/login', authenticateJWT);

app.get('/login', (req, res) => {
  // This route is protected and can only be accessed with a valid token
  res.json({ message: 'Protected resource accessed successfully', user: req.user });
});

app.use('/useraccount', authenticateJWT);

app.get('/useraccount', (req, res) => {
  // This route is protected and can only be accessed with a valid token
  res.json({ message: 'Protected resource accessed successfully', user: req.user });
});

app.use('/order', authenticateJWT);

app.get('/order', (req, res) => {
  // This route is protected and can only be accessed with a valid token
  res.json({ message: 'Protected resource accessed successfully', user: req.user });
});

app.use('/payment', authenticateJWT);

app.get('/payment', (req, res) => {
  // This route is protected and can only be accessed with a valid token
  res.json({ message: 'Protected resource accessed successfully', user: req.user });
});


// category

app.post('/category', async (req, res) => {
    console.log(req.body);
    const { name, description } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO category (name, description) VALUES ($1, $2) RETURNING id',
        [name, description]
      );
      const newCategoryId = result.rows[0].id;
      client.release();
      res.status(201).json({ id: newCategoryId, name, description });
    } catch (err) {
      console.error('Error creating category', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }); 
  
  // Read all category
  app.get('/category', async (req, res) => {
    try {
    
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM category');
      // res.status(500).json('tseew');

      const category = result.rows;
      client.release();
      res.json(result.rows);
    } catch (err) {
      console.error('Error retrieving category', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Update a category by ID
  app.put('/category/:id',  async (req, res) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;
    try {
      const client = await pool.connect();
      await client.query(
        'UPDATE category SET name = $1, description = $2 WHERE id = $3',
        [name, description, categoryId]
      );
      client.release();
      res.json({ message: 'Category updated successfully' });
    } catch (err) {
      console.error('Error updating category', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Delete a category by ID
  app.delete('/category/:id',  async (req, res) => {
    const categoryId = req.params.id;
    try {
      const client = await pool.connect();
      await client.query('DELETE FROM category WHERE id = $1', [categoryId]);
      client.release();
      res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      console.error('Error deleting category', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  // Create and send a JWT token to the user upon successful registration or login
  app.post('/generatetoken', (req, res) => {
    const { username, password } = req.body;
  
    // Verify username and password (you may use your authentication logic here)
  
    if (username !== 'admin@gmail.com') {
      res.json({ message: 'Invalid credentials' });
    }
  
    // User is authenticated, create a JWT token
    const token = jwt.sign({ username: username }, jwtSecret, {
      expiresIn: '1h', // Token expiration time (e.g., 1 hour)
    });
  
    // Send the token to the client
    res.json({ token });
  });

 
  