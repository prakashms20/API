const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.post('/', async (req, res) => {
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

      router.get('/', async (req, res) => {
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


  
  