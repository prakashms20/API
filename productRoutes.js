const express = require('express');
const router = express.Router();

module.exports = (pool) => {



router.post('/', async (req, res) => {
    const { Category_id, price, model } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO product (Category_id, price, model) VALUES ($1, $2, $3) RETURNING id',
        [Category_id, price, model]
      );
      const newProductId = result.rows[0].id;
      client.release();
      res.status(201).json({ id: newProductId, Category_id, price, model });
    } catch (err) {
      console.error('Error creating product', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  router.get('/', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM product');
      const product = result.rows;
      client.release();
      res.json(product);
    } catch (err) {
      console.error('Error retrieving product', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const { Category_id, price, model } = req.body;
    try {
      const client = await pool.connect();
      await client.query(
        'UPDATE product SET Category_id = $1, price = $2, model = $3 WHERE id = $4',
        [Category_id, price, model, productId]
      );
      client.release();
      res.json({ message: 'Product updated successfully' });
    } catch (err) {
      console.error('Error updating product', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
      const client = await pool.connect();
      await client.query('DELETE FROM product WHERE id = $1', [productId]);
      client.release();
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error('Error deleting product', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};


  
  