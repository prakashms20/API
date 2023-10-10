const express = require('express');

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Retrieve all categories
 *     description: Get a list of all categories.
 *     responses:
 *       200:
 *         description: Successful response with a list of categories.
 *       500:
 *         description: Internal Server Error.
 */
const router = express.Router();

module.exports = (pool,authenticateJWT) => {
    
    router.post('/',authenticateJWT, async (req, res) => {
        const { user_id, username, password } = req.body;
        try {
          const client = await pool.connect();
          const result = await client.query(
            'INSERT INTO login (user_id, username, password) VALUES ($1, $2, $3) RETURNING id',
            [user_id, username, password]
          );
          const newLoginId = result.rows[0].id;
          client.release();
          res.status(201).json({ id: newLoginId, user_id, username });
        } catch (err) {
          console.error('Error creating login', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

      router.get('/',authenticateJWT, async (req, res) => {
        try {
          const client = await pool.connect();
          const result = await client.query('SELECT * FROM login');
          const logins = result.rows;
          client.release();
          res.json(logins);
        } catch (err) {
          console.error('Error retrieving logins', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

  return router;
};




  
  