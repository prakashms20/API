const express = require('express');
const router = express.Router();

module.exports = (pool) => {

    router.post('/', async (req, res) => {
        const { user_id, order_id, amount, status, datetime } = req.body;
        try {
          const client = await pool.connect();
          const result = await client.query(
            'INSERT INTO payment (user_id, order_id, amount, status, datetime) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [user_id, order_id, amount, status, datetime]
          );
          const newPaymentId = result.rows[0].id;
          client.release();
          res.status(201).json({ id: newPaymentId, user_id, order_id, amount, status, datetime });
        } catch (err) {
          console.error('Error creating payment', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

      
      router.get('/', async (req, res) => {
        try {
          const client = await pool.connect();
          const result = await client.query('SELECT * FROM payment');
          const payments = result.rows;
          client.release();
          res.json(payments);
        } catch (err) {
          console.error('Error retrieving payments', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

  return router;
};


  
  