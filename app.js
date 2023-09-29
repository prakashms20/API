const express = require('express');
const{ Pool } = require('pg');
const app = express();
const port = 5000;


app.get('/', (req, res) => {
  res.send('Hello, World!!!!!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Carms@20',
    port: 5432
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (for development, restrict in production)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const productRoutes = require('./productRoutes');
app.use('/product', productRoutes(pool)); 

const useraccount = require('./useraccount');
app.use('/useraccount', useraccount(pool)); 

const login = require('./login');
app.use('/login', login(pool)); 

const order = require('./order');
app.use('/ordertable', order(pool)); 

const payment = require('./payment');
app.use('/payment', payment(pool)); 




// Create a new category
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
  app.put('/category/:id', async (req, res) => {
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
  app.delete('/category/:id', async (req, res) => {
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
 
  