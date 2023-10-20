const express = require('express');

/**
 * @swagger
 * /Payment:
 *   get:
 *     summary: Retrieve all Payment
 *     description: Get a list of all Payment.
 *     responses:
 *       200:
 *         description: Successful response with a list of Payment.
 *       500:
 *         description: Internal Server Error.
 *   post:
 *     summary: Create a new product
 *     description: Create a new Payment with a name and Payment.
 *     responses:
 *       201:
 *         description: payment created successfully.
 *       500:
 *         description: Internal Server Error.
 */
const router = express.Router();

module.exports = (pool,authenticateJWT) => {

    router.post('/',authenticateJWT, async (req, res) => {
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

      
      router.get('/',authenticateJWT, async (req, res) => {
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




  
  