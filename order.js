const express = require('express');
const router = express.Router();

module.exports = (pool) => {

    router.post('/', async (req, res) => {
        const { product_id, date, tax, amount, status } = req.body;
        try {
          const client = await pool.connect();
          const result = await client.query(
            'INSERT INTO ordertable (product_id, date, tax, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [product_id, date, tax, amount, status]
          );
          const newOrderId = result.rows[0].id;
          client.release();
          res.status(201).json({ id: newOrderId, product_id, date, tax, amount, status });
        } catch (err) {
          console.error('Error creating order', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

      router.get('/', async (req, res) => {
        try {
          const client = await pool.connect();
          const result = await client.query('SELECT * FROM ordertable');
          const orders = result.rows;
          client.release();
          res.json(orders);
        } catch (err) {
          console.error('Error retrieving orders', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

  return router;
};


  
  